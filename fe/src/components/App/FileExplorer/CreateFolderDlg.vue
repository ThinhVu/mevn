<template>
  <div class="fc fg-4px px-2 py-2" style="min-width: 300px; min-height: 200px; border: 1px solid #ddd; margin: 0 auto">
    <h3>New Folder</h3>
    <div class="rf-aic">
      <p>Name:</p>
      <t-text class="w-100" v-model="name"/>
    </div>
    <div class="f1"></div>
    <div class="fr jc-fe fg-1">
      <t-btn secondary @click="cancel">Cancel</t-btn>
      <t-btn primary @click="create">Create</t-btn>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue'

const emit = defineEmits(['close'])

const name = ref()
const cancel = () => emit('close')
const create = () => emit('close', toRaw(name.value))
</script>
