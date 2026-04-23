<script setup>
import { inject } from 'vue'
import { useStore } from 'vuex'
import { NOTIFY } from '@/constants'
import '@/assets/theme.css'

// ────────────────────────────────────────────────────────────────────
// Props & Emits
// ────────────────────────────────────────────────────────────────────
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['remove-item'])

// ────────────────────────────────────────────────────────────────────
// Injeções
// ────────────────────────────────────────────────────────────────────
const store = useStore()
const notify = inject('notify')

// ────────────────────────────────────────────────────────────────────
// Constantes
// ────────────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────────
// Métodos
// ────────────────────────────────────────────────────────────────────
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
    <!-- Imagem/Emoji -->
    <div class="prod-img" :class="`prod-img--${item.cor || 'br'}`">
      {{ item.emoji || corEmoji[item.cor] || '🍞' }}
    </div>

    <!-- Conteúdo -->
    <div class="prod-body">
      <!-- Nome & Categoria -->
      <div class="prod-header">
        <div class="prod-name">{{ item.nome }}</div>
        <div class="prod-cat">{{ item.categoria }}</div>
      </div>

      <!-- Preços -->
      <div class="prod-prices">
        <span class="price-pill price-pill--ind">
          Ind {{ item.precoInd }}
        </span>
        <span class="price-pill price-pill--var">
          Var {{ item.precoVar }}
        </span>
      </div>

      <!-- Status de Estoque -->
      <span class="stock-badge" :class="`stock-badge--${item.estoque ?? 'ok'}`">
        ● {{ estoqueLabel[item.estoque ?? 'ok'] }}
      </span>

      <!-- Ações -->
      <div class="prod-actions">
        <button
          class="btn-delete"
          title="Remover este item"
          @click="emit('remove-item', item.id)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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