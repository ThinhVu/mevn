<template>
  <div class="ta-c">
    {{currentValue}}<span class="caret">.</span>
  </div>
</template>
<script setup>
import {onBeforeUnmount, onMounted, ref, watch, computed} from 'vue';
import {random} from 'lodash';

const props = defineProps({txt: String})
const emit = defineEmits(['completed'])

const currentValue = ref('')
let interval;

function createMask(len) {
  const mask = []
  for (let i = 0; i < len; ++i) {
    const randomVal = random(2, 15);
    mask.push(randomVal < 3 ? randomVal : 0)
  }
  return mask;
}

const delay = async ms => new Promise(resolve => setTimeout(resolve, ms))
let busy = false;
async function typing() {
  if (busy)
    return
  busy = true;
  currentValue.value = '';
  const len = props.txt.length;
  const mask = createMask(len);
  for (let i = 0; i < len; ++i) {
    for (let j = 0; j < mask[i]; ++j) {
      currentValue.value += String.fromCharCode(random(97, 123))
      await delay(random(100, 150))
    }
    for (let j = 0; j < mask[i]; ++j) {
      currentValue.value = currentValue.value.substr(0, currentValue.value.length - 1)
      await delay(random(100, 150))
    }
    currentValue.value += props.txt[i];
    await delay(random(100, 150))
  }
  setTimeout(() => {
    busy = false;
    emit('completed')
  }, 2000)
}

watch(() => props.txt, typing)
onMounted(typing)
onBeforeUnmount(() => clearInterval(interval))
</script>
<style>
.caret {
  display: inline-block;
  width: 10px;
  background: #fff;
  animation: blink 1s;
  animation-iteration-count: infinite;
  font-weight: bold;
}

@keyframes blink {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

</style>
