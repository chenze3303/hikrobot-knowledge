<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import Icon from '../components/Icon.vue'
import { categories } from '../data/categories'
import { getCategory, getCategoryArticles } from '../data/knowledge'

const route = useRoute()
const query = ref('')

const category = computed(() => getCategory(route.params.categoryId))
const list = computed(() => getCategoryArticles(route.params.categoryId))
const filtered = computed(() => {
  const word = query.value.trim().toLowerCase()
  if (!word) return list.value
  return list.value.filter((article) => {
    return (
      article.title.toLowerCase().includes(word) ||
      article.summary.toLowerCase().includes(word) ||
      article.tags.join(' ').toLowerCase().includes(word) ||
      article.plain.toLowerCase().includes(word)
    )
  })
})

const categoryIndex = computed(() => categories.findIndex((item) => item.id === route.params.categoryId))
const prevCategory = computed(() => categories[categoryIndex.value - 1] || null)
const nextCategory = computed(() => categories[categoryIndex.value + 1] || null)

watch(
  () => route.params.categoryId,
  () => {
    query.value = ''
  }
)
</script>

<template>
  <div v-if="category" class="category-page page-wrap">
    <Breadcrumbs :items="[{ label: category.title }]" />

    <header class="cat-head">
      <div class="cat-mark">
        <Icon :name="category.icon" :size="26" />
      </div>
      <div class="cat-copy">
        <h1>{{ category.title }}</h1>
        <p>{{ category.description }}</p>
        <div class="cat-tags">
          <span v-for="word in category.keywords" :key="word" class="tag">{{ word }}</span>
        </div>
      </div>
      <div class="cat-count">
        <strong>{{ list.length }}</strong>
        <span>篇文档</span>
      </div>
    </header>

    <div class="cat-toolbar">
      <div class="toolbar-label">
        <span>全部文档</span>
      </div>
      <div class="toolbar-search">
        <Icon name="search" :size="14" />
        <input v-model="query" type="search" :placeholder="`在「${category.title}」中筛选…`" />
        <button v-if="query" type="button" aria-label="清空筛选" @click="query = ''">
          <Icon name="close" :size="13" />
        </button>
      </div>
    </div>

    <div v-if="filtered.length" class="doc-list">
      <RouterLink v-for="article in filtered" :key="article.slug" :to="`/article/${article.slug}`" class="doc-row">
        <div class="doc-main">
          <h2>{{ article.title }}</h2>
          <p>{{ article.summary }}</p>
          <div class="doc-tags">
            <span v-for="tag in article.tags.slice(0, 4)" :key="tag" class="tag">{{ tag }}</span>
            <span class="tag blue">{{ article.level }}</span>
          </div>
        </div>
        <div class="doc-meta">
          <span><Icon name="clock" :size="12" /> {{ article.readTime }} 分钟</span>
          <span class="doc-date">{{ article.updated }}</span>
          <span class="doc-arrow"><Icon name="arrowRight" :size="14" /></span>
        </div>
      </RouterLink>
    </div>

    <div v-else class="cat-empty">
      <Icon name="search" :size="24" />
      <p>没有匹配「{{ query }}」的文档</p>
      <button type="button" class="btn btn-ghost" @click="query = ''">清空筛选</button>
    </div>

    <nav class="cat-pager" aria-label="栏目切换">
      <RouterLink v-if="prevCategory" :to="`/category/${prevCategory.id}`" class="pager-card">
        <span class="pager-label"><Icon name="arrowLeft" :size="13" /> 上一栏目</span>
        <span class="pager-title">{{ prevCategory.title }}</span>
      </RouterLink>
      <span v-else />
      <RouterLink v-if="nextCategory" :to="`/category/${nextCategory.id}`" class="pager-card right">
        <span class="pager-label">下一栏目 <Icon name="arrowRight" :size="13" /></span>
        <span class="pager-title">{{ nextCategory.title }}</span>
      </RouterLink>
    </nav>
  </div>

  <div v-else class="not-found page-wrap">
    <h1>栏目不存在</h1>
    <p>这个栏目可能已经被移动或删除。</p>
    <RouterLink to="/" class="btn btn-primary">返回知识库</RouterLink>
  </div>
</template>

<style scoped>
.category-page {
  padding-top: 34px;
  padding-bottom: 10px;
}

.cat-head {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-top: 22px;
  padding: 28px 30px 26px;
  background: #fff;
  border: 1px solid #dce6f1;
  border-top: 3px solid #2f9bff;
  border-radius: 0;
}

