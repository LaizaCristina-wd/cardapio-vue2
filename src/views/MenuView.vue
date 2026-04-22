<script setup>
import { ref, computed, watch, inject } from 'vue'
import MenuForm from '@/components/MenuForm.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import MenuSummary from '@/components/MenuSummary.vue'
import { NOTIFY, ALL_CATEGORY } from '@/constants'
import { useProdutos } from '@/services/produtoService'

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
const availableCount = computed(() => items.value.filter(i => i.available).length)
const averagePrice   = computed(() => {
  if (!filteredItems.value.length) return 0
  return filteredItems.value.reduce((acc, i) => acc + (i.price || 0), 0) / filteredItems.value.length
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

// ── Helpers visuais ───────────────────────────────────────
const estoqueLabel = { ok: 'Estoque OK', mid: 'Estoque médio', low: 'Estoque baixo' }
const corEmoji     = { br: '🍞', pt: '🥐', cr: '🧁', bf: '🥖' }
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
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="prod-card"
          >
            <MenuItem :item="item" @remove-item="removeItem" />

            <div class="prod-img" :class="`prod-img--${item.cor || 'br'}`">
              {{ item.emoji || corEmoji[item.cor] || '🍞' }}
            </div>

            <div class="prod-body">
              <div class="prod-name">{{ item.name || item.nome }}</div>
              <div class="prod-cat">{{ item.category || item.categoria }}
              </div>

              <div class="prod-prices">
                <span class="price-pill price-pill--ind">Ind {{ item.precoInd || `R$${item.price?.toFixed(2)}` }}</span>
                <span class="price-pill price-pill--var">Var {{ item.precoVar }}</span>
              </div>

              <span class="stock-badge" :class="`stock-badge--${item.estoque || 'ok'}`">
                ● {{ estoqueLabel[item.estoque] || 'Estoque OK' }}
              </span>
            </div>

           
            <div class="prod-actions">
              <button class="btn-delete" @click="removeItem(item.id)" title="Remover">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Remover
              </button>
            </div>
           
          </div>
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

<style scoped>
.menu-page {
  padding: 24px;
  background: #001d3d;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  color: #e0e0e0;
}

/* ── Layout ── */
.layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
}

/* ── Aside esquerdo ── */
.form-aside {
  position: sticky;
  top: 24px;
}

.aside-inner {
  background: #002952;
  border: 1px solid #003566;
  border-radius: 14px;
  overflow: hidden;
}

.aside-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #003566;
}

.aside-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffd60a;
  margin: 0 0 3px 0;
}

.aside-sub {
  font-size: 12px;
  color: #415a77;
  margin: 0;
}

