<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categories, groups } from '../data/categories'
import { getArticle, getCategoryArticles } from '../data/knowledge'
import Icon from './Icon.vue'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'search'])
const route = useRoute()

const expanded = ref(new Set())

const activeCategory = computed(() => {
  if (route.name === 'category') return route.params.categoryId
  if (route.name === 'article') {
    return getArticle(route.params.slug)?.categoryId || ''
  }
  return ''
})
const activeArticle = computed(() => (route.name === 'article' ? route.params.slug : ''))

watch(
  () => route.fullPath,
  () => {
    if (activeCategory.value) {
      const next = new Set(expanded.value)
      next.add(activeCategory.value)
      expanded.value = next
    }
    emit('close')
  },
  { immediate: true }
)

function isExpanded(id) {
  return expanded.value.has(id)
}

function toggle(id) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

function countOf(id) {
  return getCategoryArticles(id).length
}

const groupCategories = (group) => categories.filter((category) => group.categories.includes(category.id))
</script>

<template>
  <aside class="side-nav" :class="{ open }">
    <div class="side-top">
      <div class="side-title-row">
        <span class="side-kicker">LIBRARY</span>
        <button class="side-close" type="button" aria-label="关闭目录" @click="emit('close')">
          <Icon name="close" :size="16" />
        </button>
      </div>
      <h2>知识库</h2>
      <button class="side-search" type="button" @click="emit('search')">
        <Icon name="search" :size="15" />
        <span>搜索型号、故障或参数</span>
        <kbd>/</kbd>
      </button>
    </div>

    <nav class="side-tree" aria-label="知识库目录">
      <section v-for="group in groups" :key="group.id" class="tree-group">
        <div class="group-head">
          <span class="group-index">{{ group.index }}</span>
          <span class="group-label">{{ group.label }}</span>
          <span class="group-line" />
        </div>

        <div v-for="category in groupCategories(group)" :key="category.id" class="tree-category">
          <div class="category-row" :class="{ active: activeCategory === category.id }">
            <RouterLink :to="`/category/${category.id}`" class="category-main">
              <span class="category-icon"><Icon :name="category.icon" :size="16" /></span>
              <span class="category-name">{{ category.title }}</span>
              <span class="category-count">{{ countOf(category.id) }}</span>
            </RouterLink>
            <button
              class="category-toggle"
              type="button"
              :aria-expanded="isExpanded(category.id)"
              :aria-label="`${isExpanded(category.id) ? '收起' : '展开'}${category.title}`"
              @click="toggle(category.id)"
            >
              <Icon name="chevron" :size="14" :class="{ rotated: isExpanded(category.id) }" />
            </button>
          </div>

          <div v-if="isExpanded(category.id)" class="article-links">
            <RouterLink
              v-for="article in getCategoryArticles(category.id)"
              :key="article.slug"
              :to="`/article/${article.slug}`"
              class="article-link"
              :class="{ active: activeArticle === article.slug }"
            >
              <span class="article-dot" />
              <span>{{ article.title }}</span>
            </RouterLink>
          </div>
        </div>
      </section>

      <div class="tree-note">
        <span class="note-dot" />
        <p>示例内容框架。正式参数与操作请以海康机器人官方手册为准。</p>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.side-nav {
  position: sticky;
  top: 64px;
  display: flex;
  flex-direction: column;
  width: 312px;
  height: calc(100vh - 64px);
  background: #f7f9fc;
  border-right: 1px solid #dfe7f1;
  overflow: hidden;
  z-index: 40;
}

.side-top {
  padding: 24px 22px 18px;
  border-bottom: 1px solid #e4ebf3;
  background:
    linear-gradient(180deg, rgba(47, 155, 255, 0.05), transparent),
    #fbfcfe;
}

.side-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.side-kicker {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  color: #8aa1ba;
}

.side-close {
  display: none;
  width: 28px;
  height: 28px;
  color: #60748a;
  background: transparent;
  border: 1px solid #dbe5ef;
  border-radius: 3px;
  cursor: pointer;
}

