<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import logo from '@/assets/images/logos/logoSr.png'
import '@/assets/theme.css'

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

<template>
  <div class="sr-root">
   
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

