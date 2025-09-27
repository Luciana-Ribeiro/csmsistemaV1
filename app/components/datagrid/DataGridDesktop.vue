<template>
  <div class="dg-wrapper flex flex-col h-full">
    <!-- Cabeçalho fixo -->
    <div class="dg-header flex-shrink-0" :style="{ paddingRight: headerPadding }" ref="headerRef">
      <table class="w-full table-fixed border-separate border-spacing-0">
        <colgroup>
          <col
            v-for="col in desktopColumns"
            :key="`head-${col.id}`"
            :style="columnStyles[col.id]"
          />
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
          <col
            v-for="col in desktopColumns"
            :key="`body-${col.id}`"
            :style="columnStyles[col.id]"
          />
        </colgroup>
        <tbody>
          <tr
            v-for="(row, rIdx) in displayedRows"
            :key="rIdx"
            class="odd:bg-white even:bg-gray-100/70 border-b border-gray-100 hover:bg-primary-50 transition-colors duration-150"
          >
            <td
              v-for="col in desktopColumns"
              :key="col.id"
              class="px-3 py-3 align-top text-sm text-gray-900"
              :style="[ cellStyles[col.id], { textAlign: col.align || 'left' } ]"
            >
              <component v-if="col.cell" :is="{ render: () => col.cell!(getValue(col, row), row) }" />
              <template v-else>{{ getValue(col, row) }}</template>
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

const collator = new Intl.Collator('pt-BR', { numeric: true, sensitivity: 'base' })

const parseBrazilianDate = (value: unknown): number | null => {
  if (typeof value !== 'string') return null
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

const parseBrazilianNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return null
  const normalized = value
    .replace(/[^0-9,-\.]/g, '')
    .replace(/\.(?=[0-9]{3}(\D|$))/g, '')
    .replace(',', '.')
  if (!normalized || Number.isNaN(Number(normalized))) return null
  return Number(normalized)
}

const compareValues = (a: unknown, b: unknown): number => {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1

  const dateA = parseBrazilianDate(a)
  const dateB = parseBrazilianDate(b)
  if (dateA !== null && dateB !== null) return dateA - dateB

  const numA = parseBrazilianNumber(a)
  const numB = parseBrazilianNumber(b)
  if (numA !== null && numB !== null) return numA - numB

  return collator.compare(String(a), String(b))
}

const displayedRows = computed(() => {
  const sortState = props.sort
  if (!sortState) return props.rows

  const column = desktopColumns.value.find(col => col.id === sortState.id)
  if (!column) return props.rows

  const accessor = column.accessor ?? ((row: any) => (column.field ? (row as any)[column.field] : undefined))
  const sorted = [...props.rows]

  sorted.sort((a, b) => {
    const result = compareValues(accessor(a), accessor(b))
    return sortState.desc ? -result : result
  })

  return sorted
})

const updateHeaderPadding = () => {
  const body = bodyRef.value
  if (!body) return
  const scrollbarWidth = body.offsetWidth - body.clientWidth
  headerPadding.value = `${Math.max(scrollbarWidth, 0)}px`
}

const scheduleUpdate = () => nextTick(updateHeaderPadding)

onMounted(() => {
  updateHeaderPadding()
  window.addEventListener('resize', scheduleUpdate)
})

onUnmounted(() => {
  window.removeEventListener('resize', scheduleUpdate)
})

watch(() => props.rows.length, scheduleUpdate)
watch(() => props.columns.length, scheduleUpdate)

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
</script>

<style scoped>
.dg-wrapper {
  height: 100%;
  max-height: 60vh;
  min-height: 400px;
  overflow: hidden;
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
  scrollbar-gutter: stable;
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
