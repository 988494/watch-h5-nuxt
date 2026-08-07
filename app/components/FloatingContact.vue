<template>
  <button class="float-contact-btn" aria-label="contact" @click="openContact">
    <span class="float-contact-icon">✉</span>
  </button>
</template>

<script setup lang="ts">
const contact = useContactStore()

function openContact() {
  contact.open()
}
</script>
