<template>
  <div class="date-picker-wrapper relative" ref="datePickerRef">
    <!-- Input Field -->
    <div class="relative">
      <input
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @click="togglePicker"
        @focus="togglePicker"
        readonly
      />
      
      <!-- Calendar Icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <CalendarIcon class="w-5 h-5 text-gray-400" />
      </div>
    </div>

    <!-- Date Picker Dropdown -->
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
        class="absolute z-50 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="dropdownPositionClass"
      >
        <div class="p-4">
          <!-- Month/Year Navigation -->
          <div class="flex items-center justify-between mb-4">
            <button
              type="button"
              @click="previousMonth"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </button>
            
            <div class="flex items-center space-x-2">
              <select
                v-model="currentMonth"
                class="text-sm font-medium text-gray-900 bg-transparent border-0 focus:ring-0"
              >
                <option v-for="(month, index) in monthNames" :key="index" :value="index">
                  {{ month }}
                </option>
              </select>
              
              <select
                v-model="currentYear"
                class="text-sm font-medium text-gray-900 bg-transparent border-0 focus:ring-0"
              >
                <option v-for="year in yearRange" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
            
            <button
              type="button"
              @click="nextMonth"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Days of Week Header -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in dayNames"
              :key="day"
              class="text-xs font-medium text-gray-500 text-center py-2"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="day in calendarDays"
              :key="`${day.date}-${day.isCurrentMonth}`"
              type="button"
              @click="selectDate(day)"
              :disabled="!day.isCurrentMonth || isDateDisabled(day.date)"
              :class="getDayClasses(day)"
              class="h-8 w-8 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {{ day.day }}
            </button>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              @click="selectToday"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Hoje
            </button>
            
            <div class="flex space-x-2">
              <button
                type="button"
                @click="clearDate"
                class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpar
              </button>
              <button
                type="button"
                @click="closePicker"
                class="px-3 py-1 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

export interface DatePickerProps {
  modelValue?: Date | string | null
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outline'
  position?: 'left' | 'right' | 'center'
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  format?: string
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  placeholder: 'Selecione uma data',
  disabled: false,
  size: 'md',
  variant: 'default',
  position: 'left',
  format: 'dd/MM/yyyy'
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  'change': [value: Date | null]
}>()

// Estado reativo
const isOpen = ref(false)
const datePickerRef = ref<HTMLElement>()
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Constantes
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Computed properties
const selectedDate = computed(() => {
  if (!props.modelValue) return null
  return props.modelValue instanceof Date ? props.modelValue : new Date(props.modelValue)
})

const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  return formatDate(selectedDate.value)
})

const inputClasses = computed(() => [
  // Base classes
  'w-full px-3 py-2 text-sm border rounded-md transition-colors focus:outline-none focus:ring-2',
  
  // Size variations
  {
    'px-2 py-1.5 text-xs': props.size === 'sm',
    'px-3 py-2 text-sm': props.size === 'md',
    'px-4 py-2.5 text-base': props.size === 'lg'
  },
  
  // Variant styles
  {
    'border-gray-300 bg-white focus:ring-primary-500 focus:border-primary-500': props.variant === 'default' && !props.disabled,
    'border-0 bg-gray-100 focus:ring-primary-500 focus:bg-white': props.variant === 'filled' && !props.disabled,
    'border-2 border-gray-300 bg-transparent focus:ring-primary-500 focus:border-primary-500': props.variant === 'outline' && !props.disabled
  },
  
  // Disabled state
  {
    'bg-gray-50 text-gray-500 cursor-not-allowed': props.disabled
  }
])

const dropdownPositionClass = computed(() => {
  switch (props.position) {
    case 'right':
      return 'right-0 origin-top-right'
    case 'center':
      return 'left-1/2 transform -translate-x-1/2 origin-top'
    default:
      return 'left-0 origin-top-left'
  }
})

const yearRange = computed(() => {
  const currentYear = new Date().getFullYear()
  const start = currentYear - 50
  const end = currentYear + 50
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const currentDate = new Date(startDate)
  
  // Gerar 42 dias (6 semanas)
  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(currentDate),
      day: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === currentMonth.value,
      isToday: isToday(currentDate),
      isSelected: selectedDate.value && isSameDay(currentDate, selectedDate.value)
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return days
})

// Métodos
const togglePicker = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const closePicker = () => {
  isOpen.value = false
}

const selectDate = (day: any) => {
  if (!day.isCurrentMonth || isDateDisabled(day.date)) return
  
  const newDate = new Date(day.date)
  emit('update:modelValue', newDate)
  emit('change', newDate)
  closePicker()
}

const selectToday = () => {
  const today = new Date()
  emit('update:modelValue', today)
  emit('change', today)
  closePicker()
}

const clearDate = () => {
  emit('update:modelValue', null)
  emit('change', null)
  closePicker()
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const isToday = (date: Date): boolean => {
  const today = new Date()
  return isSameDay(date, today)
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

const isDateDisabled = (date: Date): boolean => {
  if (props.minDate && date < props.minDate) return true
  if (props.maxDate && date > props.maxDate) return true
  if (props.disabledDates?.some(disabledDate => isSameDay(date, disabledDate))) return true
  return false
}

const getDayClasses = (day: any) => {
  return [
    // Base styles
    'flex items-center justify-center',
    
    // Current month vs other months
    {
      'text-gray-900 hover:bg-gray-100': day.isCurrentMonth && !day.isSelected,
      'text-gray-400': !day.isCurrentMonth
    },
    
    // Today highlight
    {
      'font-semibold text-primary-600': day.isToday && !day.isSelected
    },
    
    // Selected state
    {
      'bg-primary-600 text-white hover:bg-primary-700': day.isSelected
    },
    
    // Disabled state
    {
      'opacity-50 cursor-not-allowed': !day.isCurrentMonth || isDateDisabled(day.date)
    }
  ]
}

// Click outside handler
const handleClickOutside = (event: Event) => {
  if (datePickerRef.value && !datePickerRef.value.contains(event.target as Node)) {
    closePicker()
  }
}

// Keyboard handler
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closePicker()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

// Watch for changes in selected date to update current month/year
watch(selectedDate, (newDate) => {
  if (newDate) {
    currentMonth.value = newDate.getMonth()
    currentYear.value = newDate.getFullYear()
  }
}, { immediate: true })
</script>

<style scoped>
/* Remove browser default date picker styles */
input[type="text"]::-webkit-calendar-picker-indicator {
  display: none;
}

/* Custom scrollbar for dropdowns */
select::-webkit-scrollbar {
  width: 4px;
}

select::-webkit-scrollbar-track {
  background: #f1f1f1;
}

select::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

select::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>