<template>
  <t-back-office :sidebar-items="sidebarItems">
    <temmplate #header>MEVN</temmplate>
  </t-back-office>
</template>
<script setup lang="tsx">
import AdminDashboard from "../components/AdminDashboard.vue";
import SystemConfig from "../components/SystemConfig.vue";
import SystemLog from "../components/SystemLog/SystemLog.vue";
import FileExplorer from "../components/FileExplorer/FileExplorer.vue";

const sidebarItems = [
  {title: 'Dashboard', icon: 'fas fa-play@20px:#aaa', component: AdminDashboard},
  {title: 'System Config', icon: 'fas fa-cog@20px:#aaa', component: SystemConfig},
  {title: 'System Log', icon: 'fas fa-align-justify@20px:#aaa', component: SystemLog},
  {title: 'File System', icon: 'fas fa-folder@20px:#aaa', component: FileExplorer}
]
</script>
