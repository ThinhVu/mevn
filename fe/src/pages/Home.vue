<template>
  <back-office :sidebar-items="sidebarItems"/>
</template>
<script setup lang="tsx">
import BackOffice from "../components/template/BackOffice.vue";
import AdminDashboard from "../components/App/AdminDashboard.vue";
import SystemConfig from "../components/App/SystemConfig.vue";
import SystemLog from "../components/App/SystemLog/SystemLog.vue";

const sidebarItems = [
  {title: 'Dashboard', icon: 'fas fa-play@20:#aaa', component: AdminDashboard},
  {title: 'System Config', icon: 'fas fa-cog@20:#aaa', component: SystemConfig},
  {title: 'System Log', icon: 'fas fa-align-justify@20:#aaa', component: SystemLog}
]
</script>
