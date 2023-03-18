<template>
  <router-view #default="{ Component }">
    <component :is="Component"/>
  </router-view>
  <system/>
    <div style="margin-left: 20px; margin-top: 20px;" class="fr ai-c fg-1">
      <button id="x" class="w-100px h-100px br-20px" style="color: blue">Click me</button>
      <button v-shadow id="x" class="w-100px h-100px br-20px" style="color: blue">Click me</button>
    </div>
</template>

<script setup>
import System from '@/components/UiLib/System/System.vue';
</script>
