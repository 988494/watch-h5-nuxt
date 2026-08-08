import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, LANG_CODES } from './site.config'

// 从 SQLite 枚举所有产品/分类 slug（构建期生成静态页路由）
function getDynamicRoutes(): string[] {
  const dbPath = path.resolve(process.cwd(), 'data', 'watch.db')
  const db = new Database(dbPath, { readonly: true })
  try {
    const products = db.prepare('SELECT slug FROM products').all() as { slug: string }[]
    const categories = db.prepare('SELECT slug FROM categories').all() as { slug: string }[]
    const langs = LANG_CODES.map(l => `${l}/`)
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

// sitemap URL 列表（带优先级/更新频率）
type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
type Priority = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1

interface SitemapUrlEntry {
  loc: string
  lastmod: string
  changefreq: Changefreq
  priority: Priority
}

function getSitemapUrls(): SitemapUrlEntry[] {
  const langs = LANG_CODES.map(l => `/${l}/`)
  // lastmod 使用带时间的 ISO 格式（如 2026-08-08T16:19:00+08:00）
  const now = new Date()
  const offset = -now.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const absOffset = Math.abs(offset)
  const tz = `${sign}${String(Math.floor(absOffset / 60)).padStart(2, '0')}:${String(absOffset % 60).padStart(2, '0')}`
  const lastmod = now.toISOString().replace('Z', '') + tz
  const urls: SitemapUrlEntry[] = []

  for (const prefix of langs) {
    // 首页（最高优先级）
    urls.push({ loc: prefix, lastmod, changefreq: 'daily', priority: 1 })
    // FAQ / About
    urls.push({ loc: `${prefix}faq`, lastmod, changefreq: 'weekly', priority: 0.6 })
    urls.push({ loc: `${prefix}about`, lastmod, changefreq: 'monthly', priority: 0.5 })
  }

  // 产品/分类（从 SQLite 枚举）
  const dbPath = path.resolve(process.cwd(), 'data', 'watch.db')
  const db = new Database(dbPath, { readonly: true })
  try {
    const products = db.prepare('SELECT slug FROM products').all() as { slug: string }[]
    const categories = db.prepare('SELECT slug FROM categories').all() as { slug: string }[]
    for (const prefix of langs) {
      for (const p of products) {
        urls.push({ loc: `${prefix}product/${p.slug}`, lastmod, changefreq: 'weekly', priority: 0.8 })
      }
      for (const c of categories) {
        urls.push({ loc: `${prefix}category/${c.slug}`, lastmod, changefreq: 'weekly', priority: 0.7 })
      }
    }
  } finally {
    db.close()
  }

  return urls
}

// 从 SQLite 读取品牌和系列，生成 SEO keywords
function getKeywords(): string {
  const base = [
    'replica watches',
    'luxury watches',
    '1:1 replica',
    'super clone',
    'replica watch store',
    'wholesale replica watches'
  ]

  const dbPath = path.resolve(process.cwd(), 'data', 'watch.db')
  const db = new Database(dbPath, { readonly: true })
  try {
    // 品牌关键词（中英文 + 复刻/仿表变体）
    const brands = db.prepare("SELECT name_en, name_zh FROM categories WHERE parent_id IS NULL ORDER BY sort DESC").all() as { name_en: string; name_zh: string }[]

    for (const b of brands) {
      base.push(b.name_en.toLowerCase())
      base.push(`${b.name_en} replica`)
      base.push(`${b.name_en} replica watch`)
      if (b.name_zh && b.name_zh !== b.name_en) {
        base.push(b.name_zh)
        base.push(`${b.name_zh}复刻`)
        base.push(`${b.name_zh}仿表`)
      }
    }

    // 系列关键词
    const series = db.prepare("SELECT name_en, name_zh FROM categories WHERE parent_id IS NOT NULL ORDER BY sort DESC").all() as { name_en: string; name_zh: string }[]

    for (const s of series) {
      base.push(s.name_en.toLowerCase())
      base.push(`${s.name_en} replica`)
      if (s.name_zh && s.name_zh !== s.name_en) {
        base.push(s.name_zh)
        base.push(`${s.name_zh}复刻`)
      }
    }
  } catch {
    // 数据库不存在时忽略
  } finally {
    db.close()
  }

  return Array.from(new Set(base)).join(', ')
}

// 从 SQLite 读取品牌列表字符串（供首页 description 使用）
function getBrandsFromDb(lang: string): string {
  const dbPath = path.resolve(process.cwd(), 'data', 'watch.db')
  const db = new Database(dbPath, { readonly: true })
  try {
    const rows = db.prepare("SELECT name_en, name_zh FROM categories WHERE parent_id IS NULL ORDER BY sort DESC").all() as { name_en: string; name_zh: string }[]
    const isZh = lang === 'zh'
    const names = rows.map(r => isZh ? r.name_zh : r.name_en)
    return names.join(', ')
  } catch {
    return ''
  } finally {
    db.close()
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  // @ 别名指向项目根目录，替代所有 ../ 相对路径
  // （~/ 仍指向 app/，是 Nuxt 约定，保持不变）
  alias: {
    '@': fileURLToPath(new URL('.', import.meta.url))
  },

  // 注入各语言品牌字符串（构建期从数据库读取，供页面 description 使用）
  runtimeConfig: {
    public: {
      brandString: Object.fromEntries(
        LANG_CODES.map(lang => [lang, getBrandsFromDb(lang)])
      )
    }
  },

  app: {
    head: {
      title: 'Luxury Timepieces - Premium Replica Watches',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' },
        { name: 'theme-color', content: '#0b0d12' },
        { name: 'charset', content: 'utf-8' },
        { name: 'description', content: 'Premium 1:1 replica watches from top factories. Rolex, Patek Philippe, Audemars Piguet, Omega and more. Quality assured, fast shipping, after-sales support.' },
        { name: 'keywords', content: getKeywords() },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'Luxury Timepieces' },
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: 'Luxury Timepieces' },
        { name: 'og:title', content: 'Luxury Timepieces - Premium Replica Watches' },
        { name: 'og:description', content: 'Premium 1:1 replica watches from top factories. Quality assured, fast shipping, after-sales support.' },
        { name: 'og:image', content: '/images/banners/banner1.svg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Luxury Timepieces - Premium Replica Watches' },
        { name: 'twitter:description', content: 'Premium 1:1 replica watches from top factories.' }
      ],
      link: [
        { rel: 'canonical', href: `${SITE_URL}/` },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }
      ]
    }
  },

  css: [
    '~/assets/css/main.css',
    'swiper/css',
    'swiper/css/autoplay',
    'swiper/css/pagination',
    'swiper/css/navigation'
  ],

  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap'],

  // 站点配置（sitemap/SEO 使用）
  site: {
    url: SITE_URL
  },

  sitemap: {
    // 排除错误页和根重定向
    exclude: ['/404', '/200'],
    strictNuxtContentPaths: false,
    // 纯静态站：构建时生成 sitemap，减少运行时开销
    zeroRuntime: true,
    // 显式提供所有 URL（含优先级/更新频率/最后修改时间）
    urls: getSitemapUrls(),
    // 自定义 sitemap 浏览器展示列（URL / 优先级 / 更新频率 / 最后修改时间）
    xslColumns: [
      { label: 'URL', width: '40%' },
      {
        label: 'Priority',
        width: '15%',
        select: 'concat(floor(sitemap:priority * 100), \'%\')'
      },
      {
        label: 'Change Frequency',
        width: '20%',
        select: 'sitemap:changefreq'
      },
      {
        label: 'Last Change',
        width: '25%',
        select: 'substring(sitemap:lastmod,0,20)'
      }
    ]
  },

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
        '/robots.txt',
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
        '/en/about',
        '/zh/about',
        '/es/about',
        '/fr/about',
        '/ar/about',
        ...getDynamicRoutes()
      ]
    }
  }
})
