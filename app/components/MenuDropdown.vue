<template>
  <div class="menu-dropdown-container">
    <!-- Trigger Button -->
    <button 
      @click="toggleDropdown"
      class="dropdown-trigger"
      :class="{ 'active': isOpen }"
    >
      <div class="user-info">
        <!-- Avatar -->
        <div class="user-avatar">
          <span class="avatar-text">{{ userInitials }}</span>
        </div>
        
        <!-- User Details -->
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
        
        <!-- Chevron Icon -->
        <div class="chevron-icon" :class="{ 'rotated': isOpen }">
          <ChevronDownIcon class="w-4 h-4" />
        </div>
      </div>
    </button>

    <!-- Dropdown Menu - SEM Teleport para debugging -->
    <div 
      v-if="isOpen" 
      class="dropdown-overlay"
      @click="closeDropdown"
    >
      <div 
        class="dropdown-menu"
        :style="dropdownPosition"
        @click.stop
      >
          <!-- User Info Header -->
          <div class="dropdown-header">
            <div class="user-avatar large">
              <span class="avatar-text">{{ userInitials }}</span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
          </div>
          
          <!-- Divider -->
          <div class="dropdown-divider"></div>
          
          <!-- Menu Items -->
          <div class="dropdown-content">
            <button 
              @click="handleLogout"
              class="dropdown-item logout-item"
            >
              <ArrowRightOnRectangleIcon class="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

// Props
interface Props {
  userName?: string
  userRole?: string
}

const props = withDefaults(defineProps<Props>(), {
  userName: 'Ada Correa',
  userRole: 'Desenvolvedora'
})

// Emits
defineEmits<{
  logout: []
}>()

// Estado reativo
const isOpen = ref(false)
const dropdownPosition = ref({})

// Computed
const userInitials = computed(() => {
  return props.userName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Métodos
const toggleDropdown = (event: Event) => {
  console.log('MenuDropdown: toggleDropdown chamado, isOpen atual:', isOpen.value)
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown(event)
  }
}

const openDropdown = (event: Event) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  
  dropdownPosition.value = {
    position: 'fixed',
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`,
    zIndex: 99999 // Z-index extremamente alto para garantir visibilidade
  }
  
  isOpen.value = true
  console.log('MenuDropdown: dropdown aberto, position:', dropdownPosition.value)
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleLogout = () => {
  // Emit logout event
  // emit('logout')
  console.log('Usuário clicou em Sair')
  closeDropdown()
}

// Event listeners
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.menu-dropdown-container') && !target.closest('.dropdown-menu')) {
    closeDropdown()
  }
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
/* Container do menu dropdown */
.menu-dropdown-container {
  @apply relative;
  position: relative !important;
  z-index: 99999 !important; /* Container com z-index alto */
}

/* Botão trigger */
.dropdown-trigger {
  @apply w-full p-3 rounded-material-lg transition-all duration-200 border border-transparent;
  @apply hover:bg-gray-50 hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.dropdown-trigger.active {
  @apply bg-gray-50 border-gray-200;
}

/* Informações do usuário no trigger */
.user-info {
  @apply flex items-center space-x-3;
}

.user-avatar {
  @apply w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium;
  background: linear-gradient(135deg, #07239A 0%, #13A0D5 100%);
}

.user-avatar.large {
  @apply w-10 h-10 text-base;
}

.avatar-text {
  @apply select-none;
}

.user-details {
  @apply flex flex-col items-start flex-1 min-w-0;
}

.user-name {
  @apply text-sm font-medium text-gray-900 truncate;
}

.user-role {
  @apply text-xs text-gray-500 truncate;
}

/* Ícone chevron */
.chevron-icon {
  @apply transition-transform duration-200 text-gray-400;
}

.chevron-icon.rotated {
  @apply rotate-180;
}

/* Overlay - agora sem Teleport, posicionado a partir do container */
.dropdown-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 99999 !important; /* Z-index extremamente alto com !important */
  background: transparent;
  pointer-events: auto !important; /* Garante que o overlay capture cliques */
}

/* Menu dropdown - agora posicionado absolutamente dentro do overlay */
.dropdown-menu {
  @apply bg-white rounded-material-xl elevation-3 border border-gray-200;
  @apply min-w-60 max-w-80 overflow-hidden;
  animation: dropdownSlide 0.2s ease-out;
  position: absolute !important;
  z-index: 99999 !important; /* Garante que fique no topo absoluto */
  pointer-events: auto !important; /* Menu deve capturar cliques */
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header do dropdown */
.dropdown-header {
  @apply p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100;
  @apply flex items-center space-x-3;
}

.dropdown-header .user-details {
  @apply flex flex-col items-start;
}

.dropdown-header .user-name {
  @apply text-base font-semibold text-gray-900;
}

.dropdown-header .user-role {
  @apply text-sm text-gray-600;
}

/* Divider */
.dropdown-divider {
  @apply h-px bg-gray-200;
}

/* Conteúdo do dropdown */
.dropdown-content {
  @apply py-2;
}

/* Item do menu */
.dropdown-item {
  @apply w-full px-4 py-3 text-left flex items-center space-x-3;
  @apply text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150;
}

.logout-item {
  @apply text-red-600 hover:bg-red-50 hover:text-red-700;
}

.logout-item svg {
  @apply text-red-500;
}

/* Responsividade */
@media (max-width: 640px) {
  .dropdown-menu {
    @apply min-w-72 mx-4;
    left: 1rem !important;
    right: 1rem !important;
    width: auto !important;
  }
}
</style>