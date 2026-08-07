<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// 根据语言设置 <html dir> 和 lang（阿拉伯语 RTL）
const { locale } = useI18n()

const htmlAttrs = computed(() => {
  const lang = locale.value || 'en'
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  return { lang, dir }
})

useHead({
  htmlAttrs
})
</script>
