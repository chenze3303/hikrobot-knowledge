<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import SideNav from './components/SideNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import SearchDialog from './components/SearchDialog.vue'
import { getArticle, getCategory } from './data/knowledge'

const SITE_NAME = '海康机器人读码器知识中心'

const route = useRoute()
const navOpen = ref(false)
const searchOpen = ref(false)
const searchSeed = ref('')

function openSearch(event) {
  searchSeed.value = event?.detail || ''
  searchOpen.value = true
}

function isTyping(target) {
  if (!target) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

function onResize() {
  if (window.innerWidth > 1200 && navOpen.value) {
    navOpen.value = false
  }
}

function onGlobalKeydown(event) {
  if (event.key === 'Escape') {
    if (searchOpen.value) {
      searchOpen.value = false
      return
    }
    if (navOpen.value) {
      navOpen.value = false
      return
    }
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
    return
  }
  if (event.key === '/' && !isTyping(event.target) && !searchOpen.value) {
    event.preventDefault()
    openSearch()
  }
}

watch(
  () => route.fullPath,
  () => {
    navOpen.value = false
    searchOpen.value = false

    let title = SITE_NAME
    if (route.name === 'article') {
      const article = getArticle(route.params.slug)
      title = article ? `${article.title} · ${SITE_NAME}` : `文档不存在 · ${SITE_NAME}`
    } else if (route.name === 'category') {
      const category = getCategory(route.params.categoryId)
      title = category ? `${category.title} · ${SITE_NAME}` : `栏目不存在 · ${SITE_NAME}`
    } else if (route.name === 'not-found') {
      title = `页面不存在 · ${SITE_NAME}`
    }
    document.title = title
  },
  { immediate: true }
)

watch([navOpen, searchOpen], ([nav, search]) => {
  document.body.style.overflow = nav || search ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
  window.addEventListener('kb:search', openSearch)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('kb:search', openSearch)
  window.removeEventListener('resize', onResize)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">跳到正文</a>
    <AppHeader :nav-open="navOpen" @search="searchOpen = true" @toggle-nav="navOpen = !navOpen" />

    <div class="app-body">
      <SideNav :open="navOpen" @close="navOpen = false" @search="searchOpen = true" />

      <Transition name="fade">
        <div v-if="navOpen" class="nav-backdrop" aria-hidden="true" @click="navOpen = false" />
      </Transition>

      <main id="main-content" class="app-main">
        <RouterView />
        <SiteFooter />
      </main>
    </div>

    <SearchDialog v-model:open="searchOpen" :initial-query="searchSeed" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f2f5f9;
}

.app-body {
  display: flex;
  align-items: flex-start;
  min-height: calc(100vh - 64px);
}

.app-main {
  flex: 1;
  min-width: 0;
}

.skip-link {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 120;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  background: #0b63bd;
  border-radius: 3px;
  transform: translateY(-160%);
}

.skip-link:focus {
  transform: translateY(0);
}

.nav-backdrop {
  position: fixed;
  inset: 64px 0 0;
  z-index: 35;
  background: rgba(5, 18, 34, 0.45);
  backdrop-filter: blur(2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
