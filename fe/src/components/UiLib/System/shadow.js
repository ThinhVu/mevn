import {computed} from 'vue';
import useMoment from '@/composables/useMoment.js';
const now = useMoment(180000);
const hour = computed(() => now.value.getHours())

const r = 4;
const shadow = computed(() => {
  let h = hour.value;
  if (6 <= h && h <= 18) {
    const rad = (h - 6) * Math.PI / 12;
    const x = Math.floor(Math.cos(rad) * r)
    const y = Math.floor(Math.sin(rad) * r)
    return {x, y}
  }
  return {x: 0, y: 0}
})
export const boxShadow = computed(() => ({
  'box-shadow': `${shadow.value.x}px ${shadow.value.y}px ${r}px 0 rgba(0, 0, 0, 0.5)`
}))
