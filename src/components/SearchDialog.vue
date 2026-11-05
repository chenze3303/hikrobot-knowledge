<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { categories, hotSearches } from '../data/categories'
import { searchArticles, recentArticles } from '../data/knowledge'
import Icon from './Icon.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  initialQuery: { type: String, default: '' }
})
const emit = defineEmits(['update:open'])

const query = ref('')
const inputRef = ref(null)
const panelRef = ref(null)
const activeIndex = ref(0)
const lastActive = ref(null)
const router = useRouter()

const results = computed(() => searchArticles(query.value).slice(0, 12))
const showEmpty = computed(() => query.value.trim() && results.value.length === 0)
const suggestions = computed(() => recentArticles.slice(0, 5))

watch(
  () => props.open,
  async (open) => {
    if (open) {
      lastActive.value = document.activeElement
      query.value = props.initialQuery || ''
      activeIndex.value = 0
      await nextTick()
      inputRef.value?.focus()
    } else {
      lastActive.value?.focus?.()
      lastActive.value = null
    }
  }
)

watch(results, () => {
  activeIndex.value = 0
})

function close() {
  emit('update:open', false)
}

function pick(article) {
  close()
  router.push(`/article/${article.slug}`)
}

function setHot(word) {
  query.value = word
  nextTick(() => inputRef.value?.focus())
}

function onKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter' && results.value[activeIndex.value]) {
    event.preventDefault()
    pick(results.value[activeIndex.value])
  } else if (event.key === 'Escape') {
    close()
  }
}

function onPanelKeydown(event) {
  if (event.key !== 'Tab' || !panelRef.value) return
  const nodes = [...panelRef.value.querySelectorAll('button, input, a[href]')].filter(
    (el) => !el.disabled && el.offsetParent !== null
  )
  if (!nodes.length) return
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlight(text) {
  const safe = escapeHtml(text)
  const word = query.value.trim()
  if (!word) return safe
  const escapedWord = escapeHtml(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return safe.replace(new RegExp(escapedWord, 'gi'), (match) => `<mark>${match}</mark>`)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div v-if="open" class="search-layer" @mousedown.self="close">
        <div ref="panelRef" class="search-panel" role="dialog" aria-modal="true" aria-label="搜索文档" @keydown="onPanelKeydown">
          <div class="search-head">
            <div class="search-input-wrap">
              <Icon name="search" :size="19" />
              <input
                ref="inputRef"
                v-model="query"
                type="search"
                aria-label="搜索文档"
                placeholder="搜索型号、故障现象、协议或参数…"
                autocomplete="off"
                @keydown="onKeydown"
              />
              <kbd>ESC</kbd>
            </div>
            <button class="search-close" type="button" aria-label="关闭搜索" @click="close">
              <Icon name="close" :size="18" />
            </button>
          </div>

          <div class="search-body">
            <div v-if="!query.trim()" class="search-idle">
              <div class="search-section-label">热门搜索</div>
              <div class="hot-list">
                <button v-for="word in hotSearches" :key="word" type="button" @click="setHot(word)">
                  {{ word }}
                </button>
              </div>

              <div class="search-section-label recent-label">最近更新</div>
              <button
                v-for="article in suggestions"
                :key="article.slug"
                class="recent-row"
                type="button"
                @click="pick(article)"
              >
                <Icon name="book" :size="15" />
                <span>{{ article.title }}</span>
                <small>{{ article.category?.title }}</small>
              </button>
            </div>

            <div v-else-if="showEmpty" class="search-empty">
              <Icon name="search" :size="26" />
              <p>没有找到与「{{ query }}」相关的文档</p>
              <span>试试型号前缀（如 ID2000）、故障现象或协议名称。</span>
            </div>

            <div v-else class="search-results">
              <div class="search-section-label" aria-live="polite">
                找到 {{ results.length }} 篇文档
                <span>使用 ↑ ↓ 选择，Enter 打开</span>
              </div>
              <button
                v-for="(article, index) in results"
                :key="article.slug"
                class="result-row"
                :class="{ active: index === activeIndex }"
                type="button"
                @mousedown.prevent="pick(article)"
                @mouseenter="activeIndex = index"
              >
                <span class="result-icon"><Icon :name="article.category?.icon || 'book'" :size="16" /></span>
                <span class="result-main">
                  <span class="result-title" v-html="highlight(article.title)" />
                  <span class="result-snippet" v-html="highlight(article.snippet)" />
                  <span class="result-tags">
                    <b>{{ article.category?.title }}</b>
                    <i v-for="tag in article.tags.slice(0, 3)" :key="tag">{{ tag }}</i>
                  </span>
                </span>
                <Icon name="arrowRight" :size="15" class="result-arrow" />
              </button>
            </div>
          </div>

          <div class="search-foot">
            <span><i class="legend-key">↵</i> 打开文档</span>
            <span><i class="legend-key">esc</i> 关闭</span>
            <span class="foot-note">索引 {{ categories.length }} 个栏目 · 本地全文检索</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-layer {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  justify-content: center;
  padding: 9vh 20px 20px;
  background: rgba(4, 12, 24, 0.72);
  backdrop-filter: blur(6px);
}

.search-panel {
  display: flex;
  flex-direction: column;
  width: min(760px, 100%);
  max-height: 78vh;
  background: #fff;
  border: 1px solid rgba(120, 170, 220, 0.35);
  border-radius: 5px;
  box-shadow: 0 30px 80px rgba(1, 8, 18, 0.5);
  overflow: hidden;
}

.search-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 14px 14px 18px;
  background: #07111f;
  border-bottom: 1px solid rgba(112, 160, 214, 0.25);
}

.search-head :focus-visible {
  outline-color: #7cc4ff;
}

.search-input-wrap {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 11px;
  height: 48px;
  padding: 0 12px;
  color: #8fa6bd;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(146, 186, 228, 0.38);
  border-radius: 3px;
}

.search-input-wrap:focus-within {
  border-color: #4aa8ff;
  box-shadow: 0 0 0 3px rgba(47, 155, 255, 0.16);
}

.search-input-wrap input {
  flex: 1;
  min-width: 0;
  font-size: 16px;
  color: #f3f8ff;
  background: transparent;
  border: 0;
  outline: 0;
}

.search-input-wrap input::placeholder {
  color: #9db4cc;
}

.search-input-wrap input::-webkit-search-cancel-button {
  filter: invert(0.7);
}

.search-input-wrap kbd {
  padding: 3px 7px;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 11px;
  color: #a7bdd4;
  border: 1px solid rgba(146, 186, 228, 0.34);
  border-radius: 2px;
}

.search-close {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #b4c8de;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
}

.search-close:hover {
  color: #fff;
  border-color: rgba(146, 186, 228, 0.34);
}

.search-body {
  flex: 1;
  padding: 18px 18px 10px;
  overflow-y: auto;
}

.search-section-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.search-section-label span {
  font-weight: 400;
  letter-spacing: 0;
  color: var(--muted-2);
}

.hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 26px;
}

.hot-list button {
  padding: 7px 12px;
  font-size: 13px;
  color: #2c4a68;
  background: #f2f7fd;
  border: 1px solid #dbe8f5;
  border-radius: 3px;
  cursor: pointer;
  transition: color 0.16s ease, background 0.16s ease, border-color 0.16s ease;
}

.hot-list button:hover {
  color: #0b63bd;
  background: #e8f3ff;
  border-color: #a9d0f6;
}

.recent-label {
  margin-top: 2px;
}

.recent-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  color: #38506a;
  text-align: left;
  background: transparent;
  border: 0;
  border-bottom: 1px dashed #e8eff6;
  cursor: pointer;
}

