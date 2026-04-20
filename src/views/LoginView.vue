
<script setup>
import { ref, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { NOTIFY } from '@/constants'
import logo from '@/assets/images/logos/logoSr.png'

const store = useStore()
const router = useRouter()
const route = useRoute()
const notify = inject('notify')

const username = ref('')
const error = ref('')

function submit() {
  const name = username.value.trim()

  if (!name) {
    error.value = 'Informe um nome de usuário'
    return
  }

  store.dispatch('auth/login', { username: name })

  notify(`Bem-vindo, ${name}!`, NOTIFY.SUCCESS)

  const raw = route.query.redirect
  const isSafeInternal = typeof raw === 'string' && /^\/(?!\/)/.test(raw)

  router.push(isSafeInternal ? raw : { name: 'home' })
}
</script>

<template>
  <div class="pn-plain">
    <div class="card pn-login-card">
      <div class="card-body p-4">

        <!-- BRAND -->
        <div class="pn-login-brand">
          <img :src="logo" class="logo" />

          <div>
            <div class="pn-brand-name" style="font-size: 22px">
              Selo Real
            </div>
            <div class="pn-brand-sub">
              Panificação Industrial
            </div>
          </div>
        </div>

        <!-- TITULO -->
        <h1 class="pn-card-title fs-4 mb-1">
          Acesse sua conta
        </h1>

        <p class="pn-card-sub mb-3">
          Sistema de gestão de pedidos e produção
        </p>

        <!-- FORM -->
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="pn-label">Usuário</label>
            <input
              v-model.trim="username"
              type="text"
              class="form-control"
              placeholder="seu_usuario"
              required
            />
          </div>

          <!-- ERRO -->
          <div v-if="error" class="alert alert-danger mb-3">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Entrar no sistema
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>
.pn-login-card {
  width: 100%;
  max-width: 420px;
}

.pn-login-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--pn-border-soft);
}

.logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
</style>