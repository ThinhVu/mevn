<template>
  <input :value="v" :placeholder="placeholder" @input="updateV" style="outline: none">
</template>
<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String
})
const emit = defineEmits(['update:modelValue'])

const v = ref(props.modelValue)
watch(() => props.modelValue, newV => v.value = newV)

const updateV = e => {
  const val = e.target.value;
  v.value = val
  emit('update:modelValue', val)
}
</script>
