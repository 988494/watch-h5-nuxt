/**
 * 分类查询（构建期使用）
 */
import type { Category, CategoryOption, LangCode } from '@/types'
import { getDb } from '@/server/db/index'

/** 读取全部分类（含父子层级） */
export function getAllCategories(): Category[] {
  const rows = getDb()
    .prepare('SELECT * FROM categories ORDER BY sort DESC, id ASC')
    .all() as Category[]
  return rows
}

/** 读取顶级分类（品牌） */
export function getRootCategories(): Category[] {
  return getAllCategories().filter(c => c.parent_id === null)
}

/** 按语言读取分类树（用于首页下拉框） */
export function getCategoryTree(lang: LangCode): CategoryOption[] {
  const all = getAllCategories()
  const nameOf = (c: Category) => c[`name_${lang}` as keyof Category] as string || c.name_en

  const roots = all.filter(c => c.parent_id === null)
  return roots.map(root => ({
    id: root.id,
    slug: root.slug,
    name: nameOf(root),
    children: all
      .filter(c => c.parent_id === root.id)
      .map(child => ({
        id: child.id,
        slug: child.slug,
        name: nameOf(child),
        children: [] as CategoryOption[]
      }))
  }))
}

/** 按 slug 查找分类 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return getAllCategories().find(c => c.slug === slug)
}
