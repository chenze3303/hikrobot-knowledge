<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Icon from './Icon.vue'
import { getArticle } from '../data/knowledge'

defineProps({
  navOpen: { type: Boolean, default: false }
})
const emit = defineEmits(['search', 'toggle-nav'])
const route = useRoute()

const links = [
  { label: '产品选型', to: '/category/selection' },
  { label: '安装调试', to: '/category/software' },
  { label: '通讯与协议', to: '/category/communication' },
  { label: '二次开发', to: '/category/development' },
  { label: '故障排查', to: '/category/troubleshooting' }
]

const activeCategory = computed(() => {
  if (route.name === 'category') return route.params.categoryId
  if (route.name === 'article') return getArticle(route.params.slug)?.categoryId || ''
  return ''
})

const isActive = (link) => link.to === `/category/${activeCategory.value}`
</script>

<template>
  <header class="site-header">
    <div class="header-left">
      <button
        class="menu-btn"
        type="button"
        :aria-label="navOpen ? '关闭目录' : '打开目录'"
        :aria-expanded="navOpen"
        aria-controls="side-nav"
        @click="emit('toggle-nav')"
      >
        <Icon :name="navOpen ? 'close' : 'menu'" :size="18" />
      </button>

      <RouterLink to="/" class="brand" aria-label="返回知识中心首页">
        <span class="brand-mark" aria-hidden="true">
          <i v-for="bar in 5" :key="bar" :style="{ height: `${9 + bar * 2}px` }" />
          <b />
        </span>
        <span class="brand-text">
          <strong>HIKROBOT</strong>
          <small>读码器知识中心</small>
        </span>
      </RouterLink>
    </div>

    <nav class="header-nav" aria-label="主导航">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        :class="{ active: isActive(link) }"
        :aria-current="isActive(link) ? 'page' : undefined"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="header-right">
      <button class="search-trigger" type="button" @click="emit('search')">
        <Icon name="search" :size="16" />
        <span>搜索文档</span>
        <kbd>⌘K</kbd>
      </button>
      <a
        class="header-icon-link"
        href="https://www.hikrobotics.com/cn/machinevision/service/download?module=0"
        target="_blank"
        rel="noopener"
        title="前往海康机器人下载中心"
      >
        <Icon name="download" :size="18" />
      </a>
      <span class="sample-pill">示例库</span>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 64px;
  padding: 0 24px;
  color: #dce8f7;
  background:
    linear-gradient(90deg, rgba(47, 155, 255, 0.14), transparent 36%),
    #07111f;
  border-bottom: 1px solid rgba(112, 160, 214, 0.22);
  box-shadow: 0 10px 30px rgba(4, 12, 24, 0.28);
}

.site-header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(57, 169, 255, 0.7), transparent);
}

.header-left,
.header-right,
.brand,
.header-nav {
  display: flex;
  align-items: center;
}

.header-left {
  gap: 14px;
  min-width: 0;
}

.menu-btn {
  display: none;
  width: 34px;
  height: 34px;
  color: #cfe0f4;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(150, 190, 230, 0.2);
  border-radius: 4px;
  cursor: pointer;
}

.brand {
  gap: 11px;
  color: inherit;
  text-decoration: none;
}

.brand-mark {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 28px;
  padding: 0 5px 4px;
  border: 1px solid rgba(120, 180, 240, 0.35);
  border-radius: 3px;
  background: rgba(10, 34, 60, 0.7);
  overflow: hidden;
}

.brand-mark i {
  display: block;
  width: 3px;
  background: #42a5ff;
  border-radius: 1px;
}

.brand-mark i:nth-child(3) {
  background: #ff7a1a;
}

.brand-mark b {
  position: absolute;
  left: 4px;
  right: 4px;
  top: 7px;
  height: 2px;
  background: rgba(255, 122, 26, 0.85);
  box-shadow: 0 0 8px rgba(255, 122, 26, 0.8);
  animation: scan 3.2s ease-in-out infinite;
}

@keyframes scan {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  50% {
    transform: translateY(13px);
    opacity: 0.9;
  }
  85% {
    opacity: 0;
  }
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.brand-text strong {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #f3f8ff;
}

.brand-text small {
  margin-top: 3px;
  font-size: 11.5px;
  letter-spacing: 0.1em;
  color: #a7bdd4;
}

.header-nav {
  gap: 4px;
  margin-left: auto;
}

.nav-link {
  position: relative;
  padding: 9px 13px;
  font-size: 13.5px;
  color: #b4c8de;
  text-decoration: none;
  border-radius: 3px;
  transition: color 0.18s ease, background 0.18s ease;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.nav-link.active {
  color: #fff;
  background: rgba(47, 155, 255, 0.14);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 13px;
  right: 13px;
  bottom: 4px;
  height: 1px;
  background: #42a5ff;
}

.header-right {
  gap: 10px;
}

.search-trigger {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 36px;
  padding: 0 10px 0 12px;
  color: #b4c8de;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(146, 186, 228, 0.24);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.search-trigger:hover {
  border-color: rgba(66, 165, 255, 0.6);
  background: rgba(47, 155, 255, 0.1);
}

.search-trigger span {
  font-size: 13.5px;
}

.search-trigger kbd {
  padding: 2px 6px;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 11px;
  color: #a7bdd4;
  border: 1px solid rgba(146, 186, 228, 0.3);
  border-radius: 3px;
}

.header-icon-link {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: #9ab4d0;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: color 0.18s ease, border-color 0.18s ease;
}

.header-icon-link:hover {
  color: #fff;
  border-color: rgba(146, 186, 228, 0.3);
}

.sample-pill {
  padding: 4px 9px;
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: #ffc9a3;
  background: rgba(255, 122, 26, 0.12);
  border: 1px solid rgba(255, 122, 26, 0.4);
  border-radius: 2px;
}

.site-header :focus-visible {
  outline-color: #7cc4ff;
}

@media (max-width: 1200px) {
  .site-header {
    padding: 0 14px;
    gap: 12px;
  }
  .menu-btn {
    display: grid;
    place-items: center;
  }
  .header-nav,
  .header-icon-link,
  .sample-pill,
  .search-trigger span,
  .search-trigger kbd {
    display: none;
  }
  .search-trigger {
    width: 36px;
    height: 36px;
    padding: 0;
    justify-content: center;
  }
  .brand-text small {
    letter-spacing: 0.08em;
  }
}
</style>
