<template>
  <form @submit.prevent="handleSubmit" :class="formClasses">
    <!-- Título do Formulário -->
    <div v-if="title || subtitle" class="mb-6">
      <h2 v-if="title" :class="titleClasses">{{ title }}</h2>
      <p v-if="subtitle" :class="subtitleClasses">{{ subtitle }}</p>
    </div>

    <!-- Campos do Formulário -->
    <div :class="fieldsContainerClasses">
      <slot name="default" :form="form" :errors="errors" :isSubmitting="isSubmitting">
        <!-- Conteúdo padrão se nenhum slot for fornecido -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <BaseInput
              v-model="form.name"
              placeholder="Digite seu nome completo"
              :error="errors.name"
              :disabled="isSubmitting"
              size="md"
              variant="outline"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              E-mail *
            </label>
            <BaseInput
              v-model="form.email"
              type="email"
              placeholder="Digite seu e-mail"
              :error="errors.email"
              :disabled="isSubmitting"
              size="md"
              variant="outline"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <BaseInput
              v-model="form.phone"
              type="tel"
              placeholder="(11) 99999-9999"
              :error="errors.phone"
              :disabled="isSubmitting"
              size="md"
              variant="outline"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mensagem
            </label>
            <textarea
              v-model="form.message"
              rows="4"
              :class="textareaClasses"
              :disabled="isSubmitting"
              placeholder="Digite sua mensagem..."
            />
            <p v-if="errors.message" class="text-red-500 text-sm mt-1">
              {{ errors.message }}
            </p>
          </div>
        </div>
      </slot>
    </div>

    <!-- Ações do Formulário -->
    <div :class="actionsClasses">
      <slot name="actions" :isSubmitting="isSubmitting" :reset="resetForm">
        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <BaseButton
            v-if="showResetButton"
            variant="ghost"
            size="md"
            type="button"
            :disabled="isSubmitting"
            @click="resetForm"
          >
            {{ resetButtonText }}
          </BaseButton>
          
          <BaseButton
            :variant="submitButtonVariant"
            size="md"
            type="submit"
            :disabled="isSubmitting || !isValid"
            :loading="isSubmitting"
          >
            {{ isSubmitting ? loadingText : submitButtonText }}
          </BaseButton>
        </div>
      </slot>
    </div>

    <!-- Mensagem de Status -->
    <div v-if="statusMessage" :class="statusMessageClasses">
      <div class="flex items-center">
        <component :is="statusIcon" class="w-5 h-5 mr-2" />
        {{ statusMessage }}
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

// Props
interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'card' | 'modal' | 'inline'
  size?: 'sm' | 'md' | 'lg'
  columns?: 1 | 2 | 3
  showResetButton?: boolean
  submitButtonText?: string
  resetButtonText?: string
  loadingText?: string
  submitButtonVariant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'
  autoValidate?: boolean
  initialData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  columns: 1,
  showResetButton: true,
  submitButtonText: 'Enviar',
  resetButtonText: 'Limpar',
  loadingText: 'Enviando...',
  submitButtonVariant: 'primary',
  autoValidate: true,
  initialData: () => ({})
})

// Emits
interface Emits {
  submit: [data: Record<string, any>]
  reset: []
  change: [data: Record<string, any>]
}

const emit = defineEmits<Emits>()

// Estado interno
const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | null>(null)

// Formulário padrão
const defaultForm = {
  name: '',
  email: '',
  phone: '',
  message: ''
}

const form = ref({ ...defaultForm, ...props.initialData })
const errors = ref<Record<string, string>>({})

// Validações
const validateField = (field: string, value: any): string => {
  switch (field) {
    case 'name':
      if (!value?.trim()) return 'Nome é obrigatório'
      if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres'
      return ''
    
    case 'email':
      if (!value?.trim()) return 'E-mail é obrigatório'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return 'E-mail inválido'
      return ''
    
    case 'phone':
      if (value && value.length > 0) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
        if (!phoneRegex.test(value)) return 'Formato: (11) 99999-9999'
      }
      return ''
    
    case 'message':
      if (value && value.length > 500) return 'Mensagem muito longa (máx. 500 caracteres)'
      return ''
    
    default:
      return ''
  }
}

