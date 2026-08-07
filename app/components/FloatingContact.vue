<template>
  <button class="float-contact-btn" aria-label="contact" @click="openContact">
    <svg class="float-contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 消息气泡 -->
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.4-.25-3.5-.7L3 21l1.7-5.9a8.5 8.5 0 1 1 16.3-3.6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
      <circle cx="8.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="11.5" r="1" fill="currentColor" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const contact = useContactStore()

function openContact() {
  contact.open()
}
</script>
