<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

// ────────────────────────────────────────────────────────────────────
// Store & Computed
// ────────────────────────────────────────────────────────────────────
const store = useStore()
const user = computed(() => store.getters['auth/user'])

const initials = computed(() => {
  const name = user.value?.username || ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})


// Estado

const activeNav = ref('allview')

// Constantes

const NAV_ITEMS = [
  { key: 'allview', label: 'Visão Geral', to: '/Overview', icon: 'grid' },
  { key: 'producao', label: 'Produção', to: '/producao', icon: 'settings' },
  { key: 'menu', label: 'Gestão de Menu', to: '/menu', icon: 'clipboard' },
  { key: 'logistica', label: 'Logística', to: '/logistica', icon: 'truck' },
  { key: 'relatorio', label: 'Relatórios', to: '/relatorio', icon: 'chart' },
]

// Métodos

const navTo = (key) => {
  activeNav.value = key
}

const getIconType = (key) => {
  const iconMap = {
    allview: 'grid',
    producao: 'settings',
    menu: 'clipboard',
    logistica: 'truck',
    relatorio: 'chart',
  }
  return iconMap[key]
}
</script>

<template>
  <aside class="db-sidebar">
    <!-- Logo Section -->
    <div class="sb-logo">
      <div class="sb-logo-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" />
        </svg>
      </div>
      <div class="sb-logo-text">
        <div class="sb-brand">Selo Real</div>
        <div class="sb-sub">Panificação</div>
      </div>
    </div>

    <!-- Navigation Section -->
    <nav class="sb-nav">
      <p class="sb-section">Principal</p>

      <RouterLink
        v-for="item in NAV_ITEMS"
        :key="item.key"
        :to="item.to"
        class="sb-item"
        active-class="active"
        exact-active-class="active"
        @click="navTo(item.key)"
      >
        <!-- Grid Icon -->
        <svg
          v-if="item.icon === 'grid'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>

        <!-- Settings Icon -->
        <svg
          v-if="item.icon === 'settings'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>

        <!-- Clipboard Icon -->
        <svg
          v-if="item.icon === 'clipboard'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
        </svg>

        <!-- Truck Icon -->
        <svg
          v-if="item.icon === 'truck'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>

        <!-- Chart Icon -->
        <svg
          v-if="item.icon === 'chart'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>

        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- User Footer Section -->
    <div class="sb-footer">
      <div class="sb-avatar">
        {{ initials || 'U' }}
      </div>

      <div class="sb-user-info">
        <div class="sb-user-name">
          {{ user?.username || 'Visitante' }}
        </div>
        <div class="sb-user-role">
          {{ user?.role || 'Operador' }}
        </div>
      </div>
    </div>
  </aside>
</template>

