<script setup>
import Icon from './Icon.vue'

defineProps({
  items: { type: Array, default: () => [] }
})
</script>

<template>
  <nav class="breadcrumbs" aria-label="面包屑">
    <RouterLink to="/" class="crumb home">
      <Icon name="grid" :size="13" />
      <span>知识库</span>
    </RouterLink>
    <template v-for="(item, index) in items" :key="`${item.label}-${index}`">
      <span class="crumb-sep"><Icon name="chevron" :size="12" /></span>
      <RouterLink v-if="item.to && index !== items.length - 1" :to="item.to" class="crumb">
        {{ item.label }}
      </RouterLink>
      <span v-else class="crumb current" aria-current="page">{{ item.label }}</span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: var(--muted);
}

.crumb {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--muted-2);
  text-decoration: none;
}

.crumb:hover {
  color: #0c63bd;
}

.crumb.home {
  font-size: 12.5px;
}

.crumb.current {
  color: #344d68;
  font-weight: 600;
}

.crumb-sep {
  display: inline-flex;
  color: #b3c1d0;
  transform: rotate(-90deg);
}
</style>