.aside-tag {
  width: 32px;
  height: 32px;
  background: rgba(255, 214, 10, 0.1);
  border: 1px solid rgba(255, 214, 10, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #ffd60a;
  flex-shrink: 0;
}

/* ── Sobrescreve MenuForm ── */
.aside-inner :deep(.card) {
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
}
.aside-inner :deep(.card-body) {
  padding: 16px 20px 20px;
}
.aside-inner :deep(.pn-card-title),
.aside-inner :deep(.pn-card-sub),
.aside-inner :deep(.pn-tag),
.aside-inner :deep(.d-flex.justify-content-between.mb-3) {
  display: none !important;
}
.aside-inner :deep(.pn-label) {
  font-size: 11px;
  color: #415a77;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
}
.aside-inner :deep(.form-control),
.aside-inner :deep(.form-select) {
  background: #001d3d;
  border: 1px solid #003566;
  border-radius: 8px;
  color: #c0ccd8;
  font-size: 13px;
}
.aside-inner :deep(.form-control:focus),
.aside-inner :deep(.form-select:focus) {
  border-color: #c3a343;
  box-shadow: 0 0 0 3px rgba(195, 163, 67, 0.12);
}
.aside-inner :deep(.btn-primary) {
  background: rgba(255, 214, 10, 0.12);
  border: 1px solid rgba(255, 214, 10, 0.4);
  color: #ffd60a;
  font-weight: 600;
  border-radius: 20px;
  transition: all .2s;
}
.aside-inner :deep(.btn-primary:hover:not(:disabled)) {
  background: rgba(255, 214, 10, 0.22);
  border-color: #ffd60a;
}
.aside-inner :deep(.btn-primary:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}
.aside-inner :deep(.form-check-label) {
  font-size: 12px;
  color: #415a77;
}
.aside-inner :deep(.emoji-btn) {
  background: #001d3d;
  border: 1px solid #003566;
  border-radius: 6px;
  font-size: 1.1rem;
  padding: 0.2rem 0.35rem;
  cursor: pointer;
  transition: all .15s;
}
.aside-inner :deep(.emoji-btn.btn-primary) {
  background: rgba(255, 214, 10, 0.2);
  border-color: #ffd60a;
}

/* ── Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #ffd60a;
  margin: 0 0 4px 0;
}
.page-sub { font-size: 13px; color: #415a77; }
.header-actions { display: flex; gap: 10px; }

.btn-sugestoes {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all .2s;
  border: 1px solid rgba(195, 163, 67, 0.35);
  background: rgba(195, 163, 67, 0.08);
  color: #c3a343;
}
.btn-sugestoes:hover:not(:disabled) { background: rgba(195, 163, 67, 0.18); border-color: #c3a343; }
.btn-sugestoes:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-sugestoes svg { width: 14px; height: 14px; }
.btn-content { display: flex; align-items: center; gap: 6px; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

/* ── Filtro de categorias ── */
.filter-section {
  margin-bottom: 20px;
  background: #002952;
  border: 1px solid #003566;
  border-radius: 12px;
  padding: 14px 16px 16px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  color: #415a77;
  text-transform: uppercase;
  letter-spacing: .1em;
  margin-bottom: 12px;
}

/* ── Sobrescreve CategoryFilter ── */
/* Container */
.filter-wrap :deep(div),
.filter-wrap :deep(ul),
.filter-wrap :deep(nav),
.filter-wrap :deep(section) {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.filter-wrap :deep(li) {
  display: contents !important;
}

/* Botões padrão */
.filter-wrap :deep(button),
.filter-wrap :deep(.btn),
.filter-wrap :deep(a) {
  display: inline-flex !important;
  align-items: center !important;
  padding: 5px 16px !important;
  border-radius: 20px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all .18s !important;
  border: 1px solid #003566 !important;
  background: transparent !important;
  color: #415a77 !important;
  text-decoration: none !important;
  white-space: nowrap !important;
  box-shadow: none !important;
  outline: none !important;
  line-height: 1.4 !important;
}

/* Hover */
.filter-wrap :deep(button:hover),
.filter-wrap :deep(.btn:hover),
.filter-wrap :deep(a:hover) {
  border-color: rgba(195, 163, 67, 0.4) !important;
  color: #c3a343 !important;
  background: rgba(195, 163, 67, 0.06) !important;
}

/* Ativo — captura .active, .btn-primary, aria-pressed, aria-selected */
.filter-wrap :deep(.active),
.filter-wrap :deep([class*="active"]),
.filter-wrap :deep(.btn-primary),
.filter-wrap :deep([aria-pressed="true"]),
.filter-wrap :deep([aria-selected="true"]) {
  background: rgba(255, 214, 10, 0.12) !important;
  border-color: rgba(255, 214, 10, 0.5) !important;
  color: #ffd60a !important;
}

/* ── Erro ── */
.api-error {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #f87171;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

/* ── Grid de cards ── */
.prod-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.prod-card {
  background: #002952;
  border: 1px solid #003566;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color .2s, transform .2s;
}
.prod-card:hover { border-color: #c3a343; transform: translateY(-2px); }

.prod-img {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
}
.prod-img--br { background: linear-gradient(135deg, #1a3a2a, #0d2418); }
.prod-img--pt { background: linear-gradient(135deg, #1a2a3a, #0d1824); }
.prod-img--cr { background: linear-gradient(135deg, #2a1a2a, #1a0d1a); }
.prod-img--bf { background: linear-gradient(135deg, #2a2a1a, #1a1a0d); }

.prod-body {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.prod-name { font-size: 14px; font-weight: 600; color: #c0ccd8; }
.prod-cat  { font-size: 11px; color: #415a77; }

.prod-prices { display: flex; gap: 6px; flex-wrap: wrap; }

.price-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
}
.price-pill--ind { background: rgba(0,53,102,.6); color: #7aadda; }
.price-pill--var { background: rgba(195,163,67,.15); color: #c3a343; }

.stock-badge       { font-size: 11px; font-weight: 600; }
.stock-badge--ok   { color: #4ade80; }
.stock-badge--mid  { color: #fbbf24; }
.stock-badge--low  { color: #f87171; }

/* ── Ação do card ── */
.prod-actions {
  border-top: 1px solid #003566;
}

.btn-delete {
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #415a77;
  transition: all .15s;
  font-family: inherit;
}
.btn-delete svg { width: 13px; height: 13px; }
.btn-delete:hover {
  background: rgba(248, 113, 113, 0.08);
  color: #f87171;
}

/* ── Empty state ── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #415a77;
}
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-state p { font-size: 14px; }
</style>