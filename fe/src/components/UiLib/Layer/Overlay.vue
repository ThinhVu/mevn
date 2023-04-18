<script setup>
const props = defineProps({zIndex: Number, raiseEvent: Boolean})
const emit = defineEmits(['click'])
const handleOnClick = (e) => {
  if (props.raiseEvent) {
    emit('click', e);
  } else {
    e.preventDefault();
    e.stopPropagation();
  }
}
</script>

<template>
  <div class="w-100vw h-100vh fr ai-c fix top-0 left-0" :style="{zIndex}" @click="handleOnClick">
    <slot></slot>
  </div>
</template>
