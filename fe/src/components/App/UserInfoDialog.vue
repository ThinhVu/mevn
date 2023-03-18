<template>
  <div class="px-4 py-4 br-10 mx-a fc fg-1" style="backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.3); min-width: 400px">
    <img :src="avatar" style="width: 40px; height: 40px; border-radius: 20px" @click="selectAvatar"/>
    <p><txt v-model="fullName" class="w-100" placeholder="Email"/></p>
    <div class="fr ai-c fg-1 mt-2">
      <button @click="close">x</button>
      <spacer/>
      <button @click="finish">Finish</button>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue'
import notification from '@/components/UiLib/System/notification'
import {uploadFile} from '@/components/UiLib/FileUpload/fs-util'
import {openUploadFileDialog} from '@/utils/file.js'
import Spacer from '@/components/UiLib/Spacer.vue'
import Txt from '@/components/UiLib/Txt.vue'
import {user} from '@/app-state'
import {userAPI} from '@/api'

const emit = defineEmits(['close'])
const avatar = ref(user.value && user.value.avatar || '')
const fullName = ref(user.value && user.value.fullName || '')

const pendingAvatar = ref()
const selectAvatar = () => openUploadFileDialog({mimeType: 'image/*', multiple: false}, (files) => {
  const file = files[0]
  pendingAvatar.value = file
  console.log('pendingAvatar', pendingAvatar.value)
  const url = window.URL.createObjectURL(file)
  console.log('url', url)
  avatar.value = url
})

const close = () => emit('close')
const finish = async () => {
  try {
    const avatarUrl =  await (uploadFile([pendingAvatar.value]))[0];
    await userAPI.update({avatar: avatarUrl, fullName: fullName.value})
    emit('close')
  } catch (e) {
    notification.err(e)
  }
}
</script>
