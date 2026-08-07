<template>
  <div class="toast" :class="{ show: toastVisible }">
    {{ toastMsg }}
  </div>
</template>

<script setup lang="ts">
const store = useContactStore()

// 解构出顶层 ref，模板中自动解包
const toastVisible = store.toastVisible
const toastMsg = store.toastMsg
</script>
