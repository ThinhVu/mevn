<template>
  <TLoading :action="ACTIONS.AUTH">
    <template #loading>
      <TPulseBlock class="h-100vh w-100vw"/>
    </template>
    <TDashboard v-if="user" :sidebar-items="sidebarItems">
      <template #header>
        <div class="px-2">MHVN</div>
      </template>
    </TDashboard>
    <Auth v-else/>
  </TLoading>
</template>
<script setup lang="ts">
import {inject, computed, onBeforeMount} from 'vue';
import {userAPI} from '@/api';
import {user} from '@/app-state';
import {socketConnect} from '@/socket/socket';
import Dashboard from "../components/Dashboard.vue";
import KV from "../components/KV.vue";
import Auth from "../components/Auth.vue";
import FileExplorer from "../components/FileExplorer/FileExplorer.vue";

const sidebarAdmin = [
  {title: 'Dashboard', icon: 'fas fa-bar-chart@20px:#aaa', component: Dashboard},
  {title: 'KV', icon: 'fas fa-key@20px:#aaa', component: KV},
  {title: 'File System', icon: 'fas fa-folder@20px:#aaa', component: FileExplorer}
]

const sidebarModerator = [
  {title: 'Dashboard', icon: 'fas fa-bar-chart@20px:#aaa', component: Dashboard},
  {title: 'File System', icon: 'fas fa-folder@20px:#aaa', component: FileExplorer}
]

const sidebarItems = computed(() => {
  console.log(user.value)
  if (!user.value) return []
  if (user.value.role === 'admin') return sidebarAdmin
  return sidebarModerator
})

const {loading, notification} = inject('TSystem')

const ACTIONS = {
  AUTH: 'authenticate'
}

onBeforeMount(async () => {
  const access_token = window.localStorage.getItem('access_token')
  if (!access_token) return
  loading.begin(ACTIONS.AUTH)
  try {
    await userAPI.auth(access_token)
    socketConnect(access_token)
  } catch (e) {
    notification.err(e, {duration: 0})
  } finally {
    loading.end(ACTIONS.AUTH)
  }
})
</script>
