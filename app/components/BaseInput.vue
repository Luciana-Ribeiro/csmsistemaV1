<template>
  <div class="relative">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>

    <!-- Input container -->
    <div class="relative">
      <!-- Icon left -->
      <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="iconLeft" :class="iconClasses" />
      </div>

      <!-- Input field -->
      <input
        :id="inputId"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Icon right / Toggle password -->
      <div v-if="iconRight || type === 'password'" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <!-- Password toggle -->
        <button
          v-if="type === 'password'"
          type="button"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
          @click="togglePasswordVisibility"
        >
          <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m0 0l3.122 3.122M12 12l-3.122-3.122m0 0L3 3m6.878 6.878L12 12"></path>
          </svg>
        </button>
        
        <!-- Custom right icon -->
        <component
          v-else-if="iconRight"
          :is="iconRight"
          :class="iconClasses"
        />
      </div>
    </div>

    <!-- Helper text / Error message -->
    <div v-if="helperText || errorMessage" class="mt-2 text-sm">
      <p v-if="errorMessage" class="text-error-500 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        {{ errorMessage }}
      </p>
      <p v-else-if="helperText" class="text-gray-500">
        {{ helperText }}
      </p>
    </div>

    <!-- Character counter -->
    <div v-if="maxlength" class="mt-1 text-right text-xs text-gray-500">
      {{ modelValue?.length || 0 }} / {{ maxlength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface InputProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'filled'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  maxlength?: number
  autocomplete?: string
  iconLeft?: any
  iconRight?: any
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'md',
  variant: 'filled',
  disabled: false,
  readonly: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// Estado interno
const showPassword = ref(false)
const isFocused = ref(false)
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

// Tipo do input (com toggle de password)
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

// Classes do label
const labelSizeClasses = {
  sm: 'text-xs mb-1.5',
  md: 'text-sm mb-2',
  lg: 'text-base mb-2.5'
}

const labelClasses = computed(() => [
  'block font-medium',
  labelSizeClasses[props.size],
  {
    'text-gray-900': !props.errorMessage,
    'text-error-500': props.errorMessage,
    'opacity-60': props.disabled
  }
])

// Classes base do input
const baseInputClasses = [
  'w-full transition-all duration-material',
  'focus:outline-none focus:ring-2 focus:ring-offset-1',
  'disabled:opacity-60 disabled:cursor-not-allowed',
  'placeholder:text-gray-500'
]

// Classes por variante
const variantClasses = {
  outline: [
    'border-2 bg-white',
    'focus:ring-primary-300',
    {
      'border-gray-300 hover:border-gray-400': !props.errorMessage && !isFocused.value,
      'border-primary-500': isFocused.value && !props.errorMessage,
      'border-error-500 focus:ring-error-300': props.errorMessage,
      'disabled:border-gray-200 disabled:bg-gray-50': props.disabled
    }
  ],
  filled: [
    'border-0 bg-white',
    'hover:bg-white focus:bg-white focus:ring-primary-300',
    {
      'focus:ring-error-300': props.errorMessage,
      'disabled:bg-gray-50': props.disabled
    }
  ]
}

// Classes por tamanho
const sizeClasses = {
  sm: ['px-3 py-2 text-sm rounded-material'],
  md: ['px-4 py-3 text-base rounded-material-lg'],
  lg: ['px-5 py-4 text-lg rounded-material-xl']
}

// Ajustes para ícones
const paddingWithIcons = computed(() => {
  const sizes = {
    sm: { left: 'pl-10', right: 'pr-10' },
    md: { left: 'pl-12', right: 'pr-12' },
    lg: { left: 'pl-14', right: 'pr-14' }
  }
  
  return {
    'pl-10 sm:pl-12 lg:pl-14': props.iconLeft,
    'pr-10 sm:pr-12 lg:pr-14': props.iconRight || props.type === 'password'
  }
})

// Classes computadas do input
const inputClasses = computed(() => [
  ...baseInputClasses,
  ...variantClasses[props.variant],
  ...sizeClasses[props.size],
  paddingWithIcons.value
])

// Classes dos ícones
const iconClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  return [
    sizes[props.size],
    {
      'text-gray-400': !props.errorMessage,
      'text-error-500': props.errorMessage
    }
  ]
})

// Handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>
