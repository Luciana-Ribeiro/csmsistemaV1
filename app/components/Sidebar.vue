<template>
  <aside 
    :class="[
      'sidebar-container',
      isCollapsed ? 'collapsed' : 'expanded',
      {
        'mobile-open': isMobileOpen,
        'mobile-closed': !isMobileOpen
      }
    ]"
  >
    <!-- Header -->
    <header class="sidebar-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <ChartBarIcon class="w-6 h-6 text-primary-500" />
          </div>
          <transition name="fade" mode="out-in">
            <h1 v-if="!isCollapsed || isMobileOpen" class="logo-text">
              CSM Sistema
            </h1>
          </transition>
        </div>
        <!-- Botão fechar mobile -->
        <button 
          v-if="isMobileOpen" 
          @click="$emit('close-mobile')"
          class="mobile-close-btn lg:hidden"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Main Navigation -->
    <main class="sidebar-main">
      <nav class="navigation">
        <ul class="nav-list">
          <li v-for="item in navigationItems" :key="item.id" class="nav-item">
            <button 
              :class="[
                'nav-button group',
                activeItem === item.id ? 'active' : 'inactive'
              ]"
              :title="isCollapsed && !isMobileOpen ? item.label : ''"
              @click="onNavClick(item.id)"
            >
              <div class="nav-icon">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <transition name="fade" mode="out-in">
                <span v-if="!isCollapsed || isMobileOpen" class="nav-text">
                  {{ item.label }}
                </span>
              </transition>
              <div v-if="!isCollapsed || isMobileOpen" class="ripple-effect"></div>
            </button>
          </li>
        </ul>
      </nav>
    </main>

    <!-- Footer - Botão colapsar (apenas desktop) -->
    <footer class="sidebar-footer hidden lg:block">
      <button 
        class="collapse-button"
        @click="toggleCollapsed"
        :title="isCollapsed ? 'Expandir sidebar' : 'Fechar'"
      >
        <div class="collapse-icon">
          <transition name="rotate" mode="out-in">
            <ChevronLeftIcon v-if="!isCollapsed" class="w-4 h-4" />
            <ChevronRightIcon v-else class="w-4 h-4" />
          </transition>
        </div>
        <transition name="fade" mode="out-in">
          <span v-if="!isCollapsed" class="collapse-text">
            Fechar
          </span>
        </transition>
      </button>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  ChartBarIcon,
  HomeIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  UserGroupIcon,
  TruckIcon,
  DocumentChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Interface para os itens de navegação
interface NavigationItem {
  id: string
  label: string
  icon: any
  route?: string
}

// Props
interface Props {
  isCollapsed?: boolean
  isMobileOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false,
  isMobileOpen: false
})

// Emits
const emit = defineEmits<{
  collapsed: [collapsed: boolean]
  navigate: [itemId: string, route?: string]
  'close-mobile': []
}>()

// Estado reativo local
const isCollapsed = ref(props.isCollapsed)
const isMobileOpen = ref(props.isMobileOpen)
const activeItem = ref('dashboard')

// Watch props para sincronizar estado
watch(() => props.isCollapsed, (newValue) => {
  isCollapsed.value = newValue
})

watch(() => props.isMobileOpen, (newValue) => {
  isMobileOpen.value = newValue
})

// Itens de navegação
const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    route: '/'
  },
  {
    id: 'notas-servicos',
    label: 'Notas de Serviços',
    icon: DocumentTextIcon,
    route: '/notas-servicos'
  },
  {
    id: 'servicos',
    label: 'Serviços',
    icon: WrenchScrewdriverIcon,
    route: '/servicos'
  },
  {
    id: 'pessoas',
    label: 'Pessoas',
    icon: UsersIcon,
    route: '/pessoas'
  },
  {
    id: 'equipes',
    label: 'Equipes',
    icon: UserGroupIcon,
    route: '/equipes'
  },
  {
    id: 'veiculos',
    label: 'Veículos',
    icon: TruckIcon,
    route: '/veiculos'
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: DocumentChartBarIcon,
    route: '/relatorios'
  }
]

// Métodos
const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}

const setActiveItem = (itemId: string) => {
  activeItem.value = itemId
  // Aqui você pode adicionar navegação com useRouter se necessário
}

// Watch para emitir mudanças
watch(() => isCollapsed.value, (newValue) => {
  emit('collapsed', newValue)
})

watch(() => activeItem.value, (newValue) => {
  const item = navigationItems.find(nav => nav.id === newValue)
  emit('navigate', newValue, item?.route)
})
// Clique de navega��o: seta ativo e fecha no mobile
const onNavClick = (itemId: string) => {
  setActiveItem(itemId)
  if (isMobileOpen.value) {
    emit('close-mobile')
  }
}

</script>

<style scoped>
/* Container principal com cores do projeto */
.sidebar-container {
  @apply shadow-lg border-r flex flex-col;
  background-color: #4D7493; /* Cor principal do projeto */
  border-color: #3a5a73; /* Tom mais escuro para a borda */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* Desktop: posição fixa para não rolar com o conteúdo */
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 40;
}

/* Estados desktop */
.expanded {
  @apply w-64;
}

.collapsed {
  @apply w-16;
}

/* Estados mobile */
@media (max-width: 1023px) {
  .sidebar-container {
    @apply transform transition-transform duration-300 ease-in-out;
    /* Mobile: manter fixed mas com z-index maior */
    z-index: 50;
    height: 100vh;
    width: 280px;
  }
  
  .mobile-closed {
    transform: translateX(-100%);
  }
  
  .mobile-open {
    transform: translateX(0);
  }
  
  /* No mobile, sempre mostrar como expandido quando aberto */
  .mobile-open.collapsed {
    @apply w-80;
  }
}

