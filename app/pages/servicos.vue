<template>
  <div class="servicos-page">
    <MainContainer offsetHeader scrollMode="local">
      <template #header>
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Serviços</h2>
            <p class="text-sm text-gray-600 mt-1">Gerenciamento de tipos de serviços</p>
          </div>
          <div class="w-full md:w-auto">
            <BaseButton :icon-left="PlusIcon" class="w-full md:w-auto justify-center text-sm md:text-base py-2.5">
              <span class="md:hidden">+ Serviço</span>
              <span class="hidden md:inline">Cadastrar Serviço</span>
            </BaseButton>
          </div>
        </div>
      </template>

      <template #filters>
        <div class="space-y-3">
          <div class="md:hidden">
            <BaseButton
              variant="outline"
              size="sm"
              class="w-full justify-between items-center"
              @click="toggleMobileFilters"
            >
              <span>Filtros</span>
              <ChevronDownIcon
                :class="['w-4 h-4 transition-transform', showMobileFilters ? 'rotate-180' : '']"
              />
            </BaseButton>
          </div>

          <div
            v-if="!isMobile || showMobileFilters"
            class="rounded-lg border border-gray-200 shadow-sm p-4"
            style="background-color: #F7F9FC;"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <FunnelIcon class="w-4 h-4" style="color: #07239A;" />
                  <h3 class="text-base font-semibold text-gray-900">Filtros</h3>
                </div>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  :icon-left="XMarkIcon"
                  @click="clearFilters"
                >
                  Limpar
                </BaseButton>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-3 md:items-end">
                <div class="border border-gray-200 rounded-md p-3 md:col-span-5">
                  <BaseInput
                    type="search"
                    label="Buscar"
                    placeholder="Nome do serviço, código, descrição..."
                    :icon-left="MagnifyingGlassIcon"
                    v-model="searchTerm"
                    size="sm"
                  />
                </div>

                <div class="border border-gray-200 rounded-md p-3 md:col-span-3">
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Categoria</label>
                  <MenuDropdownGeral
                    :icon-left="TagIcon"
                    :label="selectedCategory || 'Todas as categ...'"
                    width="trigger"
                    size="sm"
                    class="w-full"
                  >
                    <button
                      v-for="category in categoryOptions"
                      :key="category.value"
                      class="block px-3 py-1.5 text-sm hover:bg-gray-100 w-full text-left"
                      :class="selectedCategory === category.label ? 'bg-primary-50 text-primary-700' : 'text-gray-700'"
                      @click="selectedCategory = category.value === 'all' ? null : category.label"
                    >
                      {{ category.label }}
                    </button>
                  </MenuDropdownGeral>
                </div>

                <div class="border border-gray-200 rounded-md p-3 md:col-span-4">
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">Operação</label>
                  <MenuDropdownGeral
                    :icon-left="CogIcon"
                    :label="selectedOperation || 'Todas as opera...'"
                    width="trigger"
                    size="sm"
                    class="w-full"
                  >
                    <button
                      v-for="operation in operationOptions"
                      :key="operation.value"
                      class="flex items-center px-3 py-1.5 text-sm hover:bg-gray-100 w-full text-left gap-2"
                      :class="selectedOperation === operation.label ? 'bg-primary-50 text-primary-700' : 'text-gray-700'"
                      @click="selectedOperation = operation.value === 'all' ? null : operation.label"
                    >
                      <div class="w-2 h-2 rounded-full" :class="operation.colorClass"></div>
                      {{ operation.label }}
                    </button>
                  </MenuDropdownGeral>
                </div>
              </div>

              <div v-if="hasActiveFilters" class="flex flex-wrap gap-1.5">
                <span v-if="selectedCategory" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                  {{ selectedCategory }}
                  <button @click="selectedCategory = null" class="ml-1 text-blue-600 hover:text-blue-800">
                    <XMarkIcon class="w-3 h-3" />
                  </button>
                </span>

                <span v-if="selectedOperation" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
                  {{ selectedOperation }}
                  <button @click="selectedOperation = null" class="ml-1 text-green-600 hover:text-green-800">
                    <XMarkIcon class="w-3 h-3" />
                  </button>
                </span>
              </div>

              <BaseButton
                v-if="isMobile"
                variant="primary"
                size="sm"
                class="w-full justify-center"
                @click="showMobileFilters = false"
              >
                Aplicar filtros
              </BaseButton>
            </div>
          </div>
        </div>
      </template>

      <!-- Área de conteúdo principal com DataGrid -->
      <div class="flex flex-col flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <h3 class="text-lg font-semibold text-gray-900">Serviços Cadastrados</h3>
        </div>
        <div class="flex-1 min-h-0 flex flex-col">
          <ResponsiveDataGrid
            :columns="columns"
            :rows="paginatedRows"
            :sort="sort"
            @update:sort="handleSort"
          />
        </div>
        <DataGridPagination
          v-if="!isMobile"
          :page="page"
          :page-size="pageSize"
          :total="total"
          @update:page="page = $event"
          @update:page-size="pageSize = $event; page = 1"
        />
      </div>
    </MainContainer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, onUnmounted } from 'vue'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  TagIcon,
  CogIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import ResponsiveDataGrid from '@/components/datagrid/ResponsiveDataGrid.vue'
