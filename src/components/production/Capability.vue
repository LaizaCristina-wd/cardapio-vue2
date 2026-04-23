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
