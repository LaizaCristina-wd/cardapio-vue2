<script setup>
import { produtos } from "../store/produtos"
</script>
<template>
  <section>
    <h1>Visualizar Cardápio</h1>

    <div v-if="produtos.length" class="grid">
      <article
        v-for="produto in produtos"
        :key="produto.id"
        class="card"
        :class="{ indisponivel: !produto.disponivel }"
      >
        <h2>{{ produto.nome }}</h2>
        <p class="descricao">{{ produto.descricao }}</p>
        <p class="preco">{{ produto.preco }}</p>
        <span class="categoria">{{ produto.categoria }}</span>
        <button class="comprar" :disabled="!produto.disponivel">Comprar</button>
      </article>
    </div>

    <p v-else class="vazio">Nenhum produto cadastrado ainda.</p>
  </section>
</template>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 20px;
}

.card {
  padding: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card.indisponivel {
  opacity: 0.6;
  filter: grayscale(50%);
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.card.indisponivel::after {
  content: "Indisponível";
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
}

.descricao {
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.5;
}

.preco {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #059669;
}

.categoria {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 0.9rem;
}

.comprar {
  display: block;
  width: 100%;
  padding: 14px 20px;
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  position: relative;
  overflow: hidden;
}

.comprar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.comprar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.comprar:hover:not(:disabled)::before {
  left: 100%;
}

.comprar:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(34, 197, 94, 0.3);
}

.comprar:disabled {
  background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
  color: #6b7280;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

</style>