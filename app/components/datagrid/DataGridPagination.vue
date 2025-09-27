<template>
  <div class="pagination-wrapper px-4 md:px-6 py-2 flex items-center justify-between border-t border-gray-200 bg-white">
    <div class="text-sm text-gray-600">Página {{ page }} de {{ totalPages }} — {{ total }} itens</div>
    <div class="flex items-center gap-2">
      <select
        class="border rounded-md px-2 py-1 text-sm"
        :value="pageSize"
        @change="$emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="s in pageSizeOptions" :key="s" :value="s">{{ s }}/página</option>
      </select>
      <button class="px-2 py-1 border rounded-md" :disabled="page<=1" @click="$emit('update:page', page-1)">Anterior</button>
      <button class="px-2 py-1 border rounded-md" :disabled="page>=totalPages" @click="$emit('update:page', page+1)">Próxima</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [10, 20, 30, 50, 100]
})

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

defineEmits(['update:page', 'update:pageSize'])
</script>

<style scoped>
.pagination-wrapper {
  background-color: white;
  border-top: 1px solid #e5e7eb;
}
</style>
