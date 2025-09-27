<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white elevation-1 sticky top-0 z-sticky">
      <div class="mobile-padding sm:container sm:mx-auto py-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-black">
          Teste de Componentes
        </h1>
        <p class="text-gray-600 mt-2">
          Avaliação dos componentes BaseButton, BaseInput e MenuDropdownGeral
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

  <!-- Seção DataGrid Responsivo -->
  <section>
    <div class="bg-white rounded-material-xl elevation-2 p-0">
      <MainContainer scrollMode="local" offsetHeader>
        <template #header>
          <div class="px-4 sm:px-6 py-3">
            <h2 class="text-xl sm:text-2xl font-bold text-black">Demo: DataGrid Responsivo</h2>
            <p class="text-gray-600">Scroll somente no grid; desktop = tabela, mobile = lista.</p>
          </div>
          <FiltersBar>
            <div class="flex flex-wrap items-center gap-3 px-0">
              <input v-model="demoSearch" type="text" placeholder="Buscar..." class="border rounded-md px-3 py-2 text-sm" />
              <BaseButton variant="primary" @click="applyDemoFilter">Filtrar</BaseButton>
              <span class="text-sm text-gray-600">Itens: {{ demoRows.length }}</span>
            </div>
          </FiltersBar>
        </template>

        <DataGridContainer maxHeight="440px">
          <ResponsiveDataGrid
            :columns="demoColumns"
            :rows="pagedRows"
            :sort="demoSort"
            @update:sort="demoSort = $event"
            @row-click="onRowClick"
          />
        </DataGridContainer>
        <DataGridPagination
          class="rounded-b-material-xl"
          :page="page"
          :pageSize="pageSize"
          :total="filteredRows.length"
          @update:page="page = $event"
          @update:pageSize="pageSize = $event; page = 1"
        />
      </MainContainer>
    </div>
  </section>

  <!-- Seção DataGrid Desktop Drawer -->
  <section>
    <div class="bg-white rounded-material-xl elevation-2 p-0 relative">
      <MainContainer scrollMode="local" offsetHeader>
        <template #header>
          <div class="px-4 sm:px-6 py-3">
            <h2 class="text-xl sm:text-2xl font-bold text-black">Demo: DataGrid Desktop Drawer</h2>
            <p class="text-gray-600">Grid com ícones flutuantes no hover e clique na linha para abrir drawer.</p>
          </div>
          <FiltersBar>
            <div class="flex flex-wrap items-center gap-3 px-0">
              <input v-model="drawerDemoSearch" type="text" placeholder="Buscar..." class="border rounded-md px-3 py-2 text-sm" />
              <BaseButton variant="primary" @click="applyDemoFilter">Filtrar</BaseButton>
              <span class="text-sm text-gray-600">Itens: {{ drawerDemoRows.length }}</span>
            </div>
          </FiltersBar>
        </template>

        <DataGridContainer maxHeight="440px">
          <DataGridDesktopDrawer
            :columns="drawerDemoColumns"
            :rows="drawerPagedRows"
            :sort="drawerDemoSort"
            @update:sort="drawerDemoSort = $event"
            @row-click="openDrawer"
            @delete-row="confirmDelete"
            @print-row="printRow"
          />
        </DataGridContainer>
        <DataGridPagination
          class="rounded-b-material-xl"
          :page="drawerPage"
          :pageSize="drawerPageSize"
          :total="drawerFilteredRows.length"
          @update:page="drawerPage = $event"
          @update:pageSize="drawerPageSize = $event; drawerPage = 1"
        />
      </MainContainer>

      <!-- Drawer Component dentro desta seção -->
      <Drawer
        :is-open="isDrawerOpen"
        :title="drawerTitle"
        width="lg"
        @close="isDrawerOpen = false"
        @save="handleDrawerSave"
      />
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

      <!-- Seção MenuDropdownGeral -->
      <section>
        <div class="bg-white rounded-material-xl elevation-2 p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-black mb-6 flex items-center">
            <div class="w-8 h-8 bg-blue-500 rounded-material mr-3"></div>
            MenuDropdownGeral - Variações
          </h2>

          <div class="space-y-8">
            <!-- Tamanhos -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Tamanhos</h3>
              <div class="flex flex-wrap items-center gap-4">
                <MenuDropdownGeral size="sm" label="Pequeno">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Ação 1 - Pequeno'">Ação 1</button>
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Ação 2 - Pequeno'">Ação 2</button>
                </MenuDropdownGeral>

                <MenuDropdownGeral size="md" label="Médio">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Ação 1 - Médio'">Ação 1</button>
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Ação 2 - Médio'">Ação 2</button>
                </MenuDropdownGeral>

                <MenuDropdownGeral size="lg" label="Grande">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Ação 1 - Grande'">Ação 1</button>
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Ação 2 - Grande'">Ação 2</button>
                </MenuDropdownGeral>
              </div>
            </div>

            <!-- Variantes -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Variantes</h3>
              <div class="flex flex-wrap items-center gap-4">
                <MenuDropdownGeral variant="default" label="Default">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Default - Editar'">Editar</button>
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Default - Duplicar'">Duplicar</button>
                  <hr class="my-1">
                  <button class="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left" @click="lastAction = 'Default - Excluir'">Excluir</button>
                </MenuDropdownGeral>

                <MenuDropdownGeral variant="ghost" label="Ghost">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Ghost - Visualizar'">Visualizar</button>
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Ghost - Compartilhar'">Compartilhar</button>
                </MenuDropdownGeral>

                <MenuDropdownGeral variant="outline" label="Outline">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Outline - Configurar'">Configurar</button>
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Outline - Ajuda'">Ajuda</button>
                </MenuDropdownGeral>
              </div>
            </div>

            <!-- Com Ícones -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Com Ícones</h3>
              <div class="flex flex-wrap items-center gap-4">
                <MenuDropdownGeral :icon-left="UserIcon" label="Perfil">
                  <button class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left gap-2" @click="lastAction = 'Perfil - Editar'">
                    <PencilIcon class="w-4 h-4" />
                    Editar Perfil
                  </button>
                  <button class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left gap-2" @click="lastAction = 'Perfil - Configurações'">
                    <CogIcon class="w-4 h-4" />
                    Configurações
                  </button>
                  <hr class="my-1">
                  <button class="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left gap-2" @click="lastAction = 'Perfil - Sair'">
                    <ArrowRightOnRectangleIcon class="w-4 h-4" />
                    Sair
                  </button>
                </MenuDropdownGeral>

                <MenuDropdownGeral :icon-left="BellIcon" label="Notificações" :badge="3">
                  <template #header>
                    <div class="text-sm font-medium">Notificações Recentes</div>
                  </template>
                  
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Notificação 1'">Nova mensagem recebida</button>
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Notificação 2'">Tarefa atribuída</button>
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Notificação 3'">Relatório disponível</button>
                  
                  <template #footer>
                    <button class="text-xs text-blue-600 hover:text-blue-800 font-medium" @click="lastAction = 'Ver todas notificações'">Ver todas</button>
                  </template>
                </MenuDropdownGeral>
              </div>
            </div>

            <!-- Posicionamento -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Posicionamento</h3>
              <div class="flex flex-wrap items-center gap-4">
                <MenuDropdownGeral position="left" label="Esquerda">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Posição Esquerda'">Alinhado à esquerda</button>
                </MenuDropdownGeral>

                <MenuDropdownGeral position="center" label="Centro">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Posição Centro'">Centralizado</button>
                </MenuDropdownGeral>

                <MenuDropdownGeral position="right" label="Direita">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Posição Direita'">Alinhado à direita</button>
                </MenuDropdownGeral>
              </div>
            </div>

            <!-- Larguras -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Larguras</h3>
              <div class="flex flex-wrap items-center gap-4">
                <MenuDropdownGeral width="auto" label="Auto">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Largura Auto'">Largura automática</button>
                </MenuDropdownGeral>

                <MenuDropdownGeral width="sm" label="Pequena">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Largura Pequena'">Opção com texto um pouco mais longo</button>
                </MenuDropdownGeral>

                <MenuDropdownGeral width="lg" label="Grande">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Largura Grande'">Opção com texto muito mais longo para testar a largura do dropdown</button>
                </MenuDropdownGeral>
              </div>
            </div>

            <!-- Estado Desabilitado -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Estados</h3>
              <div class="flex flex-wrap items-center gap-4">
                <MenuDropdownGeral label="Normal">
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" @click="lastAction = 'Dropdown Normal'">Dropdown habilitado</button>
                </MenuDropdownGeral>

                <MenuDropdownGeral label="Desabilitado" disabled>
                  <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Não deve funcionar</button>
                </MenuDropdownGeral>
              </div>
            </div>

            <!-- Debug -->
            <div v-if="lastAction" class="mt-6 p-4 bg-gray-100 rounded-material border-l-4 border-primary-500">
              <p class="text-sm text-gray-700">
                <strong>Última ação:</strong> {{ lastAction }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção DatePicker -->
      <section>
        <div class="bg-white rounded-material-xl elevation-2 p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-black mb-6 flex items-center">
            <div class="w-8 h-8 bg-green-500 rounded-material mr-3"></div>
            DatePicker - Seletor de Data
          </h2>

          <div class="space-y-8">
            <!-- Tamanhos -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Tamanhos</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pequeno (sm)</label>
                  <DatePicker 
                    v-model="dateSmall"
                    size="sm"
                    placeholder="Selecione uma data"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Médio (md)</label>
                  <DatePicker 
                    v-model="dateMedium"
                    size="md"
                    placeholder="Selecione uma data"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Grande (lg)</label>
                  <DatePicker 
                    v-model="dateLarge"
                    size="lg"
                    placeholder="Selecione uma data"
                  />
                </div>
              </div>
            </div>

            <!-- Variantes -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Variantes</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Default</label>
                  <DatePicker 
                    v-model="dateDefault"
                    variant="default"
                    placeholder="Data padrão"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Filled</label>
                  <DatePicker 
                    v-model="dateFilled"
                    variant="filled"
                    placeholder="Data preenchida"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Outline</label>
                  <DatePicker 
                    v-model="dateOutline"
                    variant="outline"
                    placeholder="Data com borda"
                  />
                </div>
              </div>
            </div>

            <!-- Posicionamento do Dropdown -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Posicionamento</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Esquerda</label>
                  <DatePicker 
                    v-model="dateLeft"
                    position="left"
                    placeholder="Alinhado à esquerda"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Centro</label>
                  <DatePicker 
                    v-model="dateCenter"
                    position="center"
                    placeholder="Centralizado"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Direita</label>
                  <DatePicker 
                    v-model="dateRight"
                    position="right"
                    placeholder="Alinhado à direita"
                  />
                </div>
              </div>
            </div>

            <!-- Datas Restringidas -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Restrições de Data</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Data Mínima (a partir de hoje)</label>
                  <DatePicker 
                    v-model="dateMinRestricted"
                    :min-date="new Date()"
                    placeholder="Apenas datas futuras"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Data Máxima (até hoje)</label>
                  <DatePicker 
                    v-model="dateMaxRestricted"
                    :max-date="new Date()"
                    placeholder="Apenas datas passadas"
                  />
                </div>
              </div>
            </div>

            <!-- Estados -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Estados</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Normal</label>
                  <DatePicker 
                    v-model="dateNormal"
                    placeholder="DatePicker habilitado"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Desabilitado</label>
                  <DatePicker 
                    v-model="dateDisabled"
                    placeholder="DatePicker desabilitado"
                    disabled
                  />
                </div>
              </div>
            </div>

            <!-- Debug - Valores Selecionados -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Valores Selecionados</h3>
              <div class="bg-gray-100 rounded-material p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div><strong>Small:</strong> {{ dateSmall ? formatDisplayDate(dateSmall) : 'Não selecionado' }}</div>
                  <div><strong>Medium:</strong> {{ dateMedium ? formatDisplayDate(dateMedium) : 'Não selecionado' }}</div>
                  <div><strong>Large:</strong> {{ dateLarge ? formatDisplayDate(dateLarge) : 'Não selecionado' }}</div>
                  <div><strong>Default:</strong> {{ dateDefault ? formatDisplayDate(dateDefault) : 'Não selecionado' }}</div>
                  <div><strong>Filled:</strong> {{ dateFilled ? formatDisplayDate(dateFilled) : 'Não selecionado' }}</div>
                  <div><strong>Outline:</strong> {{ dateOutline ? formatDisplayDate(dateOutline) : 'Não selecionado' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção FormularioGeral -->
      <section>
        <div class="bg-white rounded-material-xl elevation-2 p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-black mb-6 flex items-center">
            <div class="w-8 h-8 bg-purple-500 rounded-material mr-3"></div>
            FormularioGeral - Componente de Formulário
          </h2>

          <div class="space-y-8">
            <!-- Variantes -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-800">Variantes</h3>
              
              <!-- Formulário Default -->
              <div class="space-y-4">
                <h4 class="text-md font-medium text-gray-700">Default (Card)</h4>
                <FormularioGeral
                  title="Formulário de Contato"
                  subtitle="Preencha os campos abaixo para entrar em contato"
                  variant="default"
                  size="md"
                  @submit="handleFormSubmit"
                  @reset="handleFormReset"
                />
              </div>

              <!-- Formulário Card Compacto -->
              <div class="space-y-4">
                <h4 class="text-md font-medium text-gray-700">Card Compacto</h4>
                <FormularioGeral
                  title="Cadastro Rápido"
                  variant="card"
                  size="sm"
                  :show-reset-button="false"
                  submit-button-text="Cadastrar"
                  @submit="handleFormSubmit"
                />
              </div>

              <!-- Formulário Inline -->
              <div class="space-y-4">
                <h4 class="text-md font-medium text-gray-700">Inline (sem container)</h4>
                <div class="bg-gray-50 p-4 rounded-material-lg">
                  <FormularioGeral
                    variant="inline"
                    size="md"
                    submit-button-text="Enviar Dados"
                    submit-button-variant="secondary"
                    @submit="handleFormSubmit"
                  />
                </div>
              </div>
            </div>

            <!-- Tamanhos -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-800">Tamanhos</h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Pequeno -->
                <div>
                  <h4 class="text-md font-medium text-gray-700 mb-4">Pequeno (sm)</h4>
                  <FormularioGeral
                    title="Mini Form"
                    variant="card"
                    size="sm"
                    submit-button-text="OK"
                    :show-reset-button="false"
                    @submit="handleFormSubmit"
                  />
                </div>

                <!-- Médio -->
                <div>
                  <h4 class="text-md font-medium text-gray-700 mb-4">Médio (md)</h4>
                  <FormularioGeral
                    title="Formulário Padrão"
                    variant="card"
                    size="md"
                    @submit="handleFormSubmit"
                  />
                </div>

                <!-- Grande -->
                <div>
                  <h4 class="text-md font-medium text-gray-700 mb-4">Grande (lg)</h4>
                  <FormularioGeral
                    title="Formulário Detalhado"
                    subtitle="Versão expandida com mais espaço"
                    variant="card"
                    size="lg"
                    @submit="handleFormSubmit"
                  />
                </div>
              </div>
            </div>

            <!-- Formulário com Colunas -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-800">Layout em Colunas</h3>
              
              <div class="space-y-4">
                <h4 class="text-md font-medium text-gray-700">Duas Colunas</h4>
                <FormularioGeral
                  title="Formulário em Grade"
                  subtitle="Layout otimizado para desktop"
                  variant="default"
                  size="lg"
                  :columns="2"
                  @submit="handleFormSubmit"
                >
                  <template #default="{ form, errors, isSubmitting }">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Nome *
                        </label>
                        <BaseInput
                          v-model="form.name"
                          placeholder="Seu nome"
                          :error="errors.name"
                          :disabled="isSubmitting"
                          variant="outline"
                        />
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Sobrenome *
                        </label>
                        <BaseInput
                          v-model="form.surname"
                          placeholder="Seu sobrenome"
                          :error="errors.surname"
                          :disabled="isSubmitting"
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
                          placeholder="seu@email.com"
                          :error="errors.email"
                          :disabled="isSubmitting"
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
                          variant="outline"
                        />
                      </div>
                      
                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Empresa
                        </label>
                        <BaseInput
                          v-model="form.company"
                          placeholder="Nome da empresa"
                          :error="errors.company"
                          :disabled="isSubmitting"
                          variant="outline"
                        />
                      </div>
                      
                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Observações
                        </label>
                        <textarea
                          v-model="form.message"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-material text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed resize-none transition-colors duration-200"
                          :disabled="isSubmitting"
                          placeholder="Informações adicionais..."
                        />
                      </div>
                    </div>
                  </template>
                </FormularioGeral>
              </div>
            </div>

            <!-- Estados e Ações -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-gray-800">Estados e Personalização</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Botão de Ação Personalizado -->
                <div>
                  <h4 class="text-md font-medium text-gray-700 mb-4">Botão Danger</h4>
                  <FormularioGeral
                    title="Exclusão de Dados"
                    subtitle="Confirme os dados antes de excluir"
                    variant="card"
                    size="sm"
                    submit-button-text="Excluir"
                    submit-button-variant="danger"
                    reset-button-text="Cancelar"
                    loading-text="Excluindo..."
                    @submit="handleFormSubmit"
                  />
                </div>

                <!-- Sem Validação Automática -->
                <div>
                  <h4 class="text-md font-medium text-gray-700 mb-4">Sem Auto-validação</h4>
                  <FormularioGeral
                    title="Formulário Livre"
                    subtitle="Validação customizada"
                    variant="card"
                    size="sm"
                    :auto-validate="false"
                    submit-button-text="Validar e Enviar"
                    @submit="handleFormSubmit"
                  />
                </div>
              </div>
            </div>

            <!-- Debug - Log de Ações -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">Log de Ações</h3>
              <div class="bg-gray-100 rounded-material p-4">
                <div class="space-y-2 max-h-32 overflow-y-auto">
                  <div v-if="formActions.length === 0" class="text-gray-500 text-sm">
                    Nenhuma ação realizada ainda...
                  </div>
                  <div 
                    v-for="(action, index) in formActions.slice().reverse()" 
                    :key="index"
                    class="text-sm"
                  >
                    <span class="text-gray-500">{{ action.time }}</span> - 
                    <span :class="action.type === 'submit' ? 'text-green-600' : 'text-blue-600'">
                      {{ action.message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  InformationCircleIcon,
  BellIcon,
  CogIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

// Component imports
import DatePicker from '@/components/DatePicker.vue'
import FormularioGeral from '@/components/FormularioGeral.vue'

// DataGrid demo imports
import FiltersBar from '@/components/datagrid/FiltersBar.vue'
import DataGridContainer from '@/components/datagrid/DataGridContainer.vue'
import ResponsiveDataGrid from '@/components/datagrid/ResponsiveDataGrid.vue'
import DataGridDesktopDrawer from '@/components/datagrid/DataGridDesktopDrawer.vue'
import DataGridPagination from '@/components/datagrid/DataGridPagination.vue'
import Drawer from '@/components/Drawer.vue'
import type { ColumnDef, SortState } from '@/components/datagrid/types'

// Definição da página
definePageMeta({
  title: 'Teste de Componentes',
  description: 'Página para testar os componentes BaseButton, BaseInput e MenuDropdownGeral'
})

// Toast composable
const toast = useToast()

// Estados
const buttonVariants = ['primary', 'secondary', 'tertiary', 'ghost', 'danger'] as const
const sizes = ['sm', 'md', 'lg'] as const
const submitting = ref(false)
const lastAction = ref('')

// DatePicker State
const dateSmall = ref<Date | null>(null)
const dateMedium = ref<Date | null>(null)
const dateLarge = ref<Date | null>(null)
const dateDefault = ref<Date | null>(null)
const dateFilled = ref<Date | null>(null)
const dateOutline = ref<Date | null>(null)
const dateLeft = ref<Date | null>(null)
const dateCenter = ref<Date | null>(null)
const dateRight = ref<Date | null>(null)
const dateMinRestricted = ref<Date | null>(null)
const dateMaxRestricted = ref<Date | null>(null)
const dateNormal = ref<Date | null>(null)
const dateDisabled = ref<Date | null>(null)

// FormularioGeral State
const formActions = ref<Array<{time: string, type: string, message: string}>>([])

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

// DatePicker helper functions
const formatDisplayDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// FormularioGeral helper functions
const handleFormSubmit = (data: Record<string, any>) => {
  const time = new Date().toLocaleTimeString('pt-BR')
  formActions.value.push({
    time,
    type: 'submit',
    message: `Formulário enviado com dados: ${Object.keys(data).length} campos preenchidos`
  })
  
  // Toast de sucesso
  toast.success('Formulário enviado com sucesso!', {
    icon: CheckCircleIcon
  })
}

const handleFormReset = () => {
  const time = new Date().toLocaleTimeString('pt-BR')
  formActions.value.push({
    time,
    type: 'reset',
    message: 'Formulário resetado'
  })
  
  // Toast informativo
  toast.info('Formulário foi resetado', {
    icon: InformationCircleIcon
  })
}

// ===== DataGrid demo state =====
interface Person { id: number; name: string; role: string; team: string; city: string }
const demoRows: Person[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `Pessoa ${i + 1}`,
  role: ['Analista','Dev','QA','PM'][i % 4],
  team: ['Alfa','Beta','Gama'][i % 3],
  city: ['SP','RJ','BH','POA'][i % 4]
}))

const demoColumns: ColumnDef<Person>[] = [
  { id: 'name', header: 'Nome', field: 'name', minWidth: 180, visibleOn: ['desktop','mobile'] },
  { id: 'role', header: 'Cargo', field: 'role', minWidth: 120, visibleOn: ['desktop','mobile'] },
  { id: 'team', header: 'Equipe', field: 'team', minWidth: 120, visibleOn: ['desktop'] },
  { id: 'city', header: 'Cidade', field: 'city', minWidth: 120, visibleOn: ['desktop'] },
]

const demoSort = ref<SortState | null>(null)
const demoSearch = ref('')

const filteredRows = computed(() => {
  const term = demoSearch.value.toLowerCase().trim()
  let out = demoRows
  if (term) {
    out = out.filter(r => `${r.name} ${r.role} ${r.team} ${r.city}`.toLowerCase().includes(term))
  }
  if (demoSort.value) {
    out = [...out].sort((a,b) => {
      const col = demoSort.value!.id as keyof Person
      const va = String(a[col] ?? '')
      const vb = String(b[col] ?? '')
      return demoSort.value!.desc ? vb.localeCompare(va) : va.localeCompare(vb)
    })
  }
  return out
})

function applyDemoFilter() {/* no-op demo */}
function onRowClick(row: Person) { console.log('Row clicked', row) }

//paginação
const page = ref(1)
const pageSize = ref(20)
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

// ===== DataGrid Desktop Drawer demo state =====
// Estados do drawer
const isDrawerOpen = ref(false)
const drawerTitle = ref('Detalhes do Item')
const selectedRow = ref<Person | null>(null)

// Estados específicos do DataGridDesktopDrawer
const drawerDemoRows: Person[] = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  name: `Funcionário ${i + 1}`,
  role: ['Gerente','Desenvolvedor','Analista','Designer','QA'][i % 5],
  team: ['Frontend','Backend','Mobile','DevOps','UX/UI'][i % 5],
  city: ['São Paulo','Rio de Janeiro','Belo Horizonte','Porto Alegre','Salvador'][i % 5]
}))

