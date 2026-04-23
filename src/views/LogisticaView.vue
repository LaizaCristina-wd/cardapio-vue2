<script setup>
import { ref, computed, inject } from 'vue'
import { useStore } from 'vuex'
import { formatBRL } from '@/utils/formatarMoeda'
import { NOTIFY } from '@/constants'
import '@/assets/theme.css'

const store = useStore()
const notify = inject('notify')

const items = computed(() => store.getters['cart/items'])
const isEmpty = computed(() => store.getters['cart/isEmpty'])

const cep = ref('')
const distance = ref('')
const transport = ref('')

const RATES = { minivan: 2.8, caminhao: 5.5 }

const quantities = ref({})

function getQty(id) {
    if (!quantities.value[id]) quantities.value[id] = 50
    return quantities.value[id]
}

function setQty(id, val) {
    const num = Math.max(50, parseInt(val) || 50)
    quantities.value[id] = num
}

const totalUnits = computed(() =>
    items.value.reduce((acc, item) => acc + getQty(item.id), 0)
)

const freightValue = computed(() => {
    const dist = parseFloat(distance.value) || 0
    if (!transport.value || dist <= 0 || isEmpty.value) return null
    const rate = RATES[transport.value]
    const base = dist * rate
    const mult = totalUnits.value > 500 ? 1.15 : 1
    return +(base * mult).toFixed(2)
})

const canSend = computed(() =>
    !isEmpty.value &&
    cep.value.replace(/\D/g, '').length === 8 &&
    parseFloat(distance.value) > 0 &&
    transport.value !== ''
)

function formatCep(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8)
    cep.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v
}

function submitOrder() {
    const transportLabel = transport.value === 'minivan' ? 'Minivan' : 'Caminhão'
    notify(
        `Pedido enviado via ${transportLabel} — Frete ${formatBRL(freightValue.value ?? 0)}`,
        NOTIFY.SUCCESS
    )
    store.dispatch('cart/clearCart')
    cep.value = ''
    distance.value = ''
    transport.value = ''
    quantities.value = {}
}
</script>

