<script setup>
import { ref, computed } from 'vue'

const orders = ref([
  { id: '#4821', client: 'Pão & Cia Ltda',     product: 'Pão Francês 5.000un',   type: 'B2B Industrial', value: 'R$ 2.250', deadline: '20/04 18:00', priority: 'alta',  status: 'Produção'   },
  { id: '#4822', client: 'Supermercado Rex',    product: 'Baguete Rústica 800un', type: 'B2B Industrial', value: 'R$ 1.440', deadline: '20/04 20:00', priority: 'media', status: 'Aguardando' },
  { id: '#4823', client: 'Padaria Doce Mel',    product: 'Croissant 40un',        type: 'Varejo',         value: 'R$ 180',   deadline: '21/04 08:00', priority: 'baixa', status: 'Entregue'   },
  { id: '#4824', client: 'GPA Distribuidora',   product: 'Misto 12.000un',        type: 'B2B Industrial', value: 'R$ 8.400', deadline: '21/04 06:00', priority: 'alta',  status: 'Produção'   },
  { id: '#4825', client: 'Café Aroma',          product: 'Cupcake 24un',          type: 'Varejo',         value: 'R$ 189',   deadline: '21/04 10:00', priority: 'baixa', status: 'Entregue'   },
  { id: '#4826', client: 'Rede Pão Quente',     product: 'Pão Hot-Dog 2.000un',   type: 'B2B Industrial', value: 'R$ 700',   deadline: '22/04 07:00', priority: 'media', status: 'Aguardando' },
  { id: '#4827', client: 'Maria Confeitaria',   product: 'Folhado 60un',          type: 'Varejo',         value: 'R$ 270',   deadline: '22/04 09:00', priority: 'alta',  status: 'Produção'   },
])

const filterPriority = ref('todos')

const filteredOrders = computed(() => {
  if (filterPriority.value === 'todos') return orders.value
  return orders.value.filter((o) => o.priority === filterPriority.value)
})

const priorityOptions = [
  { id: 'todos', label: 'Todos' },
  { id: 'alta',  label: '🔴 Alta' },
  { id: 'media', label: '🟡 Média' },
  { id: 'baixa', label: '🟢 Baixa' },
]

const priorityCycle = { alta: 'media', media: 'baixa', baixa: 'alta' }
const togglePriority = (order) => {
  order.priority = priorityCycle[order.priority]
}

const priorityColor = (p) => ({ alta: '#f87171', media: '#fbbf24', baixa: '#4ade80' }[p])
const priorityLabel = (p) => ({ alta: 'Alta', media: 'Média', baixa: 'Baixa' }[p])
const statusColor  = (s) => ({ Produção: '#c3a343', Aguardando: '#415a77', Entregue: '#4ade80' }[s] || '#415a77')
const typeColor    = (t) => t === 'B2B Industrial' ? '#3b82f6' : '#a855f7'
</script>

<template>
  <div class="order-priority">
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

    <div class="hint">
      <span>💡 Clique na prioridade de um pedido para alterá-la</span>
    </div>

    <div class="table-wrap">
      <table class="orders-table">
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
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" class="order-row">
            <td class="order-id">{{ order.id }}</td>
            <td class="order-client">{{ order.client }}</td>
            <td class="order-product">{{ order.product }}</td>
            <td>
              <span class="type-badge" :style="{ background: typeColor(order.type) + '22', color: typeColor(order.type), borderColor: typeColor(order.type) + '44' }">
                {{ order.type }}
              </span>
            </td>
            <td class="order-value">{{ order.value }}</td>
            <td class="order-deadline">{{ order.deadline }}</td>
            <td>
              <button
                class="priority-btn"
                :style="{ color: priorityColor(order.priority), borderColor: priorityColor(order.priority) + '55', background: priorityColor(order.priority) + '18' }"
                @click="togglePriority(order)"
                :title="`Clique para mudar para ${priorityCycle[order.priority]}`"
              >
                {{ priorityLabel(order.priority) }}
                <span class="cycle-icon">↻</span>
              </button>
            </td>
            <td>
              <span class="status-dot" :style="{ background: statusColor(order.status) }"></span>
              <span class="status-text" :style="{ color: statusColor(order.status) }">{{ order.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.order-priority { color: #e0e0e0; }

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffd60a;
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 6px;
}

.filter-btn {
  background: transparent;
  border: 1px solid #003566;
  color: #415a77;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: #ffd60a;
  color: #ffd60a;
  background: rgba(255,214,10,0.07);
}

.hint {
  font-size: 11px;
  color: #415a77;
  margin-bottom: 16px;
}

.table-wrap {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.orders-table th {
  text-align: left;
  padding: 10px 14px;
  color: #415a77;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #003566;
}

.order-row {
  border-bottom: 1px solid rgba(0, 53, 102, 0.5);
  transition: background 0.15s;
}

.order-row:hover {
  background: rgba(0, 53, 102, 0.3);
}

.orders-table td {
  padding: 12px 14px;
  vertical-align: middle;
}

.order-id     { color: #ffd60a; font-weight: 600; }
.order-client { color: #c0ccd8; }
.order-product { color: #8899aa; font-size: 12px; }
.order-value  { color: #c0ccd8; font-weight: 500; }
.order-deadline { color: #8899aa; font-size: 12px; }

.type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
  border: 1px solid;
  white-space: nowrap;
}

.priority-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 20px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
}

.priority-btn:hover {
  filter: brightness(1.2);
  transform: scale(1.03);
}

.cycle-icon {
  font-size: 13px;
  opacity: 0.7;
}

.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-text {
  font-size: 12px;
}
</style>