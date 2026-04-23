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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

/* ─── BASE ─── */
.sr-toast {
    font-family: 'DM Sans', sans-serif;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 280px;
    max-width: 420px;
    padding: 0.75rem 0.875rem;
    border-radius: 10px;
    border: 1px solid var(--pn-border);
    background: var(--pn-panel);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.04);
    overflow: hidden;
    animation: sr-toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes sr-toast-in {
    from { opacity: 0; transform: translateX(20px) scale(0.96); }
    to   { opacity: 1; transform: translateX(0)   scale(1); }
}

/* Linha superior colorida */
.sr-toast::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 10px 10px 0 0;
}

/* ─── PROGRESS BAR ─── */
.sr-toast-progress {
    position: absolute;
    bottom: 0; left: 0;
    height: 2px;
    width: 100%;
    transform-origin: left;
    animation: sr-progress linear forwards;
    border-radius: 0 0 10px 10px;
}

@keyframes sr-progress {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
}

/* ─── ICON ─── */
.sr-toast-icon {
    width: 26px; height: 26px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    border: 1px solid transparent;
}

/* ─── MESSAGE ─── */
.sr-toast-message {
    flex: 1;
    font-size: 0.825rem;
    font-weight: 400;
    color: var(--pn-text);
    line-height: 1.4;
}

/* ─── CLOSE ─── */
.sr-toast-close {
    display: grid;
    place-items: center;
    width: 22px; height: 22px;
    border-radius: 5px;
    border: none;
    background: transparent;
    color: var(--pn-text-dim);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    flex-shrink: 0;
    padding: 0;
}
.sr-toast-close:hover {
    background: rgba(255,255,255,0.06);
    color: var(--pn-text);
}

/* ═══════════════════════════════
   VARIANTES
═══════════════════════════════ */

/* SUCCESS */
.sr-toast--success::before { background: linear-gradient(90deg, var(--pn-green), transparent); }
.sr-toast--success .sr-toast-progress { background: var(--pn-green); opacity: 0.4; }
.sr-toast--success .sr-toast-icon {
    color: var(--pn-green);
    background: var(--pn-green-soft);
    border-color: rgba(45, 206, 137, 0.2);
}

/* ERROR */
.sr-toast--error::before { background: linear-gradient(90deg, var(--pn-red), transparent); }
.sr-toast--error .sr-toast-progress { background: var(--pn-red); opacity: 0.4; }
.sr-toast--error .sr-toast-icon {
    color: var(--pn-red);
    background: rgba(245, 54, 92, 0.12);
    border-color: rgba(245, 54, 92, 0.2);
}

/* INFO */
.sr-toast--info::before { background: linear-gradient(90deg, var(--pn-orange), transparent); }
.sr-toast--info .sr-toast-progress { background: var(--pn-orange); opacity: 0.5; }
.sr-toast--info .sr-toast-icon {
    color: var(--pn-orange);
    background: var(--pn-orange-soft);
    border-color: rgba(195, 163, 67, 0.2);
}
</style>