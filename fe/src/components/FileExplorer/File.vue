<template>
  <div class="fc fg-1 px-1 py-1 clickable" @click="copySrc">
    <t-img v-shadow :src="thumbnail" :style="{width: '100px', height: '100px', border: '1px solid #ddd'}"/>
    <span class="ta-c mt-1" style="line-break: anywhere; font-size: 12px">{{shortenName}}</span>
  </div>
</template>
<script setup>
import {computed} from 'vue';
import {copyToClipboard} from '@/utils/common.js';

const props = defineProps({name: String, src: String, size: Number, thumbnail: String, type: String})

const copySrc = () => copyToClipboard(props.src)

const shortenName = computed(() => {
  if (props.name.length > 20) {
    return props.name.substring(0, 8) + '...' + props.name.substring(props.name.length - 8)
  }
  return props.name
})
</script>