<template>
    <div class="lg-page">

        <!-- Cabeçalho da Página -->
        <div class="lg-header">
            <div>
                <h1 class="lg-title">Logística de Entrega</h1>
                <p class="lg-subtitle">Configure o envio dos produtos selecionados</p>
            </div>
            <span v-if="!isEmpty" class="lg-badge">{{ items.length }} produto(s)</span>
        </div>

        <!-- Estado Vazio -->
        <div v-if="isEmpty" class="lg-empty">
            <div class="lg-empty-icon">📦</div>
            <p class="lg-empty-text">Nenhum produto no carrinho.</p>
            <p class="lg-empty-sub">
                Adicione itens pela
                <router-link :to="{ name: 'menu' }">página de cardápio</router-link>
                para montar um pedido de entrega.
            </p>
        </div>

        <div v-else class="lg-grid">

            <!-- Coluna Esquerda: Produtos -->
            <section class="lg-col-left">
                <div class="lg-card">
                    <div class="lg-card-header">
                        <h2 class="lg-card-title">Produtos selecionados</h2>
                        <p class="lg-card-sub">Defina as quantidades para entrega (mín. 50 un.)</p>
                    </div>

                    <div class="lg-product-list">
                        <div
                            v-for="item in items"
                            :key="item.id"
                            class="lg-product-row"
                        >
                            <div class="lg-product-info">
                                <span class="lg-product-name">{{ item.name }}</span>
                                <span class="lg-product-price">{{ formatBRL(item.price) }} / un.</span>
                            </div>
                            <div class="lg-qty-control">
                                <button
                                    class="lg-qty-btn"
                                    @click="setQty(item.id, getQty(item.id) - 10)"
                                    :disabled="getQty(item.id) <= 50"
                                >−</button>
                                <input
                                    class="lg-qty-input"
                                    type="number"
                                    min="50"
                                    step="10"
                                    :value="getQty(item.id)"
                                    @input="setQty(item.id, $event.target.value)"
                                />
                                <button
                                    class="lg-qty-btn"
                                    @click="setQty(item.id, getQty(item.id) + 10)"
                                >+</button>
                            </div>
                        </div>
                    </div>

                    <div class="lg-total-units">
                        <span class="lg-soft">Total de unidades</span>
                        <span class="lg-units-value">{{ totalUnits.toLocaleString('pt-BR') }} un.</span>
                    </div>
                </div>
            </section>

            <!-- Coluna Direita: Frete + Envio -->
            <aside class="lg-col-right">
                <div class="lg-card">
                    <div class="lg-card-header">
                        <h2 class="lg-card-title">Calcular frete</h2>
                        <p class="lg-card-sub">Preencha os dados de destino e transporte</p>
                    </div>

                    <!-- Campos de Destino -->
                    <div class="lg-fields">
                        <div class="lg-field">
                            <label class="lg-label">CEP de destino</label>
                            <input
                                class="lg-input"
                                type="text"
                                placeholder="00000-000"
                                maxlength="9"
                                :value="cep"
                                @input="formatCep"
                            />
                        </div>
                        <div class="lg-field">
                            <label class="lg-label">Distância estimada (km)</label>
                            <input
                                class="lg-input"
                                type="number"
                                placeholder="ex: 120"
                                min="1"
                                v-model="distance"
                            />
                        </div>
                    </div>

                    <div class="lg-divider"></div>
                    <!-- Seleção de Transporte -->
                    <div class="lg-field">
                        <label class="lg-label">Meio de transporte</label>
                        <div class="lg-transport-grid">
                            <button
                                class="lg-transport-opt"
                                :class="{ 'is-active': transport === 'minivan' }"
                                @click="transport = 'minivan'"
                            >
                                <span class="lg-opt-icon">🚐</span>
                                <div>
                                    <div class="lg-opt-name">Minivan</div>
                                    <div class="lg-opt-cap">Até 1.5 t · R$ 2,80/km</div>
                                </div>
                            </button>
                            <button
                                class="lg-transport-opt"
                                :class="{ 'is-active': transport === 'caminhao' }"
                                @click="transport = 'caminhao'"
                            >
                                <span class="lg-opt-icon">🚛</span>
                                <div>
                                    <div class="lg-opt-name">Caminhão</div>
                                    <div class="lg-opt-cap">Até 8 t · R$ 5,50/km</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div class="lg-divider"></div>

                    <!-- Resultado do Frete -->
                    <div class="lg-freight-box">
                        <div class="lg-freight-rows">
                            <div class="lg-freight-row">
                                <span class="lg-soft">Unidades</span>
                                <span>{{ totalUnits.toLocaleString('pt-BR') }} un.</span>
                            </div>
                            <div class="lg-freight-row">
                                <span class="lg-soft">Distância</span>
                                <span>{{ distance ? distance + ' km' : '—' }}</span>
                            </div>
                            <div class="lg-freight-row">
                                <span class="lg-soft">Volume extra (+15%)</span>
                                <span :class="totalUnits > 500 ? 'lg-warn' : 'lg-soft'">
                                    {{ totalUnits > 500 ? 'Aplicado' : 'Não aplicado' }}
                                </span>
                            </div>
                        </div>
                        <div class="lg-freight-total">
                            <span class="lg-soft">Valor do frete</span>
                            <span class="lg-freight-value">
                                {{ freightValue !== null ? formatBRL(freightValue) : '—' }}
                            </span>
                        </div>
                    </div>

                    <!-- Botão de Envio -->
                    <button
                        class="lg-send-btn"
                        :disabled="!canSend"
                        @click="submitOrder"
                    >
                        Enviar pedido
                    </button>
                    <p v-if="!canSend" class="lg-hint">
                        Preencha CEP, distância e selecione um transporte para enviar.
                    </p>
                </div>
            </aside>

        </div>
    </div>
</template>