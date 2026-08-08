<template>
  <div>
    <!-- 浮动返回按钮（覆盖在内容区域顶部） -->
    <FloatingBack />

    <template v-if="product">
      <!-- 封面图（无边框，仅价格浮动叠加） -->
      <div class="detail-cover">
        <img :src="coverUrl" :alt="title" />
        <div class="cover-overlay">
          <div class="cover-price-row">
            <span class="cover-price"><span class="rmb">$</span>{{ money(product.price) }}</span>
            <span class="cover-currency">USD</span>
          </div>
        </div>
      </div>

      <!-- 标题区（标题 + 厂牌标签） -->
      <div class="detail-title-block">
        <h1 class="detail-title">{{ title }}</h1>
        <div class="cover-factory">
          <span class="factory-pill">{{ factoryName }}</span>
          <span class="factory-pill">{{ $t('detail.factory') }}</span>
        </div>
      </div>

      <!-- 媒体缩略图网格（正方形，图片/视频排列，点击预览） -->
      <div class="media-grid">
        <div
          v-for="(m, i) in media"
          :key="i"
          class="media-thumb"
          @click="openPreview(i)"
        >
          <img v-if="m.type === 'image'" :src="m.url" :alt="title" loading="lazy" />
          <template v-else>
            <video :src="m.url" muted loop playsinline preload="metadata" />
            <span class="media-thumb-play">▶</span>
          </template>
        </div>
      </div>

      <!-- 全屏预览层（图片放大 / 视频播放，可左右滑动切换，可关闭）用 Teleport 挂到 body，脱离容器限制 -->
      <Teleport to="body">
        <transition name="fade">
          <div v-if="previewIndex !== null" class="preview-overlay">
            <div class="preview-close" @click.stop="closePreview">✕</div>
            <div class="preview-count">{{ previewIndex + 1 }} / {{ media.length }}</div>
            <swiper
              :initial-slide="previewIndex"
              :modules="[Navigation]"
              :navigation="true"
              @swiper="onPreviewSwiper"
              @slide-change="onPreviewSlideChange"
            >
              <swiper-slide
                v-for="(m, i) in media"
                :key="i"
                class="preview-slide"
              >
                <img v-if="m.type === 'image'" :src="m.url" :alt="title" />
                <video
                  v-else
                  :src="m.url"
                  controls
                  playsinline
                />
              </swiper-slide>
            </swiper>
          </div>
        </transition>
      </Teleport>

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
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductMedia } from '@/types'
import { DEFAULT_LANG, type LangCode } from '@/types'
import { SITE_URL } from '../../../site.config'
import { Swiper as SwiperInstance } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'

// SSG：构建时生成每个产品静态页
const route = useRoute()
const slug = String(route.params.slug)

const { locale, t } = useI18n()
const lang = (locale.value || DEFAULT_LANG) as LangCode

// 数据存 useState：key 含语言，避免 SSG 多语言预渲染互相污染
const product = useState<Product | null>(`product-${slug}-${lang}`, () => null)
const media = useState<ProductMedia[]>(`media-${slug}-${lang}`, () => [])

if (import.meta.server) {
  const { getProductBySlug, getProductMedia } = await import('@/server/db/products')
  const p = getProductBySlug(slug) || null
  product.value = p
  if (p) {
    media.value = getProductMedia(p.id)
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

// 封面图：优先取第一张图片，否则取 cover
const coverUrl = computed(() => {
  const firstImage = media.value.find(m => m.type === 'image')
  return firstImage?.url || product.value?.cover || ''
})

// SEO
useHead(() => {
  const name = title.value || slug
  const price = product.value?.price ?? 0
  const seoTitle = t('seo.productTitle', { name })
  const seoDesc = t('seo.productDesc', { name, price })
  return {
    title: seoTitle,
    meta: [
      { name: 'description', content: seoDesc },
      { name: 'og:title', content: seoTitle },
      { name: 'og:description', content: seoDesc },
      { name: 'og:image', content: coverUrl.value },
      { name: 'twitter:title', content: seoTitle },
      { name: 'twitter:description', content: seoDesc },
      { name: 'twitter:image', content: coverUrl.value }
    ],
    link: [{ rel: 'canonical', href: `${SITE_URL}/${lang}/product/${slug}` }]
  }
})

const factoryName = computed(() => {
  return title.value.split(' ').slice(0, 2).join(' ')
})

function money(n: number): string {
  return n.toLocaleString('en-US')
}

// 预览层：点击缩略图打开全屏预览（图片放大/视频播放，可左右滑动切换）
const previewIndex = ref<number | null>(null)
const previewSwiper = ref<SwiperInstance | null>(null)

function openPreview(index: number) {
  previewIndex.value = index
}

function closePreview() {
  previewIndex.value = null
}

// Swiper 初始化完成：跳到点击的媒体项
function onPreviewSwiper(swiper: any) {
  previewSwiper.value = swiper
  if (previewIndex.value !== null) {
    swiper.slideTo(previewIndex.value, 0)
  }
}

// 滑动切换后同步当前索引
function onPreviewSlideChange() {
  if (previewSwiper.value) {
    previewIndex.value = previewSwiper.value.realIndex
  }
}

definePageMeta({
  name: 'product-detail'
})
</script>
