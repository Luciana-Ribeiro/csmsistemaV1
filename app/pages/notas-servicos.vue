<template>
  <div class="notas-servicos-page">
    <MainContainer offsetHeader scrollMode="local">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Notas de Serviços</h2>
            <p class="text-sm text-gray-600 mt-1">Controle e acompanhamento das NS</p>
          </div>
          <div class="flex items-center">
            <BaseButton :icon-left="PlusIcon" @click="openCadastroModal">
              Cadastrar NS
            </BaseButton>
          </div>
        </div>
      </template>

      <template #filters>
        <!-- Card dos Filtros -->
        <div class="rounded-lg border border-gray-200 shadow-sm p-4" style="background-color: #F7F9FC;">
          <div class="space-y-3">
            <!-- Título dos Filtros com botão Limpar -->
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
          
          <!-- Linha única com todos os filtros -->
          <div class="grid grid-cols-12 gap-3 items-end">
            <!-- Campo de Busca - ocupa mais espaço -->
            <div class="col-span-4 border border-gray-200 rounded-md p-3">
              <BaseInput 
                type="search"
                label="Buscar"
                placeholder="Localidade, N° NS, serviço, técnico..."
                :icon-left="MagnifyingGlassIcon"
                v-model="searchTerm"
                size="sm"
              />
            </div>

            <!-- Status da NS -->
            <div class="col-span-2 border border-gray-200 rounded-md p-3">
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
              <MenuDropdownGeral 
                :icon-left="CheckCircleIcon" 
                :label="selectedStatus || 'Todos os status'"
                width="trigger"
                size="sm"
                class="w-full"
              >
                <button 
                  v-for="status in statusOptions" 
                  :key="status.value"
                  class="flex items-center px-3 py-1.5 text-sm hover:bg-gray-100 w-full text-left gap-2"
                  :class="selectedStatus === status.label ? 'bg-primary-50 text-primary-700' : 'text-gray-700'"
                  @click="selectedStatus = status.value === 'all' ? null : status.label"
                >
                  <div 
                    class="w-2 h-2 rounded-full" 
                    :class="status.colorClass"
                  ></div>
                  {{ status.label }}
                </button>
              </MenuDropdownGeral>
            </div>

            <!-- Técnico -->
            <div class="col-span-2 border border-gray-200 rounded-md p-3">
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Visita Técnica</label>
              <MenuDropdownGeral 
                :icon-left="UserIcon" 
                :label="selectedTechnician || 'Todas as opções'"
                width="trigger"
                size="sm"
                class="w-full"
              >
                <button 
                  v-for="technician in technicianOptions" 
                  :key="technician.value"
                  class="block px-3 py-1.5 text-sm hover:bg-gray-100 w-full text-left"
                  :class="selectedTechnician === technician.label ? 'bg-primary-50 text-primary-700' : 'text-gray-700'"
                  @click="selectedTechnician = technician.value === 'all' ? null : technician.label"
                >
                  {{ technician.label }}
                </button>
              </MenuDropdownGeral>
            </div>

            <!-- Tipo de Serviço -->
            <div class="col-span-2 border border-gray-200 rounded-md p-3">
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Base</label>
              <MenuDropdownGeral 
                :icon-left="BuildingOfficeIcon" 
                :label="selectedServiceType || 'Todas as bases'"
                width="trigger"
                size="sm"
                class="w-full"
              >
                <button 
                  v-for="serviceType in serviceTypeOptions" 
                  :key="serviceType.value"
                  class="block px-3 py-1.5 text-sm hover:bg-gray-100 w-full text-left"
                  :class="selectedServiceType === serviceType.label ? 'bg-primary-50 text-primary-700' : 'text-gray-700'"
                  @click="selectedServiceType = serviceType.value === 'all' ? null : serviceType.label"
                >
                  {{ serviceType.label }}
                </button>
              </MenuDropdownGeral>
            </div>

            <!-- Localidade -->
            <div class="col-span-2 border border-gray-200 rounded-md p-3">
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Período</label>
              <MenuDropdownGeral 
                :icon-left="CalendarIcon" 
                :label="selectedLocation || 'Todos os períodos'"
                width="trigger"
                size="sm"
                class="w-full"
              >
                <button 
                  v-for="location in locationOptions" 
                  :key="location.value"
                  class="block px-3 py-1.5 text-sm hover:bg-gray-100 w-full text-left"
                  :class="selectedLocation === location.label ? 'bg-primary-50 text-primary-700' : 'text-gray-700'"
                  @click="selectedLocation = location.value === 'all' ? null : location.label"
                >
                  {{ location.label }}
                </button>
              </MenuDropdownGeral>
            </div>
          </div>

          <!-- Filtros Ativos -->
          <div v-if="hasActiveFilters" class="flex flex-wrap gap-1.5">
            <span v-if="selectedStatus" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
              {{ selectedStatus }}
              <button @click="selectedStatus = null" class="ml-1 text-blue-600 hover:text-blue-800">
                <XMarkIcon class="w-3 h-3" />
              </button>
            </span>
            
            <span v-if="selectedTechnician" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
              {{ selectedTechnician }}
              <button @click="selectedTechnician = null" class="ml-1 text-green-600 hover:text-green-800">
                <XMarkIcon class="w-3 h-3" />
              </button>
            </span>
            
            <span v-if="selectedServiceType" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-700">
              {{ selectedServiceType }}
              <button @click="selectedServiceType = null" class="ml-1 text-purple-600 hover:text-purple-800">
                <XMarkIcon class="w-3 h-3" />
              </button>
            </span>
            
            <span v-if="selectedLocation" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-yellow-100 text-yellow-700">
              {{ selectedLocation }}
              <button @click="selectedLocation = null" class="ml-1 text-yellow-600 hover:text-yellow-800">
                <XMarkIcon class="w-3 h-3" />
              </button>
            </span>
          </div>
          </div>
        </div>
      </template>

      <!-- Área de conteúdo principal com DataGrid -->
      <div class="flex flex-col flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <h3 class="text-lg font-semibold text-gray-900">Notas de Serviços</h3>
        </div>
        <div class="flex-1 min-h-0 flex flex-col">
          <DataGridDesktopDrawer
            :columns="columns"
            :rows="paginatedRows"
            :sort="sort"
            @update:sort="handleSort"
            @row-click="handleRowClick"
          />
        </div>
        <DataGridPagination
          :page="page"
          :page-size="pageSize"
          :total="total"
          @update:page="page = $event"
          @update:page-size="pageSize = $event; page = 1"
        />
      </div>
    </MainContainer>

    <!-- Drawer -->
    <Drawer
      :is-open="isDrawerOpen"
      :title="`Detalhes da NS ${selectedRow?.numero || ''}`"
      width="xl"
      @close="closeDrawer"
      @save="handleSaveDrawer"
    />

    <!-- Modal de Cadastro de NS -->
    <div 
      v-if="isFormModalOpen"
      class="fixed inset-0 z-50 overflow-hidden"
    >
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="closeCadastroModal"
      ></div>
      
      <!-- Modal Container -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="relative max-h-[90vh] overflow-auto">
          <FormularioCadastroNS
            @submit="handleFormSubmit"
            @cancel="handleFormCancel"
            @close="closeCadastroModal"
            @novo-tecnico="handleNovoTecnico"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'
