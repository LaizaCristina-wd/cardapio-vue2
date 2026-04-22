<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { ITEM_CATEGORIES } from '@/constants'

    const emit = defineEmits(['add-item'])

    const name = ref('')
    const price = ref(null)
    const category = ref(ITEM_CATEGORIES[0])
    const available = ref(true)
    const nameInput = ref(null)

    const isFormValid = computed(
        () => name.value !== '' && price.value != null && price.value > 0 && category.value !== ''
    )

    onMounted(() => {
        nameInput.value?.focus()
    })

    function submitForm() {
        if (!isFormValid.value) return

        emit('add-item', {
            id: crypto.randomUUID(),
          nome: name.value,
          precoInd: `R$${price.value.toFixed(2)}`,
          precoVar: `R$${(price.value * 2).toFixed(2)}`,
          categoria: category.value,
          estoque: 'ok',
          emoji: '🍞' 
        })
          function resetForm() {
            name.value = ''
            price.value = null
            category.value = ''
            available.value = true
    }
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
                <div class="mb-3">
                    <label for="name" class="pn-label">Nome</label>
                    <input
                        id="name"
                        ref="nameInput"
                        v-model.trim="name"
                        type="text"
                        class="form-control"
                        placeholder="Ex: Pizza Calabresa"
                        required
                    />
                </div>

                <div class="mb-3">
                    <label for="price" class="pn-label">Preço (R$)</label>
                    <input
                        id="price"
                        v-model.number="price"
                        type="number"
                        class="form-control"
                        min="0.01"
                        step="0.01"
                        placeholder="0,00"
                        required
                    />
                </div>

                <div class="mb-3">
                    <label for="category" class="pn-label">Categoria</label>
                    <select id="category" v-model="category" class="form-select" required>
                        <option value="" disabled>Selecione</option>
                        <option v-for="cat in ITEM_CATEGORIES" :key="cat" :value="cat">
                            {{ cat }}
                        </option>
                    </select>
                </div>

                <div class="form-check mb-3">
                    <input
                        id="available"
                        v-model="available"
                        type="checkbox"
                        class="form-check-input"
                    />
                    <label class="form-check-label pn-soft small" for="available">
                        Disponível para pedido
                    </label>
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
