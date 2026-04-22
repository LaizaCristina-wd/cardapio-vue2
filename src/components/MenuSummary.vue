<script setup>
    import { formatBRL } from '@/utils/formatarMoeda';

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
    <div class="row g-3 mb-3">
        <div class="col-12 col-md-4">
            <div class="pn-kpi">
                <div class="pn-kpi-label">
                    <span class="pn-kpi-icon">🍰</span>
                    Total de itens
                </div>
                <div class="pn-kpi-value">{{ totalItems }}</div>
            </div>
        </div>
        <div class="col-12 col-md-4">
            <div class="pn-kpi">
                <div class="pn-kpi-label">
                    <span class="pn-kpi-icon">✓</span>
                    Disponíveis
                </div>
                <div class="pn-kpi-value" style="color: var(--pn-green)">{{ availableItems }}</div>
            </div>
        </div>
        <div class="col-12 col-md-4">
            <div class="pn-kpi">
                <div class="pn-kpi-label">
                    <span class="pn-kpi-icon">R$</span>
                    Preço médio
                </div>
                <div class="pn-kpi-value">{{ formatBRL(averagePrice) }}</div>
            </div>
        </div>
    </div>
</template>
