/**
 * 全站共享类型定义
 * 数据契约：与 SQLite 表结构一一对应
 */

/** 支持的语言 */
export const LANGUAGES = ['en', 'es', 'fr', 'ar', 'zh'] as const
export type LangCode = (typeof LANGUAGES)[number]

export const DEFAULT_LANG: LangCode = 'en'

/** 分类（支持品牌→系列两级层级） */
export interface Category {
  id: number
  parent_id: number | null
  slug: string
  sort: number
  name_en: string
  name_es: string
  name_fr: string
  name_ar: string
  name_zh: string
}

/** 产品 */
export interface Product {
  id: number
  category_id: number
  slug: string
  sort: number
  price: number
  price_original: number
  cover: string
  title_en: string
  title_es: string
  title_fr: string
  title_ar: string
  title_zh: string
  description_en: string
  description_es: string
  description_fr: string
  description_ar: string
  description_zh: string
  specs_en: string // JSON 文本
  specs_es: string
  specs_fr: string
  specs_ar: string
  specs_zh: string
}

/** 产品图集（图片/视频） */
export interface ProductMedia {
  id: number
  product_id: number
  type: 'image' | 'video'
  url: string
  sort: number
}

/** 解析后的参数表（specs JSON → 键值对） */
export type SpecsMap = Record<string, string>

/** 分类下拉框树结构（用于首页） */
export interface CategoryOption {
  id: number
  slug: string
  name: string
  children: CategoryOption[]
}
