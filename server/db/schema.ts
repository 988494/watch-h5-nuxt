/**
 * 建表 SQL：5 语言文案字段，价格统一美元
 */
import type Database from 'better-sqlite3'

export function createSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id   INTEGER,
      slug        TEXT NOT NULL UNIQUE,
      sort        INTEGER DEFAULT 0,
      name_en     TEXT NOT NULL DEFAULT '',
      name_es     TEXT NOT NULL DEFAULT '',
      name_fr     TEXT NOT NULL DEFAULT '',
      name_ar     TEXT NOT NULL DEFAULT '',
      name_zh     TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (parent_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id       INTEGER NOT NULL,
      slug              TEXT NOT NULL UNIQUE,
      sort              INTEGER DEFAULT 0,
      price             REAL NOT NULL DEFAULT 0,
      price_original    REAL NOT NULL DEFAULT 0,
      cover             TEXT NOT NULL DEFAULT '',
      title_en          TEXT NOT NULL DEFAULT '',
      title_es          TEXT NOT NULL DEFAULT '',
      title_fr          TEXT NOT NULL DEFAULT '',
      title_ar          TEXT NOT NULL DEFAULT '',
      title_zh          TEXT NOT NULL DEFAULT '',
      description_en    TEXT NOT NULL DEFAULT '',
      description_es    TEXT NOT NULL DEFAULT '',
      description_fr    TEXT NOT NULL DEFAULT '',
      description_ar    TEXT NOT NULL DEFAULT '',
      description_zh    TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS product_media (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id  INTEGER NOT NULL,
      type        TEXT NOT NULL DEFAULT 'image',
      url         TEXT NOT NULL DEFAULT '',
      sort        INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_media_product ON product_media(product_id);
  `)
}
