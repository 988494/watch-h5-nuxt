<template>
  <div>
    <!-- 分类导航 -->
    <nav class="detail-nav">
      <button class="back-btn" aria-label="back" @click="goBack">←</button>
      <div class="nav-title">{{ categoryName }}</div>
    </nav>
    <div class="detail-nav-space" />

    <!-- 品牌 → 系列 子分类 chips -->
    <div v-if="children.length" class="subcat-nav">
      <button
        class="chip"
        :class="{ active: !activeSeries }"
        @click="activeSeries = null"
      >
        {{ $t('filter.allSeries') }}
      </button>
      <button
        v-for="child in children"
        :key="child.id"
        class="chip"
        :class="{ active: activeSeries === child.slug }"
        @click="navigateToSeries(child.slug)"
      >
        {{ child.name }}
      </button>
    </div>

    <!-- 分类标题 -->
    <div class="section-head">
      <h2 class="section-title">{{ categoryName }}</h2>
      <span class="section-more">{{ $t('section.count', { count: filteredProducts.length }) }}</span>
    </div>

    <!-- 产品网格 -->
    <div class="product-grid">
      <ProductCard
        v-for="p in filteredProducts"
        :key="p.slug"
        :product="p"
        :lang="lang"
      />
    </div>

    <!-- 空态 -->
    <div v-if="!filteredProducts.length" class="empty-state">
      <div class="icon">📦</div>
      <p>{{ $t('detail.notFound') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, CategoryOption, Product } from '@/types'
import { DEFAULT_LANG, type LangCode } from '@/types'
import { SITE_URL } from '../../../site.config'

// SSG：构建时生成每个分类静态页
const route = useRoute()
const slug = String(route.params.slug)

const { locale, t } = useI18n()
const lang = (locale.value || DEFAULT_LANG) as LangCode

// 数据存 useState：key 含语言，避免 SSG 多语言预渲染互相污染
const category = useState<Category | undefined>(`category-${slug}-${lang}`, () => undefined)
const allCategories = useState<Category[]>(`allCategories-${slug}-${lang}`, () => [])
const categoryTree = useState<CategoryOption[]>(`categoryTree-${slug}-${lang}`, () => [])
const allProducts = useState<Product[]>(`allProducts-${slug}-${lang}`, () => [])

if (import.meta.server) {
  const catMod = await import('@/server/db/categories')
  const prodMod = await import('@/server/db/products')
  category.value = catMod.getCategoryBySlug(slug)
  allCategories.value = catMod.getAllCategories()
  categoryTree.value = catMod.getCategoryTree(lang)
  allProducts.value = prodMod.getAllProducts()
}

// 当前分类名称（按语言）
const categoryName = computed(() => {
  if (!category.value) return slug
  return (category.value[`name_${lang}` as keyof Category] as string) || category.value.name_en
})

// SEO
useHead(() => {
  const name = categoryName.value || slug
  return {
    title: t('seo.categoryTitle', { name }),
    meta: [
      { name: 'description', content: t('seo.categoryDesc', { name }) },
      { name: 'og:title', content: t('seo.categoryTitle', { name }) },
      { name: 'og:description', content: t('seo.categoryDesc', { name }) },
      { name: 'twitter:title', content: t('seo.categoryTitle', { name }) },
      { name: 'twitter:description', content: t('seo.categoryDesc', { name }) }
    ],
    link: [{ rel: 'canonical', href: `${SITE_URL}/${lang}/category/${slug}` }]
  }
})

// 子分类（系列）
const children = computed<CategoryOption[]>(() => {
  if (!category.value) return []
  return categoryTree.value.find(c => c.slug === category.value?.slug)?.children || []
})

// 品牌分类下的产品（直接子分类） vs 系列分类下的产品
const products = computed<Product[]>(() => {
  if (!category.value) return []
  // 系列分类：直接返回该分类下产品
  if (category.value.parent_id !== null) {
    return allProducts.value.filter(p => p.category_id === category.value!.id)
  }
  // 品牌分类：返回品牌下所有系列的产品
  return allProducts.value.filter(p => {
    const cat = allCategories.value.find(c => c.id === p.category_id)
    return cat && cat.parent_id === category.value!.id
  })
})

const activeSeries = ref<string | null>(null)

const filteredProducts = computed(() => {
  if (!activeSeries.value) return products.value
  const child = children.value.find(c => c.slug === activeSeries.value)
  if (!child) return products.value
  return allProducts.value.filter(p => p.category_id === child.id)
})

function goBack() {
  // 返回首页：整页跳转保证数据完整
  const localePath = useLocalePath()
  window.location.href = localePath('/')
}

function navigateToSeries(seriesSlug: string) {
  // 跳转系列页：分类页数据依赖服务端读取，整页跳转触发 SSR
  const localePath = useLocalePath()
  window.location.href = localePath(`/category/${seriesSlug}`)
}
</script>
