<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      ref="triggerRef"
      :id="triggerId"
      type="button"
      :class="triggerClasses"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      @click="toggle"
      @keydown="onKeydown"
    >
      <!-- Left Icon -->
      <component
        v-if="iconLeft"
        :is="iconLeft"
        :class="iconClasses"
      />

      <!-- Label -->
      <span v-if="label" :class="labelClasses">
        {{ label }}
      </span>

      <!-- Badge/Counter -->
      <span
        v-if="badge && badge > 0"
        class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
      >
        {{ badge > 99 ? '99+' : badge }}
      </span>

      <!-- Right Icon (Chevron) -->
      <ChevronDownIcon
        :class="[
          'w-4 h-4 transition-transform duration-200',
          { 'transform rotate-180': isOpen },
          iconClasses
        ]"
      />
    </button>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="menuRef"
          :class="menuClasses"
          :style="menuStyles"
          role="menu"
          :aria-labelledby="triggerId"
        >
          <!-- Header (opcional) -->
          <div v-if="$slots.header" class="px-4 py-3 border-b border-gray-100">
            <slot name="header" />
          </div>

          <!-- Menu Items -->
          <div class="py-1" role="none">
            <slot name="default" :close="close" />
          </div>

          <!-- Footer (opcional) -->
          <div v-if="$slots.footer" class="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <slot name="footer" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

export interface MenuDropdownGeralProps {
  label?: string
  iconLeft?: any
  badge?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  position?: 'left' | 'right' | 'center'
  width?: 'auto' | 'trigger' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

const props = withDefaults(defineProps<MenuDropdownGeralProps>(), {
  size: 'md',
  variant: 'default',
  position: 'left',
  width: 'auto',
  disabled: false
})

const emit = defineEmits<{
  open: []
  close: []
  toggle: [isOpen: boolean]
}>()

// Estado reativo
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const triggerId = `dropdown-trigger-${Math.random().toString(36).substr(2, 9)}`
const menuStyles = ref<CSSProperties>({})

// Classes do trigger
const triggerClasses = computed(() => [
  // Base
  'inline-flex items-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 w-full justify-between',

  // Tamanhos (alinhados com BaseInput)
  {
    'px-3 py-2 text-sm rounded-material': props.size === 'sm',
    'px-4 py-3 text-base rounded-material-lg': props.size === 'md',
    'px-5 py-4 text-lg rounded-material-xl': props.size === 'lg'
  },

  // Variantes
  {
    // Default (with border like DatePicker)
    'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 focus:ring-primary-500 focus:border-primary-500': props.variant === 'default' && !props.disabled,

    // Ghost
    'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary-500': props.variant === 'ghost' && !props.disabled,

    // Outline
    'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 focus:ring-primary-500 focus:border-primary-500': props.variant === 'outline' && !props.disabled
  },

  // Estados
  {
    'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200': props.disabled && props.variant === 'default',
    'opacity-60 cursor-not-allowed': props.disabled && props.variant !== 'default'
  }
])

// Classes dos ícones
const iconClasses = computed(() => [
  {
    'w-3.5 h-3.5': props.size === 'sm',
    'w-4 h-4': props.size === 'md',
    'w-5 h-5': props.size === 'lg'
  },
  'text-gray-500'
])

// Classes do label
const labelClasses = computed(() => [
  'truncate',
  {
    'max-w-24': props.size === 'sm',
    'max-w-32': props.size === 'md',
    'max-w-40': props.size === 'lg'
  }
])

// Classes do menu
const menuClasses = computed(() => [
  'fixed z-[2000] bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',

  // Origem da animação
  {
    'origin-top-left': props.position === 'left',
    'origin-top-right': props.position === 'right',
    'origin-top': props.position === 'center'
  },

  // Larguras
  {
    'w-auto min-w-max': props.width === 'auto',
    'w-full': props.width === 'trigger',
    'w-48': props.width === 'sm',
    'w-56': props.width === 'md',
    'w-64': props.width === 'lg',
    'w-80': props.width === 'xl'
  }
])

// Métodos
const open = () => {
  if (props.disabled) return
  isOpen.value = true
  emit('open')
  emit('toggle', true)
}

const close = () => {
  isOpen.value = false
  emit('close')
  emit('toggle', false)
}

const toggle = () => {
  if (props.disabled) return
  isOpen.value ? close() : open()
}

const updateMenuPosition = () => {
  if (typeof window === 'undefined') return
  if (!isOpen.value) return

  const triggerEl = triggerRef.value
  const menuEl = menuRef.value

  if (!triggerEl || !menuEl) return

  const triggerRect = triggerEl.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const offset = 8

  const widthForCalc = props.width === 'trigger'
    ? triggerRect.width
    : menuEl.offsetWidth || triggerRect.width

  const styles: CSSProperties = {
    position: 'fixed',
    top: `${triggerRect.bottom + offset}px`
  }

  if (props.width === 'trigger') {
    styles.width = `${triggerRect.width}px`
  }

  let left = triggerRect.left

  if (props.position === 'center') {
    left = triggerRect.left + triggerRect.width / 2 - widthForCalc / 2
  } else if (props.position === 'right') {
    left = triggerRect.right - widthForCalc
  }

  const minLeft = 8
  const maxLeft = viewportWidth - widthForCalc - 8
  styles.left = `${Math.min(Math.max(left, minLeft), Math.max(maxLeft, minLeft))}px`

  menuStyles.value = styles
}

const handleViewportChange = () => {
  if (typeof window === 'undefined') return
  if (!isOpen.value) return
  updateMenuPosition()
}

watch(isOpen, async value => {
  if (value) {
    await nextTick()
    updateMenuPosition()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleViewportChange)
      window.addEventListener('scroll', handleViewportChange, true)
    }
  } else {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
    menuStyles.value = {}
  }
})

watch(
  () => [props.position, props.width],
  () => {
    if (!isOpen.value) return
    nextTick(updateMenuPosition)
  }
)

// Keyboard navigation
const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      toggle()
      break
    case 'Escape':
      if (isOpen.value) {
        close()
      }
      break
  }
}

// Click outside to close
const handleClickOutside = (event: Event) => {
  const target = event.target as Node

  if (dropdownRef.value?.contains(target) || menuRef.value?.contains(target)) return

  close()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleViewportChange)
    window.removeEventListener('scroll', handleViewportChange, true)
  }
})
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>
