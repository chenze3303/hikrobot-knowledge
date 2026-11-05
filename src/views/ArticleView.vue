<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { marked } from 'marked'
import { useRoute } from 'vue-router'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import Icon from '../components/Icon.vue'
import {
  getAdjacentArticles,
  getArticle,
  getRelatedArticles
} from '../data/knowledge'

const route = useRoute()
const contentRef = ref(null)
const toc = ref([])
const activeHeading = ref('')
const progress = ref(0)
const feedback = ref('')
const copied = ref(false)

const article = computed(() => getArticle(route.params.slug))
const html = computed(() => (article.value ? marked.parse(article.value.body) : ''))
const adjacent = computed(() => (article.value ? getAdjacentArticles(article.value) : { prev: null, next: null }))
const related = computed(() => (article.value ? getRelatedArticles(article.value) : []))

watch(
  () => article.value?.slug,
  (slug) => {
    feedback.value = slug ? localStorage.getItem(`kb-feedback-${slug}`) || '' : ''
    if (slug) {
      nextTick(() => {
        processContent()
        updateProgress()
      })
    }
  },
  { immediate: true }
)

watch(html, async () => {
  await nextTick()
  processContent()
  updateProgress()
})

onMounted(() => {
  nextTick(processContent)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', updateProgress)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateProgress)
})

function processContent() {
  const root = contentRef.value
  if (!root) return

  root.querySelectorAll('table').forEach((table) => {
    if (table.parentElement?.classList.contains('table-scroll')) return
    const wrapper = document.createElement('div')
    wrapper.className = 'table-scroll'
    table.parentElement.insertBefore(wrapper, table)
    wrapper.appendChild(table)
  })

  root.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.copy-code')) return
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'copy-code'
    button.textContent = '复制'
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent || ''
      try {
        await navigator.clipboard.writeText(code)
        button.textContent = '已复制'
        setTimeout(() => (button.textContent = '复制'), 1500)
      } catch {
        button.textContent = '复制失败'
        setTimeout(() => (button.textContent = '复制'), 1500)
      }
    })
    pre.appendChild(button)
  })

  root.querySelectorAll('img').forEach((img) => {
    img.loading = 'lazy'
  })

  const headings = [...root.querySelectorAll('h2, h3')]
  toc.value = headings.map((heading, index) => {
    heading.id = `sec-${index + 1}`
    return {
      id: heading.id,
      text: heading.textContent.trim(),
      level: Number(heading.tagName.slice(1))
    }
  })
  if (toc.value[0]) activeHeading.value = toc.value[0].id
}

function onScroll() {
  updateProgress()
  updateActiveHeading()
}

function updateProgress() {
  const root = contentRef.value
  if (!root) {
    progress.value = 0
    return
  }
  const rect = root.getBoundingClientRect()
  const total = rect.height - window.innerHeight * 0.35
  const passed = window.innerHeight * 0.2 - rect.top
  progress.value = Math.max(0, Math.min(100, (passed / Math.max(total, 1)) * 100))
}

function updateActiveHeading() {
  if (!toc.value.length) return
  let current = toc.value[0].id
  for (const item of toc.value) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top <= 110) current = item.id
  }
  activeHeading.value = current
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function setFeedback(value) {
  if (!article.value) return
  feedback.value = value
  localStorage.setItem(`kb-feedback-${article.value.slug}`, value)
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    copied.value = false
  }
}

function formatDate(date) {
  return date.replaceAll('-', '.')
}
</script>

