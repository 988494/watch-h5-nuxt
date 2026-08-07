<template>
  <button class="float-contact-btn" aria-label="contact" @click="openContact">
    <svg class="float-contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 客服人形 + 耳机 -->
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="currentColor" />
      <path d="M20 15v-3a8 8 0 1 0-16 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const contact = useContactStore()

function openContact() {
  contact.open()
}
</script>
