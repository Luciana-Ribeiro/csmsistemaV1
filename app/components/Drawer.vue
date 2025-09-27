<template>
  <div>
    <!-- Overlay -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="absolute inset-0 bg-black bg-opacity-50 z-[9998]"
        @click="close"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="slide-right">
      <div
        v-if="isOpen"
        class="absolute right-0 top-0 h-full bg-white shadow-xl z-[9999] flex flex-col"
        :class="drawerWidth"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ title }}
          </h2>
          <button
            @click="close"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-4" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="flex-1 p-4 overflow-y-auto">
          <div v-if="activeTab === 'nota-servico'" class="space-y-4">
            <!-- Conteúdo da Tab Nota de Serviço -->
            <div class="text-center text-gray-500 py-8">
              <h3 class="text-lg font-medium mb-2">Nota de Serviço</h3>
              <p>Conteúdo da nota de serviço será adicionado aqui</p>
            </div>
          </div>

          <div v-if="activeTab === 'equipe'" class="space-y-4">
            <!-- Conteúdo da Tab Equipe -->
            <div class="text-center text-gray-500 py-8">
              <h3 class="text-lg font-medium mb-2">Equipe</h3>
              <p>Informações da equipe serão adicionadas aqui</p>
            </div>
          </div>

          <div v-if="activeTab === 'servicos-ns'" class="space-y-4">
            <!-- Conteúdo da Tab Serviços da NS -->
            <div class="text-center text-gray-500 py-8">
              <h3 class="text-lg font-medium mb-2">Serviços da NS</h3>
              <p>Lista de serviços da NS será adicionada aqui</p>
            </div>
          </div>
        </div>

        <!-- Footer (opcional para ações) -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex space-x-3 justify-end">
            <BaseButton variant="secondary" @click="close">
              Cancelar
            </BaseButton>
            <BaseButton variant="primary" @click="handleSave">
              Salvar
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface DrawerTab {
  id: string
  name: string
}

interface Props {
  isOpen: boolean
  title?: string
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

interface Emits {
  (e: 'close'): void
  (e: 'save'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Detalhes',
  width: 'lg'
})

const emit = defineEmits<Emits>()

// Estado das tabs
const activeTab = ref<string>('nota-servico')

// Definição das tabs
const tabs: DrawerTab[] = [
  { id: 'nota-servico', name: 'Nota de Serviço' },
  { id: 'equipe', name: 'Equipe' },
  { id: 'servicos-ns', name: 'Serviços da NS' }
]

// Classes de largura do drawer
const drawerWidthClasses = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-1/3',
  xl: 'w-2/5',
  '2xl': 'w-1/2'
}

const drawerWidth = computed(() => drawerWidthClasses[props.width])

// Métodos
function close() {
  emit('close')
}

function handleSave() {
  emit('save')
}

// Fechar drawer com ESC
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      close()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
/* Animações */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>