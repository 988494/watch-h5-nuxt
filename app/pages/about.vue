<template>
  <div>
    <!-- 页面标题 -->
    <div class="section-head">
      <h2 class="section-title">{{ $t('about.title') }}</h2>
    </div>

    <!-- 品牌介绍 -->
    <section class="about-section">
      <h3><span class="icon">👑</span> {{ $t('about.introTitle') }}</h3>
      <p>{{ $t('about.introText') }}</p>
    </section>

    <!-- 服务承诺 -->
    <section class="about-section">
      <h3><span class="icon">💎</span> {{ $t('about.whyTitle') }}</h3>
      <div class="about-points">
        <div v-for="i in 4" :key="i" class="about-point">
          <span class="about-point-icon">{{ aboutIcons[i - 1] }}</span>
          <div>
            <div class="about-point-title">{{ t(`about.points.${i}.title`) }}</div>
            <div class="about-point-desc">{{ t(`about.points.${i}.desc`) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系引导 -->
    <div class="faq-cta">
      <p>{{ $t('about.ctaText') }}</p>
      <button class="faq-cta-btn" @click="openContact">
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
  title: t('seo.aboutTitle'),
  meta: [
    { name: 'description', content: t('seo.aboutDesc') },
    { name: 'og:title', content: t('seo.aboutTitle') },
    { name: 'og:description', content: t('seo.aboutDesc') },
    { name: 'twitter:title', content: t('seo.aboutTitle') },
    { name: 'twitter:description', content: t('seo.aboutDesc') }
  ],
  link: [{ rel: 'canonical', href: `${SITE_URL}/${lang}/about` }]
}))

const aboutIcons = ['✓', '🛡', '🚚', '⚡']

function openContact() {
  contact.open()
}
</script>
