<script setup>
import { RouterLink, RouterView } from "vue-router"
</script>

<template>
  <div class="container py-4">
    <nav class="menu">

      <RouterLink to="/">
        Início
      </RouterLink>

      <RouterLink to="/cadastro">
        Cadastro
      </RouterLink>

      <RouterLink to="/controle">
        Controle
      </RouterLink>
     
      <RouterLink to="/cardapio">
        Cardápio
      </RouterLink>

    </nav>
      <RouterView />
  </div>
</template>

<style scoped>
.titulo{
  text-align:center;
  margin-top:20px;
  color:#16a34a;
}

.menu{
  display:flex;
  justify-content:center;
  gap:20px;
  margin:20px 0;
}

.menu a{
  text-decoration:none;
  color:#333;
  font-weight:500;
  padding:6px 12px;
  border-radius:6px;
}

.menu a:hover{
  background:#f0fdf4;
  color:#16a34a;
}

.router-link-active{
  background:#16a34a;
  color:white;
}

</style>
