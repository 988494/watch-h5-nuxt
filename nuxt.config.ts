import Database from 'better-sqlite3'
import path from 'node:path'

// 从 SQLite 枚举所有产品/分类 slug（构建期生成静态页路由）
function getDynamicRoutes(): string[] {
  const dbPath = path.resolve(process.cwd(), 'data', 'watch.db')
  const db = new Database(dbPath, { readonly: true })
  try {
    const products = db.prepare('SELECT slug FROM products').all() as { slug: string }[]
    const categories = db.prepare('SELECT slug FROM categories').all() as { slug: string }[]
    const langs = ['en/', 'es/', 'fr/', 'ar/', 'zh/']
    const routes: string[] = []
    for (const prefix of langs) {
      for (const p of products) {
        routes.push(`/${prefix}product/${p.slug}`)
      }
      for (const c of categories) {
        routes.push(`/${prefix}category/${c.slug}`)
      }
    }
    return routes
  } finally {
    db.close()
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  app: {
    head: {
      title: 'Luxury Timepieces - Premium Replica Watches',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' },
        { name: 'theme-color', content: '#0b0d12' }
      ]
    }
  },

  css: [
    '~/assets/css/main.css',
    'swiper/css',
    'swiper/css/autoplay',
    'swiper/css/pagination'
  ],

  modules: ['@nuxtjs/i18n'],

  i18n: {
    strategy: 'prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', dir: 'ltr', file: 'en.json' },
      { code: 'es', name: 'Español', dir: 'ltr', file: 'es.json' },
      { code: 'fr', name: 'Français', dir: 'ltr', file: 'fr.json' },
      { code: 'ar', name: 'العربية', dir: 'rtl', file: 'ar.json' },
      { code: 'zh', name: '中文', dir: 'ltr', file: 'zh.json' }
    ],
    // 完全关闭浏览器语言检测：语言完全由用户通过下拉/侧边栏主动切换
    // 避免浏览器语言(如 en)导致切换后被自动跳回默认语言
    detectBrowserLanguage: false,
    langDir: 'locales',
    lazy: false,
    vueI18n: './i18n.config.ts'
  },

  routeRules: {
    // 根路径主动跳转到默认语言英语 /en/
    '/': { redirect: '/en/' }
  },

  // SSG：静态导出为纯 HTML，nginx 托管
  nitro: {
    prerender: {
      // 串行渲染，避免多语言页面并发时共享 db 连接导致数据错乱
      concurrency: 1,
      routes: [
        '/en/',
        '/zh/',
        '/es/',
        '/fr/',
        '/ar/',
        '/en/faq',
        '/zh/faq',
        '/es/faq',
        '/fr/faq',
        '/ar/faq',
        ...getDynamicRoutes()
      ]
    }
  }
})