.side-top h2 {
  margin: 7px 0 15px;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #122238;
}

.side-search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 0 10px;
  color: #7a8ea5;
  background: #fff;
  border: 1px solid #d8e3ef;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.18s ease;
}

.side-search:hover {
  border-color: #2f9bff;
}

.side-search span {
  flex: 1;
  overflow: hidden;
  font-size: 12px;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.side-search kbd {
  padding: 1px 5px;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 9px;
  color: #7d93aa;
  border: 1px solid #dbe4ee;
  border-radius: 2px;
}

.side-tree {
  flex: 1;
  padding: 14px 14px 30px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c9d6e4 transparent;
}

.tree-group + .tree-group {
  margin-top: 18px;
}

.group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 8px;
}

.group-index {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 9px;
  color: #2f9bff;
}

.group-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #7a8fa6;
  white-space: nowrap;
}

.group-line {
  flex: 1;
  height: 1px;
  background: #e1e9f2;
}

.category-row {
  display: flex;
  align-items: stretch;
  border-radius: 4px;
  transition: background 0.16s ease;
}

.category-row:hover {
  background: #eef4fb;
}

.category-row.active {
  background: #e8f2ff;
  box-shadow: inset 3px 0 0 #2f9bff;
}

.category-main {
  display: flex;
  align-items: center;
  gap: 9px;
  flex: 1;
  min-width: 0;
  padding: 9px 6px 9px 10px;
  color: #31465e;
  text-decoration: none;
}

.category-icon {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  color: #5d7891;
  background: #fff;
  border: 1px solid #dce7f2;
  border-radius: 3px;
}

.category-row.active .category-icon {
  color: #1173d4;
  border-color: #b8d8f8;
}

.category-name {
  flex: 1;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.category-count {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 9px;
  color: #8ba0b6;
}

.category-toggle {
  display: grid;
  place-items: center;
  width: 28px;
  color: #8ba0b6;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.category-toggle :deep(.icon) {
  transition: transform 0.18s ease;
}

.category-toggle :deep(.icon.rotated) {
  transform: rotate(180deg);
}

.article-links {
  margin: 3px 0 7px 22px;
  padding-left: 12px;
  border-left: 1px solid #dce6f1;
}

.article-link {
  position: relative;
  display: flex;
  gap: 7px;
  align-items: flex-start;
  padding: 6px 8px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #687c93;
  text-decoration: none;
  border-radius: 3px;
}

.article-link:hover {
  color: #1d5f9e;
  background: #f0f6fd;
}

.article-link.active {
  color: #0c63bd;
  font-weight: 600;
  background: #eaf4ff;
}

.article-dot {
  width: 4px;
  height: 4px;
  margin-top: 6px;
  background: #b6c8da;
  border-radius: 50%;
  flex: none;
}

.article-link.active .article-dot {
  background: #2f9bff;
}

.tree-note {
  display: flex;
  gap: 8px;
  margin: 24px 8px 0;
  padding: 11px 10px;
  background: #fff;
  border: 1px solid #e1e9f2;
  border-left: 2px solid #ff9a4d;
  border-radius: 0 3px 3px 0;
}

.note-dot {
  width: 6px;
  height: 6px;
  margin-top: 4px;
  background: #ff8a2a;
  border-radius: 50%;
  flex: none;
}

.tree-note p {
  margin: 0;
  font-size: 10px;
  line-height: 1.6;
  color: #7d8fa4;
}

@media (max-width: 1024px) {
  .side-nav {
    position: fixed;
    left: 0;
    top: 64px;
    bottom: 0;
    height: auto;
    transform: translateX(-102%);
    transition: transform 0.22s ease;
    box-shadow: 20px 0 50px rgba(5, 20, 38, 0.18);
  }
  .side-nav.open {
    transform: translateX(0);
  }
  .side-close {
    display: grid;
    place-items: center;
  }
}
</style>
