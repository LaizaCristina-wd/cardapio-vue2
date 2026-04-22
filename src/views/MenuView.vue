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
const loading        = ref(false)
const apiError       = ref('')

// modal de edição
const editando       = ref(false)
const produtoEdit    = ref(null)

// modal de adição
const adicionando    = ref(false)

// ── Computed ─────────────────────────────────────────────
const filteredItems = computed(() =>
  activeCategory.value === ALL_CATEGORY
    ? items.value
    : items.value.filter(i =>
        (i.category || i.categoria) === activeCategory.value
      )
)
const availableCount = computed(() => items.value.filter(i => i.available).length)

const averagePrice = computed(() => {
  if (!filteredItems.value.length) return 0
  return filteredItems.value.reduce((acc, i) => acc + i.price, 0) / filteredItems.value.length
})

// ── Watchers ─────────────────────────────────────────────
watch(() => items.value.length, len => { document.title = `Selo Real (${len} itens)` }, { immediate: true })
watch(items, newItems => { localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems)) }, { deep: true })

// ── CRUD ─────────────────────────────────────────────────
function addItem(item) {
  items.value.push(item)
  adicionando.value = false
  notify(`"${item.name}" adicionado`, NOTIFY.SUCCESS)
}

function removeItem(id) {
  const removed = items.value.find(i => i.id === id)
  items.value = items.value.filter(i => i.id !== id)
  if (removed) notify(`"${removed.name}" removido`, NOTIFY.INFO)
}

function abrirEdicao(item) {
  produtoEdit.value = { ...item }
  editando.value = true
}

function salvarEdicao() {
  const idx = items.value.findIndex(i => i.id === produtoEdit.value.id)
  if (idx !== -1) {
    items.value[idx] = { ...produtoEdit.value }
    notify(`"${produtoEdit.value.name}" atualizado`, NOTIFY.SUCCESS)
  }
  editando.value = false
}

// ── Sugestões da API ──────────────────────────────────────
async function loadSuggestions() {
  try {
    await toggleProdutos()

    const existingIds = new Set(items.value.map(i => i.id))

    const novos = produtosVisiveis.value.filter(
      p => !existingIds.has(p.id)
    )

    items.value.push(...novos)

    notify(`${novos.length} produto(s) adicionados`, NOTIFY.SUCCESS)
  } catch (err) {
    notify(`Erro: ${err.message}`, NOTIFY.ERROR)
  }
}
// ── Helpers visuais ───────────────────────────────────────
const estoqueLabel = { ok: 'Estoque OK', mid: 'Estoque médio', low: 'Estoque baixo' }
const corEmoji = { br: '🍞', pt: '🥐', cr: '🧁', bf: '🥖' }
</script>

<template>
  <div class="menu-page">

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
        <button class="btn-novo" @click="adicionando = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo Produto
        </button>
      </div>
    </div>

    <!-- Resumo -->
    <MenuSummary
      :total-items="items.length"
      :available-items="availableCount"
      :average-price="averagePrice"
    />

    <!-- Filtro de categorias -->
    <div class="filter-wrap">
      <CategoryFilter
        :active-category="activeCategory"
        @filter-change="activeCategory = $event"
      />
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
        <!-- Emoji / imagem -->
        <div class="prod-img" :class="`prod-img--${item.cor || 'br'}`">
          {{ item.emoji || corEmoji[item.cor] || '🍞' }}
        </div>

        <!-- Corpo -->
        <div class="prod-body">
          <div class="prod-name">{{ item.name || item.nome }}</div>
          <div class="prod-cat">{{ item.category || item.categoria }}</div>

          <div class="prod-prices">
            <span class="price-pill price-pill--ind">Ind {{ item.precoInd || `R$${item.price?.toFixed(2)}` }}</span>
            <span class="price-pill price-pill--var">Var {{ item.precoVar }}</span>
          </div>

          <span class="stock-badge" :class="`stock-badge--${item.estoque || 'ok'}`">
            ● {{ estoqueLabel[item.estoque] || 'Estoque OK' }}
          </span>
        </div>

        <!-- Ações -->
        <div class="prod-actions">
          <button class="btn-edit" @click="abrirEdicao(item)" title="Editar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-delete" @click="removeItem(item.id)" title="Remover">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <div class="empty-icon">🍞</div>
      <p>Nenhum produto encontrado.</p>
      <button class="btn-novo" @click="adicionando = true">Adicionar produto</button>
    </div>

    <!-- ── Modal Edição ───────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="editando" class="modal-overlay" @click.self="editando = false">
        <div class="modal">
          <div class="modal-header">
            <h3>Editar Produto</h3>
            <button class="modal-close" @click="editando = false">✕</button>
          </div>

          <div class="modal-body">
            <label>Nome
              <input v-model="produtoEdit.name" placeholder="Nome do produto" />
            </label>
            <label>Categoria
              <input v-model="produtoEdit.category" placeholder="Categoria" />
            </label>
            <div class="modal-row">
              <label>Preço Industrial
                <input v-model="produtoEdit.precoInd" placeholder="R$0,00" />
              </label>
              <label>Preço Varejo
                <input v-model="produtoEdit.precoVar" placeholder="R$0,00" />
              </label>
            </div>
            <label>Estoque
              <select v-model="produtoEdit.estoque">
                <option value="ok">Estoque OK</option>
                <option value="mid">Estoque médio</option>
                <option value="low">Estoque baixo</option>
              </select>
            </label>
            <label>Emoji
              <input v-model="produtoEdit.emoji" placeholder="🍞" maxlength="2" />
            </label>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="editando = false">Cancelar</button>
            <button class="btn-save" @click="salvarEdicao">Salvar</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Modal Adicionar ────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="adicionando" class="modal-overlay" @click.self="adicionando = false">
        <div class="modal">
          <div class="modal-header">
            <h3>Novo Produto</h3>
            <button class="modal-close" @click="adicionando = false">✕</button>
          </div>
          <div class="modal-body">
            <MenuForm @add-item="addItem" />
          </div>
        </div>
      </div>
    </Teleport>

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

