<script setup>
import { inject } from 'vue'
import { useStore } from 'vuex'
import { NOTIFY } from '@/constants'

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['remove-item'])

const store = useStore()
const notify = inject('notify')

const corEmoji = {
    br: '🍞',
    pt: '🥐',
    cr: '🍰',
    bf: '🥧',
}

const estoqueLabel = {
    ok: 'Estoque OK',
    mid: 'Estoque médio',
    low: 'Estoque baixo',
}

function addToCart() {
    if (props.item.estoque === 'low') {
        notify(`"${props.item.nome}" indisponível`, NOTIFY.ERROR)
        return
    }
    store.dispatch('cart/addToCart', {
        id: props.item.id,
        name: props.item.nome,
        price: props.item.precoInd,
        priceVar: props.item.precoVar,
        estoque: props.item.estoque,
    })
    notify(`"${props.item.nome}" adicionado aos pedidos`, NOTIFY.SUCCESS)
}
</script>

<template>
    <div class="prod-card">
        <div class="prod-img" :class="`prod-img--${item.cor || 'br'}`">
            {{ item.emoji || corEmoji[item.cor] || '🍞' }}
        </div>

        <div class="prod-body">
            <div class="prod-name">{{ item.nome }}</div>
            <div class="prod-cat">{{ item.categoria }}</div>

            <div class="prod-prices">
                <span class="price-pill price-pill--ind">Ind {{ item.precoInd }}</span>
                <span class="price-pill price-pill--var">Var {{ item.precoVar}}</span>
            </div>

                    <span class="stock-badge" :class="`stock-badge--${item.estoque ?? 'ok'}`">
                        ● {{ estoqueLabel[item.estoque ?? 'ok'] }}
                    </span>

            <div class="prod-actions">
                <button
                    class="btn-delete"
                    title="Remover"
                    @click="emit('remove-item', item.id)"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                    Remover
                </button>

                <button
                    class="btn-add"
                    :disabled="item.estoque === 'low'"
                    @click="addToCart"
                >
                    + Pedido
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.prod-card {
    background: #002952;
    border: 1px solid #003566;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: border-color 0.2s, transform 0.2s;
}
.prod-card:hover {
    border-color: #c3a343;
    transform: translateY(-2px);
}

.prod-img {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 38px;
}
.prod-img--br { background: linear-gradient(135deg, #1a3a2a, #0d2418); }
.prod-img--pt { background: linear-gradient(135deg, #1a2a3a, #0d1824); }
.prod-img--cr { background: linear-gradient(135deg, #2a1a2a, #1a0d1a); }
.prod-img--bf { background: linear-gradient(135deg, #2a2a1a, #1a1a0d); }

.prod-body {
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.prod-name { font-size: 14px; font-weight: 600; color: #c0ccd8; }
.prod-cat  { font-size: 11px; color: #415a77; }

.prod-prices { display: flex; gap: 6px; flex-wrap: wrap; }

.price-pill {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
}
.price-pill--ind { background: rgba(0, 53, 102, 0.6); color: #7aadda; }
.price-pill--var { background: rgba(195, 163, 67, 0.15); color: #c3a343; }

.stock-badge       { font-size: 11px; font-weight: 600; }
.stock-badge--ok   { color: #4ade80; }
.stock-badge--mid  { color: #fbbf24; }
.stock-badge--low  { color: #f87171; }

.prod-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 8px;
}

.btn-delete {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #f87171;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px 0;
    transition: opacity 0.2s;
}
.btn-delete:hover { opacity: 0.75; }
.btn-delete svg   { width: 13px; height: 13px; }

.btn-add {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    border: none;
    background: #c3a343;
    color: #001f3f;
    cursor: pointer;
    transition: opacity 0.2s;
}
.btn-add:hover    { opacity: 0.85; }
.btn-add:disabled {
    background: #415a77;
    color: #1a2f45;
    cursor: not-allowed;
    opacity: 1;
}
</style>