const drawerDemoColumns: ColumnDef<Person>[] = [
  { id: 'id', header: 'ID', field: 'id', minWidth: 80, visibleOn: ['desktop'] },
  { id: 'name', header: 'Nome', field: 'name', minWidth: 200, visibleOn: ['desktop'] },
  { id: 'role', header: 'Cargo', field: 'role', minWidth: 150, visibleOn: ['desktop'] },
  { id: 'team', header: 'Equipe', field: 'team', minWidth: 120, visibleOn: ['desktop'] },
  { id: 'city', header: 'Cidade', field: 'city', minWidth: 150, visibleOn: ['desktop'] },
]

const drawerDemoSort = ref<SortState | null>(null)
const drawerDemoSearch = ref('')

const drawerFilteredRows = computed(() => {
  const term = drawerDemoSearch.value.toLowerCase().trim()
  let out = drawerDemoRows
  if (term) {
    out = out.filter(r => `${r.name} ${r.role} ${r.team} ${r.city}`.toLowerCase().includes(term))
  }
  if (drawerDemoSort.value) {
    out = [...out].sort((a,b) => {
      const col = drawerDemoSort.value!.id as keyof Person
      const va = String(a[col] ?? '')
      const vb = String(b[col] ?? '')
      return drawerDemoSort.value!.desc ? vb.localeCompare(va) : va.localeCompare(vb)
    })
  }
  return out
})