import DataGridPagination from '@/components/datagrid/DataGridPagination.vue'
import type { ColumnDef, SortState } from '@/components/datagrid/types'

// Estado reativo
const searchTerm = ref('')
const selectedCategory = ref<string | null>(null)
const selectedOperation = ref<string | null>(null)
const loading = ref(false)
const sort = ref<SortState | null>(null)
const isMobile = ref(false)
const showMobileFilters = ref(true)

// Estados de paginação
// Mantidos para desktop
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// Definição das colunas
const columns: ColumnDef[] = [
  {
    id: 'categoria',
    header: 'Categoria',
    field: 'categoria',
    minWidth: 150,
    sortable: true,
    align: 'left',
    visibleOn: ['desktop', 'mobile'],
    priority: 1,
    mobileRole: 'primary'
  },
  {
    id: 'descricao',
    header: 'Descrição',
    field: 'descricao',
    minWidth: 300,
    sortable: false,
    align: 'left',
    visibleOn: ['desktop', 'mobile'],
    priority: 2,
    mobileRole: 'secondary'
  },
  {
    id: 'operacao',
    header: 'Operação',
    field: 'operacao',
    minWidth: 120,
    sortable: true,
    align: 'left',
    visibleOn: ['desktop', 'mobile'],
    priority: 3,
    mobileRole: 'meta',
    mobileLabel: 'Operação'
  },
  {
    id: 'us',
    header: 'US',
    field: 'us',
    minWidth: 80,
    sortable: true,
    align: 'left',
    visibleOn: ['desktop', 'mobile'],
    priority: 4,
    mobileRole: 'meta',
    mobileLabel: 'US'
  },
  {
    id: 'acoes',
    header: 'Ações',
    minWidth: 100,
    sortable: false,
    align: 'left',
    visibleOn: ['desktop', 'mobile'],
    priority: 5,
    mobileRole: 'actions',
    cell: (value, row) => {
      return h('div', { class: 'flex items-center justify-start gap-2' }, [
        h('button', {
          class: 'p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors',
          title: 'Editar',
          onClick: () => handleEdit(row)
        }, [
          h('svg', {
            class: 'w-4 h-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          }, [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '2',
              d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
            })
          ])
        ]),
        h('button', {
          class: 'p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors',
          title: 'Excluir',
          onClick: () => handleDelete(row)
        }, [
          h('svg', {
            class: 'w-4 h-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          }, [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '2',
              'd': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            })
          ])
        ])
      ])
    }
  }
]

// Opções dos filtros
const categoryOptions = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'instalacao', label: 'Instalação' },
  { value: 'reparo', label: 'Reparo' },
  { value: 'preventiva', label: 'Preventiva' },
  { value: 'emergencia', label: 'Emergência' }
]

