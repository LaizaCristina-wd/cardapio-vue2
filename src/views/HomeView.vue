<template>
  <div class="home">
    <h1 class="titulo text-center text-success mb-4">Bem-vindo ao Controle de Produtos</h1>
    <h2 class="subtitulo">Gerencie seu cardápio de forma simples</h2>
    <p class="descricao">
      Este sistema permite cadastrar produtos do seu restaurante,
      organizar por categoria e visualizar o cardápio.
    </p>
    <div class="acoes">
      <router-link to="/cadastro">
        <button class="btn primary">Cadastrar produtos</button>
      </router-link>
      <router-link to="/controle">
        <button class="btn secondary">Ver controle de produtos</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  text-align: center;
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  padding: 20px;
}

.titulo {
  font-size: 2.5rem;
  font-weight: bold;
  color: #111827;
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeSlide 1s ease forwards;
}

.subtitulo {
  font-size: 1.3rem;
  color: #4b5563;
  opacity: 0;
  animation: fadeSlide 1s ease forwards;
  animation-delay: 0.3s;
}

.descricao {
  max-width: 500px;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
  opacity: 0;
  animation: fadeSlide 1s ease forwards;
  animation-delay: 0.6s;
}

.acoes {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  opacity: 0;
  animation: fadeSlide 1s ease forwards;
  animation-delay: 0.9s;
}

.btn {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor:pointer;
  font-weight: 500;
  transition: 0.3s;
}

.primary {
  background: #22c55e;
  color: white;
}

.primary:hover {
  background: #16a34a;
  transform: scale(1.05);
}

.secondary {
  background: #e5e7eb;
  color: #111827;
}

.secondary:hover {
  background: #d1d5db;
  transform: scale(1.05);
}

@keyframes fadeSlide {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>