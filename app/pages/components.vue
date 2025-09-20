<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white elevation-1 sticky top-0 z-sticky">
      <div class="mobile-padding sm:container sm:mx-auto py-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-black">
          Teste de Componentes
        </h1>
        <p class="text-gray-600 mt-2">
          Avaliação dos componentes BaseButton e BaseInput
        </p>
      </div>
    </div>

    <div class="mobile-padding sm:container sm:mx-auto py-8 space-y-12">
      <!-- Demonstração: MainContainer com header sticky e scroll local -->
      <section>
        <h2 class="text-xl sm:text-2xl font-bold text-black mb-4">MainContainer</h2>
        <p class="text-gray-600 mb-4">Container que limita o scroll à área principal abaixo do header.</p>
        <div class="rounded-material-xl elevation-2 border bg-white">
          <MainContainer>
            <template #header>
              <div class="px-4 sm:px-6">
                <h3 class="text-lg font-semibold text-gray-900">Cabeçalho do Container</h3>
                <p class="text-gray-600">Filtros, breadcrumbs e ações podem ficar aqui.</p>
              </div>
            </template>

            <div class="p-4 sm:p-6 space-y-4">
              <div v-for="n in 12" :key="n" class="p-4 border rounded-material-lg">
                Item de conteúdo {{ n }}
              </div>
            </div>
          </MainContainer>
        </div>
      </section>
      <!-- Seção BaseButton -->
      <section>
        <div class="bg-white rounded-material-xl elevation-2 p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-black mb-6 flex items-center">
            <div class="w-8 h-8 bg-primary-500 rounded-material mr-3"></div>
            BaseButton - Variantes
          </h2>

          <!-- Botões por tamanho -->
          <div class="space-y-8">
            <div v-for="size in sizes" :key="size" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 capitalize">
                Tamanho {{ size }}
              </h3>
              
              <div class="flex flex-wrap gap-3">
                <BaseButton
                  v-for="variant in buttonVariants"
                  :key="`${variant}-${size}`"
                  :variant="variant"
                  :size="size"
                  @click="handleButtonClick(variant, size)"
                >
                  {{ variant.charAt(0).toUpperCase() + variant.slice(1) }}
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Estados especiais -->
          <div class="mt-8 space-y-6">
            <h3 class="text-lg font-semibold text-gray-800">Estados Especiais</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Loading -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-600">Loading</h4>
                <BaseButton variant="primary" loading>
                  Carregando...
                </BaseButton>
              </div>

              <!-- Disabled -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-600">Disabled</h4>
                <BaseButton variant="primary" disabled>
                  Desabilitado
                </BaseButton>
              </div>

              <!-- Full Width -->
              <div class="space-y-3 sm:col-span-2">
                <h4 class="text-sm font-medium text-gray-600">Full Width</h4>
                <BaseButton variant="secondary" full-width>
                  Botão Full Width
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Com ícones -->
          <div class="mt-8 space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">Com Ícones</h3>
            
            <div class="flex flex-wrap gap-3">
              <BaseButton variant="primary" :icon-left="PlusIcon">
                Adicionar
              </BaseButton>
              <BaseButton variant="secondary" :icon-right="ArrowRightIcon">
                Continuar
              </BaseButton>
              <BaseButton variant="danger" :icon-left="TrashIcon">
                Deletar
              </BaseButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção BaseInput -->
      <section>
        <div class="bg-white rounded-material-xl elevation-2 p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-black mb-6 flex items-center">
            <div class="w-8 h-8 bg-secondary-500 rounded-material mr-3"></div>
            BaseInput - Variações
          </h2>

          <!-- Formulário de teste -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Inputs básicos -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BaseInput
                v-model="form.name"
                label="Nome Completo"
                placeholder="Digite seu nome"
                helper-text="Como você gostaria de ser chamado"
                required
              />
              
              <BaseInput
                v-model="form.email"
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                :error-message="emailError"
                required
              />
            </div>

            <!-- Senha e telefone -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BaseInput
                v-model="form.password"
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
                :error-message="passwordError"
                required
              />
              
              <BaseInput
                v-model="form.phone"
                type="tel"
                label="Telefone"
                placeholder="(11) 99999-9999"
                :icon-left="PhoneIcon"
              />
            </div>

            <!-- Diferentes tamanhos -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Tamanhos</h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <BaseInput
                  v-model="form.small"
                  size="sm"
                  label="Small"
                  placeholder="Input pequeno"
                />
                
                <BaseInput
                  v-model="form.medium"
                  size="md"
                  label="Medium"
                  placeholder="Input médio"
                />
                
                <BaseInput
                  v-model="form.large"
                  size="lg"
                  label="Large"
                  placeholder="Input grande"
                />
              </div>
            </div>

            <!-- Variantes -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Variantes</h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BaseInput
                  v-model="form.outline"
                  variant="outline"
                  label="Outline"
                  placeholder="Input com borda"
                  :icon-left="UserIcon"
                />
                
                <BaseInput
                  v-model="form.filled"
                  variant="filled"
                  label="Filled"
                  placeholder="Input preenchido"
                  :icon-right="SearchIcon"
                />
              </div>
            </div>

            <!-- Estados especiais -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Estados</h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BaseInput
                  model-value="Input desabilitado"
                  label="Desabilitado"
                  disabled
                />
                
                <BaseInput
                  model-value="Input readonly"
                  label="Readonly"
                  readonly
                />
              </div>
            </div>

            <!-- Input com limite de caracteres -->
            <BaseInput
              v-model="form.bio"
              label="Biografia"
              placeholder="Conte um pouco sobre você..."
              helper-text="Máximo 150 caracteres"
              :maxlength="150"
            />

            <!-- Botões do formulário -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4">
              <BaseButton type="submit" variant="primary" :loading="submitting">
                Enviar Formulário
              </BaseButton>
              
              <BaseButton type="button" variant="ghost" @click="resetForm">
                Limpar
              </BaseButton>
              
              <BaseButton type="button" variant="tertiary" @click="fillSampleData">
                Dados de Exemplo
              </BaseButton>
            </div>
          </form>
        </div>
      </section>

      <!-- Seção Toast/Notificações -->
      <section>
        <div class="bg-white rounded-material-xl elevation-2 p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-black mb-6 flex items-center">
            <div class="w-8 h-8 bg-warning-500 rounded-material mr-3"></div>
            Toasts e Notificações
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Toast Sucesso -->
            <BaseButton 
              variant="primary" 
              :icon-left="CheckCircleIcon"
              @click="showToast('success')"
            >
              Sucesso
            </BaseButton>

            <!-- Toast Erro -->
            <BaseButton 
              variant="danger" 
              :icon-left="XCircleIcon"
              @click="showToast('error')"
            >
              Erro
            </BaseButton>

            <!-- Toast Aviso -->
            <BaseButton 
              variant="secondary" 
              :icon-left="ExclamationTriangleIcon"
              @click="showToast('warning')"
            >
              Aviso
            </BaseButton>

            <!-- Toast Info -->
            <BaseButton 
              variant="tertiary" 
              :icon-left="InformationCircleIcon"
              @click="showToast('info')"
            >
              Informação
            </BaseButton>
          </div>

          <!-- Toasts personalizados -->
          <div class="mt-6 space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">Toasts Personalizados</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseButton 
                variant="ghost" 
                @click="showCustomToast"
                full-width
              >
                Toast com Ação
              </BaseButton>
              
              <BaseButton 
                variant="ghost" 
                @click="showPersistentToast"
                full-width
              >
                Toast Persistente
              </BaseButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Feedback das ações -->
      <section v-if="lastAction" class="bg-white rounded-material-xl elevation-2 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Última Ação</h3>
        <div class="bg-info-50 border border-info-200 rounded-material p-4">
          <p class="text-info-800">{{ lastAction }}</p>
        </div>
      </section>

      <!-- Dados do formulário -->
      <section class="bg-white rounded-material-xl elevation-2 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Estado do Formulário</h3>
        <pre class="bg-gray-100 rounded-material p-4 text-sm overflow-x-auto">{{ JSON.stringify(form, null, 2) }}</pre>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
