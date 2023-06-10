<template>
  <section data-name="system-config" class="fc w-100 h-100 fg-12px px-3 py-3">
    <t-table class="w-100">
      <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
        <th class="w-10px">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="cfg in configs">
        <td>{{cfg.key}}</td>
        <td>{{cfg.value}}</td>
        <td class="fr ai-c fg-4px">
          <t-btn edit class="fn-btn" @click="prepareEdit(cfg)">
            <t-icon>fas fa-edit@20px:#fff</t-icon>
          </t-btn>
          <t-btn delete class="fn-btn" @click="api.systemConfig.unset(cfg.key)">
            <t-icon>fas fa-times@20px:#fff</t-icon>
          </t-btn>
        </td>
      </tr>
      </tbody>
    </t-table>
    <div class="fc ai-c fg-12px ai-fs">
      <t-text class="w-100" placeholder="Key" label="Key" v-model="key"/>
      <t-text class="w-100" placeholder="Value" label="Value" v-model="value"/>
      <t-btn @click="setConfig" save class="min-w-100px">Add</t-btn>
    </div>
  </section>
</template>
<script setup>
import {systemConfigAPI} from '@/api';
import {ref, onMounted, onBeforeMount, onBeforeUnmount} from 'vue'

const configs = ref([])
const key = ref('')
const value = ref('')

const prepareEdit = (cfg) => {
  key.value = cfg.key
  value.value = cfg.value
}
const setConfig = () => {
  systemConfigAPI.set(key.value, value.value)
  key.value = ''
  value.value = ''
}
const loadConfigs = () => {
  console.log('load config');
  systemConfigAPI.gets().then(rs => configs.value = rs)
}
onBeforeMount(() => loadConfigs())
onMounted(() => {
  console.log('watch system-config');
  window.$socket.emit('watch', 'system-config');
  window.$socket.on('system-config:set', () => loadConfigs())
  window.$socket.on('system-config:unset', () => loadConfigs())
})
onBeforeUnmount(() => {
  window.$socket.emit('un-watch', 'system-config');
  window.$socket.off('system-config:set')
  window.$socket.off('system-config:unset')
})
</script>
