<template>
  <div class="w-100 h-100">
    <div class="fr ai-c jc-c" style="height: 50px; font-size: 24px; color: #fff">
      {{idx+1}} / {{props.media.length}}
    </div>
    <div class="w-100 fr ai-c fg-1" style="height: calc(100% - 50px)">
      <icon :color="canPrev ? '#fff' : '#333'" @click="prev">fas fa-chevron-left@40</icon>
      <div class="f1"><imgx :src="src" class="h-100 mx-0"/></div>
      <icon :color="canNext ? '#fff' : '#333'" @click="next">fas fa-chevron-right@40</icon>
    </div>
  </div>
</template>
<script setup>
import {computed, onMounted, ref} from 'vue';
import Imgx from '@/components/Imgx';
import Icon from '@/components/UiLib/Icon';
const props = defineProps({ media: Array, idx: Number })

const idx = ref(props.idx || 0)
const canPrev = computed(() => idx.value > 0)
const canNext = computed(() => idx.value < props.media.length - 1)
const prev = () => idx.value = Math.max(idx.value - 1, 0)
const next = () => idx.value = Math.min(idx.value + 1, props.media.length - 1)
const src = computed(() => props.media && props.media[idx.value])
onMounted(() => {
  if (props.media.length)
    idx.value = 0
})
</script>
