<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProdutos, estoqueLabel } from '@/services/produtoService'
import '@/assets/theme.css'

const { produtosVisiveis, mostrarExtras, loading, toggleProdutos } = useProdutos()


// Recharts equivalente para Vue → use vue-chartjs
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)


// ─────────────────────────────────────────────
// Estado local
// ─────────────────────────────────────────────
const canalAtivo   = ref('todos')
const filtroOrdem  = ref('todos')
const activeNav    = ref('allview')

const kpiData = {
  todos:  { vendas: 'R$ 84.320', ticket: 'R$ 1.248', svLabel: 'Este mês • todos os canais', stLabel: 'Por pedido • todos os canais' },
  b2b:    { vendas: 'R$ 61.900', ticket: 'R$ 3.860', svLabel: 'Este mês • B2B Industrial',   stLabel: 'Por pedido • B2B' },
  varejo: { vendas: 'R$ 22.420', ticket: 'R$   189', svLabel: 'Este mês • Varejo',            stLabel: 'Por pedido • Varejo' },
}

const kpi = computed(() => kpiData[canalAtivo.value])

// ─────────────────────────────────────────────
// Produção (fictício — substitua por store/API)
// ─────────────────────────────────────────────
const producao = ref({ espera: 12, fornando: 8, prontos: 34 })

