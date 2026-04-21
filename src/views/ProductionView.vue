<script setup>
import { ref, computed } from 'vue'
import ProductionControl from '@/components/production/ProductionControl.vue'
import Capability from '@/components/production/Capability.vue'
import OrderPriority from '@/components/production/OrderPriority.vue'

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

<style scoped>
.production-page {
  padding: 24px;
  background: #001d3d;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.page-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  color: #ffd60a;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.page-date {
  color: #415a77;
  font-size: 13px;
  text-transform: capitalize;
}

.card {
  background: #002952;
  border-radius: 12px;
  border: 1px solid #003566;
}

.card-body {
  padding: 24px;
}

.nav-tabs {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0 0 24px 0;
  padding: 0;
  border-bottom: 1px solid #003566;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #415a77;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s;
  border-radius: 6px 6px 0 0;
}

.tab-btn:hover {
  color: #c3a343;
  background: rgba(195, 163, 67, 0.05);
}

.tab-btn.active {
  color: #ffd60a;
  border-bottom-color: #ffd60a;
  background: rgba(255, 214, 10, 0.05);
}
</style>