const operationOptions = [
  { value: 'all', label: 'Todas as operações', colorClass: 'bg-gray-300' },
  { value: 'ativa', label: 'Ativa', colorClass: 'bg-green-500' },
  { value: 'pendente', label: 'Pendente', colorClass: 'bg-yellow-500' },
  { value: 'suspensa', label: 'Suspensa', colorClass: 'bg-red-500' },
  { value: 'concluida', label: 'Concluída', colorClass: 'bg-blue-500' }
]

// Dados de exemplo
const mockRows = [
  {
    id: 1,
    codigo: 'SRV-001',
    nome: 'Manutenção Preventiva de Transformador',
    categoria: 'Manutenção',
    descricao: 'Inspeção e manutenção preventiva em transformadores de distribuição',
    prioridade: 'Alta',
    tempo_estimado: '4h',
    operacao: 'Ativa',
    us: '001'
  },
  {
    id: 2,
    codigo: 'SRV-002',
    nome: 'Instalação de Medidor',
    categoria: 'Instalação',
    descricao: 'Instalação de medidor residencial ou comercial',
    prioridade: 'Média',
    tempo_estimado: '2h',
    operacao: 'Ativa',
    us: '002'
  },
  {
    id: 3,
    codigo: 'SRV-003',
    nome: 'Reparo de Cabo Subterrâneo',
    categoria: 'Reparo',
    descricao: 'Reparo em cabos subterrâneos de baixa e média tensão',
    prioridade: 'Crítica',
    tempo_estimado: '8h',
    operacao: 'Pendente',
    us: '003'
  },
  {
    id: 4,
    codigo: 'SRV-004',
    nome: 'Troca de Poste',
    categoria: 'Instalação',
    descricao: 'Substituição de poste danificado ou inadequado',
    prioridade: 'Alta',
    tempo_estimado: '6h',
    operacao: 'Ativa',
    us: '004'
  },
  {
    id: 5,
    codigo: 'SRV-005',
    nome: 'Poda de Árvore',
    categoria: 'Preventiva',
    descricao: 'Poda de árvores que interferem na rede elétrica',
    prioridade: 'Baixa',
    tempo_estimado: '2h',
    operacao: 'Concluída',
    us: '005'
  },
  {
    id: 6,
    codigo: 'SRV-006',
    nome: 'Ligação Nova',
    categoria: 'Instalação',
    descricao: 'Nova ligação residencial ou comercial',
    prioridade: 'Média',
    tempo_estimado: '2h',
    operacao: 'Ativa',
    us: '006'
  },
  {
    id: 7,
    codigo: 'SRV-007',
    nome: 'Religação por Corte',
    categoria: 'Reparo',
    descricao: 'Religação após suspensão por inadimplência',
    prioridade: 'Baixa',
    tempo_estimado: '1h',
    operacao: 'Concluída',
    us: '007'
  },
  {
    id: 8,
    codigo: 'SRV-008',
    nome: 'Inspeção Termográfica',
    categoria: 'Preventiva',
    descricao: 'Inspeção termográfica em equipamentos elétricos',
    prioridade: 'Média',
    tempo_estimado: '4h',
    operacao: 'Suspensa',
    us: '008'
  },
  {
    id: 9,
    codigo: 'SRV-009',
    nome: 'Manutenção de Religador',
    categoria: 'Manutenção',
    descricao: 'Manutenção preventiva em religadores automáticos',
    prioridade: 'Alta',
    tempo_estimado: '6h',
    operacao: 'Pendente',
    us: '009'
  },
  {
    id: 10,
    codigo: 'SRV-010',
    nome: 'Calibração de Proteção',
    categoria: 'Manutenção',
    descricao: 'Calibração de sistemas de proteção',
    prioridade: 'Crítica',
    tempo_estimado: '8h',
    operacao: 'Ativa',
    us: '010'
  },
  {
    id: 11,
    codigo: 'SRV-011',
    nome: 'Substituição de Transformador',
    categoria: 'Instalação',
    descricao: 'Substituição de transformador de distribuição defeituoso',
    prioridade: 'Crítica',
    tempo_estimado: '12h',
    operacao: 'Pendente',
    us: '011'
  },
  {
    id: 12,
    codigo: 'SRV-012',
    nome: 'Limpeza de Isoladores',
    categoria: 'Preventiva',
    descricao: 'Limpeza de isoladores em linhas de alta tensão',
    prioridade: 'Média',
    tempo_estimado: '3h',
    operacao: 'Ativa',
    us: '012'
  },
  {
    id: 13,
    codigo: 'SRV-013',
    nome: 'Reparo de Chave Fusível',
    categoria: 'Reparo',
    descricao: 'Reparo em chave fusível com defeito',
    prioridade: 'Alta',
    tempo_estimado: '2h',
    operacao: 'Concluída',
    us: '013'
  },
  {
    id: 14,
    codigo: 'SRV-014',
    nome: 'Instalação de Para-raios',
    categoria: 'Instalação',
    descricao: 'Instalação de para-raios em subestação',
    prioridade: 'Alta',
    tempo_estimado: '4h',
    operacao: 'Ativa',
    us: '014'
  },
  {
    id: 15,
    codigo: 'SRV-015',
    nome: 'Teste de Relé de Proteção',
    categoria: 'Manutenção',
    descricao: 'Teste e calibração de relés de proteção',
    prioridade: 'Crítica',
    tempo_estimado: '6h',
    operacao: 'Suspensa',
    us: '015'
  },
  {
    id: 16,
    codigo: 'SRV-016',
    nome: 'Corte de Ligação Clandestina',
    categoria: 'Emergência',
    descricao: 'Corte de ligação irregular detectada',
    prioridade: 'Crítica',
    tempo_estimado: '1h',
    operacao: 'Pendente',
    us: '016'
  },
  {
    id: 17,
    codigo: 'SRV-017',
    nome: 'Manutenção de Seccionalizador',
    categoria: 'Manutenção',
    descricao: 'Manutenção preventiva em seccionalizador automático',
    prioridade: 'Média',
    tempo_estimado: '4h',
    operacao: 'Ativa',
    us: '017'
  },
  {
    id: 18,
    codigo: 'SRV-018',
    nome: 'Instalação de Banco de Capacitores',
    categoria: 'Instalação',
    descricao: 'Instalação de banco de capacitores para correção de fator de potência',
    prioridade: 'Média',
    tempo_estimado: '8h',
    operacao: 'Concluída',
    us: '018'
  },
  {
    id: 19,
    codigo: 'SRV-019',
    nome: 'Reparo de Condutor',
    categoria: 'Reparo',
    descricao: 'Reparo em condutor de linha de distribuição',
    prioridade: 'Alta',
    tempo_estimado: '3h',
    operacao: 'Ativa',
    us: '019'
  },
  {
    id: 20,
    codigo: 'SRV-020',
    nome: 'Inspeção de Subestação',
    categoria: 'Preventiva',
    descricao: 'Inspeção geral em subestação de distribuição',
    prioridade: 'Baixa',
    tempo_estimado: '6h',
    operacao: 'Pendente',
    us: '020'
  },
  {
    id: 21,
    codigo: 'SRV-021',
    nome: 'Troca de Medidor Eletrônico',
    categoria: 'Instalação',
    descricao: 'Substituição de medidor analógico por eletrônico',
    prioridade: 'Baixa',
    tempo_estimado: '1h',
    operacao: 'Ativa',
    us: '021'
  },
  {
    id: 22,
    codigo: 'SRV-022',
    nome: 'Reparo de Poste Danificado',
    categoria: 'Reparo',
    descricao: 'Reparo estrutural em poste com avarias',
    prioridade: 'Crítica',
    tempo_estimado: '5h',
    operacao: 'Suspensa',
    us: '022'
  },
  {
    id: 23,
    codigo: 'SRV-023',
    nome: 'Calibração de Medidores',
    categoria: 'Manutenção',
    descricao: 'Calibração de medidores em laboratório',
    prioridade: 'Média',
    tempo_estimado: '4h',
    operacao: 'Concluída',
    us: '023'
  },
  {
    id: 24,
    codigo: 'SRV-024',
    nome: 'Instalação de Aterramento',
    categoria: 'Instalação',
    descricao: 'Instalação de sistema de aterramento',
    prioridade: 'Alta',
    tempo_estimado: '3h',
    operacao: 'Ativa',
    us: '024'
  },
  {
    id: 25,
    codigo: 'SRV-025',
    nome: 'Manutenção de Regulador',
    categoria: 'Manutenção',
    descricao: 'Manutenção preventiva em regulador de tensão',
    prioridade: 'Média',
    tempo_estimado: '5h',
    operacao: 'Pendente',
    us: '025'
  },
  {
    id: 26,
    codigo: 'SRV-026',
    nome: 'Corte por Inadimplência',
    categoria: 'Emergência',
    descricao: 'Suspensão de fornecimento por falta de pagamento',
    prioridade: 'Baixa',
    tempo_estimado: '0.5h',
    operacao: 'Ativa',
    us: '026'
  },
  {
    id: 27,
    codigo: 'SRV-027',
    nome: 'Teste de Óleo Isolante',
    categoria: 'Preventiva',
    descricao: 'Análise físico-química do óleo isolante de transformadores',
    prioridade: 'Média',
    tempo_estimado: '2h',
    operacao: 'Concluída',
    us: '027'
  },
  {
    id: 28,
    codigo: 'SRV-028',
    nome: 'Reparo de Cabo Aéreo',
    categoria: 'Reparo',
    descricao: 'Reparo em cabo condutor de linha aérea',
    prioridade: 'Alta',
    tempo_estimado: '4h',
    operacao: 'Suspensa',
    us: '028'
  },
  {
    id: 29,
    codigo: 'SRV-029',
    nome: 'Instalação de Chave Seccionadora',
    categoria: 'Instalação',
    descricao: 'Instalação de chave seccionadora em linha de distribuição',
    prioridade: 'Média',
    tempo_estimado: '3h',
    operacao: 'Pendente',
    us: '029'
  },
  {
    id: 30,
    codigo: 'SRV-030',
    nome: 'Manutenção de Banco de Baterias',
    categoria: 'Manutenção',
    descricao: 'Manutenção preventiva em banco de baterias de subestação',
    prioridade: 'Alta',
    tempo_estimado: '6h',
    operacao: 'Ativa',
    us: '030'
  }
]

