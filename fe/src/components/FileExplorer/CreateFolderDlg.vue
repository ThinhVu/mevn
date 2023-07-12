<template>
  <div class="fc fg-4px px-4 py-4 br-1 bc:#fff" style="min-width: 300px; min-height: 200px; border: 1px solid #ddd; margin: 0 auto">
    <h3>Create Folder</h3>
    <div class="rf-aic">
      <t-text label="Name:" class="w-100" v-model="name"/>
    </div>
    <div class="f1"></div>
    <div class="fr jc-fe fg-8px">
      <t-btn secondary @click="cancel">Cancel</t-btn>
      <t-btn primary @click="create">Create</t-btn>
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
