<template>
  <img draggable="false" v-show="imgState === 'loaded'" :style="mediaStyle" ref="image" @click="emit('click')"/>
  <pulse-block v-if="imgState === 'loading'" :style="mediaStyle"/>
  <div v-if="imgState === 'error'" :style="mediaStyle"></div>
</template>
<script setup>
import {ref, onMounted, watch, computed} from 'vue';
import PulseBlock from '@/components/UiLib/PulseBlock';

const props = defineProps({
  src: String,
  style: [String, Object],
})

const emit = defineEmits(['click'])

const image = ref()
const mediaStyle = computed(() => {
  return {
    height: `100%`,
    maxWidth: `100%`,
    objectFit: 'cover',
    ...props.style
  }
})
const imgState = ref()
const changeImgSrc = src => {
  image.value.src = src;
  imgState.value = 'loading';
}
watch(() => props.src, changeImgSrc);
onMounted(() => {
  image.value.onload = () => imgState.value = 'loaded';
  image.value.onerror = () => imgState.value = 'error';
  changeImgSrc(props.src)
})
</script>