import DataGridDesktopDrawer from '@/components/datagrid/DataGridDesktopDrawer.vue'
import DataGridPagination from '@/components/datagrid/DataGridPagination.vue'
import Drawer from '@/components/Drawer.vue'
import FormularioCadastroNS from '@/components/FormularioCadastroNS.vue'
import type { ColumnDef, SortState } from '@/components/datagrid/types'

// Estado reativo
const searchTerm = ref('')
const selectedStatus = ref<string | null>(null)
const selectedTechnician = ref<string | null>(null)
const selectedServiceType = ref<string | null>(null)
const selectedLocation = ref<string | null>(null)
const loading = ref(false)
const sort = ref<SortState | null>(null)
const isDrawerOpen = ref(false)
const selectedRow = ref<any | null>(null)

// Estado do modal de cadastro
const isFormModalOpen = ref(false)

// Estados de paginação
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// Definição das colunas
const columns: ColumnDef[] = [
  {
    id: 'numero',
    header: 'N° NS',
    field: 'numero',
    minWidth: 100,
    sortable: true,
    align: 'left'
  },
  {
    id: 'localidade',
    header: 'Localidade',
    field: 'localidade',
    minWidth: 150,
    sortable: true,
    align: 'left'
  },
  {
    id: 'servico',
    header: 'Serviço',
    field: 'servico',
    minWidth: 200,
    sortable: false,
    align: 'left'
  },
  {
    id: 'tecnico',
    header: 'Técnico',
    field: 'tecnico',
    minWidth: 150,
    sortable: true,
    align: 'left'
  },
  {
    id: 'status',
    header: 'Status',
    field: 'status',
    minWidth: 120,
    sortable: true,
    align: 'center'
  },
  {
    id: 'data_criacao',
    header: 'Data',
    field: 'data_criacao',
    minWidth: 110,
    sortable: true,
    align: 'center'
  },
  {
    id: 'valor',
    header: 'Valor',
    field: 'valor',
    minWidth: 100,
    sortable: true,
    align: 'right'
  }
]

