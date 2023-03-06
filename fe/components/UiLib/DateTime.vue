<template>
  <span>{{fmt}}</span>
</template>
<script setup>
import {onBeforeUnmount, onMounted, ref, computed} from 'vue'
import {padStart} from 'lodash'
const now = ref(new Date())
const fmt = computed(() => `${padStart(now.value.getHours(), 2, '0') }:${padStart(now.value.getMinutes(), 2, '0')}`)
let timer;
onMounted(() => timer = setInterval(() => now.value = new Date(), 1000))
onBeforeUnmount(() => clearInterval(timer))
</script>
<style scoped>
</style>
