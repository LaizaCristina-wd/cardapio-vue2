<script setup>
import { ref, computed, inject } from 'vue'
import { useStore } from 'vuex'
import { formatBRL } from '@/utils/formatarMoeda'
import { NOTIFY } from '@/constants'

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

<style scoped>
/* ───────── Layout ───────── */
.lg-page {
    padding: 1.5rem;
}

.lg-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.75rem;
}

.lg-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--pn-text);
    margin: 0 0 4px;
}

.lg-subtitle {
    font-size: 13px;
    color: var(--pn-text-muted);
    margin: 0;
}

.lg-badge {
    background: var(--pn-orange-soft);
    color: var(--pn-orange);
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid rgba(195, 163, 67, 0.3);
    white-space: nowrap;
}

/* ───────── Grid Colunas ───────── */
.lg-grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 1.25rem;
    align-items: start;
}

@media (max-width: 960px) {
    .lg-grid {
        grid-template-columns: 1fr;
    }
}

/* ───────── Card ───────── */
.lg-card {
    background: var(--pn-panel);
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius);
    padding: 1.5rem;
}

.lg-card-header {
    margin-bottom: 1.25rem;
}

.lg-card-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--pn-text);
    margin: 0 0 4px;
}

.lg-card-sub {
    font-size: 12px;
    color: var(--pn-text-muted);
    margin: 0;
}

/* ───────── Produtos ───────── */
.lg-product-list {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.lg-product-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 12px 0;
    border-bottom: 1px solid var(--pn-border-soft);
}

.lg-product-row:last-child {
    border-bottom: none;
}

.lg-product-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.lg-product-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--pn-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lg-product-price {
    font-size: 12px;
    color: var(--pn-text-muted);
}

.lg-qty-control {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}

.lg-qty-btn {
    width: 30px;
    height: 30px;
    border-radius: var(--pn-radius-sm);
    border: 1px solid var(--pn-border);
    background: var(--pn-bg-2);
    color: var(--pn-text);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, border-color 0.15s;
    padding: 0;
    line-height: 1;
}

.lg-qty-btn:hover:not(:disabled) {
    background: var(--pn-panel-2);
    border-color: var(--pn-orange);
    color: var(--pn-orange);
}

.lg-qty-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.lg-qty-input {
    width: 68px;
    text-align: center;
    background: var(--pn-bg-2);
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius-sm);
    color: var(--pn-text);
    font-size: 13px;
    font-weight: 500;
    padding: 5px 6px;
    outline: none;
    transition: border-color 0.15s;
}

.lg-qty-input:focus {
    border-color: var(--pn-orange);
}

.lg-qty-input::-webkit-inner-spin-button,
.lg-qty-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
}

.lg-total-units {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--pn-border);
}

.lg-units-value {
    font-size: 15px;
    font-weight: 700;
    color: var(--pn-orange);
}

/* ───────── Frete ───────── */
.lg-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 1rem;
}

@media (max-width: 480px) {
    .lg-fields {
        grid-template-columns: 1fr;
    }
}

.lg-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 0.75rem;
}

.lg-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--pn-text-muted);
}

.lg-input {
    background: var(--pn-bg-2);
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius-sm);
    color: var(--pn-text);
    font-size: 14px;
    padding: 9px 12px;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
}

.lg-input::placeholder {
    color: var(--pn-text-dim);
}

.lg-input:focus {
    border-color: var(--pn-orange);
    box-shadow: 0 0 0 3px var(--pn-orange-soft);
}

.lg-input::-webkit-inner-spin-button,
.lg-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
}

/* ───────── Transporte ───────── */
.lg-transport-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.lg-transport-opt {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    border-radius: var(--pn-radius-sm);
    border: 1px solid var(--pn-border);
    background: var(--pn-bg-2);
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s, background 0.15s;
    width: 100%;
}

.lg-transport-opt:hover {
    border-color: var(--pn-orange);
    background: var(--pn-panel-2);
}

.lg-transport-opt.is-active {
    border-color: var(--pn-orange);
    background: var(--pn-orange-soft);
}

.lg-opt-icon {
    font-size: 20px;
    line-height: 1;
}

.lg-opt-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--pn-text);
}

.lg-transport-opt.is-active .lg-opt-name {
    color: var(--pn-orange);
}

.lg-opt-cap {
    font-size: 11px;
    color: var(--pn-text-muted);
    margin-top: 2px;
}

/* ───────── Divider ───────── */
.lg-divider {
    height: 1px;
    background: var(--pn-border-soft);
    margin: 1rem 0;
}

/* ───────── Resultado Frete ───────── */
.lg-freight-box {
    background: var(--pn-bg-2);
    border: 1px solid var(--pn-border-soft);
    border-radius: var(--pn-radius-sm);
    padding: 12px 14px;
    margin-bottom: 1rem;
}

.lg-freight-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed var(--pn-border);
}

.lg-freight-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--pn-text);
}

.lg-freight-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.lg-freight-value {
    font-size: 20px;
    font-weight: 800;
    color: var(--pn-orange);
}

/* ───────── Botão Enviar ───────── */
.lg-send-btn {
    width: 100%;
    padding: 11px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    background: var(--pn-orange);
    color: #000;
    border: none;
    border-radius: var(--pn-radius-sm);
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
}

.lg-send-btn:hover:not(:disabled) {
    opacity: 0.88;
}

.lg-send-btn:active:not(:disabled) {
    transform: scale(0.98);
}

.lg-send-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.lg-hint {
    font-size: 11px;
    color: var(--pn-text-dim);
    text-align: center;
    margin-top: 8px;
    margin-bottom: 0;
}

/* ───────── Semânticas ───────── */
.lg-soft {
    color: var(--pn-text-muted);
}

.lg-warn {
    color: var(--pn-yellow);
    font-weight: 500;
}

/* ───────── Estado Vazio ───────── */
.lg-empty {
    background: var(--pn-panel);
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius);
    padding: 3rem 2rem;
    text-align: center;
}

.lg-empty-icon {
    font-size: 40px;
    margin-bottom: 1rem;
}

.lg-empty-text {
    font-size: 16px;
    font-weight: 500;
    color: var(--pn-text);
    margin-bottom: 6px;
}

.lg-empty-sub {
    font-size: 13px;
    color: var(--pn-text-muted);
    margin: 0;
}

.lg-empty-sub a {
    color: var(--pn-orange);
}
</style>