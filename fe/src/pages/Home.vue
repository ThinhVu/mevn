<template>
  <back-office :sidebar-items="sidebarItems"/>
</template>
<script setup lang="tsx">
import BackOffice from "../components/template/BackOffice.vue";
import AdminDashboard from "../components/App/AdminDashboard.vue";
import SystemConfig from "../components/App/SystemConfig.vue";
const sidebarItems = [
  { title: 'Dashboard', icon: 'fas fa-play@20:#aaa', component: AdminDashboard },
  {title: 'System Config', icon: 'fas fa-cog@20:#aaa', component: SystemConfig }
]
</script>