// Paginação do drawer demo
const drawerPage = ref(1)
const drawerPageSize = ref(15)
const drawerPagedRows = computed(() => {
  const start = (drawerPage.value - 1) * drawerPageSize.value
  return drawerFilteredRows.value.slice(start, start + drawerPageSize.value)
})

// Métodos específicos do drawer
function openDrawer(row: Person, index: number) {
  selectedRow.value = row
  drawerTitle.value = `Detalhes - ${row.name}`
  isDrawerOpen.value = true
  
  toast.info(`Abrindo drawer para: ${row.name}`, {
    icon: InformationCircleIcon
  })
}

function confirmDelete(row: Person, index: number) {
  toast.warning(`Confirmar exclusão de: ${row.name}`, {
    icon: ExclamationTriangleIcon
  })
  console.log('Delete row:', row, 'at index:', index)
}

function printRow(row: Person, index: number) {
  toast.success(`Imprimindo: ${row.name}`, {
    icon: CheckCircleIcon
  })
  console.log('Print row:', row, 'at index:', index)
}

function handleDrawerSave() {
  if (selectedRow.value) {
    toast.success(`Dados salvos para: ${selectedRow.value.name}`, {
      icon: CheckCircleIcon
    })
  }
  isDrawerOpen.value = false
}

// ===== DataGrid hierárquico demo state =====
</script>
