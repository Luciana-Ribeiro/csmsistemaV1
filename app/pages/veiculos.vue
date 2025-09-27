<template>
  <div class="veiculos-page">
    <MainContainer offsetHeader>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-lg sm:text-xl font-bold text-gray-900">Veículos</h1>
            <p class="text-xs sm:text-sm text-gray-600">Controle de frota e veículos</p>
          </div>
        </div>
      </template>

      <div class="p-4 sm:p-6">
        <!-- Conteúdo da página será adicionado aqui -->
      </div>
    </MainContainer>
  </div>
</template>

<script setup lang="ts">
// Meta dados da página
useSeoMeta({
  title: 'Veículos | CSM Sistema',
  description: 'Controle de frota e veículos'
})
</script>

<style scoped>
.veiculos-page {
  @apply bg-gray-50;
}
</style>