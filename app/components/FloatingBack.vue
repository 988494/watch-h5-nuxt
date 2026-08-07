<template>
  <button class="float-back-btn" aria-label="back" @click="goBack">
    ←
  </button>
</template>

<script setup lang="ts">
function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    const localePath = useLocalePath()
    window.location.href = localePath('/')
  }
}
</script>
