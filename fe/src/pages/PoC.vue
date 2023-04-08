<template>
  <div class="hide-scroll-bar">
    <no-throw v-for="item in items" :key="item.id" silent>
      <p>
        <span>{{ item.name.toLowerCase() }}</span>
        <span>{{ item.age }}</span>
      </p>
    </no-throw>
  </div>
</template>
<script setup>

import NoThrow from '@/components/UiLib/NoThrow.vue';

const items = [
  {name: 'Josh', age: 20},
  {name: 'Tom', age: 20},
  {name: null, age: 20}, // bad value -> entire component not render
]

</script>
