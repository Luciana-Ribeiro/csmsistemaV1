<template>
  <div
    :class="[
      'filters-bar px-4 md:px-6',
      sticky ? 'sticky z-10 bg-white/90 backdrop-blur border-b border-gray-200' : 'bg-transparent'
    ]"
    :style="sticky ? { top: 'var(--header-height, 73px)', ['--filters-height']: filtersHeight } : undefined"
  >
    <div class="py-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props { sticky?: boolean; height?: number }
const props = withDefaults(defineProps<Props>(), { sticky: true, height: 40 })
const filtersHeight = `${props.height}px`
</script>

<style scoped>
</style>
