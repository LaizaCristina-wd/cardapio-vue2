<script setup>
import { ref } from 'vue'
import logo from '@/assets/images/logos/logoSr.png'

const username = ref('')
const password = ref('')

function login() {
  console.log(username.value, password.value)
}
</script>

<template>
  <div class="pn-plain">
    <div class="card login-card">

      <!-- Logo -->
      <img :src="logo" class="logo" />

      <!-- Nome -->
      <h1 class="pn-card-title">Selo Real Panificação</h1>
      <p class="pn-card-sub">Acesso ao sistema</p>

      <!-- Form -->
      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="pn-label">Usuário</label>
          <input v-model="username" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="pn-label">Senha</label>
          <input type="password" v-model="password" class="form-control" />
        </div>

        <button class="btn btn-primary w-100">Entrar</button>
      </form>

    </div>
  </div>
</template>
<style scoped>
.login-card {
  width: 360px;
  padding: 28px;
  text-align: center;
}

.logo {
  width: 90px;
  margin-bottom: 14px;
}
</style>