import { categories, categoryMap } from './categories'

/**
 * 浏览器安全的 frontmatter 解析器。
 * 只支持本项目使用的简单 YAML：字符串、布尔、数组。
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { data: {}, content: raw }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = line.indexOf(':')
    if (index === -1) continue
    const key = line.slice(0, index).trim()
    let value = line.slice(index + 1).trim()

    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      data[key] = value.slice(1, -1)
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true'
    } else {
      data[key] = value
    }
  }

  return { data, content: raw.slice(match[0].length) }
}

/**
 * 所有正文以 Markdown 存放于 src/content/<栏目>/<slug>.md
 * 新增文档：复制一份 .md，写好 frontmatter，重新构建即可。
 */
const files = import.meta.glob('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

function normalizeTags(tags) {
  if (!tags) return []
  return Array.isArray(tags) ? tags : String(tags).split(',').map((tag) => tag.trim()).filter(Boolean)
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function estimateReadTime(text) {
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const words = (text.match(/[A-Za-z0-9_]+/g) || []).length
  return Math.max(2, Math.round((chinese + words / 1.5) / 380))
}

export const articles = Object.entries(files)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const parts = path.split('/')
    const slug = parts.pop().replace(/\.md$/, '')
    const categoryId = data.category || parts.pop()
    const plain = stripMarkdown(content)
    return {
      slug,
      categoryId,
      category: categoryMap[categoryId],
      title: data.title || slug,
      summary: data.summary || plain.slice(0, 90),
      tags: normalizeTags(data.tags),
      level: data.level || '入门',
      updated: data.updated || '2026-10-01',
      order: Number(data.order || 99),
      featured: Boolean(data.featured),
      body: content,
      plain,
      readTime: estimateReadTime(plain)
    }
  })
  .filter((article) => article.category)
  .sort((a, b) => a.order - b.order || b.updated.localeCompare(a.updated))

export const featuredArticles = articles.filter((article) => article.featured)

export const recentArticles = [...articles]
  .sort((a, b) => b.updated.localeCompare(a.updated))
  .slice(0, 6)

export const stats = {
  categories: categories.length,
  articles: articles.length,
  series: 3
}

export function getCategory(id) {
  return categoryMap[id] || null
}

export function getCategoryArticles(id) {
  return articles.filter((article) => article.categoryId === id)
}

export function getArticle(slug) {
  return articles.find((article) => article.slug === slug) || null
}

export function getAdjacentArticles(article) {
  const list = getCategoryArticles(article.categoryId)
  const index = list.findIndex((item) => item.slug === article.slug)
  return {
    prev: index > 0 ? list[index - 1] : null,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : null
  }
}

export function getRelatedArticles(article, limit = 3) {
  return articles
    .filter((item) => item.slug !== article.slug)
    .map((item) => {
      let score = item.categoryId === article.categoryId ? 3 : 0
      score += item.tags.filter((tag) => article.tags.includes(tag)).length * 2
      return { item, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.item.updated.localeCompare(a.item.updated))
    .slice(0, limit)
    .map((entry) => entry.item)
}

/** 简单全文检索：标题 > 标签 > 摘要 > 正文 */
export function searchArticles(query) {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return []
  return articles
    .map((article) => {
      const title = article.title.toLowerCase()
      const summary = article.summary.toLowerCase()
      const tags = article.tags.join(' ').toLowerCase()
      const body = article.plain.toLowerCase()
      let score = 0
      if (title.includes(keyword)) score += 18
      if (tags.includes(keyword)) score += 10
      if (summary.includes(keyword)) score += 6
      if (body.includes(keyword)) score += 3
      if (score === 0) return null
      const index = article.plain.toLowerCase().indexOf(keyword)
      const snippet =
        index >= 0
          ? article.plain.slice(Math.max(0, index - 28), index + keyword.length + 70)
          : article.summary
      return { ...article, score, snippet }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
}
