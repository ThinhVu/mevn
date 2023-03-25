<template>
  <router-view #default="{ Component }">
    <component :is="Component"/>
  </router-view>
  <system/>
</template>

<script setup>
import System from '@/components/UiLib/System/System.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Sans-Serif;
}

button {
  background: #1f252f;
  color: #eee;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0.5em 1em;
  box-shadow: 2px 2px 4px 0 rgba(0,0,0,.4);
}

button.active {
  background: #eee;
  color: #1f252f;
}


input {
  height: 30px;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

select {
  height: 30px;
  min-width: 60px;
}

/*
Uno css failed to generate pseudo rule.
https://github.com/unocss/unocss/issues/2371
*/
.hide-scroll-bar::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari and Opera */
}
</style>
