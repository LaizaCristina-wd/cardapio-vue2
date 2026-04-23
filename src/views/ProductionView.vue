<script setup>
import { ref, computed } from 'vue'
import ProductionControl from '@/components/production/ProductionControl.vue'
import Capability from '@/components/production/Capability.vue'
import OrderPriority from '@/components/production/OrderPriority.vue'
import '@/assets/theme.css'

const tabs = [
  { id: 'production', label: '👷 Controle de Produção', component: ProductionControl },
  { id: 'capability', label: '📊 Capacidade', component: Capability },
  { id: 'orders', label: '📋 Prioridade de Pedidos', component: OrderPriority },
]

const tabById = Object.fromEntries(tabs.map((t) => [t.id, t.component]))
const currentTabId = ref('production')
const currentComponent = computed(() => tabById[currentTabId.value] ?? ProductionControl)
</script>

<template>
  <div class="production-page">
    <div class="page-header">
      <h1 class="page-title">Produção</h1>
      <span class="page-date">{{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
    </div>

    <div class="card">
      <div class="card-body">
        <ul class="nav-tabs">
          <li v-for="tab in tabs" :key="tab.id">
            <button
              type="button"
              :class="['tab-btn', { active: currentTabId === tab.id }]"
              @click="currentTabId = tab.id"
            >
              {{ tab.label }}
            </button>
          </li>
        </ul>

        <div class="tab-content">
          <keep-alive>
            <component :is="currentComponent" />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>
