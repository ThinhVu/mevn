<template>
  <div>{{fmtNow}}</div>
</template>
<script setup>
import {ref, watch, onMounted, onBeforeUnmount} from 'vue';
import dayjs from 'dayjs';
const props = defineProps({interval: Number})
const fmtNow = ref();
let intervalId;
function startTimer(interval) {
  intervalId = setInterval(() => fmtNow.value = dayjs().format('HH:mm'), interval)
}
function stopTimer() {
  clearInterval(intervalId)
}
onMounted(startTimer)
onBeforeUnmount(stopTimer)
watch(() => props.interval, v => {
  stopTimer()
  startTimer(v || 60000)
})
</script>
