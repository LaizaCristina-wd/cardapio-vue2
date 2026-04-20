<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const user = computed(() => store.getters['auth/user'])

const initials = computed(() => {
  const name = user.value?.username || ''
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
})


// estado do menu (você pode ligar ao Vuex depois)
const activeNav = ref('overview')

const navItems = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'producao', label: 'Produção' },
  { key: 'menu', label: 'Gestão de Menu' },
  { key: 'logistica', label: 'Logística' },
  { key: 'relatorios', label: 'Relatórios' },
]

function navTo(key) {
  activeNav.value = key
}
</script>

<template>
  <aside class="db-sidebar">

    <!-- LOGO -->
    <div class="sb-logo">
      <div class="sb-logo-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c3a343" stroke-width="2">
          <path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/>
        </svg>
      </div>
      <div>
        <div class="sb-brand">Selo Real</div>
        <div class="sb-sub">Panificação</div>
      </div>
    </div>

    <!-- NAV -->
    <nav class="sb-nav">
      <p class="sb-section">Principal</p>

      <button
        v-for="item in navItems"
        :key="item.key"
        class="sb-item"
        :class="{ active: activeNav === item.key }"
        @click="navTo(item.key)"
      >
        {{ item.label }}
      </button>
    </nav>

    <!-- USER FOOTER (AQUI VAI O LOGIN DEPOIS) -->
    <div class="sb-footer">
      <div class="sb-avatar">
         {{ initials || 'U' }}
      </div>

      <div>
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
<style scoped>
.db-sidebar {
  width: 210px;
  min-width: 210px;
  background: var(--pn-bg-2);
  border-right: 1px solid var(--pn-border-soft);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sb-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 14px;
  border-bottom: 1px solid var(--pn-border-soft);
}

.sb-logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--pn-orange-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sb-brand { font-size: 14px; font-weight: 600; }
.sb-sub { font-size: 10px; color: var(--pn-orange); }

.sb-nav { padding: 10px 8px; flex: 1; }

.sb-section {
  font-size: 10px;
  color: var(--pn-text-dim);
  text-transform: uppercase;
  padding: 10px 8px 4px;
}

.sb-item {
  width: 100%;
  padding: 8px 10px;
  border-radius: 7px;
  background: transparent;
  border: none;
  color: var(--pn-text-muted);
  text-align: left;
  cursor: pointer;
  transition: 0.2s;
}

.sb-item:hover {
  background: var(--pn-panel);
  color: var(--pn-text);
}

.sb-item.active {
  background: var(--pn-orange-soft);
  color: var(--pn-orange);
}

.sb-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--pn-border-soft);
}

.sb-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--pn-orange-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

</style>