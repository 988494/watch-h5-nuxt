/**
 * 服务端工具：首页数据读取（仅服务端/构建期使用，自动注入）
 * 不经过 useFetch/useState，SSR 时同步读取，直接渲染进 HTML
 */
import { getCategoryTree } from '../db/categories'
import { getAllProducts } from '../db/products'
import type { CategoryOption, Product, LangCode } from '../../types'

export function getHomeData(lang: LangCode): { categories: CategoryOption[]; products: Product[] } {
  const categories = getCategoryTree(lang)
  const products = getAllProducts()
  return { categories, products }
}
