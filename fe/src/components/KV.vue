<template>
  <section data-name="system-config" class="fc w-100 h-100 fg-12px px-3 py-3">
    <t-table class="w-100 max-h-400px">
      <thead>
      <tr>
        <th class="z-index-1">Key</th>
        <th class="z-index-1">Value</th>
        <th class="w-10px z-index-1">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="kv in kvs" :key="kv.key">
        <td>{{kv.key}}</td>
        <td>
          <div class="fr ai-c jc-sb fg-4px">
            <span class="ovf-h max-w-500px" style="text-overflow: ellipsis;">
              {{ ((!kv.showValue) && kv.encrypted) || kv.value}}
            </span>
            <div v-if="kv.isSecret" class="px-1 py-1 br-1 clickable h-24px w-24px bc:#3c5bb7">
              <t-icon @click="kv.showValue = !kv.showValue">fas fa-search@16px:#fff</t-icon>
            </div>
          </div>
        </td>
        <td>
          <div class="fr ai-c fg-4px">
            <t-btn edit class="fn-btn" @click="prepareEdit(kv)">
              <t-icon>fas fa-edit@20px:#fff</t-icon>
            </t-btn>
            <t-btn delete class="fn-btn" @click="unsetConfig(kv)">
              <t-icon>fas fa-times@20px:#fff</t-icon>
            </t-btn>
          </div>
        </td>
      </tr>
      </tbody>
    </t-table>
    <div class="fc ai-c fg-12px ai-fs">
      <t-text class="w-100" placeholder="Key" label="Key" v-model="key"/>
      <t-text class="w-100" placeholder="Value" label="Value" v-model="value"/>
      <t-switch v-model="isSecret" label="Is Secret"/>
      <t-btn @click="setConfig" save class="min-w-100px">Add</t-btn>
    </div>
  </section>
</template>
<script setup>
import {kvAPI} from '../api';
import {ref, onMounted, onBeforeMount, onBeforeUnmount, inject} from 'vue'
import {socket} from '@/socket/socket'

const {msgBox} = inject('TSystem')

const kvs = ref([])

const key = ref('')
const value = ref('')
const isSecret = ref(false)

function inspect(kv) {
  console.log(kv)
}
function prepareEdit(kv) {
  key.value = kv.key
  value.value = kv.value
}
async function setConfig() {
  await kvAPI.set(key.value, value.value, isSecret.value)
  key.value = ''
  value.value = ''
  await loadConfigs()
}
async function unsetConfig(config) {
  const answer = await msgBox.show('Delete', `Are you sure you want to unset "${config.key}"?`)
  if (answer !== msgBox.Results.yes) return
  await kvAPI.unset(config.key)
  await loadConfigs()
}
async function loadConfigs() {
  console.log('load config');
  kvs.value = await kvAPI.gets()
}
onBeforeMount(loadConfigs)
onMounted(() => {
  console.log('watch system-config');
  socket?.emit('watch', 'kv');
  socket?.on('kv:set', loadConfigs)
  socket?.on('kv:unset', loadConfigs)
})
onBeforeUnmount(() => {
  socket?.emit('un-watch', 'kv');
  socket?.off('kv:set', loadConfigs)
  socket?.off('kv:unset', loadConfigs)
})
</script>
