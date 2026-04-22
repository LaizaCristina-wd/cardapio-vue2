<script setup>
    import { inject } from 'vue'
    import { useStore } from 'vuex'
    import { formatBRL } from '@/utils/formatarMoeda'
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

    function addToCart() {
        if (!props.item.estoque !=='ok') {
            notify(`"${props.item.nome}" indisponível`, NOTIFY.ERROR)
            return
        }
        store.dispatch('cart/addToCart', {
            id: props.item.id,
            name: props.item.nome,
            price: props.item.precoInd,
            priceVar: props.item.precoVar,
        })
        notify(`"${props.item.name}" adicionado aos pedidos`, NOTIFY.SUCCESS)
    }
</script>
<template>
    <div class="pn-menu-card" :class="{ unavailable: item.estoque !== 'ok' }">
        <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="pn-tag">{{ item.categoria }}</span>

            <button
                class="btn btn-ghost btn-sm"
                style="width: 32px; height: 32px; padding: 0"
                title="Remover"
                @click="emit('remove-item', item.id)"
            >
                ✕
            </button>
        </div>

        <h3 class="pn-menu-name">{{ item.nome }}</h3>

        <div class="pn-menu-price">
            {{ item.precoInd }}
        </div>

        <div class="d-flex justify-content-between align-items-center mt-auto">
            <span
                :class="['pn-pill', item.estoque === 'ok' ? 'done' : 'cancelled']"
            >
                {{ item.estoque === 'ok' ? 'Disponível' : 'Indisponível' }}
            </span>

            <button
                class="btn btn-primary btn-sm"
                :disabled="item.estoque !== 'ok'"
                @click="addToCart"
            >
                + Pedido
            </button>
        </div>
    </div>
</template>