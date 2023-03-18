<template>
  <div class="w-100 h-100 fr ai-c fix z-index-999">
    <div class="px-4 py-4 br-10px mx-a fc fg-1"
         style="border: 1px solid rgba(255,255,255,0.2); min-width: 300px">
      <p><txt v-model="email" class="w-100" placeholder="Email"/></p>
      <p><txt v-model="password" class="w-100" placeholder="Password"/></p>
      <div class="fr ai-c fg-1 mt-2">
        <button @click="cancel">Close</button>
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
import Spacer from '@/components/UiLib/Spacer.vue';
import Txt from '@/components/UiLib/Txt.vue';
import dialog from '@/components/UiLib/System/dialog';
import UserInfoDialog from '@/components/App/UserInfoDialog.vue';
import {useRouter} from 'vue-router';

const router = useRouter()

const email = ref()
const password = ref()

const cancel = () => emit('close')
const signIn = async () => {
  const succeeded = await userAPI.signIn(email.value, password.value)
  if (succeeded)
    router.push({path: '/'})
}
const signUp = async () => {
  const succeeded = await userAPI.signUp(email.value, password.value)
  if (succeeded) {
    await dialog.show({component: UserInfoDialog})
    router.push({path: '/'})
  }
}
</script>
