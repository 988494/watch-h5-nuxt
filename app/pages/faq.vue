<template>
  <div>
    <!-- 页面标题 -->
    <div class="section-head">
      <h2 class="section-title">{{ $t('faq.title') }}</h2>
    </div>

    <!-- FAQ 列表 -->
    <div class="faq-list">
      <details
        v-for="(item, i) in faqItems"
        :key="i"
        class="faq-item"
      >
        <summary class="faq-question">
          <span class="faq-q-icon">Q</span>
          <span class="faq-q-text">{{ item.q }}</span>
          <span class="faq-toggle">+</span>
        </summary>
        <div class="faq-answer">
          <span class="faq-a-icon">A</span>
          <p>{{ item.a }}</p>
        </div>
      </details>
    </div>

    <!-- 底部联系引导 -->
    <div class="faq-cta">
      <p>{{ $t('faq.ctaText') }}</p>
      <button class="btn-gold faq-cta-btn" @click="openContact">
        {{ $t('nav.contact') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_LANG } from '@/types'
import type { LangCode } from '@/types'
import { SITE_URL } from '../../site.config'

const { t, locale } = useI18n()
const lang = (locale.value || DEFAULT_LANG) as LangCode
const contact = useContactStore()

// SEO
useHead(() => ({
  title: t('seo.faqTitle'),
  meta: [
    { name: 'description', content: t('seo.faqDesc') },
    { name: 'og:title', content: t('seo.faqTitle') },
    { name: 'og:description', content: t('seo.faqDesc') },
    { name: 'twitter:title', content: t('seo.faqTitle') },
    { name: 'twitter:description', content: t('seo.faqDesc') }
  ],
  link: [{ rel: 'canonical', href: `${SITE_URL}/${lang}/faq` }]
}))

const faqItems = computed(() => {
  const keys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']
  return keys.map(k => ({
    q: t(`faq.items.${k}.q`),
    a: t(`faq.items.${k}.a`)
  }))
})

function openContact() {
  contact.open()
}
</script>
