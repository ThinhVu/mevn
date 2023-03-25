<template>
  <div class="fc fg-1 px-1 py-1 clickable c:#fff" @click="copySrc">
    <imgx v-shadow :src="thumbnail" :style="{width: '100px', height: '100px'}"/>
    <span class="ta-c" style="line-break: anywhere">{{shortenName}}</span>
  </div>
</template>
<script setup>
import {computed, defineProps} from 'vue';
import {copyToClipboard} from '@/utils/common.js';
import Imgx from '@/components/UiLib/Imgx.vue';
const props = defineProps({name: String, src: String, size: Number, thumbnail: String, type: String})
const copySrc = () => copyToClipboard(props.src)
const shortenName = computed(() => {
  if (props.name.length > 20) {
    return props.name.substring(0, 8) + '...' + props.name.substring(props.name.length - 8)
  }
  return props.name
})
</script>
