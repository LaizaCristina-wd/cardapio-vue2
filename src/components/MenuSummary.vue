<script setup>
import { formatBRL } from '@/utils/formatarMoeda'
import '@/assets/theme.css'

// ────────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────────
defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  availableItems: {
    type: Number,
    required: true,
  },
  averagePrice: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="menu-summary">
    <!-- Total de itens -->
    <div class="summary-kpi">
      <div class="summary-kpi-header">
        <span class="summary-kpi-icon">🍰</span>
        <span class="summary-kpi-label">Total de itens</span>
      </div>
      <div class="summary-kpi-value">
        {{ totalItems }}
      </div>
    </div>

    <!-- Disponíveis -->
    <div class="summary-kpi">
      <div class="summary-kpi-header">
        <span class="summary-kpi-icon">✓</span>
        <span class="summary-kpi-label">Disponíveis</span>
      </div>
      <div class="summary-kpi-value summary-kpi-value--green">
        {{ availableItems }}
      </div>
    </div>

    <!-- Preço médio -->
    <div class="summary-kpi">
      <div class="summary-kpi-header">
        <span class="summary-kpi-icon">R$</span>
        <span class="summary-kpi-label">Preço médio</span>
      </div>
      <div class="summary-kpi-value">
        {{ formatBRL(averagePrice) }}
      </div>
    </div>
  </div>
</template>