<template>
  <div v-if="article" class="article-page">
    <div class="read-progress" aria-hidden="true" :style="{ width: `${progress}%` }" />

    <div class="page-wrap article-wrap">
      <Breadcrumbs
        :items="[
          { label: article.category.title, to: `/category/${article.category.id}` },
          { label: article.title }
        ]"
      />

      <header class="article-head">
        <div class="head-topline">
          <RouterLink :to="`/category/${article.category.id}`" class="category-pill">
            <Icon :name="article.category.icon" :size="12" />
            {{ article.category.title }}
          </RouterLink>
          <span class="head-level">{{ article.level }}</span>
          <span class="head-note">示例文档</span>
        </div>

        <h1>{{ article.title }}</h1>
        <p class="article-summary">{{ article.summary }}</p>

        <div class="article-meta">
          <span><Icon name="clock" :size="13" /> 约 {{ article.readTime }} 分钟</span>
          <span><Icon name="book" :size="13" /> {{ article.category.short }}文档</span>
          <span class="meta-date">更新于 {{ formatDate(article.updated) }}</span>
          <button type="button" class="meta-action" @click="copyLink">
            <Icon :name="copied ? 'check' : 'copy'" :size="12" />
            {{ copied ? '链接已复制' : '复制链接' }}
          </button>
        </div>

        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>

      <div class="article-layout">
        <div class="article-doc">
          <div ref="contentRef" class="prose" v-html="html" />

          <div class="feedback-box">
            <div>
              <strong>这篇文档对你有帮助吗？</strong>
              <span>你的反馈会用于改进示例内容结构。</span>
            </div>
            <div class="feedback-actions">
              <button
                type="button"
                :class="{ picked: feedback === 'yes' }"
                @click="setFeedback('yes')"
              >
                <Icon name="check" :size="13" /> 有帮助
              </button>
              <button
                type="button"
                :class="{ picked: feedback === 'no' }"
                @click="setFeedback('no')"
              >
                <Icon name="close" :size="13" /> 还需完善
              </button>
            </div>
          </div>

          <nav class="article-pager" aria-label="上下篇">
            <RouterLink v-if="adjacent.prev" :to="`/article/${adjacent.prev.slug}`" class="pager-item">
              <span class="pager-label"><Icon name="arrowLeft" :size="12" /> 上一篇</span>
              <span class="pager-title">{{ adjacent.prev.title }}</span>
            </RouterLink>
            <span v-else class="pager-empty">已经是本栏目第一篇</span>

            <RouterLink v-if="adjacent.next" :to="`/article/${adjacent.next.slug}`" class="pager-item right">
              <span class="pager-label">下一篇 <Icon name="arrowRight" :size="12" /></span>
              <span class="pager-title">{{ adjacent.next.title }}</span>
            </RouterLink>
            <span v-else class="pager-empty right">已经是本栏目最后一篇</span>
          </nav>
        </div>

        <aside class="article-rail">
          <div v-if="toc.length" class="rail-card toc-card">
            <div class="rail-title">
              <b>本文目录</b>
            </div>
            <button
              v-for="item in toc"
              :key="item.id"
              type="button"
              class="toc-item"
              :class="{ active: activeHeading === item.id, sub: item.level === 3 }"
              @click="scrollTo(item.id)"
            >
              <span class="toc-line" />
              {{ item.text }}
            </button>
          </div>

          <div class="rail-card info-card">
            <div class="rail-title">
              <b>文档信息</b>
            </div>
            <div class="info-row"><span>栏目</span><b>{{ article.category.title }}</b></div>
            <div class="info-row"><span>难度</span><b>{{ article.level }}</b></div>
            <div class="info-row"><span>阅读</span><b>{{ article.readTime }} 分钟</b></div>
            <div class="info-row"><span>更新</span><b>{{ article.updated }}</b></div>
          </div>

          <div class="rail-card help-card">
            <span class="help-icon"><Icon name="info" :size="17" /></span>
            <b>参数以官方手册为准</b>
            <p>本站为示例知识库，型号参数、软件版本与操作步骤请与海康机器人最新资料核对。</p>
            <a href="https://www.hikrobotics.com/cn/machinevision/service/download?module=0" target="_blank" rel="noopener">
              打开下载中心 <Icon name="external" :size="11" />
            </a>
          </div>
        </aside>
      </div>

      <section v-if="related.length" class="related-section">
        <div class="section-head">
          <div>
            <h2>相关文档</h2>
          </div>
          <RouterLink :to="`/category/${article.category.id}`" class="section-link">
            返回栏目 <Icon name="arrowRight" :size="12" />
          </RouterLink>
        </div>
        <div class="related-grid">
          <RouterLink v-for="item in related" :key="item.slug" :to="`/article/${item.slug}`" class="related-card">
            <span class="related-cat">{{ item.category.title }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
            <span class="related-meta">{{ item.readTime }} 分钟 · {{ item.updated }}</span>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="article-missing page-wrap">
    <h1>文档不存在</h1>
    <p>这篇文档可能已经被移动、重命名或删除。</p>
    <RouterLink to="/" class="btn btn-primary">返回知识库</RouterLink>
  </div>
</template>

<style scoped>
.article-page {
  position: relative;
  padding-bottom: 10px;
}

.read-progress {
  position: fixed;
  top: 64px;
  left: 0;
  z-index: 55;
  height: 2px;
  background: linear-gradient(90deg, #2f9bff, #ff7a1a);
  box-shadow: 0 0 10px rgba(47, 155, 255, 0.45);
  transition: width 0.08s linear;
}

.article-wrap {
  padding-top: 32px;
}

.article-head {
  margin-top: 20px;
  padding: 30px 34px 26px;
  background: #fff;
  border: 1px solid #dce6f1;
  border-top: 3px solid #2f9bff;
  border-bottom: 0;
}

.head-topline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  font-size: 12.5px;
  color: #0b63bd;
  text-decoration: none;
  background: #edf6ff;
  border: 1px solid #cfe7fb;
  border-radius: 2px;
}

.head-level,
.head-note {
  padding: 4px 8px;
  font-size: 11.5px;
  color: var(--muted-2);
  border: 1px solid #e0e9f2;
  border-radius: 2px;
}

.head-note {
  color: #a34b0a;
  background: #fff8f1;
  border-color: #ffe2c9;
}

.article-head h1 {
  max-width: 850px;
  margin: 15px 0 11px;
  font-size: clamp(27px, 3vw, 36px);
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #10233a;
}

.article-summary {
  max-width: 800px;
  font-size: 16px;
  line-height: 1.85;
  color: var(--muted);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 17px;
  margin-top: 19px;
  padding-top: 15px;
  font-size: 13px;
  color: var(--muted);
  border-top: 1px dashed #e1e9f2;
}

.article-meta > span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.meta-date {
  font-family: var(--font-mono);
  font-size: 12px !important;
  font-variant-numeric: tabular-nums;
}

.meta-action {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  font-size: 12.5px;
  color: var(--muted-2);
  background: transparent;
  border: 0;
  cursor: pointer;
}

.meta-action:hover {
  color: #0b63bd;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 13px;
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 236px;
  gap: 32px;
  align-items: flex-start;
}

.article-doc {
  min-width: 0;
  padding: 32px 34px 30px;
  background: #fff;
  border: 1px solid #dce6f1;
}

.article-rail {
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rail-card {
  padding: 16px 15px 14px;
  background: #fff;
  border: 1px solid #dce6f1;
  border-radius: 3px;
}

.rail-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 10px;
  margin-bottom: 8px;
  border-bottom: 1px dashed #e1e9f2;
}

.rail-title b {
  font-size: 14px;
  font-weight: 700;
  color: #2c4a68;
}

.toc-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  width: 100%;
  padding: 5px 0 5px 8px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--muted);
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.toc-item.sub {
  padding-left: 18px;
  font-size: 13px;
  color: var(--muted-2);
}

