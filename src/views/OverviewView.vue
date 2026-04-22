<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useProdutos, estoqueLabel } from '@/services/produtoService'

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
// Store / Router (ficticios — adapte aos seus)
// ─────────────────────────────────────────────
const store  = useStore()
const router = useRouter()


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
          <h1 class="db-page-title">Visão Geral</h1>
          <p class="db-page-sub">Segunda-feira, 20 de abril de 2026</p>
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

<!-- ─────────────────────────────────────────────
     STYLES
───────────────────────────────────────────── -->
<style scoped>
/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── ROOT LAYOUT ── */
.db-root {
  display: flex;
  min-height: 100vh;
  background: var(--pn-bg);
  color: var(--pn-text);
  font-size: 13px;
}

/* ════════════════════════════
   MAIN
════════════════════════════ */
.db-main {
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── TOPBAR ── */
.db-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.db-page-title { font-size: 18px; font-weight: 600; color: var(--pn-text); }
.db-page-sub   { font-size: 12px; color: var(--pn-text-muted); margin-top: 2px; }

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.canal-tabs { display: flex; gap: 6px; }
.canal-tab {
  padding: 5px 12px;
  border-radius: 7px;
  border: 1px solid var(--pn-border);
  background: transparent;
  color: var(--pn-text-muted);
  font-size: 15px;
  cursor: pointer;
  transition: all .15s;
}
.canal-tab.active {
  background: var(--pn-orange-soft);
  border-color: rgba(195,163,67,.35);
  color: var(--pn-orange);
}
.tb-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 7px;
  border: 1px solid var(--pn-border);
  background: var(--pn-panel);
  color: var(--pn-text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: all .15s;
}
.tb-btn:hover { border-color: var(--pn-orange); color: var(--pn-orange); }
.tb-primary {
  background: var(--pn-orange);
  border-color: var(--pn-orange);
  color: #0a0600;
  font-weight: 600;
}
.tb-primary:hover { opacity: .88; color: #0a0600; }

/* ── KPIs ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.kpi {
  background: var(--pn-panel);
  border: 1px solid var(--pn-border-soft);
  border-radius: 10px;
  padding: 14px 16px;
  position: relative;
  overflow: hidden;
}
.kpi::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
}
.kpi-gold::before  { background: linear-gradient(90deg, var(--pn-orange), transparent); }
.kpi-green::before { background: linear-gradient(90deg, var(--pn-green), transparent); }
.kpi-blue::before  { background: linear-gradient(90deg, var(--pn-blue), transparent); }
.kpi-yellow::before{ background: linear-gradient(90deg, var(--pn-yellow), transparent); }

.kpi-icon {
  position: absolute;
  right: 14px; top: 14px;
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.kpi-icon--gold   { background: var(--pn-orange-soft); color: var(--pn-orange); }
.kpi-icon--green  { background: var(--pn-green-soft);  color: var(--pn-green); }
.kpi-icon--blue   { background: rgba(94,114,228,.15);  color: var(--pn-blue); }
.kpi-icon--yellow { background: rgba(255,203,57,.12);  color: var(--pn-yellow); }

.kpi-label {
  font-size: 15px;
  color: var(--pn-text-muted);
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 6px;
}
.kpi-value { font-size: 18px; font-weight: 600; color: var(--pn-text); line-height: 1; }
.kpi-sub   { font-size: 16px; color: var(--pn-text-dim); margin-top: 4px; }

.kpi-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 14px;
  padding: 2px 7px;
  border-radius: 99px;
  margin-top: 6px;
}
.kpi-badge--up   { background: var(--pn-green-soft);       color: var(--pn-green); }
.kpi-badge--down { background: rgba(245,54,92,.12);         color: var(--pn-red); }

/* Produção inline */
.prod-status { display: flex; gap: 8px; margin-top: 8px; }
.ps-item {
  flex: 1; text-align: center;
  padding: 6px 4px;
  border-radius: 6px;
  border: 1px solid var(--pn-border-soft);
}
.ps-num { font-size: 18px; font-weight: 600; }
.ps-lbl { font-size: 13px; color: var(--pn-text-dim); margin-top: 2px; }
.ps-wait .ps-num { color: var(--pn-yellow); }
.ps-bake .ps-num { color: var(--pn-orange); }
.ps-done .ps-num { color: var(--pn-green); }

/* ── MID ROW ── */
.mid-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* ── CARD BOX (container genérico) ── */
.card-box {
  background: var(--pn-panel);
  border: 1px solid var(--pn-border-soft);
  border-radius: 10px;
  padding: 14px;
}
.box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.box-title  { font-size: 18px; font-weight: 600; color: var(--pn-text); }
.box-action { font-size: 15px; color: var(--pn-orange); cursor: pointer; }

/* ── PRODUTOS ── */
.prod-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}
.prod-card {
  background: var(--pn-bg-2);
  border: 1px solid var(--pn-border-soft);
  border-radius: 7px;
  overflow: hidden;
}
.prod-img {
  height: 64px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px;
}
.prod-img--br { background: rgba(195,163,67,.08); }
.prod-img--pt { background: rgba(45,206,137,.07); }
.prod-img--cr { background: rgba(245,54,92,.07); }
.prod-img--bf { background: rgba(94,114,228,.08); }

.prod-body  { padding: 8px; }
.prod-name  { font-size: 15px; font-weight: 600; color: var(--pn-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.prod-cat   { font-size: 15px; color: var(--pn-text-dim); margin-top: 1px; }
.prod-prices{ display: flex; gap: 5px; margin-top: 6px; flex-wrap: wrap; }
.price-pill { font-size: 13px; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
.price-pill--ind { background: rgba(94,114,228,.15); color: var(--pn-blue); }
.price-pill--var { background: var(--pn-orange-soft); color: var(--pn-orange); }

.stock-badge { display: inline-block; font-size: 13px; padding: 2px 6px; border-radius: 99px; margin-top: 5px; font-weight: 600; }
.stock-badge--ok  { background: var(--pn-green-soft);    color: var(--pn-green); }
.stock-badge--mid { background: rgba(255,203,57,.12);     color: var(--pn-yellow); }
.stock-badge--low { background: rgba(245,54,92,.12);      color: var(--pn-red); }
.btn-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid rgba(195, 163, 67, 0.4);
  background: rgba(195, 163, 67, 0.08);
  color: #c3a343;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-toggle:hover:not(:disabled) {
  background: rgba(195, 163, 67, 0.18);
  border-color: #c3a343;
  color: #ffd60a;
}

.btn-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-content svg {
  width: 14px;
  height: 14px;
}

/* animação de loading */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
}
/* ── GRÁFICO ── */
.chart-legend {
  display: flex;
  gap: 14px;
  margin-bottom: 10px;
}
.leg-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 18px;
  color: var(--pn-text-muted);
}
.leg-dot { width: 9px; height: 9px; border-radius: 2px; }
.chart-wrap { position: relative; height: 190px; }

/* ── TABELA ── */
.table-filters {
  display: flex;
  gap: 7px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.tf {
  padding: 4px 10px;
  border-radius: 7px;
  border: 1px solid var(--pn-border);
  background: transparent;
  color: var(--pn-text-muted);
  font-size: 15px;
  cursor: pointer;
  transition: all .15s;
}
.tf.active {
  background: var(--pn-orange-soft);
  border-color: rgba(195,163,67,.3);
  color: var(--pn-orange);
}
.table-scroll { overflow-x: auto; }
.db-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.db-table th {
  font-size: 13px;
  color: var(--pn-text-dim);
  text-transform: uppercase;
  letter-spacing: .06em;
  padding: 6px 10px;
  border-bottom: 1px solid var(--pn-border-soft);
  text-align: left;
  font-weight: 500;
  white-space: nowrap;
}
.db-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--pn-border-soft);
  font-size: 14px;
  color: var(--pn-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.db-table tr:last-child td { border-bottom: none; }
.db-table tr:hover td { background: rgba(255,255,255,.02); }

.td-id  { color: var(--pn-orange) !important; font-weight: 600; }
.td-val { font-weight: 600; }
.td-muted { color: var(--pn-text-muted) !important; }

.urg {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  padding: 2px 7px;
  border-radius: 99px;
  font-weight: 600;
}
.urg--alta  { background: rgba(245,54,92,.12);    color: var(--pn-red); }
.urg--media { background: rgba(255,203,57,.12);   color: var(--pn-yellow); }
.urg--baixa { background: var(--pn-green-soft);   color: var(--pn-green); }

.cli-type {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}
.cli-type--b2b    { background: rgba(94,114,228,.15); color: var(--pn-blue); }
.cli-type--varejo { background: var(--pn-orange-soft); color: var(--pn-orange); }

.ord-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}
.ord-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ════════════════════════════
   RESPONSIVO
════════════════════════════ */
@media (max-width: 1100px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .mid-row  { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .db-sidebar    { display: none; }
  .kpi-grid      { grid-template-columns: 1fr 1fr; }
  .topbar-right  { display: none; }
}
@media (max-width: 480px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .prod-grid{ grid-template-columns: 1fr 1fr; }
}
</style>