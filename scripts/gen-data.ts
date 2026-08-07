/**
 * gen-data.ts — 从 JSON 数据文件生成数据写入 SQLite
 * 用法：npm run gen:data（或 npx tsx scripts/gen-data.ts）
 * 数据源：scripts/categories.json + scripts/products.json
 * 可重复执行（每次先清空旧数据再重建）
 */
import fs from 'node:fs'
import path from 'node:path'
import { getDb, closeDb } from '../server/db/index'
import { createSchema } from '../server/db/schema'
import type { LangCode } from '../types'

type LText = Record<LangCode, string>

interface MockCategory {
  slug: string
  names: LText
  children: { slug: string; names: LText }[]
}

interface MockProduct {
  slug: string
  category: string
  price: number
  price_original: number
  cover: string
  title: LText
  description: LText
  specs: Record<LangCode, Record<string, string>>
  /** 媒体资源：图片/视频 URL，多个用逗号分隔 */
  media?: {
    images?: string
    videos?: string
  }
}

/** 读取 JSON 数据文件 */
function loadJson<T>(file: string): T {
  const p = path.resolve(process.cwd(), 'scripts', file)
  const raw = fs.readFileSync(p, 'utf-8')
  return JSON.parse(raw) as T
}

/** 清空并重建数据 */
function seed(): void {
  const db = getDb()
  createSchema(db)

  const categories = loadJson<MockCategory[]>('categories.json')
  const products = loadJson<MockProduct[]>('products.json')

  // 清空旧数据（按外键顺序）
  db.exec('DELETE FROM product_media')
  db.exec('DELETE FROM products')
  db.exec('DELETE FROM categories')

  // 插入分类（品牌按 1000 间隔；系列在品牌区间内按 100 间隔）
  const insCat = db.prepare(
    `INSERT INTO categories (parent_id, slug, sort, name_en, name_es, name_fr, name_ar, name_zh)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const childIds: Record<string, number> = {}

  categories.forEach((brand, bi) => {
    const brandSort = 1000 + bi * 1000
    const info = insCat.run(
      null,
      brand.slug,
      brandSort,
      brand.names.en, brand.names.es, brand.names.fr, brand.names.ar, brand.names.zh
    )
    const brandId = Number(info.lastInsertRowid)

    brand.children.forEach((series, si) => {
      const childInfo = insCat.run(
        brandId,
        series.slug,
        brandSort + 100 + si * 100,
        series.names.en, series.names.es, series.names.fr, series.names.ar, series.names.zh
      )
      childIds[series.slug] = Number(childInfo.lastInsertRowid)
    })
  })

  // 插入产品
  const insProduct = db.prepare(
    `INSERT INTO products (
      category_id, slug, sort, price, price_original, cover,
      title_en, title_es, title_fr, title_ar, title_zh,
      description_en, description_es, description_fr, description_ar, description_zh,
      specs_en, specs_es, specs_fr, specs_ar, specs_zh
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const insMedia = db.prepare(
    'INSERT INTO product_media (product_id, type, url, sort) VALUES (?, ?, ?, ?)'
  )

  const seriesSortCounter: Record<string, number> = {}

  for (const p of products) {
    const catId = childIds[p.category]
    if (!catId) {
      console.warn(`跳过产品 ${p.slug}：分类 ${p.category} 不存在`)
      continue
    }

    if (!(p.category in seriesSortCounter)) {
      seriesSortCounter[p.category] = 1000
    }
    const pSort = seriesSortCounter[p.category]
    seriesSortCounter[p.category] += 100

    const specOf = (lang: LangCode) => JSON.stringify(p.specs?.[lang] ?? {})

    const info = insProduct.run(
      catId, p.slug, pSort, p.price, p.price_original, p.cover,
      p.title.en, p.title.es, p.title.fr, p.title.ar, p.title.zh,
      p.description.en, p.description.es, p.description.fr, p.description.ar, p.description.zh,
      specOf('en'), specOf('es'), specOf('fr'), specOf('ar'), specOf('zh')
    )
    const pid = Number(info.lastInsertRowid)

    // 图集：解析 media 字段（逗号分隔），图片 + 视频
    // 无 media 时回退为主图
    const images = (p.media?.images || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    const videos = (p.media?.videos || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    let sort = 0
    // 视频放在最前面
    if (videos.length) {
      for (const url of videos) {
        insMedia.run(pid, 'video', url, sort++)
      }
    }
    if (images.length) {
      for (const url of images) {
        insMedia.run(pid, 'image', url, sort++)
      }
    }
    // 没有任何 media 时，用 cover 作为唯一主图
    if (!images.length && !videos.length) {
      insMedia.run(pid, 'image', p.cover, 0)
    }
  }

  console.log(`✅ 分类: ${db.prepare('SELECT COUNT(*) as n FROM categories').get().n}`)
  console.log(`✅ 产品: ${db.prepare('SELECT COUNT(*) as n FROM products').get().n}`)
  console.log(`✅ 图集: ${db.prepare('SELECT COUNT(*) as n FROM product_media').get().n}`)
}

seed()
closeDb()
