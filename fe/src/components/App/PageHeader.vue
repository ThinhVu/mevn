<template>
  <div style="height: 50px; background-color: rgba(0,0,0,0.2); color: #fff" class="fr ai-c jc-sb px-2">
    <slot></slot>
    <div class="f1"></div>
    <h3>{{title}}</h3>
  </div>
</template>
<script setup>
defineProps({title: String})
</script>
