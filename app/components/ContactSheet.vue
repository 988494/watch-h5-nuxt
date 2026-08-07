<template>
  <div>
    <div class="sheet-mask" :class="{ show: sheetVisible }" @click="close" />
    <div class="sheet" :class="{ show: sheetVisible }">
      <div class="sheet-handle" />
      <div class="sheet-title">{{ $t('contact.title') }}</div>
      <div class="sheet-sub">{{ $t('contact.sub') }}</div>

      <div class="sheet-row wechat" @click="copyWechat">
        <div class="row-icon">💬</div>
        <div>
          <div class="row-label">{{ $t('contact.copyWechat') }}</div>
          <div class="row-value">{{ displayWechat }}</div>
        </div>
        <span class="copy-tag">{{ $t('contact.copyWechatTag') }}</span>
      </div>

      <div class="sheet-row whatsapp" @click="openWhatsapp">
        <div class="row-icon">📱</div>
        <div>
          <div class="row-label">{{ $t('contact.whatsapp') }}</div>
          <div class="row-value">{{ displayWhatsapp }}</div>
        </div>
        <span class="wa-btn">{{ $t('contact.goWhatsapp') }}</span>
      </div>

      <button class="sheet-close" @click="close">{{ $t('contact.close') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useContactStore()
const { t } = useI18n()

// 解构出顶层 ref，模板中自动解包
const sheetVisible = store.sheetVisible
const close = store.close

// 显示用兜底值，避免 undefined
const displayWechat = computed(() => store.getContact().wechat)
const displayWhatsapp = computed(() => store.getContact().whatsapp)

async function copyWechat() {
  const wechat = store.getContact().wechat
  await store.copyText(wechat)
  store.showToast(t('contact.copied'))
}

function openWhatsapp() {
  const tel = store.getContact().whatsapp.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${tel}`, '_blank')
}
</script>
