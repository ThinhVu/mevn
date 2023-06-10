<template>
  <section data-name="system-config" class="fc w-100 h-100 fg-3 c-b-0">
    <t-table class="w-100">
      <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="cfg in configs">
        <td>{{cfg.key}}</td>
        <td>{{cfg.value}}</td>
        <td>
          <t-btn class="fn-btn" @click="api.systemConfig.unset(cfg.key)">
            <t-icon>fas fa-times@16:#d50404</t-icon>
          </t-btn>
        </td>
      </tr>
      </tbody>
    </t-table>
    <div class="fr ai-c fg-1">
      <t-text class="f1" placeholder="Key" v-model="key"/>
      <t-text class="f3" placeholder="Value" v-model="value"/>
      <t-btn @click="setConfig">Add</t-btn>
    </div>
  </section>
</template>
<script setup>
import {systemConfigAPI} from '@/api';
import {ref, onMounted, onBeforeMount, onBeforeUnmount} from 'vue'

const configs = ref([])
const key = ref('')
const value = ref('')
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
