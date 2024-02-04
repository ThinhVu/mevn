<template>
  <TSystem>
    <router-view #default="{ Component }">
      <component :is="Component"/>
    </router-view>
  </TSystem>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Sans-Serif;
}

button {
  background: #eee;
  color: #1f252f;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0.5em 1em;
}

button.active {
  background: #1f252f;
  color: #eee;
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
.sb-h::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari and Opera */
}

.hide-scroll-bar::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari and Opera */
}
</style>
