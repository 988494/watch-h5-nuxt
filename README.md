# 时策名表 H5（Luxury Watch H5）

顶级一比一复刻腕表展示站。基于 **Nuxt 4 + TypeScript + SQLite** 构建的纯静态 SSG 站点，支持 **5 种语言**（English / 中文 / Español / Français / العربية），桌面端强制手机 H5 视口展示。

## 技术栈

- **Nuxt 4**（SSG 静态导出，nginx 托管）
- **TypeScript** 全站类型安全
- **SQLite**（better-sqlite3）构建期读库生成静态页
- **@nuxtjs/i18n** 多语言（5 语言，含阿拉伯语 RTL）
- **@nuxtjs/sitemap** 自动生成多语言 sitemap
- **Swiper** 轮播/图集

## 项目结构

```
├── app/
│   ├── components/       # 组件（商品卡片/浮动按钮/弹层等）
│   ├── composables/      # 逻辑封装
│   ├── layouts/          # 布局（顶部栏+侧边栏抽屉+浮动按钮）
│   └── pages/            # 页面（首页/分类/详情/FAQ/About）
├── server/
│   ├── db/               # SQLite 数据访问层（构建期）
│   ├── routes/           # robots.txt 等
│   └── utils/            # 服务端工具
├── scripts/
│   ├── gen-data.ts       # 生成模拟数据入 SQLite
│   └── fix-robots.mjs    # robots.txt 规范化
├── i18n/locales/         # 5 语言文案
├── data/watch.db         # SQLite 数据库（构建期读）
├── site.config.ts        # 全局配置（域名/联系方式/语言）
└── public/               # 静态资源（图片/视频）
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 生成数据（首次需执行）

```bash
npm run gen:data
```

从 `scripts/products.json` / `scripts/categories.json` 生成模拟数据写入 SQLite。

### 3. 本地开发

```bash
npm run dev
```

访问 **http://localhost:3000/**（自动跳转 `/en/`）。

> 本地测试直接用 `npm run dev` 即可，无需执行 generate。

## 维护数据

所有产品/分类数据在 **`scripts/products.json`** 和 **`scripts/categories.json`** 中（5 语言文案）。

### 增加一个产品

在 `scripts/products.json` 数组末尾加：

```jsonc
{
  "slug": "breitling-navitimer-b01",      // 唯一标识
  "category": "navitimer",                 // 所属系列 slug
  "price": 429,                            // 美元
  "price_original": 15000,
  "cover": "/images/xxx.svg",
  "media": {
    "images": "/images/a.jpg,/images/b.jpg",  // 逗号分隔
    "videos": "/videos/demo.mp4"
  },
  "title": { "zh": "...", "en": "...", "es": "...", "fr": "...", "ar": "..." },
  "description": { ... 5 语言 ... }
}
```

重新生成：

```bash
npm run gen:data   # 重建数据库（清空旧数据）
npm run generate   # 生成静态页
```

> 关键约束：**slug 唯一**、**产品的 category 对应已有系列 slug**。

## 构建与部署

```bash
npm run generate
```

产物在 `.output/public/`，同步到服务器 nginx 即可。

### 配置生产域名

复制 `.env.example` 为 `.env` 并修改：

```bash
SITE_URL=https://你的真实域名.com
```

> dev 模式自动用 `http://localhost:3000`，生产用 `.env` 的 `SITE_URL`。

### 联系方式配置

微信 / WhatsApp 在 `site.config.ts` 的 `CONTACT` 中统一配置。

## SEO

- **SSG 静态导出**：每个页面独立 HTML，SEO 友好
- **sitemap**：`npm run generate` 自动生成（5 语言 + hreflang + priority/changefreq/lastmod）
  - 提交：`https://你的域名/sitemap_index.xml`
  - 详见 [docs/submit-sitemap-to-google.md](docs/submit-sitemap-to-google.md)
- **robots.txt**：自动生成并引用 sitemap

## 常用命令

| 命令 | 说明 |
| :--- | :--- |
| `npm run dev` | 本地开发（热更新） |
| `npm run gen:data` | 生成/重建 SQLite 数据 |
| `npm run generate` | 静态导出（含 sitemap/robots） |
| `npm run preview` | 预览生产构建 |
| `npm run build` | 构建（SSR 模式） |
