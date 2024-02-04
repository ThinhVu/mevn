<template>
  <div
    class="clickable fr ai-c jc-sb px-1 py-1"
    style="line-break: anywhere; font-size: 12px"
    @click="copySrc">
    <span>{{name}}</span>
    <span class="px-2 py-2 bc-aaa" @click.stop.prevent="$emit('delete')">x</span>
  </div>
</template>
<script setup>
import {copyToClipboard} from '@/utils/common.js';
const props = defineProps({
  name: String,
  src: String,
  size: Number,
  thumbnail: String,
  type: String
})
defineEmits(['delete'])
const copySrc = () => copyToClipboard(props.src)
</script>