// Importar ícones do Heroicons
import {
  PlusIcon,
  ArrowRightIcon,
  TrashIcon,
  UserIcon,
  MagnifyingGlassIcon as SearchIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

// Definição da página
definePageMeta({
  title: 'Teste de Componentes',
  description: 'Página para testar os componentes BaseButton e BaseInput'
})

// Toast composable
const toast = useToast()

// Estados
const buttonVariants = ['primary', 'secondary', 'tertiary', 'ghost', 'danger'] as const
const sizes = ['sm', 'md', 'lg'] as const
const submitting = ref(false)
const lastAction = ref('')

// Formulário
const form = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  small: '',
  medium: '',
  large: '',
  outline: '',
  filled: '',
  bio: ''
})

// Validações
const emailError = computed(() => {
  if (!form.value.email) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !emailRegex.test(form.value.email) ? 'E-mail inválido' : ''
})

const passwordError = computed(() => {
  if (!form.value.password) return ''
  return form.value.password.length < 6 ? 'Senha deve ter pelo menos 6 caracteres' : ''
})

// Handlers
const handleButtonClick = (variant: string, size: string) => {
  lastAction.value = `Clicou no botão ${variant} tamanho ${size}`
  
  // Mostrar toast baseado no variant
  const message = `Botão ${variant} (${size}) clicado!`
  
  switch (variant) {
    case 'primary':
      toast.success(message, {
        icon: CheckCircleIcon
      })
      break
    case 'secondary':
      toast.info(message, {
        icon: InformationCircleIcon
      })
      break
    case 'danger':
      toast.error(message, {
        icon: XCircleIcon
      })
      break
    case 'tertiary':
    case 'ghost':
      toast(message, {
        icon: InformationCircleIcon
      })
      break
  }
}

