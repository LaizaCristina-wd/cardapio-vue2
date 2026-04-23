<script setup>
import { ref, inject } from 'vue'
import { NOTIFY } from '@/constants'

const notify = inject('notify')
const email = ref('')
const message = ref('')
const reportType = ref('')
const period = ref('')
const sending = ref(false)

const reportTypes = [
    { value: 'vendas', label: 'Vendas', icon: '📈' },
    { value: 'estoque', label: 'Estoque', icon: '📦' },
    { value: 'logistica', label: 'Logística', icon: '🚚' },
    { value: 'financeiro', label: 'Financeiro', icon: '💰' },
]

const periods = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: 'custom', label: 'Personalizado' },
]

async function send() {
    if (!email.value || !message.value) {
        notify('Preencha e-mail e mensagem', NOTIFY.ERROR)
        return
    }
    sending.value = true
    await new Promise(r => setTimeout(r, 900))
    notify(`Relatório enviado para ${email.value}`, NOTIFY.SUCCESS)
    email.value = ''
    message.value = ''
    reportType.value = ''
    period.value = ''
    sending.value = false
}
</script>

<template>
    <div class="rp-page">

        <!-- Topo da página -->
        <div class="rp-header">
            <div class="rp-header-left">
                <div class="rp-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                    <h1 class="rp-title">Central de Relatórios</h1>
                    <p class="rp-subtitle">Solicite, exporte e envie relatórios corporativos</p>
                </div>
            </div>
            <div class="rp-status">
                <span class="rp-dot"></span>
                Sistema operacional
            </div>
        </div>

        <!-- KPI Strip -->
        <div class="rp-kpi-strip">
            <div class="rp-kpi">
                <span class="rp-kpi-value">48</span>
                <span class="rp-kpi-label">Relatórios gerados</span>
            </div>
            <div class="rp-kpi-divider"></div>
            <div class="rp-kpi">
                <span class="rp-kpi-value">12</span>
                <span class="rp-kpi-label">Este mês</span>
            </div>
            <div class="rp-kpi-divider"></div>
            <div class="rp-kpi">
                <span class="rp-kpi-value">3</span>
                <span class="rp-kpi-label">Aguardando envio</span>
            </div>
            <div class="rp-kpi-divider"></div>
            <div class="rp-kpi">
                <span class="rp-kpi-value rp-kpi-gold">100%</span>
                <span class="rp-kpi-label">Taxa de entrega</span>
            </div>
        </div>

        <!-- Grid Principal -->
        <div class="rp-grid">

            <!-- Formulário de Envio -->
            <section class="rp-card rp-form-card">
                <div class="rp-card-header">
                    <div class="rp-card-title-row">
                        <span class="rp-section-tag">Solicitação</span>
                        <h2 class="rp-card-title">Enviar relatório por e-mail</h2>
                    </div>
                    <p class="rp-card-sub">Preencha os dados abaixo para enviar um relatório personalizado</p>
                </div>

                <form @submit.prevent="send" class="rp-form">
                    <!-- Tipo de Relatório -->
                    <div class="rp-field">
                        <label class="rp-label">Tipo de relatório</label>
                        <div class="rp-type-grid">
                            <button
                                v-for="rt in reportTypes"
                                :key="rt.value"
                                type="button"
                                class="rp-type-btn"
                                :class="{ 'is-active': reportType === rt.value }"
                                @click="reportType = rt.value"
                            >
                                <span class="rp-type-icon">{{ rt.icon }}</span>
                                <span class="rp-type-label">{{ rt.label }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Período -->
                    <div class="rp-field">
                        <label class="rp-label">Período de análise</label>
                        <div class="rp-period-grid">
                            <button
                                v-for="p in periods"
                                :key="p.value"
                                type="button"
                                class="rp-period-btn"
                                :class="{ 'is-active': period === p.value }"
                                @click="period = p.value"
                            >{{ p.label }}</button>
                        </div>
                    </div>

                    <div class="rp-divider"></div>

                    <!-- Email -->
                    <div class="rp-field">
                        <label class="rp-label">E-mail destinatário</label>
                        <div class="rp-input-wrap">
                            <svg class="rp-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <input
                                v-model.trim="email"
                                type="email"
                                class="rp-input"
                                placeholder="destinatario@empresa.com"
                            />
                        </div>
                    </div>

                    <!-- Mensagem -->
                    <div class="rp-field">
                        <label class="rp-label">Observações / instruções</label>
                        <textarea
                            v-model.trim="message"
                            class="rp-textarea"
                            rows="4"
                            placeholder="Inclua contexto, filtros específicos ou instruções adicionais para o relatório..."
                        ></textarea>
                    </div>

                    <!-- Ações -->
                    <div class="rp-actions">
                        <button
                            type="button"
                            class="rp-btn-secondary"
                            @click="email = ''; message = ''; reportType = ''; period = ''"
                        >
                            Limpar campos
                        </button>
                        <button type="submit" class="rp-btn-primary" :disabled="sending">
                            <span v-if="sending" class="rp-spinner"></span>
                            <span v-else>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:-2px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                Enviar relatório
                            </span>
                        </button>
                    </div>
                </form>
            </section>

            <!-- Painel Lateral -->
            <aside class="rp-side">

                <!-- Histórico Recente -->
                <div class="rp-card">
                    <div class="rp-card-header">
                        <span class="rp-section-tag">Histórico</span>
                        <h2 class="rp-card-title">Enviados recentemente</h2>
                    </div>
                    <div class="rp-history">
                        <div class="rp-history-item" v-for="h in [
                            { type: 'Financeiro', to: 'gerencia@empresa.com', date: 'Hoje, 09:14', status: 'ok' },
                            { type: 'Vendas', to: 'comercial@empresa.com', date: 'Ontem, 17:32', status: 'ok' },
                            { type: 'Estoque', to: 'ops@empresa.com', date: '20 jun, 11:00', status: 'ok' },
                            { type: 'Logística', to: 'frota@empresa.com', date: '18 jun, 08:45', status: 'pending' },
                        ]" :key="h.date">
                            <div class="rp-hist-info">
                                <span class="rp-hist-type">{{ h.type }}</span>
                                <span class="rp-hist-to">{{ h.to }}</span>
                                <span class="rp-hist-date">{{ h.date }}</span>
                            </div>
                            <span class="rp-hist-status" :class="h.status === 'ok' ? 'st-ok' : 'st-pending'">
                                {{ h.status === 'ok' ? 'Entregue' : 'Pendente' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Formatos disponíveis -->
                <div class="rp-card rp-formats-card">
                    <div class="rp-card-header">
                        <span class="rp-section-tag">Exportação</span>
                        <h2 class="rp-card-title">Formatos disponíveis</h2>
                    </div>
                    <div class="rp-formats">
                        <div class="rp-format-item" v-for="f in [
                            { ext: 'PDF', desc: 'Relatório formatado', color: '#f5365c' },
                            { ext: 'XLSX', desc: 'Planilha de dados', color: '#2dce89' },
                            { ext: 'CSV', desc: 'Exportação bruta', color: '#5e72e4' },
                        ]" :key="f.ext">
                            <span class="rp-format-badge" :style="{ background: f.color + '22', color: f.color, borderColor: f.color + '44' }">{{ f.ext }}</span>
                            <span class="rp-format-desc">{{ f.desc }}</span>
                        </div>
                    </div>
                </div>

            </aside>
        </div>
    </div>
</template>

<style scoped>
/* ── Layout ── */
.rp-page {
    padding: 1.5rem;
}

.rp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
}

