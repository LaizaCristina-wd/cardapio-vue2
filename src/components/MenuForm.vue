<script setup>
import { ref, computed, onMounted } from 'vue'
import { ITEM_CATEGORIES } from '@/constants'

const emit = defineEmits(['add-item'])
const name = ref('')
const priceInd = ref(null)
const priceVar = ref(null)
const category = ref(ITEM_CATEGORIES[0])
const estoque = ref('ok')
const selectedEmoji = ref('🍞')
const nameInput = ref(null)
const EMOJI_OPTIONS = ['🍞', '🥐', '🧀', '🍗', '🍕', '🌮', '🍔', '🥪', '🧁', '🍰', '🥞', '🍩', '🥨', '🥖']

const isFormValid = computed(
    () =>
        name.value !== '' &&
        priceInd.value != null && priceInd.value > 0 &&
        priceVar.value != null && priceVar.value > 0 &&
        category.value !== ''
)

onMounted(() => {
    nameInput.value?.focus()
})

function submitForm() {
    if (!isFormValid.value) return

    emit('add-item', {
        id: crypto.randomUUID(),
        nome: name.value,
        precoInd: `R$${priceInd.value.toFixed(2)}`,
        precoVar: `R$${priceVar.value.toFixed(2)}`,
        categoria: category.value,
        estoque: estoque.value,
        emoji: selectedEmoji.value
    })
    resetForm()
}

function resetForm() {
    name.value = ''
    priceInd.value = null
    priceVar.value = null
    category.value = ITEM_CATEGORIES[0]
    estoque.value = 'ok'
    selectedEmoji.value = '🍞'
}
</script>

<template>
    <div class="card">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3 gap-3">
                <div>
                    <h2 class="pn-card-title">Novo Item</h2>
                    <p class="pn-card-sub">Adicione um item ao cardápio</p>
                </div>
                <span class="pn-tag">＋</span>
            </div>

            <form @submit.prevent="submitForm">
                <!-- Nome -->
                <div class="mb-3">
                    <label for="name" class="pn-label">Nome</label>
                    <input
                        id="name"
                        ref="nameInput"
                        v-model.trim="name"
                        type="text"
                        class="form-control"
                        placeholder="Ex: Pão de queijo"
                        required
                    />
                </div>

                <!-- Preços -->
                <div class="row g-2 mb-3">
                    <div class="col-6">
                        <label for="priceInd" class="pn-label">Preço Ind. (R$)</label>
                        <input
                            id="priceInd"
                            v-model.number="priceInd"
                            type="number"
                            class="form-control"
                            min="0.01"
                            step="0.01"
                            placeholder="0,00"
                            required
                        />
                    </div>
                    <div class="col-6">
                        <label for="priceVar" class="pn-label">Preço Var. (R$)</label>
                        <input
                            id="priceVar"
                            v-model.number="priceVar"
                            type="number"
                            class="form-control"
                            min="0.01"
                            step="0.01"
                            placeholder="0,00"
                            required
                        />
                    </div>
                </div>

                <!-- Categoria -->
                <div class="mb-3">
                    <label for="category" class="pn-label">Categoria</label>
                    <select id="category" v-model="category" class="form-select" required>
                        <option value="" disabled>Selecione</option>
                        <option v-for="cat in ITEM_CATEGORIES" :key="cat" :value="cat">
                            {{ cat }}
                        </option>
                    </select>
                </div>

                <!-- Emoji picker -->
                <div class="mb-3">
                    <label class="pn-label d-block mb-2">Emoji do item</label>
                    <div class="d-flex flex-wrap gap-1">
                        <button
                            v-for="emoji in EMOJI_OPTIONS"
                            :key="emoji"
                            type="button"
                            class="btn btn-sm emoji-btn"
                            :class="selectedEmoji === emoji ? 'btn-primary' : 'btn-outline-secondary'"
                            @click="selectedEmoji = emoji"
                        >
                            {{ emoji }}
                        </button>
                    </div>
                    <div class="mt-2 pn-soft small">
                        Selecionado: <span class="fs-5">{{ selectedEmoji }}</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="estoque" class="form-label pn-soft small">
                        Nível de estoque
                    </label>

                    <select
                        id="estoque"
                        v-model="estoque"
                        class="form-select"
                    >
                        <option value="ok">Estoque OK</option>
                        <option value="mid">Estoque médio</option>
                        <option value="low">Estoque baixo</option>
                    </select>
                </div>
                <button
                    type="submit"
                    class="btn btn-primary w-100"
                    :disabled="!isFormValid"
                >
                    Adicionar ao cardápio
                </button>
            </form>
        </div>
    </div>
</template>

