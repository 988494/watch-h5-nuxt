/**
 * 产品查询（构建期使用）
 */
import type { Product, ProductMedia, SpecsMap } from '@/types'
import { getDb } from '@/server/db/index'

/** 读取全部产品 */
export function getAllProducts(): Product[] {
  return getDb()
    .prepare('SELECT * FROM products ORDER BY sort DESC, id ASC')
    .all() as Product[]
}

/** 按分类读取产品 */
export function getProductsByCategory(categoryId: number): Product[] {
  return getDb()
    .prepare('SELECT * FROM products WHERE category_id = ? ORDER BY sort DESC, id ASC')
    .all(categoryId) as Product[]
}

/** 按 slug 读取产品 */
export function getProductBySlug(slug: string): Product | undefined {
  return getDb()
    .prepare('SELECT * FROM products WHERE slug = ?')
    .get(slug) as Product | undefined
}

/** 读取产品图集 */
export function getProductMedia(productId: number): ProductMedia[] {
  return getDb()
    .prepare('SELECT * FROM product_media WHERE product_id = ? ORDER BY sort ASC, id ASC')
    .all(productId) as ProductMedia[]
}

/** 解析参数 JSON（防御性解析） */
export function parseSpecs(raw: string): SpecsMap {
  try {
    const parsed = JSON.parse(raw || '{}')
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

/** 产品的 id 列表（用于 getStaticPaths 生成静态页） */
export function getAllProductSlugs(): string[] {
  return getAllProducts().map(p => p.slug)
}

/** 分类 id 列表（用于分类页静态生成） */
export function getAllCategorySlugs(): string[] {
  return getDb()
    .prepare('SELECT slug FROM categories')
    .all()
    .map((r: { slug: string }) => r.slug) as string[]
}
