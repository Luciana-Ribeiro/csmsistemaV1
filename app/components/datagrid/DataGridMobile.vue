<template>
  <div class="divide-y divide-gray-200">
    <div
      v-for="(row, idx) in rows"
      :key="idx"
      class="px-4 py-3 bg-white"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="font-semibold text-gray-900 truncate">{{ displayPrimary(row) }}</p>
          <p v-if="displaySecondary(row)" class="mt-0.5 text-sm text-gray-600 line-clamp-2">{{ displaySecondary(row) }}</p>
        </div>

        <div v-if="actionColumn" class="flex flex-shrink-0 items-center gap-2">
          <component
            v-if="hasCustomCell(actionColumn)"
            :is="renderCell(actionColumn, row)"
          />
        </div>
      </div>

      <dl v-if="metaColumns.length" class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600">
        <div
          v-for="meta in metaColumns"
          :key="meta.id"
          class="space-y-0.5"
        >
          <dt class="font-medium text-gray-500">{{ meta.mobileLabel || meta.header }}</dt>
          <dd class="text-gray-900">
            <component
              v-if="hasCustomCell(meta)"
              :is="renderCell(meta, row)"
            />
            <span v-else>{{ formatValue(meta, row) }}</span>
          </dd>
        </div>
      </dl>
    </div>
    <div v-if="!rows?.length" class="px-4 py-10 text-center text-gray-500">Sem resultados</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ColumnDef } from './types'

interface Props {
  columns: ColumnDef[]
  rows: any[]
}

const props = defineProps<Props>()

const orderedColumns = computed(() =>
  [...props.columns].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
)

const mobileColumns = computed(() =>
  orderedColumns.value.filter(col => !col.visibleOn || col.visibleOn.includes('mobile'))
)

const primaryColumn = computed(() =>
  mobileColumns.value.find(col => col.mobileRole === 'primary') || mobileColumns.value[0]
)

const secondaryColumn = computed(() =>
  mobileColumns.value.find(col => col.mobileRole === 'secondary' && col !== primaryColumn.value) ||
  mobileColumns.value.find(col => col !== primaryColumn.value)
)

const actionColumn = computed(() =>
  mobileColumns.value.find(col => col.mobileRole === 'actions')
)

const metaColumns = computed(() =>
  mobileColumns.value.filter(col =>
    col &&
    col !== primaryColumn.value &&
    col !== secondaryColumn.value &&
    col.mobileRole !== 'actions'
  )
)

function get(col: ColumnDef | undefined, row: any) {
  if (!col) return ''
  if (col.accessor) return col.accessor(row)
  if (col.field) return (row as any)[col.field]
  return ''
}

function displayPrimary(row: any) {
  return primaryColumn.value ? formatValue(primaryColumn.value, row) : ''
}

function displaySecondary(row: any) {
  return secondaryColumn.value ? formatValue(secondaryColumn.value, row) : ''
}

function formatValue(col: ColumnDef, row: any) {
  const value = get(col, row)
  if (value === undefined || value === null) return ''
  return String(value)
}

function hasCustomCell(col: ColumnDef | undefined): col is ColumnDef {
  return Boolean(col && col.cell)
}

function renderCell(col: ColumnDef, row: any) {
  const value = get(col, row)
  return { render: () => col.cell!(value, row) }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
