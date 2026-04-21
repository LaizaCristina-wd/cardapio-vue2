<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from "vue-router"
import Sidebar from '@/components/NavBar.vue'
const route = useRoute()
const showSidebar = computed(() => route.meta.requiresSidebar === true)

</script>
<template>  
  <div :class="['app-layout', { 'with-sidebar': showSidebar }]">
    <Sidebar v-if="showSidebar" />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
 
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
 
.app-main {
  flex: 1;
  overflow-y: auto;
  background: #001d3d;
}
</style>
 