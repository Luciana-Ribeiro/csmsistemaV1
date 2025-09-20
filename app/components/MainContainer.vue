<template>
  <section
    class="main-container flex flex-col overflow-hidden px-4 md:px-6"
    :style="containerStyle"
  >
    <div
      v-if="$slots.header || $slots.filters || $slots.actions"
      class="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200"
    >
      <div v-if="$slots.header" class="py-3">
        <slot name="header" />
      </div>
      <div v-if="$slots.filters" class="pb-3">
        <slot name="filters" />
      </div>
      <div v-if="$slots.actions" class="pb-3">
        <slot name="actions" />
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /**
   * Se true, o container aplica margin-top igual à altura do header.
   * Mantenha false quando o layout já compensar o header (caso atual).
   */
  offsetHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  offsetHeader: false
})

// Usa a variável CSS --header-height vinda do layout (fallback 73px)
const containerStyle = computed(() => ({
  marginTop: props.offsetHeader ? 'var(--header-height, 73px)' : '0px',
  height: 'calc(100dvh - var(--header-height, 73px))'
}))
</script>

<style scoped>
.main-container {
  box-sizing: border-box;
}

.overscroll-contain {
  overscroll-behavior: contain;
}
</style>
