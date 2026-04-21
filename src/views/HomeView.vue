
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import logo from '@/assets/images/logos/logoSr.png'

const store = useStore()
const router = useRouter()
const route = useRoute()
const username = ref('')
const error = ref('')

function submit() {
  const name = username.value.trim()

  if (!name) {
    error.value = 'Informe um nome de usuário'
    return
  }

  store.dispatch('auth/login', { username: name })

  const raw = route.query.redirect
  const isSafeInternal = typeof raw === 'string' && /^\/(?!\/)/.test(raw)
  router.push(isSafeInternal ? raw : { name: 'Overview' })
}
</script>

<template><div class="sr-root">
   
    <div class="sr-bg-orb sr-orb-1"></div>
    <div class="sr-bg-orb sr-orb-2"></div>
    <div class="sr-bg-orb sr-orb-3"></div>
    <div class="sr-grain"></div>

    <div class="sr-page">     
      <header class="sr-header">
        <div class="sr-header-inner">
          <div class="sr-crown-line"></div>
          <h1 class="sr-title">Selo Real <span class="sr-title-accent">Panificação</span></h1>
          <div class="sr-crown-line"></div>
        </div>
        <div class="sr-header-divider">
          <span class="sr-divider-gem">◆</span>
        </div>
      </header>

      <div class="sr-logo-wrap">
        <div class="sr-logo-ring">
          <img :src="logo" class="sr-logo" alt="Selo Real" />
        </div>
        <div class="sr-logo-shine"></div>
      </div>

      <p class="sr-mission">
        Nossa missão é produzir alimentos com o padrão de qualidade Selo Real,
        honrando o compromisso de levar o melhor à mesa de nossos clientes e parceiros
        através de processos seguros e ingredientes selecionados.
      </p>

      <div class="sr-card">
        <div class="sr-card-glow"></div>

        <div class="sr-card-header">
          <div class="sr-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
        <div>
            <h2 class="sr-card-title">Acesse sua conta</h2>
            <p class="sr-card-sub">Sistema de gestão de pedidos e produção</p>
          </div>
        </div>

        <div class="sr-card-divider"></div>

        <form @submit.prevent="submit" class="sr-form">
          <div class="sr-field">
            <label class="sr-label">Usuário</label>
            <div class="sr-input-wrap">
              <svg class="sr-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                v-model.trim="username"
                type="text"
                class="sr-input"
                placeholder="seu_usuario"
                required
                autocomplete="username"
              />
            </div>
          </div>

          <div v-if="error" class="sr-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="sr-btn">
            <span class="sr-btn-text">Entrar no sistema</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </button>
        </form>
      </div>

      <footer class="sr-footer">
        <span class="sr-footer-gem">◆</span>
        <span>Padrão de qualidade desde a fundação</span>
        <span class="sr-footer-gem">◆</span>
      </footer>
      
    </div>
  </div>
</template>

<style scoped> 
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');


.sr-root {
  min-height: 100vh;
  background: var(--pn-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  padding: 2rem 1rem;
}

.sr-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.sr-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(195,163,67,0.08) 0%, transparent 70%);
  top: -150px; left: -150px;
}
.sr-orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(0,53,102,0.6) 0%, transparent 70%);
  bottom: -100px; right: -100px;
}
.sr-orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(195,163,67,0.05) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%, -50%);
}
.sr-grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.4; pointer-events: none;
}

.sr-page {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
  z-index: 1;
  animation: sr-fade-in 0.8s ease both;
}

@keyframes sr-fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.sr-header {
  text-align: center;
  margin-bottom: 1.5rem;
  width: 100%;
}
.sr-header-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 0.75rem;
}
.sr-crown-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--pn-orange), transparent);
  max-width: 80px;
}
.sr-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 5vw, 2.6rem);
  font-weight: 900;
  color: var(--pn-text);
  margin: 0;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.sr-title-accent {
  color: var(--pn-orange);
}
.sr-header-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--pn-orange);
}
.sr-header-divider::before,
.sr-header-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--pn-border));
  width: 60px;
}
.sr-divider-gem {
  font-size: 0.5rem;
  opacity: 0.8;
}

