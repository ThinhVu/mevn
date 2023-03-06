<template>
  <span>{{timeDiff(props.value)}}</span>
</template>
<script setup>
import dayjs from 'dayjs';
const props = defineProps({value: [Date, String]})
function timeDiff(at) {
  const now = dayjs()
  const diffDay = now.diff(at, 'day')
  if (diffDay > 1) return `${diffDay}d`
  const diffHour = now.diff(at, 'hour')
  if (diffHour > 1) return `${diffHour}h`
  const diffMinute = now.diff(at, 'minute')
  if (diffMinute > 1) return `${diffMinute}m`
  return `${now.diff(at, 'second')}s`
}
</script>
