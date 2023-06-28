<template>
  <TLoading :action="ACTIONS.AUTH">
    <template #loading>
      <TPulseBlock class="h-100vh w-100vw"/>
    </template>
    <TDashboard v-if="user" :sidebar-items="sidebarItems">
      <template #header>
        <div class="px-2">MEVN</div>
      </template>
    </TDashboard>
    <Auth v-else/>
  </TLoading>
</template>
<script setup lang="ts">
import {inject, onBeforeMount} from 'vue';
import {userAPI} from '@/api';
import socket from '@/socket/socket';
import AdminDashboard from "../components/AdminDashboard.vue";
import KV from "../components/KV.vue";
import SystemLog from "../components/SystemLog/SystemLog.vue";
import FileExplorer from "../components/FileExplorer/FileExplorer.vue";
import {user} from '@/app-state'
import Auth from "./Auth.vue";

const sidebarItems = [
  {title: 'Dashboard', icon: 'fas fa-play@20px:#aaa', component: AdminDashboard},
  {title: 'KV', icon: 'fas fa-book@20px:#aaa', component: KV},
  {title: 'System Log', icon: 'fas fa-align-justify@20px:#aaa', component: SystemLog},
  {title: 'File System', icon: 'fas fa-folder@20px:#aaa', component: FileExplorer}
]

const {loading, notification} = inject('TSystem')

const ACTIONS = {
  AUTH: 'authenticate'
}

onBeforeMount(async () => {
  const access_token = window.localStorage.getItem('access_token')
  if (access_token) {
    loading.begin(ACTIONS.AUTH)
    try {
      await userAPI.auth(access_token)
      window.$socket = socket(access_token)
    } catch (e) {
      notification.err(e, {duration: 0})
    } finally {
      loading.end(ACTIONS.AUTH)
    }
  }
})
</script>