.page-sub {
  font-size: 13px;
  color: #415a77;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* ── Botões header ── */
.btn-novo, .btn-sugestoes {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all .2s;
  border: 1px solid;
}

.btn-novo {
  background: rgba(255, 214, 10, 0.12);
  border-color: rgba(255, 214, 10, 0.4);
  color: #ffd60a;
}
.btn-novo:hover { background: rgba(255, 214, 10, 0.22); border-color: #ffd60a; }
.btn-novo svg   { width: 14px; height: 14px; }

.btn-sugestoes {
  background: rgba(195, 163, 67, 0.08);
  border-color: rgba(195, 163, 67, 0.35);
  color: #c3a343;
}
.btn-sugestoes:hover:not(:disabled) { background: rgba(195, 163, 67, 0.18); border-color: #c3a343; }
.btn-sugestoes:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-sugestoes svg { width: 14px; height: 14px; }

.btn-content { display: flex; align-items: center; gap: 6px; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

/* ── Filtro ── */
.filter-wrap { margin: 16px 0; }

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
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
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
  position: relative;
}

.prod-card:hover {
  border-color: #c3a343;
  transform: translateY(-2px);
}

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

.prod-name  { font-size: 14px; font-weight: 600; color: #c0ccd8; }
.prod-cat   { font-size: 11px; color: #415a77; }

.prod-prices {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

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

/* ── Ações do card ── */
.prod-actions {
  display: flex;
  border-top: 1px solid #003566;
}

.btn-edit, .btn-delete {
  flex: 1;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .15s;
}

.btn-edit   svg { width: 15px; height: 15px; color: #c3a343; }
.btn-delete svg { width: 15px; height: 15px; color: #f87171; }

.btn-edit   { border-right: 1px solid #003566; }
.btn-edit:hover   { background: rgba(195,163,67,.1); }
.btn-delete:hover { background: rgba(248,113,113,.1); }

/* ── Empty state ── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #415a77;
}
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-state p { margin-bottom: 16px; font-size: 14px; }

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 10, 25, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #002952;
  border: 1px solid #003566;
  border-radius: 14px;
  width: 100%;
  max-width: 460px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #003566;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #ffd60a;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: #415a77;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all .15s;
}
.modal-close:hover { background: rgba(255,255,255,.05); color: #e0e0e0; }

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-body label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #415a77;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.modal-body input,
.modal-body select {
  background: #001d3d;
  border: 1px solid #003566;
  border-radius: 8px;
  padding: 8px 12px;
  color: #c0ccd8;
  font-size: 14px;
  outline: none;
  transition: border-color .15s;
}

.modal-body input:focus,
.modal-body select:focus {
  border-color: #c3a343;
}

.modal-body select option { background: #001d3d; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #003566;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #003566;
  color: #415a77;
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all .15s;
}
.btn-cancel:hover { border-color: #415a77; color: #c0ccd8; }

.btn-save {
  background: rgba(255, 214, 10, 0.12);
  border: 1px solid rgba(255, 214, 10, 0.4);
  color: #ffd60a;
  padding: 7px 22px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
}
.btn-save:hover { background: rgba(255, 214, 10, 0.22); }
</style>