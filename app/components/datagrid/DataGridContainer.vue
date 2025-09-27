<template>
  <section
    class="datagrid-container flex flex-col flex-1 min-h-0 overscroll-contain"
    :class="{ 'overflow-x-auto': scrollX }"
    :style="containerStyle"
  >
    <div v-if="$slots.toolbar" class="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
      <slot name="toolbar" />
    </div>

    <div class="dg-slot flex-1 min-h-0">
      <slot />
    </div>
  </section>
  
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  scrollX?: boolean
  maxHeight?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  scrollX: true,
  maxHeight: undefined
})

const containerStyle = computed(() => {
  if (!props.maxHeight) return undefined
  const value = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  return { maxHeight: value }
})
</script>

<style scoped>
.datagrid-container {
  scrollbar-gutter: stable;
  position: relative;
}

.dg-slot {
  display: flex;
  flex-direction: column;
}

.dg-slot > * {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
