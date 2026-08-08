/**
 * fix-robots.mjs — 把 robots.txt/index.html 规范为 robots.txt（构建后运行）
 * Nitro prerender 会把 server route 的 robots.txt 输出为目录，这里修正
 */
import fs from 'node:fs'
import path from 'node:path'

const publicDir = path.resolve(process.cwd(), '.output', 'public')
const dirPath = path.join(publicDir, 'robots.txt')
const src = path.join(dirPath, 'index.html')

if (fs.existsSync(src)) {
  const content = fs.readFileSync(src, 'utf-8')
  // 删除目录
  fs.rmSync(dirPath, { recursive: true, force: true })
  // 写真正的 robots.txt 文件
  fs.writeFileSync(dirPath, content, 'utf-8')
  console.log('✅ robots.txt 已规范为文件')
} else if (fs.existsSync(dirPath) && fs.statSync(dirPath).isFile()) {
  console.log('✅ robots.txt 已是文件，无需处理')
} else {
  console.log('⚠️ 未找到 robots.txt 输出')
}
