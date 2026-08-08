<template>
  <div>
    <!-- Banner 轮播 -->
    <div class="banner">
      <div class="swiper" id="banner-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide banner-slide">
            <img src="/images/banners/banner1.svg" alt="banner" />
            <div class="banner-caption">
              <h3>{{ $t('banner.s1Title') }}</h3>
              <p>{{ $t('banner.s1Sub') }}</p>
            </div>
          </div>
          <div class="swiper-slide banner-slide">
            <img src="/images/banners/banner2.svg" alt="banner" />
            <div class="banner-caption">
              <h3>{{ $t('banner.s2Title') }}</h3>
              <p>{{ $t('banner.s2Sub') }}</p>
            </div>
          </div>
          <div class="swiper-slide banner-slide">
            <img src="/images/banners/banner3.svg" alt="banner" />
            <div class="banner-caption">
              <h3>{{ $t('banner.s3Title') }}</h3>
              <p>{{ $t('banner.s3Sub') }}</p>
            </div>
          </div>
          <div class="swiper-slide banner-slide">
            <img src="/images/banners/banner4.svg" alt="banner" />
            <div class="banner-caption">
              <h3>{{ $t('banner.s4Title') }}</h3>
              <p>{{ $t('banner.s4Sub') }}</p>
            </div>
          </div>
        </div>
        <div class="swiper-pagination" />
      </div>
    </div>

    <!-- 精品腕表标题 -->
    <div class="section-head">
      <h2 class="section-title">{{ $t('section.title') }}</h2>
      <span class="section-more">{{ $t('section.count', { count: visibleProducts.length }) }}</span>
    </div>

    <!-- 分类下拉框 -->
    <div class="category-select-wrap">
      <select v-model="selectedCategory" class="category-select" @change="onCategoryChange">
        <option value="all">{{ $t('filter.allBrands') }}</option>
        <option v-for="brand in categoryList" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>
      <select v-if="currentSeries.length" v-model="selectedSeries" class="category-select">
        <option value="all-series">{{ $t('filter.allSeries') }}</option>
        <option v-for="series in currentSeries" :key="series.id" :value="series.id">
          {{ series.name }}
        </option>
      </select>
    </div>

    <!-- 产品网格 -->
    <div class="product-grid">
      <ProductCard
        v-for="p in visibleProducts"
        :key="p.slug"
        :product="p"
        :lang="locale"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, CategoryOption } from '@/types'
import { DEFAULT_LANG } from '@/types'
import type { LangCode } from '@/types'
import { SITE_URL } from '../../../site.config'

const { locale, t } = useI18n()
const lang = (locale.value || DEFAULT_LANG) as LangCode

// 分类/产品数据：useState 服务端读取赋值，客户端从 payload 自动恢复
// （避免 hydration mismatch：服务端和客户端在 setup 阶段数据一致）
const categoryList = useState<CategoryOption[]>(`home-categories-${lang}`, () => [])
const productList = useState<Product[]>(`home-products-${lang}`, () => [])

if (import.meta.server) {
  const { getHomeData } = await import('@/server/utils/home')
  const data = getHomeData(lang)
  categoryList.value = data.categories
  productList.value = data.products
}

// 分类筛选状态：默认"全部品牌"显示所有产品
const selectedCategory = ref<string>('all')

// 当前品牌下的系列
const currentSeries = computed(() => {
  if (selectedCategory.value === 'all') return []
  const brand = categoryList.value.find(c => String(c.id) === String(selectedCategory.value))
  return brand ? brand.children : []
})

// 系列筛选状态：默认"全部系列"
const selectedSeries = ref<string>('all-series')

// 切换品牌时，重置系列为"全部系列"
function onCategoryChange() {
  selectedSeries.value = 'all-series'
}

// 展示的产品：按品牌 + 系列过滤
const visibleProducts = computed<Product[]>(() => {
  let list = productList.value

  // 品牌过滤
  if (selectedCategory.value !== 'all') {
    const brand = categoryList.value.find(c => String(c.id) === String(selectedCategory.value))
    if (brand) {
      const brandIds = new Set(brand.children.map(s => s.id))
      list = list.filter(p => brandIds.has(p.category_id))
    }
  }

  // 系列过滤
  if (selectedSeries.value !== 'all-series') {
    list = list.filter(p => p.category_id === Number(selectedSeries.value))
  }

  return list
})

// SEO：首页标题/描述（多语言）
useHead(() => {
  const title = t('seo.homeTitle')
  const desc = t('seo.homeDesc')
  return {
    title,
    meta: [
      { name: 'description', content: desc },
      { name: 'og:title', content: title },
      { name: 'og:description', content: desc },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: desc }
    ],
    link: [{ rel: 'canonical', href: `${SITE_URL}/${lang}/` }]
  }
})

// Banner 轮播初始化（客户端执行）
onMounted(() => {
  initSwiper('#banner-swiper', {
    loop: true,
    autoplay: { delay: 3500, disableOnInteraction: false },
    speed: 700,
    pagination: { el: '#banner-swiper .swiper-pagination', clickable: true }
  })
})
</script>
