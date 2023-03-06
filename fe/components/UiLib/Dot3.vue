<template>
  <span>{{dot3}}</span>
</template>
<script setup>
import {computed, ref, onBeforeUnmount, onMounted} from 'vue'
let id;
const i = ref(0);
onMounted(() => id = setInterval(() => i.value++, 500))
onBeforeUnmount(() => clearInterval(id))
const anim = ['● ○ ○', '○ ● ○', '○ ○ ●']
const dot3 = computed(() => anim[i.value % 3])
</script>
