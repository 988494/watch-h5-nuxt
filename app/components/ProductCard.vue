<template>
  <article class="product-card" @click="goDetail">
    <div class="card-media">
      <img :src="product.cover" :alt="title" loading="lazy" />
    </div>
    <div class="card-body">
      <div class="card-brand">{{ brandName }}</div>
      <h3 class="card-title">{{ title }}</h3>
      <div class="card-footer">
        <div class="price">
          <span class="rmb">$</span>{{ money(product.price) }}
          <span class="currency">USD</span>
        </div>
        <span class="card-buy">{{ $t('card.view') }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '@/types'
import type { LangCode } from '@/types'

const props = defineProps<{ product: Product; lang: LangCode }>()

const title = computed(() => {
  return props.product[`title_${props.lang}` as keyof Product] as string || props.product.title_en || props.product.slug
})

const brandName = computed(() => {
  const name = title.value || ''
  return name.split(' ')[0]
})

function money(n: number): string {
  return n.toLocaleString('en-US')
}

function goDetail() {
  // 使用 localePath 生成带语言前缀的路径（prefix 策略下所有语言都有前缀）
  const localePath = useLocalePath()
  navigateTo(localePath(`/product/${props.product.slug}`))
}
</script>