// Dados de exemplo
const mockRows = [
  {
    id: 1,
    numero: 'NS-2024-001',
    localidade: 'Centro',
    servico: 'Instalação de equipamentos',
    tecnico: 'João Silva',
    status: 'Concluído',
    data_criacao: '15/09/2025',
    valor: 'R$ 1.250,00'
  },
  {
    id: 2,
    numero: 'NS-2024-002',
    localidade: 'Bairro Alto',
    servico: 'Manutenção preventiva',
    tecnico: 'Maria Santos',
    status: 'Em Andamento',
    data_criacao: '16/09/2025',
    valor: 'R$ 800,00'
  },
  {
    id: 3,
    numero: 'NS-2024-003',
    localidade: 'Vila Nova',
    servico: 'Reparo de sistema',
    tecnico: 'Pedro Costa',
    status: 'Pendente',
    data_criacao: '18/09/2025',
    valor: 'R$ 2.100,00'
  },
  {
    id: 4,
    numero: 'NS-2024-004',
    localidade: 'Industrial',
    servico: 'Instalação de rede',
    tecnico: 'Ana Lima',
    status: 'Concluído',
    data_criacao: '19/09/2025',
    valor: 'R$ 1.800,00'
  },
  {
    id: 5,
    numero: 'NS-2024-005',
    localidade: 'Residencial',
    servico: 'Configuração de sistema',
    tecnico: 'Carlos Oliveira',
    status: 'Cancelado',
    data_criacao: '20/09/2025',
    valor: 'R$ 950,00'
  },
  {
    id: 6,
    numero: 'NS-2024-006',
    localidade: 'Centro Comercial',
    servico: 'Manutenção corretiva',
    tecnico: 'Fernanda Silva',
    status: 'Em Andamento',
    data_criacao: '21/09/2025',
    valor: 'R$ 1.400,00'
  },
  {
    id: 7,
    numero: 'NS-2024-007',
    localidade: 'Zona Norte',
    servico: 'Instalação de sensores',
    tecnico: 'Roberto Santos',
    status: 'Pendente',
    data_criacao: '22/09/2025',
    valor: 'R$ 2.750,00'
  },
  {
    id: 8,
    numero: 'NS-2024-008',
    localidade: 'Zona Sul',
    servico: 'Upgrade de sistema',
    tecnico: 'Juliana Costa',
    status: 'Concluído',
    data_criacao: '23/09/2025',
    valor: 'R$ 3.200,00'
  },
  {
    id: 9,
    numero: 'NS-2024-009',
    localidade: 'Zona Leste',
    servico: 'Configuração de rede',
    tecnico: 'Marcos Pereira',
    status: 'Em Andamento',
    data_criacao: '24/09/2025',
    valor: 'R$ 1.850,00'
  },
  {
    id: 10,
    numero: 'NS-2024-010',
    localidade: 'Zona Oeste',
    servico: 'Manutenção preventiva',
    tecnico: 'Carla Rodrigues',
    status: 'Pendente',
    data_criacao: '25/09/2025',
    valor: 'R$ 1.100,00'
  },
  {
    id: 11,
    numero: 'NS-2024-011',
    localidade: 'Centro Histórico',
    servico: 'Instalação completa',
    tecnico: 'Diego Lima',
    status: 'Concluído',
    data_criacao: '26/09/2025',
    valor: 'R$ 4.500,00'
  },
  {
    id: 12,
    numero: 'NS-2024-012',
    localidade: 'Distrito Industrial',
    servico: 'Suporte técnico',
    tecnico: 'Patricia Alves',
    status: 'Em Andamento',
    data_criacao: '27/09/2025',
    valor: 'R$ 750,00'
  },
  {
    id: 13,
    numero: 'NS-2024-013',
    localidade: 'Vila São José',
    servico: 'Instalação de câmeras',
    tecnico: 'Eduardo Santos',
    status: 'Concluído',
    data_criacao: '28/09/2025',
    valor: 'R$ 2.800,00'
  },
  {
    id: 14,
    numero: 'NS-2024-014',
    localidade: 'Bairro Jardim',
    servico: 'Manutenção de servidor',
    tecnico: 'Letícia Ferreira',
    status: 'Pendente',
    data_criacao: '29/09/2025',
    valor: 'R$ 1.950,00'
  },
  {
    id: 15,
    numero: 'NS-2024-015',
    localidade: 'Centro Empresarial',
    servico: 'Configuração de firewall',
    tecnico: 'Gabriel Oliveira',
    status: 'Em Andamento',
    data_criacao: '30/09/2025',
    valor: 'R$ 3.100,00'
  },
  {
    id: 16,
    numero: 'NS-2024-016',
    localidade: 'Vila Industrial',
    servico: 'Backup e restauração',
    tecnico: 'Amanda Costa',
    status: 'Concluído',
    data_criacao: '01/10/2025',
    valor: 'R$ 1.600,00'
  },
  {
    id: 17,
    numero: 'NS-2024-017',
    localidade: 'Setor Comercial',
    servico: 'Instalação de switch',
    tecnico: 'Ricardo Silva',
    status: 'Pendente',
    data_criacao: '02/10/2025',
    valor: 'R$ 890,00'
  },
  {
    id: 18,
    numero: 'NS-2024-018',
    localidade: 'Zona Rural',
    servico: 'Conexão via satélite',
    tecnico: 'Bruna Lima',
    status: 'Em Andamento',
    data_criacao: '03/10/2025',
    valor: 'R$ 4.200,00'
  },
  {
    id: 19,
    numero: 'NS-2024-019',
    localidade: 'Centro Médico',
    servico: 'Sistema de segurança',
    tecnico: 'Thiago Santos',
    status: 'Concluído',
    data_criacao: '04/10/2025',
    valor: 'R$ 5.100,00'
  },
  {
    id: 20,
    numero: 'NS-2024-020',
    localidade: 'Campus Universitário',
    servico: 'Rede wireless',
    tecnico: 'Vanessa Costa',
    status: 'Pendente',
    data_criacao: '05/10/2025',
    valor: 'R$ 3.750,00'
  },
  {
    id: 21,
    numero: 'NS-2024-021',
    localidade: 'Residencial Parque',
    servico: 'Automação residencial',
    tecnico: 'Lucas Pereira',
    status: 'Em Andamento',
    data_criacao: '06/10/2025',
    valor: 'R$ 2.400,00'
  },
  {
    id: 22,
    numero: 'NS-2024-022',
    localidade: 'Shopping Center',
    servico: 'Sistema de som',
    tecnico: 'Marina Rodrigues',
    status: 'Concluído',
    data_criacao: '07/10/2025',
    valor: 'R$ 6.800,00'
  },
  {
    id: 23,
    numero: 'NS-2024-023',
    localidade: 'Hospital Regional',
    servico: 'Rede médica',
    tecnico: 'André Lima',
    status: 'Cancelado',
    data_criacao: '08/10/2025',
    valor: 'R$ 4.900,00'
  },
  {
    id: 24,
    numero: 'NS-2024-024',
    localidade: 'Escola Técnica',
    servico: 'Laboratório de informática',
    tecnico: 'Camila Santos',
    status: 'Pendente',
    data_criacao: '09/10/2025',
    valor: 'R$ 7.200,00'
  },
  {
    id: 25,
    numero: 'NS-2024-025',
    localidade: 'Porto Comercial',
    servico: 'Sistema logístico',
    tecnico: 'Felipe Costa',
    status: 'Em Andamento',
    data_criacao: '10/10/2025',
    valor: 'R$ 8.500,00'
  }
]

