<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
    legend: {
      display: true,
      labels: { color: '#c0ccd8', font: { size: 12 }, boxWidth: 12 },
    },
    tooltip: {
      callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` },
    },
  },
  scales: {
    x: {
      ticks: { color: '#415a77', font: { size: 13 } },
      grid: { color: '#001d3d' },
    },
    y: {
      min: 0,
      max: 110,
      ticks: { color: '#415a77', font: { size: 13 }, callback: (v) => v + '%' },
      grid: { color: '#003566' },
    },
  },
})

const supplies = ref([
  { name: 'Farinha de Trigo',  unit: 'kg',  stock: 320, min: 100, max: 500, icon: '🌾' },
  { name: 'Fermento',          unit: 'kg',  stock: 18,  min: 20,  max: 80,  icon: '🧪' },
  { name: 'Manteiga',          unit: 'kg',  stock: 45,  min: 30,  max: 100, icon: '🧈' },
  { name: 'Ovos',              unit: 'un',  stock: 840, min: 200, max: 1200,icon: '🥚' },
  { name: 'Açúcar',            unit: 'kg',  stock: 95,  min: 50,  max: 200, icon: '🍬' },
  { name: 'Sal',               unit: 'kg',  stock: 12,  min: 15,  max: 60,  icon: '🧂' },
])

const stockPercent = (s) => Math.round((s.stock / s.max) * 100)

const stockColor = (s) => {
  const pct = stockPercent(s)
  if (s.stock < s.min) return '#f87171'
  if (pct < 40) return '#fbbf24'
  return '#4ade80'
}

const stockLabel = (s) => {
  if (s.stock < s.min) return 'Crítico'
  if (stockPercent(s) < 40) return 'Baixo'
  return 'OK'
}
</script>

<template>
  <div class="capability">
    <div class="top-grid">
      <!-- Chart -->
      <div class="chart-section">
        <h2 class="section-title">Capacidade de Produção por Turno</h2>
        <div class="chart-wrap">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Stock summary -->
      <div class="stock-summary">
        <h2 class="section-title">Resumo de Insumos</h2>
        <div class="supplies-list">
          <div v-for="s in supplies" :key="s.name" class="supply-row">
            <span class="supply-icon">{{ s.icon }}</span>
            <div class="supply-info">
              <div class="supply-name-row">
                <span class="supply-name">{{ s.name }}</span>
                <span class="supply-badge" :style="{ color: stockColor(s), borderColor: stockColor(s) }">
                  {{ stockLabel(s) }}
                </span>
              </div>
              <div class="supply-bar-wrap">
                <div
                  class="supply-bar"
                  :style="{ width: stockPercent(s) + '%', background: stockColor(s) }"
                ></div>
              </div>
              <span class="supply-qty">{{ s.stock }} {{ s.unit }} / {{ s.max }} {{ s.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.capability { color: #e0e0e0; }

.top-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffd60a;
  margin: 0 0 16px 0;
}

/* Chart */
.chart-section {
  background: #001d3d;
  border: 1px solid #003566;
  border-radius: 10px;
  padding: 18px;
}

.chart-wrap {
  height: 280px;
}

/* Stock */
.stock-summary {
  background: #001d3d;
  border: 1px solid #003566;
  border-radius: 10px;
  padding: 18px;
}

.supplies-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.supply-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.supply-icon {
  font-size: 20px;
  margin-top: 2px;
}

.supply-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.supply-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.supply-name {
  font-size: 13px;
  font-weight: 500;
  color: #c0ccd8;
}

.supply-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 20px;
  border: 1px solid;
  background: transparent;
}

.supply-bar-wrap {
  height: 5px;
  background: #003566;
  border-radius: 999px;
  overflow: hidden;
}

.supply-bar {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.supply-qty {
  font-size: 11px;
  color: #415a77;
}

@media (max-width: 900px) {
  .top-grid { grid-template-columns: 1fr; }
}
</style>