const handleSubmit = async () => {
  submitting.value = true
  lastAction.value = 'Enviando formulário...'
  
  // Toast de loading
  toast.info('Enviando formulário...', {
    timeout: 2000
  })
  
  // Simular envio
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  submitting.value = false
  lastAction.value = 'Formulário enviado com sucesso!'
  
  // Toast de sucesso
  toast.success('Formulário enviado com sucesso!', {
    icon: CheckCircleIcon
  })
}

const resetForm = () => {
  Object.keys(form.value).forEach(key => {
    (form.value as any)[key] = ''
  })
  lastAction.value = 'Formulário limpo'
  
  // Toast informativo
  toast('Formulário limpo', {
    icon: InformationCircleIcon
  })
}

const fillSampleData = () => {
  form.value = {
    name: 'João Silva',
    email: 'joao@exemplo.com',
    password: '123456',
    phone: '(11) 99999-9999',
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande',
    outline: 'Outline input',
    filled: 'Filled input',
    bio: 'Desenvolvedor apaixonado por tecnologia e design.'
  }
  lastAction.value = 'Dados de exemplo preenchidos'
  
  // Toast informativo
  toast.success('Dados de exemplo preenchidos!', {
    icon: CheckCircleIcon
  })
}

// Funções para testar toasts
const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
  const messages = {
    success: 'Operação realizada com sucesso!',
    error: 'Erro ao realizar a operação',
    warning: 'Atenção: verifique os dados',
    info: 'Informação importante para o usuário'
  }

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }

  toast[type](messages[type], {
    icon: icons[type]
  })
}

const showCustomToast = () => {
  toast('Clique no botão para executar ação', {
    timeout: 10000,
    closeButton: 'button',
    icon: InformationCircleIcon,
    onClick: () => {
      toast.success('Ação executada!', {
        icon: CheckCircleIcon
      })
    }
  })
}

const showPersistentToast = () => {
  toast.warning('Este toast não desaparece automaticamente', {
    timeout: false,
    closeButton: 'button',
    icon: ExclamationTriangleIcon
  })
}
</script>
