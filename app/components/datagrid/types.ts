export type DeviceVisibility = 'desktop' | 'mobile'

export interface ColumnDef<T = any> {
  id: string
  header: string
  accessor?: (row: T) => any
  field?: keyof T & string
  align?: 'left' | 'center' | 'right'
  minWidth?: number
  visibleOn?: DeviceVisibility[]
  priority?: number
  sortable?: boolean
  cell?: (value: any, row: T) => any
  mobileRole?: 'primary' | 'secondary' | 'meta' | 'actions'
  mobileLabel?: string
}

export interface SortState {
  id: string
  desc: boolean
}

export interface PageState {
  page: number
  pageSize: number
}

export interface RowAction<T = any> {
  id: string
  label: string
  icon?: any
  onClick?: (row: T) => void
}

// Novos tipos para suporte a subníveis
export interface ExpandableRow<T = any> {
  id: string | number
  data: T
  children?: ExpandableRow<T>[]
  isExpanded?: boolean
  level?: number
}

export interface ExpandState {
  [key: string | number]: boolean
}

export interface HierarchicalPageState extends PageState {
  totalFlattened?: number // Total de itens quando expandido
}
