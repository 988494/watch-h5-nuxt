<template>
  <div>
    <!-- 详情导航 -->
    <nav class="detail-nav">
      <button class="back-btn" aria-label="back" @click="goBack">←</button>
      <div class="nav-title">{{ title }}</div>
    </nav>
    <div class="detail-nav-space" />

    <template v-if="product">
      <!-- 图集 -->
      <div class="media-gallery">
        <div class="swiper" id="media-swiper">
          <div class="swiper-wrapper">
            <div v-for="(m, i) in media" :key="i" class="swiper-slide">
              <img v-if="m.type === 'image'" :src="m.url" :alt="title" />
              <video v-else :src="m.url" muted loop playsinline />
            </div>
          </div>
        </div>
        <div class="media-count">{{ mediaIndex + 1 }} / {{ media.length }}</div>
      </div>

      <!-- 价格区 -->
      <div class="price-panel">
        <div class="factory-row">
          <span class="factory-pill">{{ factoryName }}</span>
          <span class="factory-pill">{{ $t('detail.factory') }}</span>
        </div>
        <div class="price-row">
          <span class="detail-price"><span class="rmb">$</span>{{ money(product.price) }}</span>
          <span class="detail-currency">USD</span>
        </div>
        <h1 class="detail-title">{{ title }}</h1>
      </div>

      <!-- 参数 -->
      <section class="spec-section">
        <div class="spec-head">
          <span class="icon">⚙</span>
          <h3>{{ $t('detail.specs') }}</h3>
        </div>
        <div class="spec-list">
          <div v-for="(val, key) in specs" :key="key" class="spec-item">
            <span class="key">{{ key }}</span>
            <span class="value">{{ val }}</span>
          </div>
        </div>
      </section>

      <!-- 介绍 -->
      <section class="desc-section">
        <h3><span class="icon">📖</span> {{ $t('detail.desc') }}</h3>
        <p>{{ description }}</p>
      </section>
    </template>

    <template v-else>
      <div class="empty-state">
        <div class="icon">⚠</div>
        <p>{{ $t('detail.notFound') }}</p>
      </div>
    </template>

    <div class="detail-bottom-space" />

    <!-- 底部联系栏 -->
    <div class="detail-bottom">
      <button class="btn btn-outline" @click="openWhatsapp">{{ $t('contact.whatsapp') }}</button>
      <button class="btn btn-gold breathe" @click="openContact">{{ $t('nav.contact') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductMedia, SpecsMap } from '@/types'
import { DEFAULT_LANG, type LangCode } from '@/types'

// SSG：构建时生成每个产品静态页
const route = useRoute()
const slug = String(route.params.slug)

const { locale } = useI18n()
const lang = (locale.value || DEFAULT_LANG) as LangCode

// 数据存 useState：key 含语言，避免 SSG 多语言预渲染互相污染
const product = useState<Product | null>(`product-${slug}-${lang}`, () => null)
const media = useState<ProductMedia[]>(`media-${slug}-${lang}`, () => [])
const specs = useState<SpecsMap>(`specs-${slug}-${lang}`, () => ({}))

if (import.meta.server) {
  const { getProductBySlug, getProductMedia, parseSpecs } = await import('@/server/db/products')
  const p = getProductBySlug(slug) || null
  product.value = p
  if (p) {
    media.value = getProductMedia(p.id)
    specs.value = parseSpecs(p[`specs_${lang}` as keyof Product] as string)
  }
}

const title = computed(() => {
  if (!product.value) return ''
  return (product.value[`title_${lang}` as keyof Product] as string) || product.value.title_en || product.value.slug
})

const description = computed(() => {
  if (!product.value) return ''
  return (product.value[`description_${lang}` as keyof Product] as string) || product.value.description_en || ''
})

const mediaIndex = ref(0)
const contact = useContactStore()

const factoryName = computed(() => {
  return title.value.split(' ').slice(0, 2).join(' ')
})

function money(n: number): string {
  return n.toLocaleString('en-US')
}

function goBack() {
  navigateTo('/')
}

function openContact() {
  contact.open()
}

function openWhatsapp() {
  const tel = contact.contactInfo.whatsapp.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${tel}`, '_blank')
}

onMounted(() => {
  initSwiper('#media-swiper', {
    on: {
      slideChange(this: { activeIndex: number }) {
        mediaIndex.value = this.activeIndex
      }
    }
  })
})

definePageMeta({
  name: 'product-detail'
})
</script>
