<script setup>
import { onMounted, onUnmounted } from 'vue'
import { NOTIFY } from '@/constants'

const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: NOTIFY.SUCCESS,
        validator: (val) => Object.values(NOTIFY).includes(val),
    },
    duration: {
        type: Number,
        default: 3000,
    },
})

const emit = defineEmits(['dismiss'])

let timerId = null

onMounted(() => {
    timerId = setTimeout(() => emit('dismiss'), props.duration)
})

onUnmounted(() => {
    clearTimeout(timerId)
})
</script>

<template>
    <div :class="['sr-toast', `sr-toast--${type}`]" role="alert">

        <!-- Barra de progresso -->
        <div class="sr-toast-progress" :style="{ animationDuration: `${duration}ms` }"></div>

        <!-- Ícone -->
        <div class="sr-toast-icon">
            <!-- Success -->
            <svg v-if="type === 'NOTIFY.SUCCESS'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            <!-- Error -->
            <svg v-else-if="type === 'NOTIFY.ERROR'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            <!-- Info -->
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        </div>

        <!-- Mensagem -->
        <span class="sr-toast-message">{{ message }}</span>

        <!-- Fechar -->
        <button class="sr-toast-close" @click="emit('dismiss')" aria-label="Fechar">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>

    </div>
</template>