.sr-logo-wrap {
  position: relative;
  margin-bottom: 1.5rem;
  animation: sr-fade-in 0.8s ease 0.15s both;
}
.sr-logo-ring {
  width: 96px; height: 96px;
  border-radius: 50%;
  background: var(--pn-panel);
  border: 2px solid var(--pn-border);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0 6px rgba(195,163,67,0.06), 0 8px 32px rgba(0,0,0,0.4);
  position: relative;
  overflow: hidden;
}
.sr-logo-ring::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(195,163,67,0.12) 0%, transparent 60%);
}
.sr-logo {
  width: 100px; height: 100px;
  object-fit: contain;
  position: relative;
  z-index: 1;
}
.sr-logo-shine {
  position: absolute;
  top: -2px; left: 50%; transform: translateX(-50%);
  width: 40px; height: 2px;
  background: var(--pn-orange);
  border-radius: 2px;
  box-shadow: 0 0 12px var(--pn-orange);
}

.sr-mission {
  font-size: 16px;
  line-height: 1.7;
  color: var(--pn-text-muted);
  text-align: center;
  max-width: 400px;
  margin: 0 0 2rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  animation: sr-fade-in 0.8s ease 0.25s both;
}

.sr-card {
  width: 100%;
  background: var(--pn-panel);
  border: 1px solid var(--pn-border);
  border-radius: var(--pn-radius);
  padding: 2rem;
  position: relative;
  box-shadow: var(--pn-shadow), inset 0 1px 0 rgba(195,163,67,0.08);
  animation: sr-fade-in 0.8s ease 0.35s both;
  overflow: hidden;
}
.sr-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--pn-orange), var(--pn-orange-2), var(--pn-orange), transparent);
  border-radius: var(--pn-radius) var(--pn-radius) 0 0;
}
.sr-card-glow {
  position: absolute;
  top: -40px; left: 50%; transform: translateX(-50%);
  width: 200px; height: 80px;
  background: radial-gradient(ellipse, rgba(195,163,67,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.sr-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.sr-card-icon {
  width: 42px; height: 42px;
  border-radius: var(--pn-radius-sm);
  background: var(--pn-orange-soft);
  border: 1px solid rgba(195,163,67,0.25);
  display: flex; align-items: center; justify-content: center;
  color: var(--pn-orange);
  flex-shrink: 0;
}
.sr-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--pn-text);
  margin: 0 0 0.15rem;
  letter-spacing: 0.02em;
}
.sr-card-sub {
  font-size: 0.72rem;
  color: var(--pn-text-muted);
  margin: 0;
  font-weight: 300;
}

.sr-card-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--pn-border), transparent);
  margin-bottom: 1.5rem;
}

.sr-form { display: flex; flex-direction: column; gap: 1rem; }

.sr-field { display: flex; flex-direction: column; gap: 0.4rem; }

.sr-label {
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--pn-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sr-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.sr-input-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--pn-text-dim);
  pointer-events: none;
  transition: color 0.2s;
}
.sr-input {
  width: 100%;
  background: var(--pn-bg-2);
  border: 1px solid var(--pn-border);
  border-radius: var(--pn-radius-sm);
  padding: 0.7rem 0.875rem 0.7rem 2.6rem;
  color: var(--pn-text);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.sr-input::placeholder { color: var(--pn-text-dim); }
.sr-input:focus {
  border-color: var(--pn-orange);
  box-shadow: 0 0 0 3px rgba(195,163,67,0.12);
}
.sr-input:focus + .sr-input-icon,
.sr-input-wrap:focus-within .sr-input-icon {
  color: var(--pn-orange);
}

.sr-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(245,54,92,0.1);
  border: 1px solid rgba(245,54,92,0.3);
  border-radius: var(--pn-radius-sm);
  color: var(--pn-red);
  font-size: 0.8rem;
  padding: 0.6rem 0.875rem;
}

.sr-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, var(--pn-orange) 0%, var(--pn-orange-2) 100%);
  border: none;
  border-radius: var(--pn-radius-sm);
  color: #0a0600;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(195,163,67,0.25);
  margin-top: 0.25rem;
}
.sr-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 28px rgba(195,163,67,0.35);
}
.sr-btn:active {
  transform: translateY(0);
  opacity: 1;
}

/* ─── FOOTER ─── */
.sr-footer {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.68rem;
  color: var(--pn-text-dim);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  animation: sr-fade-in 0.8s ease 0.5s both;
}
.sr-footer-gem {
  font-size: 0.4rem;
  color: var(--pn-orange);
  opacity: 0.6;
}
 </style>


