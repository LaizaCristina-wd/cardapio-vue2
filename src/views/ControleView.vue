<script setup>
import { reactive, computed, ref } from "vue"
import { formatarMoeda } from "../utils/formatarMoeda"
import {
  produtos,
  editarProduto,
  removerProduto,
  alternarDisponibilidade
} from "../store/produtos"

const categorias = [
  { value: "todas", label: "Todas" },
  { value: "lanche", label: "Lanche" },
  { value: "bebida", label: "Bebida" },
  { value: "sobremesa", label: "Sobremesa" }
]

const produtoEditando = ref(null)

function iniciarEdicao(produto) {
  produtoEditando.value = { ...produto }
}

function atualizarPrecoEdicao(event) {
  if (!produtoEditando.value) {
    return
  }

  produtoEditando.value.preco = formatarMoeda(event.target.value)
}

function salvarEdicao() {
  if (!produtoEditando.value) {
    return
  }

  editarProduto({
    ...produtoEditando.value,
    categoria: produtoEditando.value.categoria.toLowerCase().trim()
  })
  produtoEditando.value = null
}

function cancelarEdicao() {
  produtoEditando.value = null
}

const filtro = reactive({
  categoria: "todas"
})

const produtosFiltrados = computed(() => {
  if (filtro.categoria === "todas") {
    return produtos.value
  }

  return produtos.value.filter(
    (produto) => produto.categoria === filtro.categoria
  )
})

const totalProdutos = computed(() => produtos.value.length)

const totalPorCategoria = computed(() => ({
  lanche: produtos.value.filter((p) => p.categoria === "lanche").length,
  bebida: produtos.value.filter((p) => p.categoria === "bebida").length,
  sobremesa: produtos.value.filter((p) => p.categoria === "sobremesa").length
}))
</script>

<template>
  <div class="container">
    <h2>Controle de Cardápio</h2>

    <div class="cards-resumo">
      <div>Total: {{ totalProdutos }}</div>
      <div>🍔 Lanche {{ totalPorCategoria.lanche }}</div>
      <div>🥤 Bebida {{ totalPorCategoria.bebida }}</div>
      <div>🍰 Sobremesa {{ totalPorCategoria.sobremesa }}</div>
    </div>

    <div class="filtros">
      <label for="filtro-categoria">Filtrar por categoria:</label>
      <select id="filtro-categoria" v-model="filtro.categoria">
        <option
          v-for="categoria in categorias"
          :key="categoria.value"
          :value="categoria.value"
        >
          {{ categoria.label }}
        </option>
      </select>
    </div>

    <section v-if="produtoEditando" class="form-edicao">
      <h3>Editando produto</h3>

      <label for="nome-edicao">Nome</label>
      <input
        id="nome-edicao"
        v-model="produtoEditando.nome"
        placeholder="Nome"
      />

      <label for="preco-edicao">Preço</label>
      <input
        id="preco-edicao"
        :value="produtoEditando.preco"
        @input="atualizarPrecoEdicao"
        placeholder="R$ 0,00"
      />

      <label for="descricao-edicao">Descrição</label>
      <textarea
        id="descricao-edicao"
        v-model="produtoEditando.descricao"
        placeholder="Descrição"
      ></textarea>

      <label for="categoria-edicao">Categoria</label>
      <select id="categoria-edicao" v-model="produtoEditando.categoria">
        <option value="lanche">Lanche</option>
        <option value="bebida">Bebida</option>
        <option value="sobremesa">Sobremesa</option>
      </select>

      <div class="acoes">
        <button class="color-btn" type="button" @click="salvarEdicao">
          Salvar
        </button>
        <button class="second-color-btn" type="button" @click="cancelarEdicao">
          Cancelar
        </button>
      </div>
    </section>

    <ul class="lista-produtos">
      <li
        v-for="produto in produtosFiltrados"
        :key="produto.id"
        :class="{ indisponivel: !produto.disponivel }"
      >
        <div>
          <strong>{{ produto.nome }}</strong>
          <p>{{ produto.descricao }}</p>
          <span>{{ produto.preco }}</span>
          <small>{{ produto.categoria }}</small>
        </div>

        <div class="acoes">
          <button type="button" @click="alternarDisponibilidade(produto.id)">
            {{ produto.disponivel ? "Disponível" : "Indisponível" }}
          </button>
          <button class="color-btn" type="button" @click="iniciarEdicao(produto)">
            Editar
          </button>
          <button class="second-color-btn" type="button" @click="removerProduto(produto.id)">
            Remover
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  max-width: 520px;
  margin: 40px auto;
  padding: 28px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.08);
}

.cards-resumo {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.cards-resumo div {
  padding: 14px;
  border-radius: 12px;
  background: #f8fafc;
  color: #111827;
  font-weight: 600;
}

.filtros {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-edicao {
  margin-bottom: 24px;
  padding: 20px;
  background: #f3f4f6;
  border-radius: 14px;
  display: grid;
  gap: 12px;
}

label {
  font-size: 0.95rem;
  color: #374151;
}

input,
select,
textarea {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.lista-produtos {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding: 18px;
  border-radius: 12px;
  background: #f9fafb;
}

li.indisponivel {
  opacity: 0.5;
}

li strong {
  display: block;
  margin-bottom: 8px;
}

li p {
  margin: 0 0 8px;
  color: #4b5563;
}

li span {
  display: block;
  font-weight: 700;
  margin-bottom: 6px;
}

.acoes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 135px;
}

button {
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: filter 0.2s ease;
}

button:hover {
  filter: brightness(0.95);
}

.color-btn {
  background: #68c790;
  color: white;
}

.second-color-btn {
  background: #ef4444;
  color: white;
}
</style>