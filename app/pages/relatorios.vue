<template>
  <div class="relatorios-page">
    <MainContainer offsetHeader>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-lg sm:text-xl font-bold text-gray-900">Relatórios</h1>
            <p class="text-xs sm:text-sm text-gray-600">Visualização de relatórios e análises</p>
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
  title: 'Relatórios | CSM Sistema',
  description: 'Visualização de relatórios e análises'
})
</script>

<style scoped>
.relatorios-page {
  @apply bg-gray-50;
}
</style>