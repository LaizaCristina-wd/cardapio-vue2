<script setup>
import { reactive } from "vue"
import { formatarMoeda } from "../utils/formatarMoeda"
import { adicionarProduto } from "../store/produtos"

const categorias = [
  { value: "", label: "Selecione uma categoria" },
  { value: "lanche", label: "Lanche" },
  { value: "bebida", label: "Bebida" },
  { value: "sobremesa", label: "Sobremesa" }
]

const novoProduto = reactive({
  nome: "",
  preco: "",
  descricao: "",
  categoria: ""
})

function atualizarPreco(event) {
  novoProduto.preco = formatarMoeda(event.target.value)
}

function limparFormulario() {
  novoProduto.nome = ""
  novoProduto.preco = ""
  novoProduto.descricao = ""
  novoProduto.categoria = ""
}

function cadastrarProduto() {
  if (!novoProduto.nome.trim() || !novoProduto.preco || !novoProduto.categoria) {
    alert("Preencha todos os campos")
    return
  }

  adicionarProduto({
    nome: novoProduto.nome.trim(),
    preco: novoProduto.preco,
    descricao: novoProduto.descricao.trim(),
    categoria: novoProduto.categoria
  })

  limparFormulario()
}
</script>

<template>
  <div class="container">
    <h2>Cadastrar produto</h2>

    <form class="form" @submit.prevent="cadastrarProduto">
      <label for="nome">Nome do produto</label>
      <input
        id="nome"
        v-model.trim="novoProduto.nome"
        placeholder="Nome do produto"
      />

      <label for="descricao">Descrição</label>
      <textarea
        id="descricao"
        v-model.trim="novoProduto.descricao"
        placeholder="Descrição do produto"
      ></textarea>

      <label for="preco">Preço</label>
      <input
        id="preco"
        type="text"
        :value="novoProduto.preco"
        @input="atualizarPreco"
        placeholder="R$ 0,00"
      />

      <label for="categoria">Categoria</label>
      <select id="categoria" v-model="novoProduto.categoria">
        <option
          v-for="categoria in categorias"
          :key="categoria.value"
          :value="categoria.value"
          :disabled="categoria.value === ''"
        >
          {{ categoria.label }}
        </option>
      </select>

      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<style scoped>
textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  min-height: 100px;
  resize: vertical;
}

.container {
  max-width: 480px;
  margin: 40px auto;
  padding: 28px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  font-weight: 600;
  color: #333;
}

input,
select,
textarea {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  width: 100%;
}

button {
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #22c55e;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #16a34a;
}
</style>