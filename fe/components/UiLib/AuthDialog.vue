<template>
  <div class="w-100 h-100 fr ai-c fix" style="z-index: 999;">
    <div class="px-4 py-4 br-10 mx-a fc fg-1"
         style="border: 1px solid rgba(255,255,255,0.2); background: rgb(113 113 113); min-width: 300px">
      <p><txt v-model="email" class="w-100" placeholder="Email"/></p>
      <p><txt v-model="password" class="w-100" placeholder="Password"/></p>
      <div class="fr ai-c fg-1 mt-2">
        <button @click="cancel">x</button>
        <button @click="signUp">Sign Up</button>
        <spacer/>
        <button @click="signIn">Sign In</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue'
import {userAPI} from '@/api';
import Spacer from '@/components/UiLib/Spacer';
import Txt from '@/components/UiLib/Txt';
import dialog from '@/components/UiLib/Api/dialog';
import UserInfoDialog from '@/components/UserInfoDialog';
const emit = defineEmits(['close'])

const email = ref()
const password = ref()

const cancel = () => emit('close')
const signIn = async () => {
  const succeeded = await userAPI.signIn(email.value, password.value)
  if (succeeded)
    emit('close')
}
const signUp = async () => {
  const succeeded = await userAPI.signUp(email.value, password.value)
  if (succeeded) {
    await dialog.show({component: UserInfoDialog})
    emit('close')
  }
}
</script>
<style scoped>
button {
  background: transparent;
  border: 1px solid #ccc;
  color: #fff;
}
</style>
