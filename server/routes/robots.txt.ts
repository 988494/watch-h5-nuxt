/**
 * robots.txt 动态生成（引用 site.config 的 SITE_URL）
 */
import { SITE_URL } from '../../site.config'

export default defineEventHandler(() => {
  return [
    'User-Agent: *',
    'Disallow:',
    '',
    `Sitemap: ${SITE_URL}/sitemap_index.xml`
  ].join('\n')
})
