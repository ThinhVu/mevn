<template>
  <div class="pulse-block"></div>
</template>
<script setup>
</script>
<style scoped>
.pulse-block {
  animation: pulse-bg 1s infinite;
}

@keyframes pulse-bg {
  0% { background-color: #ddd; }
  50% { background-color: #aaa; }
  100% { background-color: #ddd; }
}
</style>
