import axios from 'axios'
import { ref, computed } from 'vue'

const produtosIniciais = [
  { id: 1, emoji: '🍞', nome: 'Pão Francês',      categoria: 'Pães tradicionais', precoInd: 'R$0,45', precoVar: 'R$0,89', estoque: 'ok',  cor: 'br' },
  { id: 2, emoji: '🥐', nome: 'Croissant Butter',  categoria: 'Congelados',        precoInd: 'R$2,10', precoVar: 'R$4,50', estoque: 'mid', cor: 'pt' },
  { id: 3, emoji: '🧁', nome: 'Cupcake Choco',     categoria: 'Confeitaria',       precoInd: 'R$3,20', precoVar: 'R$7,90', estoque: 'low', cor: 'cr' },
  { id: 4, emoji: '🥖', nome: 'Baguete Rústica',   categoria: 'Pães especiais',    precoInd: 'R$1,80', precoVar: 'R$3,90', estoque: 'ok',  cor: 'bf' },
]

export const estoqueLabel = { ok: 'Estoque OK', mid: 'Estoque médio', low: 'Estoque baixo' }

export function useProdutos() {
  const produtosExtras = ref([])
  const mostrarExtras  = ref(false)
  const loading        = ref(false)
  const jaCarregou     = ref(false)

  const produtosVisiveis = computed(() =>
    mostrarExtras.value
      ? [...produtosIniciais, ...produtosExtras.value]
      : produtosIniciais
  )

  async function toggleProdutos() {
    if (mostrarExtras.value) {
      mostrarExtras.value = false
      return
    }

    if (!jaCarregou.value) {
      loading.value = true
      try {
        const { data } = await axios.get('/suggestions.json')
        const idsExistentes = new Set(produtosIniciais.map(p => p.id))
        produtosExtras.value = data        
          .filter(p => !idsExistentes.has(p.id))  
          .map(p => ({ cor: 'br', ...p }))       
        jaCarregou.value = true
      } catch (err) {
        console.error('Erro ao carregar produtos:', err.message)
      } finally {
        loading.value = false
      }
    }

    mostrarExtras.value = true
  }

  return {
    produtosVisiveis,
    mostrarExtras,
    loading,
    toggleProdutos,
  }
}