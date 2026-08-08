/**
 * 站点全局配置
 * 所有站点级配置集中在此文件，供 nuxt.config、页面组件、构建脚本共用
 * 部署时只需修改此文件即可全局生效
 */

/** 站点域名（sitemap/robots/SEO 使用，部署时改成真实域名） */
export const SITE_URL = 'https://www.example.com'

/** 站点名称（不同语言） */
export const SITE_NAME = 'Luxury Timepieces'

/** 支持的语言（顺序即优先级） */
export const LANG_CODES = ['en', 'zh', 'es', 'fr', 'ar'] as const

/** 默认语言 */
export const DEFAULT_LANG = 'en'

/** 联系方式 */
export const CONTACT = {
  /** 微信号 */
  wechat: 'WatchVip8888',
  /** WhatsApp 号码（含国家码） */
  whatsapp: '+8613800138000',
  /** WhatsApp 展示号 */
  whatsappDisplay: '+86 138 0013 8000'
} as const

/** 语言前缀（用于 URL 枚举） */
export const LANG_PREFIXES = LANG_CODES.map(l => `${l}/`)