.recent-row:hover {
  color: #0b63bd;
  background: #f5faff;
}

.recent-row span {
  flex: 1;
  font-size: 14px;
}

.recent-row small {
  font-size: 12px;
  color: var(--muted);
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.result-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 12px 10px;
  text-align: left;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
}

.result-row.active {
  background: #f2f8ff;
  border-color: #d5e8fa;
}

.result-icon {
  display: grid;
  place-items: center;
  width: 28px;
  color: #5c7893;
  flex: none;
}

.result-main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.result-title {
  font-size: 14.5px;
  font-weight: 600;
  color: #152a41;
}

.result-title :deep(mark),
.result-snippet :deep(mark) {
  padding: 0 1px;
  color: #0a56a6;
  background: #cfe8ff;
  border-radius: 1px;
}

.result-snippet {
  display: -webkit-box;
  overflow: hidden;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--muted);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.result-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.result-tags b {
  font-size: 11.5px;
  font-weight: 600;
  color: #0b63bd;
}

.result-tags i {
  font-size: 11.5px;
  font-style: normal;
  color: var(--muted);
}

.result-arrow {
  margin-top: 6px;
  color: var(--muted-2);
  opacity: 0;
}

.result-row.active .result-arrow {
  color: #0b63bd;
  opacity: 1;
}

.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 50px 20px 60px;
  color: var(--muted-2);
}

.search-empty p {
  margin: 4px 0 0;
  font-size: 15px;
  color: #314b66;
}

.search-empty span {
  font-size: 13px;
  color: var(--muted);
}

.search-foot {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 11px 18px;
  font-size: 12px;
  color: var(--muted);
  background: #f8fafc;
  border-top: 1px solid #e6edf5;
}

.search-foot span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-key {
  padding: 1px 6px;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 11px;
  font-style: normal;
  color: var(--muted-2);
  background: #fff;
  border: 1px solid #dce6f0;
  border-radius: 2px;
}

.foot-note {
  margin-left: auto;
  font-size: 11.5px;
  letter-spacing: 0.02em;
  color: var(--muted-2);
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.18s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .search-layer {
    padding: 0;
  }
  .search-panel {
    width: 100%;
    max-height: 100vh;
    height: 100%;
    border-radius: 0;
    border: 0;
  }
  .search-foot {
    flex-wrap: wrap;
    gap: 10px;
  }
  .foot-note {
    width: 100%;
    margin-left: 0;
  }
}
</style>
