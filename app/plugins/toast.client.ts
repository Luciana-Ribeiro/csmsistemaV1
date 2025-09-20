import { defineNuxtPlugin } from '#app'
import Toast, { POSITION } from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'

// Importar os estilos CSS padrão e customizados
import 'vue-toastification/dist/index.css'
import '~/assets/css/toast.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Configurações personalizadas para os toasts
  const options: PluginOptions = {
    // Posição dos toasts (mobile-first)
    position: POSITION.TOP_CENTER,
    
    // Timeout padrão
    timeout: 4000,
    
    // Permitir apenas 3 toasts simultâneos
    maxToasts: 3,
    
    // Remover ao clicar
    closeOnClick: true,
    
    // Pausar ao hover
    pauseOnHover: true,
    
    // Mostrar barra de progresso
    hideProgressBar: false,
    
    // Permitir arrastar para fechar
    draggable: true,
    
    // Classes CSS customizadas para Material Design
    toastClassName: 'custom-toast',
    bodyClassName: 'custom-toast-body',
    
    // Configurações responsivas
    containerClassName: 'toast-container-mobile',
  }

  // Registrar o plugin
  nuxtApp.vueApp.use(Toast, options)
})