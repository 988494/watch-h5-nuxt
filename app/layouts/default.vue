<template>
  <div>
    <div class="h5-enclosure">
      <header class="topbar">
        <!-- 汉堡菜单按钮 -->
        <button class="hamburger" aria-label="menu" @click="menuOpen = true">
          <span class="hamburger-line" />
          <span class="hamburger-line" />
          <span class="hamburger-line" />
        </button>

        <div class="topbar-brand">{{ $t('brand') }}</div>

        <div class="spacer" />

        <!-- 语言切换下拉 -->
        <div class="lang-switch">
          <select
            class="lang-select"
            :value="currentLocale"
            @change="onLocaleChange"
          >
            <option v-for="l in locales" :key="l.code" :value="l.code">
              {{ l.name }}
            </option>
          </select>
        </div>
      </header>

      <div class="topbar-space" />

      <slot />

      <div class="bottom-space" />

      <!-- 浮动客服按钮（所有页面公用，点击弹联系弹窗） -->
      <FloatingContact />
    </div>

    <!-- 侧边栏抽屉 -->
    <div class="drawer-mask" :class="{ show: menuOpen }" @click="menuOpen = false" />
    <aside class="drawer" :class="{ open: menuOpen }">
      <div class="drawer-header">
        <div class="drawer-logo-icon">S</div>
        <div class="drawer-brand">
          <div class="drawer-brand-name">{{ $t('brand') }}</div>
          <div class="drawer-brand-sub">{{ $t('brandSub') }}</div>
        </div>
        <button class="drawer-close" aria-label="close" @click="menuOpen = false">×</button>
      </div>

      <nav class="drawer-nav">
        <button
          class="drawer-nav-item"
          :class="{ active: isActive('/') }"
          @click="go('/')"
        >
          <span class="drawer-nav-icon">🏠</span>
          <span>{{ $t('nav.home') }}</span>
        </button>
        <button
          class="drawer-nav-item"
          :class="{ active: isActive('/faq') }"
          @click="go('/faq')"
        >
          <span class="drawer-nav-icon">❓</span>
          <span>{{ $t('nav.faq') }}</span>
        </button>
        <button
          class="drawer-nav-item"
          :class="{ active: isActive('/about') }"
          @click="go('/about')"
        >
          <span class="drawer-nav-icon">ℹ️</span>
          <span>{{ $t('nav.about') }}</span>
        </button>
      </nav>
    </aside>

    <!-- 联系弹层 -->
    <ContactSheet />
    <!-- Toast -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale, locales } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const menuOpen = ref(false)
const currentLocale = computed(() => locale.value)

function isActive(path: string): boolean {
  // 用当前语言的路径比较（prefix 策略下所有语言都有前缀）
  const localized = localePath(path)
  return route.path === localized || route.path === localized.replace(/\/+$/, '')
}

function go(path: string) {
  menuOpen.value = false
  // 整页跳转：页面数据依赖服务端读取，SPA 导航不触发 SSR 会缺数据
  window.location.href = localePath(path)
}

function onLocaleChange(event: Event) {
  const target = (event.target as HTMLSelectElement).value
  if (!target || target === locale.value) return
  switchLang(target)
}

function switchLang(code: string) {
  // 手动构造目标语言路径：替换当前路径的语言前缀
  // 比 switchLocalePath 更可控，避免可能的返回路径错误
  const currentPath = route.path
  const langs = locales.value.map(l => l.code)

  // 去掉当前路径的语言前缀
  let basePath = currentPath
  for (const lang of langs) {
    const prefix = `/${lang}`
    if (currentPath === prefix || currentPath.startsWith(prefix + '/')) {
      basePath = currentPath.slice(prefix.length) || '/'
      break
    }
  }

  // 目标路径：加上目标语言前缀（trailing slash 处理）
  const targetPath = `/${code}${basePath === '/' ? '/' : basePath}`

  menuOpen.value = false
  window.location.assign(targetPath)
}
</script>
