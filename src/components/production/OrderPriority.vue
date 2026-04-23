<script setup>
import { ref, computed } from 'vue'
import '@/assets/theme.css'

// ────────────────────────────────────────────────────────────────────
// Estado
// ────────────────────────────────────────────────────────────────────
const orders = ref([
  {
    id: '#4821',
    client: 'Pão & Cia Ltda',
    product: 'Pão Francês 5.000un',
    type: 'B2B Industrial',
    value: 'R$ 2.250',
    deadline: '20/04 18:00',
    priority: 'alta',
    status: 'Produção',
  },
  {
    id: '#4822',
    client: 'Supermercado Rex',
    product: 'Baguete Rústica 800un',
    type: 'B2B Industrial',
    value: 'R$ 1.440',
    deadline: '20/04 20:00',
    priority: 'media',
    status: 'Aguardando',
  },
  {
    id: '#4823',
    client: 'Padaria Doce Mel',
    product: 'Croissant 40un',
    type: 'Varejo',
    value: 'R$ 180',
    deadline: '21/04 08:00',
    priority: 'baixa',
    status: 'Entregue',
  },
  {
    id: '#4824',
    client: 'GPA Distribuidora',
    product: 'Misto 12.000un',
    type: 'B2B Industrial',
    value: 'R$ 8.400',
    deadline: '21/04 06:00',
    priority: 'alta',
    status: 'Produção',
  },
  {
    id: '#4825',
    client: 'Café Aroma',
    product: 'Cupcake 24un',
    type: 'Varejo',
    value: 'R$ 189',
    deadline: '21/04 10:00',
    priority: 'baixa',
    status: 'Entregue',
  },
  {
    id: '#4826',
    client: 'Rede Pão Quente',
    product: 'Pão Hot-Dog 2.000un',
    type: 'B2B Industrial',
    value: 'R$ 700',
    deadline: '22/04 07:00',
    priority: 'media',
    status: 'Aguardando',
  },
  {
    id: '#4827',
    client: 'Maria Confeitaria',
    product: 'Folhado 60un',
    type: 'Varejo',
    value: 'R$ 270',
    deadline: '22/04 09:00',
    priority: 'alta',
    status: 'Produção',
  },
])

const filterPriority = ref('todos')

// ────────────────────────────────────────────────────────────────────
// Configurações
// ────────────────────────────────────────────────────────────────────
const priorityOptions = [
  { id: 'todos', label: 'Todos' },
  { id: 'alta', label: '🔴 Alta' },
  { id: 'media', label: '🟡 Média' },
  { id: 'baixa', label: '🟢 Baixa' },
]

const priorityCycle = { alta: 'media', media: 'baixa', baixa: 'alta' }

const colorMap = {
  priority: { alta: '#f87171', media: '#fbbf24', baixa: '#4ade80' },
  status: { Produção: '#c3a343', Aguardando: '#415a77', Entregue: '#4ade80' },
  type: { 'B2B Industrial': '#3b82f6', Varejo: '#a855f7' },
}

// ────────────────────────────────────────────────────────────────────
// Computed
// ────────────────────────────────────────────────────────────────────
const filteredOrders = computed(() => {
  if (filterPriority.value === 'todos') return orders.value
  return orders.value.filter((o) => o.priority === filterPriority.value)
})

// ────────────────────────────────────────────────────────────────────
// Métodos
// ────────────────────────────────────────────────────────────────────
const togglePriority = (order) => {
  order.priority = priorityCycle[order.priority]
}

const getPriorityColor = (priority) => colorMap.priority[priority]
const getPriorityLabel = (priority) => ({ alta: 'Alta', media: 'Média', baixa: 'Baixa' }[priority])
const getStatusColor = (status) => colorMap.status[status] || '#415a77'
const getTypeColor = (type) => colorMap.type[type] || '#8899aa'
</script>

<template>
  <div class="order-priority">
    <!-- Header -->
    <div class="header-row">
      <h2 class="section-title">Prioridade de Pedidos</h2>
      <div class="filter-tabs">
        <button
          v-for="opt in priorityOptions"
          :key="opt.id"
          :class="['filter-btn', { active: filterPriority === opt.id }]"
          @click="filterPriority = opt.id"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Hint -->
    <div class="hint">
      <span>💡 Clique na prioridade de um pedido para alterá-la</span>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="orders-table">
        <!-- Thead -->
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Produto</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Prazo</th>
            <th>Prioridade</th>
            <th>Status</th>
          </tr>
        </thead>

        <!-- Tbody -->
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" class="order-row">
            <!-- ID -->
            <td class="order-id">{{ order.id }}</td>

            <!-- Cliente -->
            <td class="order-client">{{ order.client }}</td>

            <!-- Produto -->
            <td class="order-product">{{ order.product }}</td>

            <!-- Tipo -->
            <td>
              <span
                class="type-badge"
                :style="{
                  background: getTypeColor(order.type) + '22',
                  color: getTypeColor(order.type),
                  borderColor: getTypeColor(order.type) + '44',
                }"
              >
                {{ order.type }}
              </span>
            </td>

            <!-- Valor -->
            <td class="order-value">{{ order.value }}</td>

            <!-- Deadline -->
            <td class="order-deadline">{{ order.deadline }}</td>

            <!-- Prioridade -->
            <td>
              <button
                class="priority-btn"
                :style="{
                  color: getPriorityColor(order.priority),
                  borderColor: getPriorityColor(order.priority) + '55',
                  background: getPriorityColor(order.priority) + '18',
                }"
                @click="togglePriority(order)"
                :title="`Clique para mudar para ${priorityCycle[order.priority]}`"
              >
                {{ getPriorityLabel(order.priority) }}
                <span class="cycle-icon">↻</span>
              </button>
            </td>

            <!-- Status -->
            <td>
              <span
                class="status-dot"
                :style="{ background: getStatusColor(order.status) }"
              ></span>
              <span class="status-text" :style="{ color: getStatusColor(order.status) }">
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>