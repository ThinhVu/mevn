import {onMounted, onBeforeUnmount, ref} from 'vue'

export default function useMoment(initInterval = 60000) {
  const now = ref(new Date())
  let intervalId;
  function startTimer(interval) {
    intervalId = setInterval(() => now.value = new Date(), interval)
  }
  function stopTimer() {
    clearInterval(intervalId)
  }
  onMounted(() => startTimer(initInterval))
  onBeforeUnmount(stopTimer)
  return now;
}
