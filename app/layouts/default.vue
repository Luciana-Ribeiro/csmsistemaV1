<template>
  <div class="layout-wrapper">
    <!-- Mobile Header com Hambúrguer (visible apenas no mobile) -->
    <header class="mobile-header md:hidden">
      <div class="mobile-header-content">
        <button 
          @click="toggleMobileSidebar"
          class="hamburger-btn"
          :class="{ 'active': isMobileSidebarOpen }"
        >
          <div class="hamburger-lines">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <h1 class="mobile-title">CSM Sistema</h1>
      </div>
    </header>

    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileSidebarOpen" 
      @click="closeMobileSidebar"
      class="mobile-overlay"
    />

    <!-- Sidebar - fixo na lateral esquerda -->
    <Sidebar 
      :isCollapsed="sidebarCollapsed"
      :isMobileOpen="isMobileSidebarOpen"
      @collapsed="handleSidebarCollapsed"
      @navigate="handleSidebarNavigate"
      @close-mobile="closeMobileSidebar"
    />

    <!-- Header Global - fixo no topo, ajustado conforme sidebar -->
    <HeaderGlobal 
      class="header-desktop hidden md:block"
      :class="{
        'sidebar-expanded': !sidebarCollapsed,
        'sidebar-collapsed': sidebarCollapsed
      }"
      :pageTitle="currentPageTitle"
      :pageSubtitle="currentPageSubtitle"
      @logout="handleLogout"
      @toggle-mobile-sidebar="toggleMobileSidebar"
    />
    
    <!-- Main Content Area -->
    <main 
      class="main-content"
      :class="{
        'lg:ml-64': !sidebarCollapsed,
        'lg:ml-16': sidebarCollapsed,
        'ml-0': true
      }"
    >      
      <div class="content-wrapper">
        <!-- Conteúdo das páginas -->
        <div class="page-content">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide, readonly } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Estados reativos
const sidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const activeRoute = ref('dashboard')
const isMobile = ref(false)

// Estados do header global
const currentPageTitle = ref('Dashboard')
const currentPageSubtitle = ref('Painel principal do CSM Sistema')

// Métodos
const handleSidebarCollapsed = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
}

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const handleNavigation = (itemId: string, route?: string) => {
  activeRoute.value = itemId
  console.log(`Layout: Navegando para ${itemId}`, route)
  
  // Atualizar título da página baseado na navegação
  updatePageTitle(itemId)
  
  // Fechar sidebar mobile após navegação
  if (isMobile.value) {
    closeMobileSidebar()
  }
}

const updatePageTitle = (routeId: string) => {
  const titleMap: Record<string, { title: string; subtitle: string }> = {
    'dashboard': { title: 'Dashboard', subtitle: 'Painel principal do CSM Sistema' },
    'notas-servicos': { title: 'Notas de Serviços', subtitle: 'Gerenciamento de notas de serviço' },
    'pessoas': { title: 'Pessoas', subtitle: 'Gerenciamento de pessoas' },
    'equipes': { title: 'Equipes', subtitle: 'Gerenciamento de equipes' },
    'veiculos': { title: 'Veículos', subtitle: 'Gerenciamento de veículos' },
    'relatorios': { title: 'Relatórios', subtitle: 'Relatórios do sistema' }
  }
  
  const pageInfo = titleMap[routeId] || { title: 'CSM Sistema', subtitle: '' }
  currentPageTitle.value = pageInfo.title
  currentPageSubtitle.value = pageInfo.subtitle
}

const handleLogout = () => {
  console.log('Layout: Usuário solicitou logout')
  // Implementar lógica de logout aqui
}