.toc-item:hover {
  color: #0b63bd;
}

.toc-item.active {
  color: #0b63bd;
  font-weight: 600;
}

.toc-item.active .toc-line {
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: #0b63bd;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  font-size: 12.5px;
}

.info-row span {
  color: var(--muted);
}

.info-row b {
  font-weight: 500;
  color: #40566d;
  text-align: right;
}

.info-row:last-child b {
  font-family: var(--font-mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.help-card {
  background: #fffdf9;
  border-color: #f0e1d2;
}

.help-icon {
  display: grid;
  place-items: center;
  width: fit-content;
  margin-bottom: 9px;
  color: #b45309;
}

.help-card b {
  display: block;
  font-size: 14px;
  color: #7a3f10;
}

.help-card p {
  margin: 6px 0 10px;
  font-size: 12.5px;
  line-height: 1.7;
  color: #5f4a37;
}

.help-card a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: #a34b0a;
  text-decoration: none;
}

.help-card a:hover {
  text-decoration: underline;
}

.feedback-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 34px;
  padding: 17px 18px;
  background: #f8fbfe;
  border: 1px solid #e1ebf4;
  border-radius: 3px;
}

.feedback-box strong {
  display: block;
  font-size: 14px;
  color: #2c4a68;
}

.feedback-box > div > span {
  display: block;
  margin-top: 3px;
  font-size: 12.5px;
  color: var(--muted);
}

