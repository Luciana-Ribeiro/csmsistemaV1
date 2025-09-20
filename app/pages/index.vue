<template>
  <div class="dashboard-page">
    <MainContainer offsetHeader>
      <template #header>
        <div class="max-w-6xl mx-auto px-2 sm:px-4 py-2">
          <h2 class="text-2xl font-bold text-gray-900">Painel Principal</h2>
          <p class="text-gray-600">Header fixo implementado com sucesso!</p>
        </div>
      </template>

      <div class="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div v-for="i in 20" :key="i" class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Card de Teste {{ i }}</h3>
          <p class="text-gray-600">HeaderGlobal está FIXO no topo. Faça scroll para verificar que ele permanece visível.</p>
          <div class="mt-4 flex gap-3">
            <button class="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">Ação 1</button>
            <button class="px-4 py-2 bg-secondary-500 text-white rounded hover:bg-secondary-600 transition-colors">Ação 2</button>
          </div>
        </div>
      </div>
    </MainContainer>
  </div>
</template>

<script setup lang="ts">
// Meta dados da página
useSeoMeta({
  title: 'Dashboard | CSM Sistema',
  description: 'Painel principal do CSM Sistema'
})
</script>

<style scoped>
.dashboard-page {
  @apply bg-gray-50;
}
</style>
