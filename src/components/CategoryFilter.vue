<script setup>
    import { FILTER_CATEGORIES } from '@/constants'

    defineProps({
        activeCategory: {
            type: String,
            required: true,
        },
    })

    const emit = defineEmits(['filter-change'])
</script>

<template>
    <div class="d-flex flex-wrap gap-2 mb-3">
        <button
            v-for="cat in FILTER_CATEGORIES"
            :key="cat"
            type="button"
            :class="['pn-chip', { active: cat === activeCategory }]"
            @click="emit('filter-change', cat)"
        >
            {{ cat }}
        </button>
    </div>
</template>
