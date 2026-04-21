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
const activeNav = ref('allview')

const navItems = [
  { key: 'allview',   label: 'Visão Geral',    to: '/Overview'           },
  { key: 'producao',  label: 'Produção',        to: '/producao'   },
  { key: 'menu',      label: 'Gestão de Menu',  to: '/menu'       },
  { key: 'logistica', label: 'Logística',       to: '/logistica'  },
  { key: 'relatorios',label: 'Relatórios',      to: '/relatorios' },
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
       <RouterLink
        v-for="item in navItems"
        :key="item.key"
        :to="item.to"
        class="sb-item"
        active-class="active"
        exact-active-class="active"
      >
       <svg v-if="item.key === 'allview'"   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          <svg v-if="item.key === 'producao'"   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
          <svg v-if="item.key === 'menu'"       viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          <svg v-if="item.key === 'logistica'"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <svg v-if="item.key === 'relatorios'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>

        {{ item.label }}
       </RouterLink>
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
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sb-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 14px;
  border-bottom: 1px solid var(--pn-border-soft);
}

.sb-logo-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: var(--pn-orange-soft);
  border: 1px solid rgba(195,163,67,.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.sb-brand { font-size: 15px; font-weight: 600; color: var(--pn-text); }
.sb-sub   { font-size: 12px; color: var(--pn-orange); letter-spacing: .06em; }


.sb-nav { padding: 10px 8px; flex: 1; }

.sb-section {
  font-size: 15px;
  color: var(--pn-text-dim);
  text-transform: uppercase;
  padding: 10px 8px 4px;
}

.sb-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--pn-text-muted);
  font-size: 15px;
  cursor: pointer;
  text-align: left;
  transition: all .15s;
  margin-bottom: 2px;
  text-decoration: none;
}

.sb-item svg { width: 15px; height: 15px; flex-shrink: 0; }
.sb-item:hover { background: var(--pn-panel); color: var(--pn-text); }
.sb-item.active {
  background: var(--pn-orange-soft);
  border-color: rgba(195,163,67,.2);
  color: var(--pn-orange);
}
.sb-item:hover {
  background: var(--pn-panel);
  color: var(--pn-text);
}

.sb-item.active {
  background: var(--pn-orange-soft);
  color: var(--pn-orange);
}

.sb-badge {
  margin-left: auto;
  background: var(--pn-red);
  color: #fff;
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 99px;
}

.sb-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--pn-border-soft);
}

.sb-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--pn-border-soft);
}

.sb-user-name { font-size: 13px; font-weight: 500; color: var(--pn-text); }
.sb-user-role { font-size: 12px; color: var(--pn-text-dim); }


.sb-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: var(--pn-orange-soft);
  border: 1px solid rgba(195,163,67,.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: var(--pn-orange); font-weight: 600;
  flex-shrink: 0;
}

</style>