.rp-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.rp-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--pn-orange-soft);
    border: 1px solid rgba(195, 163, 67, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pn-orange);
    flex-shrink: 0;
}

.rp-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--pn-text);
    margin: 0 0 3px;
}

.rp-subtitle {
    font-size: 12px;
    color: var(--pn-text-muted);
    margin: 0;
}

.rp-status {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: var(--pn-green);
    background: var(--pn-green-soft);
    border: 1px solid rgba(45, 206, 137, 0.25);
    border-radius: 20px;
    padding: 5px 12px;
    font-weight: 500;
}

.rp-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--pn-green);
    display: inline-block;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

/* ── KPI Strip ── */
.rp-kpi-strip {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--pn-panel);
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius);
    padding: 1rem 1.5rem;
    margin-bottom: 1.25rem;
    overflow-x: auto;
}

.rp-kpi {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    min-width: 90px;
}

.rp-kpi-divider {
    width: 1px;
    height: 36px;
    background: var(--pn-border);
    flex-shrink: 0;
    margin: 0 1.5rem;
}

.rp-kpi-value {
    font-size: 22px;
    font-weight: 800;
    color: var(--pn-text);
    line-height: 1;
}

.rp-kpi-gold {
    color: var(--pn-orange);
}

.rp-kpi-label {
    font-size: 11px;
    color: var(--pn-text-muted);
}

/* ── Grid ── */
.rp-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 1.25rem;
    align-items: start;
}

@media (max-width: 1024px) {
    .rp-grid { grid-template-columns: 1fr; }
}

/* ── Card ── */
.rp-card {
    background: var(--pn-panel);
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius);
    padding: 1.5rem;
    margin-bottom: 1.25rem;
}

.rp-card:last-child { margin-bottom: 0; }

.rp-side .rp-card:last-child { margin-bottom: 0; }

.rp-card-header { margin-bottom: 1.25rem; }

.rp-card-title-row { margin-bottom: 4px; }

.rp-card-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--pn-text);
    margin: 0;
}

.rp-card-sub {
    font-size: 12px;
    color: var(--pn-text-muted);
    margin: 4px 0 0;
}

