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
          <div class="row-value">{{ contactInfo.wechat }}</div>
        </div>
        <span class="copy-tag">{{ $t('contact.copyWechatTag') }}</span>
      </div>

      <div class="sheet-row whatsapp" @click="openWhatsapp">
        <div class="row-icon">📱</div>
        <div>
          <div class="row-label">{{ $t('contact.whatsapp') }}</div>
          <div class="row-value">{{ contactInfo.whatsapp }}</div>
        </div>
        <span class="row-arrow">›</span>
      </div>

      <button class="sheet-close" @click="close">{{ $t('contact.close') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useContactStore()
const { t: i18n } = useI18n()

// 解构出顶层 ref，模板中自动解包
const sheetVisible = store.sheetVisible
const contactInfo = store.contactInfo
const close = store.close

async function copyWechat() {
  await store.copyText(store.contactInfo.wechat)
  store.showToast(i18n.t('contact.copied'))
}

function openWhatsapp() {
  const tel = store.contactInfo.whatsapp.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${tel}`, '_blank')
}
</script>
