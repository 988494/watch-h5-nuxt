/**
 * 站点全局配置
 * 所有站点级配置集中在此文件，供 nuxt.config、页面组件、构建脚本共用
 * 部署时只需修改此文件即可全局生效
 */

/**
 * 站点域名（sitemap/robots/SEO 使用）
 * - dev：默认 http://localhost:3000
 * - 生产：通过环境变量 SITE_URL 指定（见 .env），未配置时回退到默认正式域名
 */
const DEFAULT_PROD_URL = 'https://www.example.com'

// dev 模式下 NODE_ENV=development，用 localhost；其他（build/generate）用生产域名
const isDev = process.env.NODE_ENV === 'development'

export const SITE_URL = process.env.SITE_URL || (isDev ? 'http://localhost:3000' : DEFAULT_PROD_URL)

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

/**
 * 常见名表品牌（单价通常 1 万人民币以上）
 * 用于 SEO 描述、关键词等。以后新增品牌只需在这里添加。
 * 格式：{ en: 英文名, zh: 中文名 }
 */
export const BRANDS = [
  { en: 'Patek Philippe', zh: '百达翡丽' },
  { en: 'Audemars Piguet', zh: '爱彼' },
  { en: 'Vacheron Constantin', zh: '江诗丹顿' },
  { en: 'Rolex', zh: '劳力士' },
  { en: 'Omega', zh: '欧米茄' },
  { en: 'Richard Mille', zh: '理查米尔' },
  { en: 'Cartier', zh: '卡地亚' },
  { en: 'Jaeger-LeCoultre', zh: '积家' },
  { en: 'Blancpain', zh: '宝珀' },
  { en: 'Breguet', zh: '宝玑' },
  { en: 'IWC Schaffhausen', zh: '万国' },
  { en: 'Panerai', zh: '沛纳海' },
  { en: 'Zenith', zh: '真力时' },
  { en: 'Breitling', zh: '百年灵' },
  { en: 'TAG Heuer', zh: '泰格豪雅' },
  { en: 'A. Lange & Söhne', zh: '朗格' },
  { en: 'Glashütte Original', zh: '格拉苏蒂原创' },
  { en: 'Piaget', zh: '伯爵' },
  { en: 'Chopard', zh: '萧邦' },
  { en: 'Bulgari', zh: '宝格丽' },
  { en: 'Tudor', zh: '帝舵' },
  { en: 'Franck Muller', zh: '法兰克穆勒' },
  { en: 'Ulysse Nardin', zh: '雅典' },
  { en: 'Girard-Perregaux', zh: '芝柏' },
  { en: 'Hublot', zh: '宇舶' },
  { en: 'Baume & Mercier', zh: '名士' },
  { en: 'Longines', zh: '浪琴' }
] as const

/**
 * 获取品牌字符串（按语言）
 * - 中文：中文品牌名逗号分隔
 * - 其他语言：英文品牌名逗号分隔
 */
export function getBrandsString(lang: string): string {
  const isZh = lang === 'zh'
  return BRANDS.map(b => isZh ? b.zh : b.en).join(', ')
}

/** 语言前缀（用于 URL 枚举） */
export const LANG_PREFIXES = LANG_CODES.map(l => `${l}/`)
