<template>
  <div class="bg-white rounded-material-xl elevation-2 max-w-4xl mx-auto">
    <!-- Header do Formulário -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Cadastrar Nota de Serviço</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Formulário -->
    <form @submit.prevent="handleSubmit" class="p-6">
      <div class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">N° da NS *</label>
            <BaseInput
              v-model="form.numeroNS"
              placeholder="Digite o número da NS"
              :error="errors.numeroNS"
              :disabled="isSubmitting"
              variant="outline"
              size="sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Data de Recebimento *</label>
            <BaseInput
              v-model="form.dataRecebimento"
              type="date"
              :error="errors.dataRecebimento"
              :disabled="isSubmitting"
              variant="outline"
              size="sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Compromisso da Obra</label>
            <BaseInput
              v-model="form.compromissoObra"
              type="date"
              :disabled="isSubmitting"
              variant="outline"
              size="sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Programação (desligamento)</label>
            <BaseInput
              v-model="form.programacaoDesligamento"
              type="date"
              :disabled="isSubmitting"
              variant="outline"
              size="sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Status *</label>
            <MenuDropdownGeral
              v-model="form.status"
              :options="statusOptions"
              placeholder="A programar"
              :error="errors.status"
              :disabled="isSubmitting"
              size="sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">US Programada</label>
            <BaseInput
              v-model="form.usProgramada"
              type="number"
              step="0.01"
              placeholder="0,00"
              :error="errors.usProgramada"
              :disabled="isSubmitting"
              variant="outline"
              size="sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Localidade *</label>
            <BaseInput
              v-model="form.localidade"
              placeholder="Rua, n° — Bairro — Cidade/UF"
              :error="errors.localidade"
              :disabled="isSubmitting"
              variant="outline"
              size="sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Base *</label>
            <MenuDropdownGeral
              v-model="form.base"
              :options="baseOptions"
              placeholder="Sete Lagoas"
              :error="errors.base"
              :disabled="isSubmitting"
              size="sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Técnico da Obra *</label>
            <MenuDropdownGeral
              v-model="form.tecnicoObra"
              :options="tecnicoOptions"
              placeholder="Selecione o técnico"
              :error="errors.tecnicoObra"
              :disabled="isSubmitting"
              size="sm"
            />
          </div>
          <BaseButton
            type="button"
            variant="primary"
            size="sm"
            :icon-left="PlusIcon"
            class="self-start md:self-end"
            :disabled="isSubmitting"
            @click="openNovoTecnicoModal"
          >
            Novo
          </BaseButton>
        </div>
      </div>

      <!-- Ações do Formulário -->
      <div class="flex flex-col sm:flex-row gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
        <BaseButton
          variant="ghost"
          size="sm"
          type="button"
          :disabled="isSubmitting"
          @click="$emit('cancel')"
        >
          Cancelar
        </BaseButton>
        
        <BaseButton
          variant="primary"
          size="sm"
          type="submit"
          :disabled="isSubmitting"
          :loading="isSubmitting"
        >
          {{ isSubmitting ? 'Criando...' : 'Criar' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import MenuDropdownGeral from './MenuDropdownGeral.vue'

// Props
interface Props {
  initialData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({})
})

// Emits
interface Emits {
  submit: [data: FormData]
  cancel: []
  close: []
  novoTecnico: []
}

const emit = defineEmits<Emits>()

// Tipos
interface FormData {
  numeroNS: string
  dataRecebimento: string
  compromissoObra: string
  programacaoDesligamento: string
  usProgramada: string
  status: string
  base: string
  localidade: string
  tecnicoObra: string
}

// Estado do formulário
const isSubmitting = ref(false)

const form = ref<FormData>({
  numeroNS: '',
  dataRecebimento: '',
  compromissoObra: '',
  programacaoDesligamento: '',
  usProgramada: '',
  status: '',
  base: '',
  localidade: '',
  tecnicoObra: '',
  ...props.initialData
})

const errors = ref<Record<string, string>>({})

// Opções dos dropdowns
const statusOptions = [
  { value: 'a-programar', label: 'A programar' },
  { value: 'programado', label: 'Programado' },
  { value: 'executando', label: 'Executando' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' }
]

const baseOptions = [
  { value: 'sete-lagoas', label: 'Sete Lagoas' },
  { value: 'belo-horizonte', label: 'Belo Horizonte' },
  { value: 'contagem', label: 'Contagem' },
  { value: 'betim', label: 'Betim' },
  { value: 'ibirite', label: 'Ibirité' }
]

const tecnicoOptions = [
  { value: 'joao-silva', label: 'João Silva' },
  { value: 'maria-santos', label: 'Maria Santos' },
  { value: 'pedro-oliveira', label: 'Pedro Oliveira' },
  { value: 'ana-costa', label: 'Ana Costa' },
  { value: 'carlos-ferreira', label: 'Carlos Ferreira' }
]

// Validações
const validateField = (field: string, value: any): string => {
  switch (field) {
    case 'numeroNS':
      if (!value?.trim()) return 'N° da NS é obrigatório'
      return ''
    
    case 'dataRecebimento':
      if (!value?.trim()) return 'Data de recebimento é obrigatória'
      return ''
    
    case 'status':
      if (!value) return 'Status é obrigatório'
      return ''
    
    case 'base':
      if (!value) return 'Base é obrigatória'
      return ''
    
    case 'localidade':
      if (!value?.trim()) return 'Localidade é obrigatória'
      return ''
    
    case 'tecnicoObra':
      if (!value) return 'Técnico da obra é obrigatório'
      return ''
    
    case 'usProgramada':
      if (value && isNaN(parseFloat(value))) return 'Valor deve ser numérico'
      return ''
    
    default:
      return ''
  }
}

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}
  
  // Campos obrigatórios
  const requiredFields = ['numeroNS', 'dataRecebimento', 'status', 'base', 'localidade', 'tecnicoObra']
  
  requiredFields.forEach(field => {
    const error = validateField(field, form.value[field as keyof FormData])
    if (error) newErrors[field] = error
  })
  
  // Validar campos opcionais se preenchidos
  const optionalFields = ['usProgramada']
  optionalFields.forEach(field => {
    if (form.value[field as keyof FormData]) {
      const error = validateField(field, form.value[field as keyof FormData])
      if (error) newErrors[field] = error
    }
  })
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Computed
const isFormValid = computed(() => {
  return form.value.numeroNS?.trim() &&
         form.value.dataRecebimento?.trim() &&
         form.value.status &&
         form.value.base &&
         form.value.localidade?.trim() &&
         form.value.tecnicoObra &&
         Object.keys(errors.value).length === 0
})

// Métodos
const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('submit', { ...form.value })
  } catch (error) {
    console.error('Erro ao enviar formulário:', error)
  } finally {
    isSubmitting.value = false
  }
}

const openNovoTecnicoModal = () => {
  emit('novoTecnico')
}

// Watchers para validação em tempo real
watch(form, (newForm) => {
  // Limpar erros quando campos forem corrigidos
  Object.keys(newForm).forEach(field => {
    if (errors.value[field] && newForm[field as keyof FormData]) {
      const error = validateField(field, newForm[field as keyof FormData])
      if (!error) {
        delete errors.value[field]
      }
    }
  })
}, { deep: true })

// Definir data padrão de recebimento como hoje
if (!form.value.dataRecebimento) {
  form.value.dataRecebimento = new Date().toISOString().split('T')[0]
}
</script>
