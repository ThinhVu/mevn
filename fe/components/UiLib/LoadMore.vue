<template>
  <section class="load-more" ref="loadMore"></section>
</template>
<script setup>

import {ref, onMounted} from 'vue';

const emit = defineEmits(['loadMore'])

const loadMore = ref()

onMounted(() => {
  const options = {rootMargin: '0px'}
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      emit('loadMore')
    }
  }, options);
  observer.observe(loadMore.value)
})

</script>
<style scoped>
.load-more {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
