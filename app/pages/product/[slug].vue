<template>
  <div>
    <!-- 浮动返回按钮（覆盖在内容区域顶部） -->
    <FloatingBack />

    <template v-if="product">
      <!-- 封面图（无边框，价格/厂牌标签叠加） -->
      <div class="detail-cover">
        <img :src="coverUrl" :alt="title" />
        <div class="cover-overlay">
          <div class="cover-factory">
            <span class="factory-pill">{{ factoryName }}</span>
            <span class="factory-pill">{{ $t('detail.factory') }}</span>
          </div>
          <div class="cover-price-row">
            <span class="cover-price"><span class="rmb">$</span>{{ money(product.price) }}</span>
            <span class="cover-currency">USD</span>
          </div>
        </div>
      </div>

      <!-- 标题区 -->
      <div class="detail-title-block">
        <h1 class="detail-title">{{ title }}</h1>
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

      <!-- 全屏预览层（图片放大 / 视频播放，可关闭）用 Teleport 挂到 body，脱离容器限制 -->
      <Teleport to="body">
        <transition name="fade">
          <div v-if="previewIndex !== null" class="preview-overlay" @click="onPreviewContentClick">
            <div class="preview-close" @click.stop="closePreview">✕</div>
            <!-- 点击图片/视频本身不关闭；点击其周围空白区域关闭 -->
            <div class="preview-content">
              <template v-if="media[previewIndex]?.type === 'image'">
                <img :src="media[previewIndex].url" :alt="title" />
              </template>
              <template v-else>
                <video
                  :src="media[previewIndex]?.url"
                  controls
                  autoplay
                  playsinline
                />
              </template>
            </div>
          </div>
        </transition>
      </Teleport>

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

// 封面图：优先取第一张图片，否则取 cover
const coverUrl = computed(() => {
  const firstImage = media.value.find(m => m.type === 'image')
  return firstImage?.url || product.value?.cover || ''
})

const factoryName = computed(() => {
  return title.value.split(' ').slice(0, 2).join(' ')
})

function money(n: number): string {
  return n.toLocaleString('en-US')
}

// 预览层：点击缩略图打开全屏预览（图片放大/视频播放）
const previewIndex = ref<number | null>(null)

function openPreview(index: number) {
  previewIndex.value = index
}

function closePreview() {
  previewIndex.value = null
}

// 点击预览内容：点图片/视频本身不关闭，点空白区域关闭
function onPreviewContentClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const isMedia = target.tagName === 'IMG' || target.tagName === 'VIDEO'
  if (!isMedia) {
    closePreview()
  }
}

definePageMeta({
  name: 'product-detail'
})
</script>