.feedback-actions {
  display: flex;
  gap: 7px;
  flex: none;
}

.feedback-actions button {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 34px;
  padding: 0 12px;
  font-size: 13px;
  color: var(--muted-2);
  background: #fff;
  border: 1px solid #dce6f1;
  border-radius: 3px;
  cursor: pointer;
}

.feedback-actions button:hover {
  border-color: #9fcdf7;
  color: #0b63bd;
}

.feedback-actions button.picked {
  color: #0b63bd;
  background: #edf6ff;
  border-color: #b8dbfa;
}

.article-pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 24px;
}

.pager-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 16px;
  text-decoration: none;
  border: 1px solid #e1e9f2;
  border-radius: 3px;
  transition: border-color 0.16s ease;
}

.pager-item.right {
  align-items: flex-end;
  text-align: right;
}

.pager-item:hover {
  border-color: #9fcdf7;
}

.pager-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--muted);
}

.pager-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-soft);
}

.pager-empty {
  padding: 14px 2px;
  font-size: 12.5px;
  color: var(--muted-2);
}

.pager-empty.right {
  text-align: right;
}

.related-section {
  margin-top: 46px;
  padding-bottom: 10px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.related-card {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 18px 18px 16px;
  text-decoration: none;
  background: #fff;
  border: 1px solid #dce6f1;
  border-radius: 3px;
  transition: border-color 0.16s ease, transform 0.16s ease;
}

.related-card:hover {
  border-color: #9fcdf7;
  transform: translateY(-2px);
}

.related-cat {
  font-size: 11.5px;
  color: #0b63bd;
}

.related-card h3 {
  font-size: 15.5px;
  font-weight: 700;
  color: #223a53;
  line-height: 1.45;
}

.related-card p {
  display: -webkit-box;
  overflow: hidden;
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--muted);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-meta {
  margin-top: auto;
  padding-top: 7px;
  font-size: 12px;
  color: var(--muted-2);
  font-variant-numeric: tabular-nums;
}

.article-missing {
  padding-top: 90px;
  padding-bottom: 90px;
}

.article-missing h1 {
  margin: 0 0 10px;
  font-size: 32px;
}

.article-missing p {
  margin-bottom: 20px;
  font-size: 15px;
  color: var(--muted);
}

@media (max-width: 980px) {
  .article-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .article-rail {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    order: -1;
    margin-bottom: 4px;
  }
  .toc-card {
    max-height: 230px;
    overflow-y: auto;
  }
  .help-card {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .article-head {
    padding: 22px 20px 20px;
  }
  .article-head h1 {
    font-size: 26px;
  }
  .article-meta {
    gap: 11px;
  }
  .meta-action {
    margin-left: 0;
  }
  .article-doc {
    padding: 24px 20px 22px;
  }
  .article-rail {
    grid-template-columns: 1fr;
  }
  .feedback-box {
    align-items: flex-start;
    flex-direction: column;
  }
  .article-pager {
    grid-template-columns: 1fr;
  }
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
