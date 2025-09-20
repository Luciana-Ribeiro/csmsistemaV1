<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <div v-if="loading" class="mr-2 animate-spin">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
    </div>

    <!-- Icon left -->
    <component 
      v-if="iconLeft && !loading" 
      :is="iconLeft" 
      :class="iconClasses"
    />

    <!-- Content slot -->
    <span v-if="$slots.default" :class="{ 'mx-2': iconLeft || iconRight }">
      <slot />
    </span>

    <!-- Icon right -->
    <component 
      v-if="iconRight && !loading" 
      :is="iconRight" 
      :class="iconClasses"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  iconLeft?: any
  iconRight?: any
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Classes base do botão com Material Design
const baseClasses = [
  'inline-flex items-center justify-center font-medium',
  'transition-all duration-material',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'material-ripple relative overflow-hidden',
  'disabled:opacity-60 disabled:cursor-not-allowed',
  'active:scale-95 transform'
]

// Classes por variante
const variantClasses = {
  primary: [
    'bg-primary-500 text-white',
    'hover:bg-primary-600 focus:ring-primary-300',
    'shadow-md hover:shadow-lg',
    'disabled:bg-primary-300'
  ],
  secondary: [
    'bg-secondary-500 text-white',
    'hover:bg-secondary-600 focus:ring-secondary-300',
    'shadow-md hover:shadow-lg',
    'disabled:bg-secondary-300'
  ],
  tertiary: [
    'bg-white text-primary-500 border-2 border-primary-500',
    'hover:bg-primary-50 hover:border-primary-600 focus:ring-primary-300',
    'shadow hover:shadow-md',
    'disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-300'
  ],
  ghost: [
    'bg-transparent text-primary-500',
    'hover:bg-primary-50 focus:ring-primary-300',
    'hover:shadow',
    'disabled:text-gray-400 disabled:bg-transparent'
  ],
  danger: [
    'bg-error-500 text-white',
    'hover:bg-error-600 focus:ring-error-300',
    'shadow-md hover:shadow-lg',
    'disabled:bg-error-300'
  ],
  success: [
    'bg-success-500 text-white',
    'hover:bg-success-600 focus:ring-success-300',
    'shadow-md hover:shadow-lg',
    'disabled:bg-success-300'
  ],
  warning: [
    'bg-warning-500 text-gray-900',
    'hover:bg-warning-600 focus:ring-warning-300',
    'shadow-md hover:shadow-lg',
    'disabled:bg-warning-300'
  ]
}

// Classes por tamanho com bordas arredondadas Material Design
const sizeClasses = {
  sm: ['px-3 py-2 text-sm rounded-material'],
  md: ['px-4 py-3 text-base rounded-material-md'],
  lg: ['px-6 py-4 text-lg rounded-material-lg']
}

// Classes computadas do botão
const buttonClasses = computed(() => [
  ...baseClasses,
  ...variantClasses[props.variant],
  ...sizeClasses[props.size],
  {
    'w-full': props.fullWidth,
    'opacity-75 cursor-wait': props.loading
  }
])

// Classes dos ícones
const iconClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  return sizes[props.size]
})

// Handler do click
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Estilo adicional para ripple effect mais suave */
.material-ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.material-ripple:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 1;
  }
  20% {
    transform: scale(25, 25);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}
</style>