// Computeds
const filteredRows = computed(() => {
  let filtered = [...mockRows]
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(row => 
      row.nome.toLowerCase().includes(term) ||
      row.codigo.toLowerCase().includes(term) ||
      row.categoria.toLowerCase().includes(term) ||
      row.descricao.toLowerCase().includes(term)
    )
  }
  
  if (selectedCategory.value) {
    filtered = filtered.filter(row => row.categoria === selectedCategory.value)
  }
  
  if (selectedOperation.value) {
    filtered = filtered.filter(row => row.operacao === selectedOperation.value)
  }
  
  // Atualizar total
  total.value = filtered.length
  
  return filtered
})

const paginatedRows = computed(() => {
  if (isMobile.value) return filteredRows.value

  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRows.value.slice(start, end)
})

const hasActiveFilters = computed(() => {
  return !!(selectedCategory.value || selectedOperation.value)
})

// Métodos
const updateViewport = () => {
  const mobile = window.innerWidth < 768
  if (mobile !== isMobile.value) {
    showMobileFilters.value = !mobile
  }
  isMobile.value = mobile
}

const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value
}

const handleSort = (sortState: SortState | null) => {
  sort.value = sortState
  console.log('🔄 Ordenação aplicada:', sortState)
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = null
  selectedOperation.value = null
  page.value = 1
  if (isMobile.value) {
    showMobileFilters.value = false
  }
}

// Ações da tabela
const handleEdit = (row: any) => {
  console.log('✏️ Editando serviço:', row)
  // Aqui você pode implementar a lógica de edição
}

const handleDelete = (row: any) => {
  console.log('🗑️ Excluindo serviço:', row)
  // Aqui você pode implementar a lógica de exclusão
}

// Meta dados da página
useSeoMeta({
  title: 'Serviços | CSM Sistema',
  description: 'Gerenciamento de tipos de serviços'
})

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport)
})
</script>

<style scoped>
.servicos-page {
  @apply bg-gray-50;
}
</style>
