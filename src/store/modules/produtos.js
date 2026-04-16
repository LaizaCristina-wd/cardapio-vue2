import { ref, watch } from "vue"

const STORAGE_KEY = "produtos"

function normalizarCategoria(categoria = "") {
  return categoria.toString().toLowerCase().trim()
}

function criarProduto(produto) {
  return {
    ...produto,
    id: crypto.randomUUID(),
    categoria: normalizarCategoria(produto.categoria),
    disponivel: true
  }
}

const dadosSalvos = localStorage.getItem(STORAGE_KEY)
export const produtos = ref(
  dadosSalvos
    ? JSON.parse(dadosSalvos).map((produto) => ({
        ...produto,
        categoria: normalizarCategoria(produto.categoria)
      }))
    : []
)

export function adicionarProduto(produto) {
  produtos.value.push(criarProduto(produto))
}

export function editarProduto(produtoAtualizado) {
  const index = produtos.value.findIndex((produto) => produto.id === produtoAtualizado.id)

  if (index === -1) {
    return
  }

  produtos.value[index] = {
    ...produtoAtualizado,
    categoria: normalizarCategoria(produtoAtualizado.categoria)
  }
}

export function alternarDisponibilidade(id) {
  const produto = produtos.value.find((item) => item.id === id)

  if (produto) {
    produto.disponivel = !produto.disponivel
  }
}

export function removerProduto(id) {
  produtos.value = produtos.value.filter((produto) => produto.id !== id)
}

watch(
  produtos,
  (novoValor) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novoValor))
  },
  { deep: true }
)