// ─────────────────────────────────────────────
// Gráfico de capacidade produtiva (vue-chartjs)
// ─────────────────────────────────────────────
const chartData = ref({
  labels: ['Turno 1', 'Turno 2', 'Turno 3', 'Turno 4', 'Turno 5', 'Turno 6'],
  datasets: [
    {
      label: 'Utilizada',
      data: [85, 92, 78, 95, 60, 40],
      backgroundColor: '#c3a343',
      borderRadius: 4,
      barPercentage: 0.55,
    },
    {
      label: 'Disponível',
      data: [100, 100, 100, 100, 100, 100],
      backgroundColor: '#003566',
      borderRadius: 4,
      barPercentage: 0.55,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%` } },
  },
  scales: {
    x: { ticks: { color: '#415a77', font: { size: 16 } }, grid: { color: '#001d3d' } },
    y: { min: 0, max: 110, ticks: { color: '#415a77', font: { size: 15 }, callback: v => v + '%' }, grid: { color: '#001d3d' } },
  },
})

// ─────────────────────────────────────────────
// Pedidos (fictício — substitua por store/API)
// ─────────────────────────────────────────────
const allOrders = ref([
  { id: '#4821', cli: 'Pão & Cia Ltda',       tipo: 'b2b',    itens: 'Pão Francês 5.000un',   val: 'R$ 2.250', urg: 'alta',  status: 'Produção',   statusColor: '#c3a343' },
  { id: '#4822', cli: 'Supermercado Rex',      tipo: 'b2b',    itens: 'Baguete Rústica 800un',  val: 'R$ 1.440', urg: 'media', status: 'Aguardando', statusColor: '#778da9' },
  { id: '#4823', cli: 'Padaria Doce Mel',      tipo: 'varejo', itens: 'Croissant 40un',          val: 'R$   180', urg: 'baixa', status: 'Entregue',   statusColor: '#2dce89' },
  { id: '#4824', cli: 'GPA Distribuidora',     tipo: 'b2b',    itens: 'Misto 12.000un',          val: 'R$ 8.400', urg: 'alta',  status: 'Produção',   statusColor: '#c3a343' },
  { id: '#4825', cli: 'Café Aroma',            tipo: 'varejo', itens: 'Cupcake 24un',            val: 'R$   189', urg: 'baixa', status: 'Entregue',   statusColor: '#2dce89' },
  { id: '#4826', cli: 'Rede Pão Quente',       tipo: 'b2b',    itens: 'Pão Hot-Dog 2.000un',    val: 'R$   700', urg: 'media', status: 'Aguardando', statusColor: '#778da9' },
  { id: '#4827', cli: 'Maria Confeitaria',     tipo: 'varejo', itens: 'Folhado 60un',            val: 'R$   270', urg: 'alta',  status: 'Produção',   statusColor: '#c3a343' },
])

const filteredOrders = computed(() => {
  const f = filtroOrdem.value
  if (f === 'urgente')  return allOrders.value.filter(o => o.urg === 'alta')
  if (f === 'b2b')      return allOrders.value.filter(o => o.tipo === 'b2b')
  if (f === 'varejo')   return allOrders.value.filter(o => o.tipo === 'varejo')
  if (f === 'pendente') return allOrders.value.filter(o => o.status !== 'Entregue')
  return allOrders.value
})

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const urgLabel = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }



// ─────────────────────────────────────────────
// Lifecycle
// ──────────────────────────────────────────────
onMounted(() => {
  // store.dispatch('dashboard/fetchKpis')
  // store.dispatch('dashboard/fetchOrders')
  // store.dispatch('dashboard/fetchProducao')
})
</script>

<!-- ─────────────────────────────────────────────
     TEMPLATE
───────────────────────────────────────────── -->
<template>
  <div class="db-root">

    <main class="db-main">

      <div class="db-topbar">
        <div>
          <h1 class="db-page-title">Visão Geral</h1> <span class="page-date">{{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
        </div>
        <div class="topbar-right">
          <div class="canal-tabs">
            <button
              v-for="c in ['todos','b2b','varejo']"
              :key="c"
              class="canal-tab"
              :class="{ active: canalAtivo === c }"
              @click="canalAtivo = c"
            >{{ c === 'todos' ? 'Todos' : c === 'b2b' ? 'B2B Industrial' : 'Varejo' }}</button>
          </div>
          <button class="tb-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar
          </button>
          <button class="tb-btn tb-primary">+ Novo Pedido</button>
        </div>
      </div>

      <!-- KPIs -->
      <div class="kpi-grid">

        <!-- Vendas -->
        <div class="kpi kpi-gold">
          <div class="kpi-icon kpi-icon--gold">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="kpi-label">Total de Vendas</div>
          <div class="kpi-value">{{ kpi.vendas }}</div>
          <div class="kpi-sub">{{ kpi.svLabel }}</div>
          <span class="kpi-badge kpi-badge--up">▲ 12,4%</span>
        </div>

        <!-- Ticket -->
        <div class="kpi kpi-green">
          <div class="kpi-icon kpi-icon--green">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div class="kpi-label">Ticket Médio</div>
          <div class="kpi-value">{{ kpi.ticket }}</div>
          <div class="kpi-sub">{{ kpi.stLabel }}</div>
          <span class="kpi-badge kpi-badge--up">▲ 5,1%</span>
        </div>

        <!-- Pedidos -->
        <div class="kpi kpi-blue">
          <div class="kpi-icon kpi-icon--blue">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div class="kpi-label">Pedidos Hoje</div>
          <div class="kpi-value">67</div>
          <div class="kpi-sub">48 entregues · 19 pendentes</div>
          <span class="kpi-badge kpi-badge--down">▼ 3,2%</span>
        </div>

        <!-- Produção -->
        <div class="kpi kpi-yellow">
          <div class="kpi-icon kpi-icon--yellow">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c-5.5 0-9 4-9 9s3.5 9 9 9 9-4 9-9-3.5-9-9-9z"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div class="kpi-label">Status Produção</div>
          <div class="prod-status">
            <div class="ps-item ps-wait">
              <div class="ps-num">{{ producao.espera }}</div>
              <div class="ps-lbl">Em espera</div>
            </div>
            <div class="ps-item ps-bake">
              <div class="ps-num">{{ producao.fornando }}</div>
              <div class="ps-lbl">Fornando</div>
            </div>
            <div class="ps-item ps-done">
              <div class="ps-num">{{ producao.prontos }}</div>
              <div class="ps-lbl">Prontos</div>
            </div>
          </div>
        </div>

      </div>

      <!-- MID ROW -->
      <div class="mid-row">
        <!-- CARDS PRODUTOS -->
        <div class="card-box">
          <div class="box-header">
            <span class="box-title">Menu de Produtos</span>
         <button class="btn-toggle" :disabled="loading" @click="toggleProdutos">
  <span v-if="loading" class="btn-content">
    <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    Carregando...
  </span>
  <span v-else-if="mostrarExtras" class="btn-content">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
    Ver menos
  </span>
  <span v-else class="btn-content">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
    Ver todos
  </span>
</button>
        </div>
         
          <div class="prod-grid">
            <div
              v-for="produto in produtosVisiveis"
              :key="produto.id"
              class="prod-card"
            >
            
              <div class="prod-img" :class="`prod-img--${produto.cor}`">{{ produto.emoji }}</div>
              <div class="prod-body">
                <div class="prod-name">{{ produto.nome }}</div>
                <div class="prod-cat">{{ produto.categoria }}</div>
                <div class="prod-prices">
                  <span class="price-pill price-pill--ind">Ind {{ produto.precoInd }}</span>
                  <span class="price-pill price-pill--var">Var {{ produto.precoVar }}</span>
                </div>
                <span class="stock-badge" :class="`stock-badge--${produto.estoque}`">
                  ● {{ estoqueLabel[produto.estoque] }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- GRÁFICO -->
        <div class="card-box">
          <div class="box-header">
            <span class="box-title">Capacidade Produtiva</span>
            <span class="box-action">Hoje</span>
          </div>
          <div class="chart-legend">
            <span class="leg-item"><span class="leg-dot" style="background:#c3a343"></span>Utilizada</span>
            <span class="leg-item"><span class="leg-dot" style="background:#003566"></span>Disponível</span>
          </div>
          <div class="chart-wrap">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
        </div>

      </div>

      <!-- TABELA PEDIDOS -->
      <div class="card-box">
        <div class="box-header">
          <span class="box-title">Pedidos Recentes</span>
          <span class="box-action">Ver todos →</span>
        </div>

        <div class="table-filters">
          <button
            v-for="f in [
              { key:'todos',   label:`Todos (${allOrders.length})` },
              { key:'urgente', label:'🔴 Alta urgência' },
              { key:'b2b',     label:'B2B Industrial' },
              { key:'varejo',  label:'Varejo' },
              { key:'pendente',label:'Pendentes' },
            ]"
            :key="f.key"
            class="tf"
            :class="{ active: filtroOrdem === f.key }"
            @click="filtroOrdem = f.key"
          >{{ f.label }}</button>
        </div>

        <div class="table-scroll">
          <table class="db-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Itens</th>
                <th>Valor</th>
                <th>Urgência</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in filteredOrders" :key="o.id">
                <td class="td-id">{{ o.id }}</td>
                <td>{{ o.cli }}</td>
                <td>
                  <span class="cli-type" :class="`cli-type--${o.tipo}`">
                    {{ o.tipo === 'b2b' ? 'B2B Industrial' : 'Varejo' }}
                  </span>
                </td>
                <td class="td-muted">{{ o.itens }}</td>
                <td class="td-val">{{ o.val }}</td>
                <td>
                  <span class="urg" :class="`urg--${o.urg}`">{{ urgLabel[o.urg] }}</span>
                </td>
                <td>
                  <span class="ord-status">
                    <span class="ord-dot" :style="{ background: o.statusColor }"></span>
                    {{ o.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>
