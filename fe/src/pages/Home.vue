<template>
  <t-back-office :sidebar-items="sidebarItems">
    <template #header>
      <div class="px-2">MEVN</div>
    </template>
  </t-back-office>
</template>
<script setup lang="tsx">
import AdminDashboard from "../components/AdminDashboard.vue";
import KV from "../components/KV.vue";
import SystemLog from "../components/SystemLog/SystemLog.vue";
import FileExplorer from "../components/FileExplorer/FileExplorer.vue";

const sidebarItems = [
  {title: 'Dashboard', icon: 'fas fa-play@20px:#aaa', component: AdminDashboard},
  {title: 'KV', icon: 'fas fa-book@20px:#aaa', component: KV},
  {title: 'System Log', icon: 'fas fa-align-justify@20px:#aaa', component: SystemLog},
  {title: 'File System', icon: 'fas fa-folder@20px:#aaa', component: FileExplorer}
]
</script>
