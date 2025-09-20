<template>
  <div class="sidebar-test-page">
    <!-- Layout com Sidebar -->
    <div class="layout-container">
      <Sidebar 
        @collapsed="handleSidebarCollapsed"
        @navigate="handleNavigation"
      />
      
      <!-- Área principal -->
      <main class="main-content">
        <div class="content-header">
          <h1 class="page-title">Teste da Sidebar</h1>
          <div class="status-info">
            <div class="status-item">
              <span class="status-label">Status:</span>
              <span :class="['status-value', sidebarCollapsed ? 'text-orange-600' : 'text-green-600']">
                {{ sidebarCollapsed ? 'Colapsada' : 'Expandida' }}
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">Item Ativo:</span>
              <span class="status-value text-blue-600">{{ activeNavItem }}</span>
            </div>
          </div>
        </div>
        
        <!-- Área de conteúdo -->
        <div class="content-body">
          <div class="demo-cards">
            <div class="demo-card">
              <h3 class="card-title">Sidebar Responsiva</h3>
              <p class="card-description">
                A sidebar se adapta automaticamente em telas menores e pode ser colapsada para economizar espaço.
              </p>
            </div>
            
            <div class="demo-card">
              <h3 class="card-title">Navegação Interativa</h3>
              <p class="card-description">
                Clique nos itens da sidebar para ver a navegação funcionando. O item ativo é destacado visualmente.
              </p>
            </div>
            
            <div class="demo-card">
              <h3 class="card-title">Ícones Heroicons</h3>
              <p class="card-description">
                Todos os ícones utilizam a biblioteca Heroicons para manter consistência visual no sistema.
              </p>
            </div>
            
            <div class="demo-card">
              <h3 class="card-title">Material Design</h3>
              <p class="card-description">
                Design seguindo princípios do Material Design com animações suaves e micro-interações.
              </p>
            </div>
          </div>
          
          <!-- Toast Test Buttons -->
          <div class="toast-section">
            <h3 class="section-title">Teste das Notificações</h3>
            <div class="toast-buttons">
              <BaseButton variant="primary" @click="showSuccessToast">
                Toast Sucesso
              </BaseButton>
              <BaseButton variant="secondary" @click="showErrorToast">
                Toast Erro
              </BaseButton>
              <BaseButton variant="tertiary" @click="showWarningToast">
                Toast Aviso
              </BaseButton>
              <BaseButton variant="ghost" @click="showInfoToast">
                Toast Info
              </BaseButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

// Composables
const toast = useToast()

// Estado reativo
const sidebarCollapsed = ref(false)
const activeNavItem = ref('dashboard')

// Handlers
const handleSidebarCollapsed = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
}

const handleNavigation = (itemId: string, route?: string) => {
  activeNavItem.value = itemId
  console.log(`Navegando para: ${itemId}`, route)
}

// Toast methods
const showSuccessToast = () => {
  toast.success('Operação realizada com sucesso!', {
    toastClassName: 'custom-toast'
  })
}

const showErrorToast = () => {
  toast.error('Ocorreu um erro na operação!', {
    toastClassName: 'custom-toast'
  })
}

const showWarningToast = () => {
  toast.warning('Atenção: Verifique os dados informados!', {
    toastClassName: 'custom-toast'
  })
}

const showInfoToast = () => {
  toast.info('Nova atualização disponível!', {
    toastClassName: 'custom-toast'
  })
}
</script>

<style scoped>
.sidebar-test-page {
  @apply h-screen overflow-hidden bg-gray-50;
}

.layout-container {
  @apply flex h-full;
}

.main-content {
  @apply flex-1 overflow-hidden flex flex-col;
}

.content-header {
  @apply bg-white shadow-sm border-b border-gray-200 px-6 py-4;
}

.page-title {
  @apply text-2xl font-bold text-gray-900 mb-3;
}

.status-info {
  @apply flex space-x-6;
}

.status-item {
  @apply flex items-center space-x-2;
}

.status-label {
  @apply text-sm font-medium text-gray-600;
}

.status-value {
  @apply text-sm font-semibold;
}

.content-body {
  @apply flex-1 overflow-y-auto p-6;
}

.demo-cards {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8;
}

.demo-card {
  @apply bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200;
}

.card-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.card-description {
  @apply text-gray-600 text-sm leading-relaxed;
}

.toast-section {
  @apply bg-white rounded-xl p-6 shadow-sm border border-gray-100;
}

.section-title {
  @apply text-lg font-semibold text-gray-900 mb-4;
}

.toast-buttons {
  @apply flex flex-wrap gap-3;
}

/* Responsividade */
@media (max-width: 768px) {
  .demo-cards {
    @apply grid-cols-1;
  }
  
  .content-header {
    @apply px-4 py-3;
  }
  
  .content-body {
    @apply p-4;
  }
  
  .status-info {
    @apply flex-col space-x-0 space-y-2;
  }
}
</style>