/* Header com gradient das cores do projeto */
.sidebar-header {
  @apply px-4 py-6 border-b;
  border-color: #3a5a73; /* Tom mais escuro da cor principal */
  background: linear-gradient(135deg, #4D7493 0%, #3a5a73 100%); /* Gradient na cor principal */
  height: 73px; /* Altura fixa igual ao HeaderGlobal */
}

.header-content {
  @apply flex items-center justify-between;
}

.logo-section {
  @apply flex items-center space-x-3;
}

/* Botão fechar mobile */
.mobile-close-btn {
  @apply p-2 rounded-md hover:bg-white/10 transition-colors duration-200 text-white;
}

.logo-icon {
  @apply flex-shrink-0 w-8 h-8 rounded-material-lg flex items-center justify-center;
  background: linear-gradient(135deg, #FFFFFF 0%, #F1CA00 100%); /* Branco para amarelo para destaque */
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.15); /* Sombra branca suave */
}

.logo-icon .w-6 {
  @apply text-blue-800; /* Ícone azul escuro para contraste no fundo claro */
}

.logo-text {
  @apply text-lg font-semibold whitespace-nowrap;
  color: #FFFFFF; /* Texto branco para contraste no fundo azul */
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Main Navigation */
.sidebar-main {
  @apply flex-1 px-2 py-4 overflow-y-auto;
}

.navigation {
  @apply h-full;
}

.nav-list {
  @apply space-y-2;
}

.nav-item {
  @apply relative;
}

.nav-button {
  @apply w-full flex items-center px-3 py-2.5 text-left transition-all duration-200 relative overflow-hidden;
  border-radius: 12px; /* rounded-material-lg */
  min-height: 2.75rem;
}

.nav-button.inactive {
  color: #FFFFFF; /* Fonte branca */
  transition: all 0.2s ease;
}

.nav-button.inactive:hover {
  background: linear-gradient(135deg, rgba(107, 114, 128, 0.3) 0%, rgba(75, 85, 99, 0.2) 100%); /* Tons de cinza */
  color: #FFFFFF; /* Fonte branca mantida */
  transform: translateX(2px);
}

.nav-button.active {
  @apply shadow-lg;
  background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); /* Gradiente cinza claro elegante */
  color: #1E293B; /* Cinza escuro para contraste */
  border: 1px solid rgba(148, 163, 184, 0.3); /* Borda cinza suave */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.nav-icon {
  @apply flex-shrink-0 w-5 h-5 mr-3 flex items-center justify-center;
}

.nav-text {
  @apply text-sm font-medium whitespace-nowrap flex-1;
}

/* Ripple effect com tons de cinza */
.ripple-effect {
  @apply absolute inset-0 opacity-0;
  border-radius: 12px; /* rounded-material-lg */
  background: linear-gradient(135deg, rgba(107, 114, 128, 0.3) 0%, rgba(75, 85, 99, 0.2) 100%); /* Tons de cinza */
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.nav-button:active .ripple-effect {
  @apply opacity-100;
}

/* Footer com cores do projeto */
.sidebar-footer {
  @apply p-4 border-t;
  border-color: #3a5a73; /* Tom mais escuro da cor principal */
  background: linear-gradient(135deg, #4D7493 0%, #3a5a73 100%); /* Gradient na cor principal */
}

.collapse-button {
  @apply w-full flex items-center justify-center px-3 py-2 text-sm transition-all duration-200;
  border-radius: 8px; /* rounded-material-md */
  color: #FFFFFF; /* Texto branco */
}

.collapse-button:hover {
  background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%); /* Tons de cinza */
  color: #FFFFFF; /* Fonte branca mantida */
  transform: scale(1.02);
}

.collapse-icon {
  @apply flex-shrink-0 w-4 h-4 mr-2;
}

.collapse-text {
  @apply text-sm font-medium;
}

/* Transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.rotate-enter-active,
.rotate-leave-active {
  transition: transform 0.2s ease;
}

.rotate-enter-from {
  transform: rotate(-90deg);
}

.rotate-leave-to {
  transform: rotate(90deg);
}

/* Responsividade (mobile): posicionamento sem sobrescrever o translate */
@media (max-width: 768px) {
  .sidebar-container {
    @apply fixed top-0 left-0 z-50;
  }
  /* O deslocamento fica a cargo das classes mobile-open/mobile-closed */
}

/* Scrollbar customizada com cores do projeto */
.sidebar-main::-webkit-scrollbar {
  width: 4px;
}

.sidebar-main::-webkit-scrollbar-track {
  background: #F5F5F5; /* project-light */
}

.sidebar-main::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4D7493 0%, #13A0D5 100%); /* primary to secondary */
  border-radius: 4px;
}

.sidebar-main::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #3a5a73 0%, #0f87b0 100%); /* darker shades */
}

/* Tooltips customizados */
.nav-button[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 12px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #4D7493 0%, #13A0D5 100%);
  color: #FFFFFF;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(7, 35, 154, 0.25);
  animation: tooltip-fade-in 0.2s ease-out;
}

.nav-button[title]:hover::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 6px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 6px 6px 0;
  border-color: transparent #4D7493 transparent transparent;
  z-index: 1001;
}

@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* Ocultar tooltip quando sidebar está expandida */
.expanded .nav-button[title]::after,
.expanded .nav-button[title]::before {
  display: none;
}
</style>
