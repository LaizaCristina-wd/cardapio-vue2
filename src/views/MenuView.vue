<script setup>
import { ref, computed, watch, inject } from 'vue'
import MenuForm from '@/components/MenuForm.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import MenuSummary from '@/components/MenuSummary.vue'
import { NOTIFY, ALL_CATEGORY } from '@/constants'
import { useProdutos } from '@/services/produtoService'
import MenuItem from '@/components/MenuItem.vue'
import '@/assets/theme.css'

const {
  produtosVisiveis,
  toggleProdutos,
  loading: loadingProdutos
} = useProdutos()

const STORAGE_KEY = 'produtos-items'
const notify = inject('notify')

// ── Persistência ─────────────────────────────────────────
function loadSaved() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return []
  try { return JSON.parse(saved) } catch { localStorage.removeItem(STORAGE_KEY); return [] }
}

// ── Estado ───────────────────────────────────────────────
const items          = ref(loadSaved())
const activeCategory = ref(ALL_CATEGORY)
const apiError       = ref('')

// ── Computed ─────────────────────────────────────────────
const filteredItems = computed(() =>
  activeCategory.value === ALL_CATEGORY
    ? items.value
    : items.value.filter(i =>
        (i.category || i.categoria) === activeCategory.value
      )
)
const availableCount = computed(() => items.value.filter(i => i.estoque === 'ok' || i.estoque === 'mid').length)
const averagePrice   = computed(() => {
  if (!filteredItems.value.length) return 0
    const total = filteredItems.value.reduce((acc, item) => {
    const preco = Number(
      item.precoInd
        .replace('R$', '')
        .replace(',', '.')
        .trim()
    )

    return acc + preco
  }, 0)

  return total / filteredItems.value.length
})

// ── Watchers ─────────────────────────────────────────────
watch(() => items.value.length, len => { document.title = `Selo Real (${len} itens)` }, { immediate: true })
watch(items, newItems => { localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems)) }, { deep: true })

// ── CRUD ─────────────────────────────────────────────────
function addItem(item) {
  items.value.push(item)
  notify(`"${item.nome || item.name}" adicionado`, NOTIFY.SUCCESS)
}

function removeItem(id) {
  const removed = items.value.find(i => i.id === id)
  items.value = items.value.filter(i => i.id !== id)
  if (removed) notify(`"${removed.nome || removed.name}" removido`, NOTIFY.INFO)
}

// ── Sugestões da API ──────────────────────────────────────
async function loadSuggestions() {
  try {
    await toggleProdutos()
    const existingIds = new Set(items.value.map(i => i.id))
    const novos = produtosVisiveis.value.filter(p => !existingIds.has(p.id))
    items.value.push(...novos)
    notify(`${novos.length} produto(s) adicionados`, NOTIFY.SUCCESS)
  } catch (err) {
    notify(`Erro: ${err.message}`, NOTIFY.ERROR)
  }
}
</script>

<template>
  <div class="menu-page">
    <div class="layout">

      <!-- ── Aside esquerdo: formulário ─────────── -->
      <aside class="form-aside">
        <div class="aside-inner">
          <div class="aside-header">
            <div>
              <h2 class="aside-title">Novo Item</h2>
              <p class="aside-sub">Adicione um item ao cardápio</p>
            </div>
            <span class="aside-tag">＋</span>
          </div>
          <MenuForm @add-item="addItem" />
        </div>
      </aside>

      <!-- ── Coluna principal ──────────────────── -->
      <div class="main-col">

        <!-- Cabeçalho -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Gestão de Menu</h1>
            <span class="page-sub">{{ items.length }} produtos cadastrados</span>
          </div>
          <div class="header-actions">
            <button class="btn-sugestoes" :disabled="loadingProdutos" @click="loadSuggestions">
              <span v-if="loadingProdutos" class="btn-content">
                <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Carregando...
              </span>
              <span v-else class="btn-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                Carregar Sugestões
              </span>
            </button>
          </div>
        </div>

        <!-- Resumo -->
        <MenuSummary
          :total-items="items.length"
          :available-items="availableCount"
          :average-price="averagePrice"
        />

        <!-- ── Filtro de categorias ── -->
        <div class="filter-section">
          <div class="filter-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filtrar por categoria
          </div>
          <div class="filter-wrap">
            <CategoryFilter
              :active-category="activeCategory"
              @filter-change="activeCategory = $event"
            />
          </div>
        </div>

        <!-- Erro da API -->
        <div v-if="apiError" class="api-error">⚠ {{ apiError }}</div>

        <!-- Grid de cards -->
      <div v-if="filteredItems.length" class="prod-grid">
            <MenuItem
              v-for="item in filteredItems"
              :key="item.id"
              :item="item"
              @remove-item="removeItem"
            />
          </div>

        <!-- Empty state -->
        <div v-else class="empty-state">
          <div class="empty-icon">🍞</div>
          <p>Nenhum produto encontrado.</p>
        </div>
      </div>
    </div>
  </div>
</template>