const validateForm = () => {
  const newErrors: Record<string, string> = {}
  
  Object.keys(form.value).forEach(field => {
    const error = validateField(field, form.value[field])
    if (error) newErrors[field] = error
  })
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Computeds
const isValid = computed(() => {
  if (!props.autoValidate) return true
  return Object.keys(errors.value).length === 0 && 
         form.value.name?.trim() && 
         form.value.email?.trim()
})

const formClasses = computed(() => [
  'w-full',
  {
    // Variantes
    'bg-white rounded-material-xl elevation-2 p-6': props.variant === 'card',
    'bg-white rounded-material-lg p-4': props.variant === 'modal',
    'space-y-4': props.variant === 'inline',
    'bg-white rounded-material-xl elevation-1 p-8': props.variant === 'default',
    
    // Tamanhos
    'max-w-md': props.size === 'sm',
    'max-w-2xl': props.size === 'md',
    'max-w-4xl': props.size === 'lg'
  }
])

const titleClasses = computed(() => [
  {
    'text-lg font-semibold text-gray-900': props.size === 'sm',
    'text-xl font-semibold text-gray-900': props.size === 'md',
    'text-2xl font-bold text-gray-900': props.size === 'lg'
  }
])

const subtitleClasses = computed(() => [
  'text-gray-600 mt-1',
  {
    'text-sm': props.size === 'sm',
    'text-base': props.size === 'md' || props.size === 'lg'
  }
])

const fieldsContainerClasses = computed(() => [
  {
    'grid gap-4': props.columns > 1,
    'grid-cols-2': props.columns === 2,
    'grid-cols-3': props.columns === 3,
    'space-y-4': props.columns === 1
  }
])

const actionsClasses = computed(() => [
  'mt-6',
  {
    'pt-4 border-t border-gray-200': props.variant === 'card' || props.variant === 'default'
  }
])

const textareaClasses = computed(() => [
  'w-full px-3 py-2 border border-gray-300 rounded-material text-gray-900 placeholder-gray-500',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
  'resize-none transition-colors duration-200',
  errors.value.message ? 'border-red-300 focus:ring-red-500' : ''
])

const statusMessageClasses = computed(() => [
  'mt-4 p-3 rounded-material text-sm font-medium',
  {
    'bg-green-50 text-green-700 border border-green-200': statusType.value === 'success',
    'bg-red-50 text-red-700 border border-red-200': statusType.value === 'error'
  }
])

const statusIcon = computed(() => {
  return statusType.value === 'success' ? CheckCircleIcon : ExclamationCircleIcon
})

// Métodos
const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  statusMessage.value = ''
  statusType.value = null
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular request
    
    emit('submit', { ...form.value })
    
    statusMessage.value = 'Formulário enviado com sucesso!'
    statusType.value = 'success'
    
    // Limpar formulário após sucesso (opcional)
    setTimeout(() => {
      statusMessage.value = ''
      statusType.value = null
    }, 3000)
    
  } catch (error) {
    statusMessage.value = 'Erro ao enviar formulário. Tente novamente.'
    statusType.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = { ...defaultForm, ...props.initialData }
  errors.value = {}
  statusMessage.value = ''
  statusType.value = null
  emit('reset')
}

// Watchers para validação em tempo real
watch(form, (newForm) => {
  if (props.autoValidate) {
    Object.keys(newForm).forEach(field => {
      const error = validateField(field, newForm[field])
      if (error) {
        errors.value[field] = error
      } else {
        delete errors.value[field]
      }
    })
  }
  emit('change', { ...newForm })
}, { deep: true })

// Formatação automática do telefone
watch(() => form.value.phone, (newPhone) => {
  if (newPhone) {
    // Remove tudo que não é número
    const numbers = newPhone.replace(/\D/g, '')
    
    // Aplica máscara
    if (numbers.length <= 11) {
      const formatted = numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
      if (formatted !== newPhone) {
        form.value.phone = formatted
      }
    }
  }
})
</script>