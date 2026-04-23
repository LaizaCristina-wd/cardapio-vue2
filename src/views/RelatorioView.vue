<script setup>
import { ref, inject } from 'vue'
import { NOTIFY } from '@/constants'
import '@/assets/theme.css'

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
