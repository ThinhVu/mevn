<template>
  <textarea style="border: none; resize: none; outline: none; background: transparent" :value="v" :placeholder="placeholder" @input="updateV"/>
</template>
<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
  modelValue: String,
  type: String,
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
