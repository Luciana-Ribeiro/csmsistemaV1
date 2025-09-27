<template>
  <div class="w-full h-full flex flex-col">
    <DataGridDesktop
      v-if="isDesktop"
      :columns="columns"
      :rows="rows"
      :sort="sort"
      @update:sort="$emit('update:sort', $event)"
    />
    <DataGridMobile
      v-else
      :columns="columns"
      :rows="rows"
      @row-click="$emit('row-click', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ColumnDef, SortState } from './types'
import DataGridDesktop from './DataGridDesktop.vue'
import DataGridMobile from './DataGridMobile.vue'

interface Props {
  columns: ColumnDef[]
  rows: any[]
  sort?: SortState | null
  breakpoint?: number // px para alternar
}

const props = withDefaults(defineProps<Props>(), { breakpoint: 768 })
defineEmits(['update:sort', 'row-click'])

const isDesktop = ref(false)

function handleResize() {
  isDesktop.value = window.innerWidth >= props.breakpoint
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<style scoped>
</style>