// Navegação a partir da Sidebar (tablet/mobile) com fechamento e router
const handleSidebarNavigate = async (itemId: string, route?: string) => {
  activeRoute.value = itemId
  console.log(`Layout: Navegando para ${itemId}`, route)

  updatePageTitle(itemId)

  if (isMobile.value) {
    closeMobileSidebar()
  }

  if (route) {
    try {
      await router.push(route)
    } catch (e) {
      console.warn('Falha ao navegar para', route, e)
    }
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024 // lg breakpoint
  
  // Fechar sidebar mobile se mudou para desktop
  if (!isMobile.value) {
    isMobileSidebarOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Provide/inject para componentes filhos
provide('layoutData', {
  sidebarCollapsed: readonly(sidebarCollapsed),
  isMobileSidebarOpen: readonly(isMobileSidebarOpen),
  activeRoute: readonly(activeRoute),
  isMobile: readonly(isMobile),
  currentPageTitle: readonly(currentPageTitle),
  currentPageSubtitle: readonly(currentPageSubtitle),
  updatePageTitle
})
</script>

<style scoped>
/* Layout principal */
.layout-wrapper {
  @apply min-h-screen bg-gray-50;
  /* Variável para altura do header (usada pelo MainContainer) */
  --header-height: 60px;
}

/* Mobile Header */
.mobile-header {
  @apply fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200;
  height: 60px;
}

.mobile-header-content {
  @apply h-full px-4 flex items-center justify-between;
}

.mobile-title {
  @apply text-lg font-semibold text-gray-900;
}

/* Hambúrguer Button */
.hamburger-btn {
  @apply p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500;
  width: 40px;
  height: 40px;
}

.hamburger-lines {
  @apply flex flex-col justify-center items-center w-6 h-6 relative;
}

.hamburger-lines span {
  @apply block w-6 h-0.5 bg-gray-600 rounded transition-all duration-300 ease-in-out;
  transform-origin: center;
}

.hamburger-lines span:nth-child(1) {
  margin-bottom: 4px;
}

.hamburger-lines span:nth-child(2) {
  margin-bottom: 4px;
}

/* Animação do hambúrguer quando ativo */
.hamburger-btn.active .hamburger-lines span:nth-child(1) {
  transform: rotate(45deg) translate(3px, 3px);
}

.hamburger-btn.active .hamburger-lines span:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.active .hamburger-lines span:nth-child(3) {
  transform: rotate(-45deg) translate(3px, -3px);
}

/* Mobile Overlay */
.mobile-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden;
  backdrop-filter: blur(2px);
}

/* Main Content */
.main-content {
  @apply transition-all duration-300 ease-in-out;
  padding-top: 0; /* Remove padding pois o header agora é separado */
}

.content-wrapper {
  @apply min-h-screen;
  /* Mobile: tem padding-top por causa do mobile header */
  padding-top: 60px;
}

/* Tablet: HeaderGlobal visível, remover padding do header mobile */
@media (min-width: 768px) {
  .content-wrapper {
    padding-top: 0;
  }
}

/* Atualiza altura do header para tablet e desktop */
@media (min-width: 768px) {
  .layout-wrapper {
    --header-height: 73px;
  }
}

/* Desktop: header agora é fixo, então o content não precisa de min-height especial */
@media (min-width: 1024px) {
  .content-wrapper {
    /* Header fixo de 73px já é considerado pelo mt-[73px] no template */
    padding-top: 0;
    min-height: 100vh; /* altura total da viewport */
  }
}

/* Header desktop - moved to HeaderGlobal (removing duplicate rules) */
/* removed duplicate header styles */
  
  
  
  z-index: 100; /* Z-index intermediário: acima da sidebar (50) mas abaixo do dropdown (9999) */
  
  
  
  
 

/* (removido) Posicionamento do header baseado no estado da sidebar */
 

/* Main content não precisa de padding-top especial */
@media (min-width: 1024px) {
  .main-content {
    padding-top: 0;
  }
}

.page-content {
  @apply flex-1;
}

/* Overrides para garantir scroll local apenas no MainContainer */
.layout-wrapper {
  overflow: hidden; /* bloqueia rolagem do body */
}

.main-content {
  min-height: 0;
}

.content-wrapper {
  min-height: 0 !important;
  padding-top: 0 !important;
}
</style>

