/**
 * 构建期数据读取 composable
 * 使用 useAsyncData：每个路由渲染时独立执行，避免跨路由状态污染
 * useAsyncData 返回值可 await，SSR/SSG 会等待数据就绪后再渲染
 */
import type { CategoryOption, Product } from '../../types'
import { DEFAULT_LANG, type LangCode } from '../../types'

export function useHomeData(lang: LangCode = DEFAULT_LANG) {
  const categories = useAsyncData<CategoryOption[]>(
    `home-categories-${lang}`,
    async () => {
      const { getCategoryTree } = await import('../../server/db/categories')
      return getCategoryTree(lang)
    }
  )

  const products = useAsyncData<Product[]>(
    `home-products-${lang}`,
    async () => {
      const { getAllProducts } = await import('../../server/db/products')
      return getAllProducts()
    }
  )

  return { categories, products }
}

/** 根据语言取产品标题 */
export function productTitle(p: Product, lang: LangCode): string {
  return p[`title_${lang}` as keyof Product] as string || p.title_en || p.slug
}

/** 根据语言取产品描述 */
export function productDescription(p: Product, lang: LangCode): string {
  return p[`description_${lang}` as keyof Product] as string || p.description_en || ''
}
