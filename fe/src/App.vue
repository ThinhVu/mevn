<template>
  <router-view #default="{ Component }">
    <component :is="Component"/>
  </router-view>
  <system/>
    <p>Hours: {{now.getHours()}}</p>
    <div style="margin-left: 20px; margin-top: 20px;" class="fr ai-c fg-1">
      <shadow>
        <button id="x" class="w-100px h-100px br-20px" style="color: blue">Click me</button>
        <button shadow id="x" class="w-100px h-100px br-20px" style="color: blue">Click me</button>
        <imgx shadow src="https://picsum.photos/200" style="width: 200px; height: 200px"/>
      </shadow>
    </div>
</template>

<script setup>
import System from '@/components/UiLib/System/System.vue';
import Shadow from '@/components/UiLib/Shadow.vue';
import useMoment from '@/composables/useMoment.js';
import Imgx from '@/components/UiLib/Imgx.vue';
const now = useMoment(1000)
</script>
