<template>
  <section data-name="system-config" class="fc w-100 h-100 fg-3 py-3 px-3 ovf-y-s hide-scroll-bar c-b-0">
    <table border>
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
            <button class="fn-btn" @click="api.systemConfig.unset(cfg.key)">
              <icon>fas fa-times@16:#d50404</icon>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button @click="uploadFileS">Upload</button>
    </div>
    <div class="fr ai-c fg-1">
      <input class="f1" placeholder="Key" :value="key" @input="key = $event.target.value"/>
      <input class="f3" placeholder="Value" :value="value" @input="value = $event.target.value"/>
      <button @click="setConfig">Add</button>
    </div>
  </section>
</template>
<script setup>
import {onBeforeMount, onBeforeUnmount, onMounted, ref} from 'vue';
import {systemConfigAPI} from '@/api';
import {uploadFile} from '@/components/UiLib/FileUpload/fs-util';
import {openUploadFileDialog} from '@/utils/file.js';
import {copyToClipboard} from '@/utils/common.js';
import notification from '@/components/UiLib/System/notification';
import Icon from '@/components/UiLib/Icon.vue';

const configs = ref([])
const key = ref('')
const value = ref('')
const setConfig = () => {
  systemConfigAPI.set(key.value, value.value)
  key.value = ''
  value.value = ''
}

const uploadFileS = () => {
  openUploadFileDialog({multiple: false, mimeType: '*/*'}, async (files) => {
    try {
      const filePath = (await Promise.all(uploadFile(files)))[0]
      console.log('uploaded', filePath)
      await copyToClipboard(filePath)
      notification.success('Upload completed. Url path has been copy to clipboard');
    } catch (e) {
      notification.err(e);
    }
  })
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
