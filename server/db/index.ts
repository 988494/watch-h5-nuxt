/**
 * SQLite 连接管理（构建期专用）
 * 仅服务端/构建期使用 better-sqlite3，不会打包进浏览器
 */
import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

let db: Database.Database | null = null

/** 获取数据库文件绝对路径 */
function getDbPath(): string {
  const root = process.cwd()
  return path.join(root, 'data', 'watch.db')
}

/** 确保 data 目录存在 */
function ensureDir(): void {
  const dir = path.dirname(getDbPath())
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/** 打开数据库连接（单例） */
export function getDb(): Database.Database {
  if (!db) {
    ensureDir()
    db = new Database(getDbPath())
    db.pragma('journal_mode = WAL')
  }
  return db
}

/** 关闭数据库（用于脚本执行完毕后） */
export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}
