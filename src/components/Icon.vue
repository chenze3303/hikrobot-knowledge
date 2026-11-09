<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 }
})

const icons = {
  layers: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
  factory:
    '<path d="M3 21V10l5 3V8l5 3V5l5 3v13"/><path d="M3 21h18"/><path d="M7 21v-4h3v4"/><path d="M14 21v-4h3v4"/>',
  target:
    '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  sliders:
    '<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h10M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
  network:
    '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 8v5M5 16v-3h14v3"/>',
  alert:
    '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5"/><circle cx="12" cy="17.5" r="0.6"/>',
  shield:
    '<path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z"/><path d="m8.5 12 2.4 2.4L15.5 10"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  arrowRight: '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H4"/><path d="m10 6-6 6 6 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  tag: '<path d="M20 12.5 12.5 20 4 11.5V4h7.5L20 12.5Z"/><circle cx="8" cy="8" r="1"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 20h16"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  spark: '<path d="M12 2v6M12 16v6M2 12h6M16 12h6"/><path d="m5 5 4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/>',
  book: '<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Z"/><path d="M4 17h14"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M9 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  github: '<path d="M9 19c-4 1.3-4-2.2-5.5-2.7M15 21v-3.4c0-1 .1-1.4-.5-2 3.2-.4 6.5-1.6 6.5-7.1a5.6 5.6 0 0 0-1.5-3.9 5.2 5.2 0 0 0-.1-3.9s-1.3-.4-4.3 1.6a14.8 14.8 0 0 0-7.2 0C4.9 1.3 3.6 1.7 3.6 1.7a5.2 5.2 0 0 0-.1 3.9A5.6 5.6 0 0 0 2 9.5c0 5.5 3.3 6.7 6.5 7.1-.6.6-.6 1.2-.5 2V21"/>',
  code: '<path d="m9 8-5 4 5 4M15 8l5 4-5 4"/>',
  quote:
    '<path d="M6 11H4.5A2.5 2.5 0 0 1 2 8.5v-2A2.5 2.5 0 0 1 4.5 4H7a1 1 0 0 1 1 1v6c0 3-1.5 4.5-4 5"/><path d="M17 11h-1.5A2.5 2.5 0 0 1 13 8.5v-2A2.5 2.5 0 0 1 15.5 4H18a1 1 0 0 1 1 1v6c0 3-1.5 4.5-4 5"/>',
  printer:
    '<path d="M7 8V3h10v5"/><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M7 13h10v8H7z"/>',
  wrench:
    '<path d="M14.5 6.5a4.5 4.5 0 0 0-6 6L3 18l3 3 5.5-5.5a4.5 4.5 0 0 0 6-6l-3 3-2.5-2.5 3-3Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.5" r="0.6"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>'
}

const inner = computed(() => icons[props.name] || icons.book)
</script>

<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="inner"
  />
</template>

<style scoped>
.icon {
  display: inline-block;
  flex: none;
  vertical-align: -0.15em;
}
</style>
