<template>
  <div class="dg-wrapper flex flex-col h-full">
    <!-- Cabeçalho fixo -->
    <div class="dg-header flex-shrink-0" :style="{ paddingRight: headerPadding }" ref="headerRef">
      <table class="w-full table-fixed border-separate border-spacing-0">
        <colgroup>
          <col v-for="col in desktopColumns" :key="`head-${col.id}`" :style="columnStyles[col.id]" />
        </colgroup>
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="col in desktopColumns"
              :key="col.id"
              class="text-left text-sm font-semibold text-gray-800 border-b border-gray-200 px-3 py-3"
              :style="[ columnStyles[col.id], { textAlign: col.align || 'left', backgroundColor: '#0F62FE26' } ]"
              :aria-sort="ariaSort(col.id)"
            >
              <button
                class="flex items-center gap-1 select-none group"
                :class="isSortable(col) ? 'cursor-pointer text-gray-800 hover:text-blue-600' : 'cursor-default text-gray-800'"
                :disabled="!isSortable(col)"
                @click="isSortable(col) && emitSort(col.id)"
              >
                <span>{{ col.header }}</span>
                <span v-if="sort?.id === col.id" class="text-blue-600">{{ sort.desc ? '▼' : '▲' }}</span>
                <span v-else-if="isSortable(col)" class="text-gray-500 group-hover:text-blue-600">⇅</span>
              </button>
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- Corpo rolável -->
    <div class="dg-body flex-1 min-h-0 overflow-y-auto" ref="bodyRef">
      <table class="w-full table-fixed border-separate border-spacing-0">
        <colgroup>
          <col v-for="col in desktopColumns" :key="`body-${col.id}`" :style="columnStyles[col.id]" />
        </colgroup>
        <tbody>
          <tr
            v-for="(row, rIdx) in rows"
            :key="rIdx"
            class="odd:bg-white even:bg-gray-100/70 border-b border-gray-100 hover:bg-primary-50 transition-colors duration-150 relative group cursor-pointer"
            @click="handleRowClick(row, rIdx)"
          >
            <td
              v-for="(col, colIdx) in desktopColumns"
              :key="col.id"
              class="px-3 py-3 align-top text-sm text-gray-900 relative"
              :style="[ cellStyles[col.id], { textAlign: col.align || 'left' } ]"
            >
              <component v-if="col.cell" :is="{ render: () => col.cell!(getValue(col, row), row) }" />
              <template v-else>{{ getValue(col, row) }}</template>
              
              <!-- Ícones flutuantes apenas na última coluna -->
              <div v-if="colIdx === desktopColumns.length - 1" class="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div class="flex space-x-2 bg-white shadow-lg rounded-lg p-2 border">
                  <button
                    @click.stop="handleDelete(row, rIdx)"
                    class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    title="Excluir"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    @click.stop="handlePrint(row, rIdx)"
                    class="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    title="Imprimir"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="!rows?.length">
            <td :colspan="desktopColumns.length" class="px-3 py-10 text-center text-gray-500">Sem resultados</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { ColumnDef, SortState } from './types'

interface Props {
  columns: ColumnDef[]
  rows: any[]
  sort?: SortState | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:sort', value: SortState | null): void
  (e: 'row-click', row: any, index: number): void
  (e: 'delete-row', row: any, index: number): void
  (e: 'print-row', row: any, index: number): void
}>()

const desktopColumns = computed(() => props.columns.filter(c => !c.visibleOn || c.visibleOn.includes('desktop')))

const headerRef = ref<HTMLElement>()
const bodyRef = ref<HTMLElement>()
const headerPadding = ref('0px')


const columnStyles = computed<Record<string, CSSProperties>>(() => {
  const styles: Record<string, CSSProperties> = {}
  for (const col of desktopColumns.value) {
    const width = col.minWidth ? `${col.minWidth}px` : undefined
    styles[col.id] = {
      width,
      minWidth: width
    }
  }
  return styles
})

const cellStyles = computed<Record<string, CSSProperties>>(() => {
  const styles: Record<string, CSSProperties> = {}
  for (const col of desktopColumns.value) {
    styles[col.id] = {
      width: columnStyles.value[col.id]?.width,
      minWidth: columnStyles.value[col.id]?.minWidth
    }
  }
  return styles
})

function getValue(col: ColumnDef, row: any) {
  if (col.accessor) return col.accessor(row)
  if (col.field) return (row as any)[col.field]
  return ''
}

function emitSort(id: string) {
  const current = props.sort?.id === id ? props.sort : null
  if (!current) {
    emit('update:sort', { id, desc: false })
  } else if (current && !current.desc) {
    emit('update:sort', { id, desc: true })
  } else {
    emit('update:sort', null)
  }
}

function ariaSort(id: string) {
  if (props.sort?.id !== id) return 'none'
  return props.sort.desc ? 'descending' : 'ascending'
}

function isSortable(col: ColumnDef) {
  if (col.sortable === false) return false
  return !!(col.field || col.accessor)
}

const updatePadding = () => {
  const body = bodyRef.value
  if (!body) return
  headerPadding.value = `${Math.max(body.offsetWidth - body.clientWidth, 0)}px`
}

const scheduleUpdate = () => nextTick(updatePadding)

onMounted(() => {
  updatePadding()
  window.addEventListener('resize', scheduleUpdate)
})

onUnmounted(() => {
  window.removeEventListener('resize', scheduleUpdate)
})

watch(() => props.rows.length, scheduleUpdate)
watch(() => props.columns.length, scheduleUpdate)

function handleRowClick(row: any, index: number) {
  emit('row-click', row, index)
}

function handleDelete(row: any, index: number) {
  emit('delete-row', row, index)
}

function handlePrint(row: any, index: number) {
  emit('print-row', row, index)
}
</script>

<style scoped>
.dg-wrapper {
  height: 100%;
  max-height: 60vh;
  min-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.dg-header {
  flex-shrink: 0;
  padding-right: 0;
  box-sizing: border-box;
}

.dg-body {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 200px;
  max-height: calc(60vh - 60px);
  padding-right: 0;
  scrollbar-gutter: stable;
  position: relative;
}

.dg-header table,
.dg-body table {
  table-layout: fixed;
  width: 100%;
}

.dg-header th,
.dg-body td {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dg-body::-webkit-scrollbar {
  width: 8px;
}

.dg-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dg-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.dg-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
