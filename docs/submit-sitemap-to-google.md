# 提交网站地图到 Google（Google Search Console）

当网站上线并希望被 Google 收录时，将 **sitemap（网站地图）** 提交到 Google Search Console 是最好的起点。本教程基于[官方 Nuxt Sitemap 提交指南](https://nuxtseo.com/docs/sitemap/guides/submitting-sitemap)整理，并针对本项目给出具体操作步骤。

---

## 一、前置条件

1. **网站已部署上线**（`npm run generate` 产物 `.output/public/` 已同步到服务器，域名已解析）。
2. **sitemap 已正确生成**（部署域名在 `site.config.ts` 或 `.env` 的 `SITE_URL` 中配置）。

### 验证 sitemap 是否正确

提交前先用 [XML Sitemap Validator](https://nuxtseo.com/tools/xml-sitemap-validator) 检查错误。

本地确认 sitemap 可访问：

```bash
# 生产环境
curl https://你的域名/sitemap_index.xml

# 本地 dev
curl http://localhost:3000/sitemap_index.xml
```

---

## 二、确认 robots.txt 已引用 sitemap

Google 会通过 `robots.txt` 发现 sitemap。本项目已自动生成 `robots.txt`，内容包含：

```
User-Agent: *
Disallow:

Sitemap: https://你的域名/sitemap_index.xml
```

验证线上地址：`https://你的域名/robots.txt`

> 本项目使用**多语言 sitemap**，所以提交 `sitemap_index.xml`（索引文件），它会指向各语言分片：
> `/en.xml`、`/zh.xml`、`/es.xml`、`/fr.xml`、`/ar.xml`

---

## 三、提交到 Google Search Console

### 第 1 步：注册 Google Search Console

1. 打开 https://search.google.com/search-console
2. 登录你的 Google 账号
3. 选择资源类型，两种方式任选：
   - **网域**（推荐）：输入整个域名 `yourdomain.com`，DNS 验证
   - **网址前缀**：输入 `https://yourdomain.com/`，用 HTML 文件或 meta 标签验证

### 第 2 步：验证网站所有权

按 Google 提示完成验证（DNS 记录 / HTML 文件 / HTML 标签，任选其一）。

### 第 3 步：提交 sitemap

1. 左侧菜单点击 **Sitemap（网站地图）**
2. 在输入框填写：
   ```
   sitemap_index.xml
   ```
3. 点击 **提交（Submit）**

> 提示：如果使用单语言/单 sitemap，填 `sitemap.xml`；本项目是多语言，填 `sitemap_index.xml`。

### 第 4 步：提交后等待

- Google 会定期自动抓取 sitemap，**无需重复提交**。
- 首次提交可能显示"错误"提示——这是 Google 之前抓取网站但没找到 sitemap 造成的，**等待几天通常自动解决**。

---

## 四、加速索引（可选）

提交 sitemap 不保证所有页面立即收录。如需加快特定页面：

- 使用 Search Console 的 **URL 检查工具（URL Inspection）**，对关键 URL 点击"请求编制索引（Request Indexing）"。

---

## 五、常见问题

### 1. 提交后显示错误？

首次提交报错是正常的（Google 曾抓取但未找到）。等待几天，若问题持续，重新提交或确认 sitemap URL 可访问。

### 2. lastmod 准确性

Google 根据 `lastmod` 决定何时重新抓取。本项目每次 `npm run generate` 时 `lastmod` 更新为构建时间，属合理行为。若页面内容实际未变，Google 可能降低对 lastmod 的信任，可考虑用 `scripts/products.json` 的实际内容更新时间。

### 3. 不要用 ping 接口

Google 已于 2024 年 1 月**弃用 ping 端点**（`http://www.google.com/ping?sitemap=...`），不要再使用。只需：
- robots.txt 引用 sitemap（已自动）
- 在 Search Console 提交一次

---

## 六、本项目 sitemap 速查

| 项 | 值 |
| :--- | :--- |
| sitemap 索引 | `https://你的域名/sitemap_index.xml` |
| 语言分片 | `/__sitemap__/en.xml`、`/zh.xml`、`/es.xml`、`/fr.xml`、`/ar.xml` |
| robots.txt | `https://你的域名/robots.txt` |
| 每语言 URL 数 | 25（首页/FAQ/About/7 产品/15 分类） |
| 字段 | lastmod + changefreq + priority + hreflang 多语言 |

**提交给 Google 的地址**：

```
https://你的域名/sitemap_index.xml
```

---

*参考：[Nuxt Sitemap - Submitting your sitemap](https://nuxtseo.com/docs/sitemap/guides/submitting-sitemap)*