// Computed para filtros ativos
const hasActiveFilters = computed(() => {
  return selectedStatus.value || selectedTechnician.value || 
         selectedServiceType.value || selectedLocation.value
})

// Computed para dados filtrados
const filteredRows = computed(() => {
  let filtered = [...mockRows]

  // Filtro por termo de busca
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(row => 
      row.numero.toLowerCase().includes(term) ||
      row.localidade.toLowerCase().includes(term) ||
      row.servico.toLowerCase().includes(term) ||
      row.tecnico.toLowerCase().includes(term)
    )
  }

  // Filtro por status
  if (selectedStatus.value) {
    filtered = filtered.filter(row => row.status === selectedStatus.value)
  }

  // Aplicar ordenação se existir
  if (sort.value) {
    filtered.sort((a: any, b: any) => {
      const aVal = a[sort.value!.id]
      const bVal = b[sort.value!.id]
      
      if (aVal < bVal) return sort.value!.desc ? 1 : -1
      if (aVal > bVal) return sort.value!.desc ? -1 : 1
      return 0
    })
  }

  return filtered
})

// Computed para dados paginados
const paginatedRows = computed(() => {
  const filtered = filteredRows.value
  total.value = filtered.length
  
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  
  return filtered.slice(start, end)
})

// Opções dos dropdowns
const statusOptions = [
  { value: 'all', label: 'Todos os status', colorClass: 'bg-gray-400' },
  { value: 'pendente', label: 'Pendente', colorClass: 'bg-yellow-400' },
  { value: 'em_andamento', label: 'Em Andamento', colorClass: 'bg-blue-400' },
  { value: 'concluido', label: 'Concluído', colorClass: 'bg-green-400' },
  { value: 'cancelado', label: 'Cancelado', colorClass: 'bg-red-400' }
]