.rp-section-tag {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--pn-orange);
    background: var(--pn-orange-soft);
    border: 1px solid rgba(195, 163, 67, 0.25);
    border-radius: 4px;
    padding: 2px 7px;
    margin-bottom: 6px;
}

/* ── Form ── */
.rp-form { display: flex; flex-direction: column; gap: 1rem; }

.rp-field { display: flex; flex-direction: column; gap: 7px; }

.rp-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--pn-text-muted);
}

/* Tipo de Relatório */
.rp-type-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

@media (max-width: 600px) {
    .rp-type-grid { grid-template-columns: repeat(2, 1fr); }
}

.rp-type-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    border-radius: var(--pn-radius-sm);
    border: 1px solid var(--pn-border);
    background: var(--pn-bg-2);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
}

.rp-type-btn:hover {
    border-color: var(--pn-orange);
    background: var(--pn-panel-2);
}

.rp-type-btn.is-active {
    border-color: var(--pn-orange);
    background: var(--pn-orange-soft);
}

.rp-type-icon { font-size: 20px; line-height: 1; }

.rp-type-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--pn-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.rp-type-btn.is-active .rp-type-label { color: var(--pn-orange); }

/* Período */
.rp-period-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
}

.rp-period-btn {
    font-size: 12px;
    font-weight: 500;
    color: var(--pn-text-muted);
    background: var(--pn-bg-2);
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius-sm);
    padding: 8px 10px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
}

.rp-period-btn:hover {
    border-color: var(--pn-orange);
    color: var(--pn-text);
}

.rp-period-btn.is-active {
    border-color: var(--pn-orange);
    background: var(--pn-orange-soft);
    color: var(--pn-orange);
    font-weight: 600;
}

/* Input */
.rp-input-wrap { position: relative; }

.rp-input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--pn-text-dim);
    pointer-events: none;
}

.rp-input {
    width: 100%;
    background: var(--pn-bg-2);
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius-sm);
    color: var(--pn-text);
    font-size: 13px;
    padding: 10px 12px 10px 34px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.rp-input::placeholder { color: var(--pn-text-dim); }

.rp-input:focus {
    border-color: var(--pn-orange);
    box-shadow: 0 0 0 3px var(--pn-orange-soft);
}

.rp-textarea {
    width: 100%;
    background: var(--pn-bg-2);
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius-sm);
    color: var(--pn-text);
    font-size: 13px;
    padding: 10px 12px;
    outline: none;
    resize: vertical;
    min-height: 90px;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
}

.rp-textarea::placeholder { color: var(--pn-text-dim); }

.rp-textarea:focus {
    border-color: var(--pn-orange);
    box-shadow: 0 0 0 3px var(--pn-orange-soft);
}

.rp-divider {
    height: 1px;
    background: var(--pn-border-soft);
}

/* Ações */
.rp-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding-top: 4px;
}

.rp-btn-secondary {
    font-size: 13px;
    font-weight: 500;
    color: var(--pn-text-muted);
    background: transparent;
    border: 1px solid var(--pn-border);
    border-radius: var(--pn-radius-sm);
    padding: 9px 18px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
}

.rp-btn-secondary:hover {
    border-color: var(--pn-text-muted);
    color: var(--pn-text);
}

.rp-btn-primary {
    font-size: 13px;
    font-weight: 700;
    color: #000;
    background: var(--pn-orange);
    border: none;
    border-radius: var(--pn-radius-sm);
    padding: 9px 20px;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    gap: 4px;
}

.rp-btn-primary:hover:not(:disabled) { opacity: 0.88; }
.rp-btn-primary:active:not(:disabled) { transform: scale(0.98); }
.rp-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

.rp-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Histórico ── */
.rp-history { display: flex; flex-direction: column; gap: 0; }

.rp-history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--pn-border-soft);
}

.rp-history-item:last-child { border-bottom: none; padding-bottom: 0; }
.rp-history-item:first-child { padding-top: 0; }

.rp-hist-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.rp-hist-type {
    font-size: 13px;
    font-weight: 600;
    color: var(--pn-text);
}

.rp-hist-to {
    font-size: 11px;
    color: var(--pn-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.rp-hist-date {
    font-size: 10px;
    color: var(--pn-text-dim);
}

.rp-hist-status {
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
}

.st-ok {
    background: var(--pn-green-soft);
    color: var(--pn-green);
    border: 1px solid rgba(45, 206, 137, 0.2);
}

.st-pending {
    background: rgba(255, 203, 57, 0.12);
    color: var(--pn-yellow);
    border: 1px solid rgba(255, 203, 57, 0.2);
}

/* ── Formatos ── */
.rp-formats { display: flex; flex-direction: column; gap: 10px; }

.rp-format-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.rp-format-badge {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid;
    flex-shrink: 0;
    min-width: 46px;
    text-align: center;
}

.rp-format-desc {
    font-size: 12px;
    color: var(--pn-text-muted);
}
</style>