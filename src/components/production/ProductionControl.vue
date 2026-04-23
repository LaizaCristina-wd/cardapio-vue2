<script setup>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import '@/assets/theme.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

// ── Setores ──────────────────────────────────────────────────────────────────
const sectors = ref([
  { id: 1, name: 'Produção de Congelados', icon: '🧊', employees: 25, capacity: 90 },
  { id: 2, name: 'Produção de Pão Especial', icon: '🥐', employees: 15, capacity: 75 },
  { id: 3, name: 'Produção de Pão Tradicional', icon: '🍞', employees: 10, capacity: 60 },
  { id: 4, name: 'Confeitaria', icon: '🎂', employees: 14, capacity: 85 },
  { id: 5, name: 'Embalagem e Expedição', icon: '📦', employees: 8, capacity: 50 },
  { id: 6, name: 'Controle de Qualidade', icon: '🔬', employees: 5, capacity: 40 },
])

const totalEmployees = ref(sectors.value.reduce((s, c) => s + c.employees, 0))

// ── Gráfico de Capacidade ─────────────────────────────────────────────────────
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
    tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` } },
  },
  scales: {
    x: { ticks: { color: '#415a77', font: { size: 16 } }, grid: { color: '#001d3d' } },
    y: {
      min: 0,
      max: 110,
      ticks: { color: '#415a77', font: { size: 15 }, callback: (v) => v + '%' },
      grid: { color: '#001d3d' },
    },
  },
})

const capacityColor = (pct) => {
  if (pct >= 85) return '#f87171'
  if (pct >= 60) return '#fbbf24'
  return '#4ade80'
}
</script>

<template>
  <div class="production-control">
    <!-- Resumo geral -->
    <div class="summary-strip">
      <div class="summary-card">
        <span class="summary-value">{{ totalEmployees }}</span>
        <span class="summary-label">Total de funcionários</span>
      </div>

      <div class="summary-card">
        <span class="summary-value">{{ sectors.length }}</span>
        <span class="summary-label">Setores ativos</span>
      </div>

      <div class="summary-card">
        <span class="summary-value">
          {{ Math.round(sectors.reduce((s, c) => s + c.capacity, 0) / sectors.length) }}%
        </span>
        <span class="summary-label">Capacidade média</span>
      </div>
    </div>

    <div class="main-grid">
      <!-- Setores -->
      <div class="sectors-section">
        <h2 class="section-title">Funcionários por Setor</h2>

        <div class="sectors-list">
          <div v-for="sector in sectors" :key="sector.id" class="sector-row">
            <span class="sector-icon">{{ sector.icon }}</span>

            <div class="sector-info">
              <div class="sector-top">
                <span class="sector-name">{{ sector.name }}</span>
                <span class="sector-count">
                  <strong>{{ sector.employees }}</strong> func.
                </span>
              </div>

              <div class="sector-bar-wrap">
                <div
                  class="sector-bar"
                  :style="{
                    width: sector.capacity + '%',
                    background: capacityColor(sector.capacity),
                  }"
                ></div>
              </div>

              <div class="sector-meta">
                <span
                  class="sector-capacity-label"
                  :style="{ color: capacityColor(sector.capacity) }"
                >
                  {{ sector.capacity }}% de capacidade
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de turnos -->
      <div class="chart-section">
        <div class="chart-header">
          <h2 class="section-title">Capacidade por Turno</h2>
          <div class="chart-legend">
            <span class="legend-dot" style="background: #c3a343"></span>
            <span>Utilizada</span>
            <span class="legend-dot" style="background: #003566; border: 1px solid #415a77"></span>
            <span>Disponível</span>
          </div>
        </div>
        <div class="chart-wrap">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>