const technicianOptions = [
  { value: 'all', label: 'Todas as opções' },
  { value: 'programada', label: 'Programada' },
  { value: 'realizada', label: 'Realizada' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'reagendada', label: 'Reagendada' }
]

const serviceTypeOptions = [
  { value: 'all', label: 'Todas as bases' },
  { value: 'base_1', label: 'Base 1' },
  { value: 'base_2', label: 'Base 2' },
  { value: 'base_3', label: 'Base 3' },
  { value: 'base_4', label: 'Base 4' }
]

const locationOptions = [
  { value: 'all', label: 'Todos os períodos' },
  { value: 'hoje', label: 'Hoje' },
  { value: 'ontem', label: 'Ontem' },
  { value: 'ultima_semana', label: 'Última semana' },
  { value: 'ultimo_mes', label: 'Último mês' },
  { value: 'personalizado', label: 'Personalizado' }
]

// Métodos
const handleSort = (sortState: SortState | null) => {
  sort.value = sortState
}

const handleRowClick = (row: any, index: number) => {
  console.log('🚀 DRAWER - Linha clicada:', row, 'Índice:', index)
  console.log('🚀 DRAWER - Estado atual do drawer:', isDrawerOpen.value)
  selectedRow.value = row
  isDrawerOpen.value = true
  console.log('🚀 DRAWER - Novo estado do drawer:', isDrawerOpen.value)
  console.log('🚀 DRAWER - Dados selecionados:', selectedRow.value)
}

const closeDrawer = () => {
  console.log('🚀 DRAWER - Fechando drawer')
  isDrawerOpen.value = false
  selectedRow.value = null
}

const handleSaveDrawer = () => {
  console.log('🚀 DRAWER - Salvando mudanças para:', selectedRow.value)
  // Aqui seria implementada a lógica de salvamento
  // Por exemplo: await saveNotaServico(selectedRow.value)
  closeDrawer()
}

const applyFilters = () => {
  console.log('Aplicando filtros:', {
    searchTerm: searchTerm.value,
    status: selectedStatus.value,
    technician: selectedTechnician.value,
    serviceType: selectedServiceType.value,
    location: selectedLocation.value
  })
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedStatus.value = null
  selectedTechnician.value = null
  selectedServiceType.value = null
  selectedLocation.value = null
}

// Funções do modal de cadastro
const openCadastroModal = () => {
  isFormModalOpen.value = true
}

const closeCadastroModal = () => {
  isFormModalOpen.value = false
}

const handleFormSubmit = (data: any) => {
  console.log('📝 Nova NS cadastrada:', data)
  // Aqui seria implementada a lógica de salvamento
  // Por exemplo: await saveNotaServico(data)
  
  // Fechar modal
  closeCadastroModal()
  
  // Recarregar dados da tabela
  // loadData()
  
  // Mostrar toast de sucesso (se disponível)
  // toast.success('Nota de Serviço cadastrada com sucesso!')
}

const handleFormCancel = () => {
  closeCadastroModal()
}

const handleNovoTecnico = () => {
  console.log('🔧 Abrir modal de cadastro de novo técnico')
  // Aqui seria implementada a abertura do modal de novo técnico
  // openNovoTecnicoModal()
}

// Meta dados da página
useSeoMeta({
  title: 'Notas de Serviços | CSM Sistema',
  description: 'Gerenciamento de notas de serviços'
})
</script>

<style scoped>
.notas-servicos-page {
  @apply bg-gray-50;
}
</style>
