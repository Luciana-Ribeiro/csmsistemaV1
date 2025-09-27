<template>
  <header class="border-b shadow-sm" style="background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); border-color: rgba(148, 163, 184, 0.3); height: 73px; box-sizing: border-box; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
    <div class="px-4 py-6 flex items-center h-full" style="justify-content: space-between; width: 100%; box-sizing: border-box;">
      <!-- Título da página (extrema esquerda) -->
      <div class="flex items-center" style="flex: 0 0 auto;">
        <button 
          class="hidden md:inline-flex lg:hidden mr-3 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="$emit('toggle-mobile-sidebar')"
          aria-label="Abrir menu"
        >
          <span class="hg-hamburger">
            <i></i><i></i><i></i>
          </span>
        </button>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold text-gray-900 m-0 leading-tight" style="color: #000000;">{{ pageTitle }}</h1>
          <p v-if="pageSubtitle" class="text-sm text-gray-600 mt-0.5 m-0 leading-tight" style="color: #6B7280;">{{ pageSubtitle }}</p>
        </div>
      </div>

      <!-- Menu do usuário (extrema direita) -->
      <div class="flex items-center" style="flex: 0 0 auto;">
        <MenuDropdown 
          :userName="userName"
          :userRole="userRole"
          @logout="handleLogout"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Props
interface Props {
  pageTitle: string
  pageSubtitle?: string
  userName?: string
  userRole?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageSubtitle: '',
  userName: 'Ada Correa',
  userRole: 'Desenvolvedora'
})

// Emits
defineEmits<{
  logout: []
  'toggle-mobile-sidebar': []
}>()

// Métodos
const handleLogout = () => {
  // Emit logout para o componente pai
  // emit('logout')
  console.log('HeaderGlobal: Usuário solicitou logout - versão atualizada')
}
</script>

<style scoped>
/* Hamburger (tablet) dentro do HeaderGlobal */
.hg-hamburger {
  display: inline-flex;
  width: 24px;
  height: 18px;
  flex-direction: column;
  justify-content: space-between;
}
.hg-hamburger i {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #4B5563; /* gray-600 */
  border-radius: 2px;
}
/* Header fixo no topo para tablet e acima */
@media (min-width: 768px) {
  .header-desktop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30; /* abaixo do overlay (40) e da sidebar mobile (50) */
    transition: all 0.3s ease-in-out;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid #F5F5F5;
  }
}

/* Em desktop, ajustar deslocamento conforme sidebar fixa */
@media (min-width: 1024px) {
  .header-desktop { z-index: 100; }
  .header-desktop.sidebar-expanded {
    left: 256px; /* w-64 */
  }

  .header-desktop.sidebar-collapsed {
    left: 64px; /* w-16 */
  }
}

/* Responsividade para mobile */
@media (max-width: 640px) {
  .flex {
    flex: 1;
    min-width: 0;
  }
  
  /* Ajustar padding no mobile */
  header > div {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  
  /* Garantir que o título não quebre o layout */
  h1 {
    font-size: 0.875rem !important; /* text-sm */
    max-width: calc(100vw - 100px);
  }
}

/* Responsividade para tablet */
@media (min-width: 641px) and (max-width: 1023px) {
  p {
    display: none !important;
  }
}
</style>
