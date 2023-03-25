<template>
  <div class="fc fg-2 px-2 py-2 bc-gray-0" style="min-width: 300px; min-height: 200px; border: 1px solid #ddd; margin: 0 auto">
    <h3>New Folder</h3>
    <div class="rf-aic">
      <p>Name:</p>
      <input class="w-100" v-model="name"/>
    </div>
    <div class="f1"></div>
    <div class="fr jc-fe fg-1">
      <button @click="cancel">Cancel</button>
      <button @click="create">Create</button>
    </div>
  </div>
</template>
<script setup>
import {ref, toRaw} from 'vue'

const emit = defineEmits(['close'])

const name = ref()
const cancel = () => emit('close')
const create = () => emit('close', toRaw(name.value))
</script>
