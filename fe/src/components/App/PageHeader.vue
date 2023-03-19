<template>
  <div style="height: 50px; background-color: #272727; color: #fff" class="fr ai-c jc-sb px-2 fg-1">
    <h3>{{title}}</h3>
    <div class="f1"></div>
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({title: String})
</script>
