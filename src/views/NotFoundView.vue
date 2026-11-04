<script setup>
import Icon from '../components/Icon.vue'

function openSearch() {
  window.dispatchEvent(new CustomEvent('kb:search'))
}
</script>

<template>
  <div class="not-found page-wrap">
    <div class="nf-mark">
      <Icon name="search" :size="30" />
      <span>404</span>
    </div>
    <span class="eyebrow orange">SIGNAL LOST</span>
    <h1>页面不存在</h1>
    <p>这个地址可能已经变更，或者文档还没有发布。可以回到知识库首页重新查找。</p>
    <div class="nf-actions">
      <RouterLink to="/" class="btn btn-primary">
        <Icon name="grid" :size="13" /> 返回知识库
      </RouterLink>
      <button type="button" class="btn btn-ghost" @click="openSearch">
        <Icon name="search" :size="13" /> 搜索文档
      </button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 100px;
  padding-bottom: 120px;
}

.nf-mark {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
  color: #7b93aa;
}

.nf-mark span {
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #d5e1ee;
}

.not-found h1 {
  margin: 9px 0 8px;
  font-size: 30px;
  color: #122238;
}

.not-found p {
  max-width: 440px;
  margin-bottom: 24px;
  font-size: 12px;
  line-height: 1.8;
  color: #6f849a;
}

.nf-actions {
  display: flex;
  gap: 9px;
}
</style>