.cat-mark {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  color: #0b63bd;
  flex: none;
}

.cat-copy {
  flex: 1;
  min-width: 0;
}

.cat-copy h1 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #122238;
}

.cat-copy p {
  max-width: 720px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--muted);
}

.cat-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
}

.cat-count {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  padding-left: 20px;
  border-left: 1px dashed #dce6f1;
  flex: none;
}

.cat-count strong {
  font-family: var(--font-mono);
  font-size: 27px;
  line-height: 1;
  color: #0b63bd;
  font-variant-numeric: tabular-nums;
}

.cat-count span {
  font-size: 12px;
  color: var(--muted);
}

.cat-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 28px 0 12px;
}

.toolbar-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-soft);
}

.toolbar-search {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 270px;
  height: 36px;
  padding: 0 10px;
  color: var(--muted-2);
  background: #fff;
  border: 1px solid #dce6f1;
  border-radius: 3px;
}

.toolbar-search:focus-within {
  border-color: #0b63bd;
  box-shadow: 0 0 0 3px rgba(11, 99, 189, 0.12);
}

.toolbar-search input {
  flex: 1;
  min-width: 0;
  font-size: 13.5px;
  color: #2c4a68;
  background: transparent;
  border: 0;
  outline: 0;
}

.toolbar-search input::placeholder {
  color: var(--muted-2);
}

.toolbar-search button {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  color: var(--muted-2);
  background: transparent;
  border: 0;
  cursor: pointer;
}

.doc-list {
  border-top: 1px solid #dce6f1;
}

.doc-row {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 20px 14px;
  text-decoration: none;
  background: #fff;
  border-bottom: 1px solid #e3ebf4;
  transition: background 0.16s ease;
}

.doc-row:hover {
  background: #fbfdff;
}

.doc-main {
  flex: 1;
  min-width: 0;
}

.doc-main h2 {
  font-size: 17px;
  font-weight: 700;
  color: #1c334b;
  transition: color 0.16s ease;
}

.doc-row:hover .doc-main h2 {
  color: #0b63bd;
}

.doc-main p {
  display: -webkit-box;
  margin-top: 6px;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.doc-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  width: 108px;
  padding-top: 3px;
  flex: none;
}

.doc-meta > span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.doc-date {
  font-family: var(--font-mono);
  font-size: 11.5px !important;
}

.doc-arrow {
  display: grid !important;
  place-items: center;
  width: 26px;
  height: 26px;
  margin-top: 3px;
  color: var(--muted-2);
  border: 1px solid #e1e9f2;
  border-radius: 50%;
  transition: color 0.16s ease, background 0.16s ease, border-color 0.16s ease;
}

.doc-row:hover .doc-arrow {
  color: #fff;
  background: #0b63bd;
  border-color: #0b63bd;
}

.cat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--muted-2);
  background: #fff;
  border: 1px solid #e1e9f2;
}

.cat-empty p {
  font-size: 15px;
  color: var(--ink-soft);
}

.cat-pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 32px;
}

.pager-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  text-decoration: none;
  background: #fff;
  border: 1px solid #dce6f1;
  border-radius: 3px;
  transition: border-color 0.16s ease;
}

.pager-card.right {
  align-items: flex-end;
  text-align: right;
}

.pager-card:hover {
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
  font-size: 15px;
  font-weight: 600;
  color: #2c4a68;
}

.not-found {
  padding-top: 100px;
  padding-bottom: 100px;
}

.not-found h1 {
  margin: 0 0 10px;
  font-size: 32px;
}

.not-found p {
  margin-bottom: 20px;
  font-size: 15px;
  color: var(--muted);
}

@media (max-width: 760px) {
  .cat-head {
    flex-wrap: wrap;
    padding: 22px 20px;
  }
  .cat-mark {
    width: 40px;
    height: 40px;
  }
  .cat-count {
    width: 100%;
    flex-direction: row;
    align-items: baseline;
    gap: 6px;
    padding-left: 0;
    padding-top: 12px;
    border-left: 0;
    border-top: 1px dashed #dce6f1;
  }
  .cat-count strong {
    font-size: 21px;
  }
  .cat-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
  .toolbar-search {
    width: 100%;
  }
  .doc-row {
    gap: 10px;
    padding: 17px 6px;
  }
  .doc-main h2 {
    font-size: 16px;
  }
  .doc-meta {
    width: 58px;
  }
  .doc-date,
  .doc-meta > span:first-child {
    display: none;
  }
  .cat-pager {
    grid-template-columns: 1fr;
  }
}
</style>
