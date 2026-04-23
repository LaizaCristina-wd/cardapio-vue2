<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from "vue-router"
import { ref, provide } from 'vue'
import NotificationToast from '@/components/NotificationToast.vue'
import { NOTIFY } from '@/constants'

import Sidebar from '@/components/NavBar.vue'
const route = useRoute()
const showSidebar = computed(() => route.meta.requiresSidebar === true)

const notification = ref(null)

function notify(message, type = NOTIFY.SUCCESS) {
  notification.value = {
    message,
    type
  }
}

function dismissNotification() {
  notification.value = null
}

provide('notify', notify)
</script>
<template>  
  <div :class="['app-layout', { 'with-sidebar': showSidebar }]">
    <Sidebar v-if="showSidebar" />
    <main class="app-main">
      <RouterView />

  <NotificationToast
  v-if="notification"
  :message="notification.message"
  :type="notification.type"
  @dismiss="dismissNotification"
/>
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
 