<template>
  <div class="w-100 h-100 fr ai-c fix z-index-999">
    <div class="px-4 py-4 br-10px mx-a fc fg-16px"
         style="border: 1px solid rgba(255,255,255,0.2); min-width: 300px">
      <p><t-text v-model="email" class="w-100" label="Email" placeholder="enter your email"/></p>
      <p><t-password v-model="password" class="w-100" label="Password"/></p>
      <div class="fr ai-c jc-fe fg-4px">
        <t-btn @click="signUp">Sign Up</t-btn>
        <t-btn primary @click="signIn">Sign In</t-btn>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, inject} from 'vue'
import {userAPI} from '@/api';
import UserInfoDialog from '@/components/UserInfoDialog.vue';
import {useRouter} from 'vue-router';

const router = useRouter()

const {dialog} = inject('TSystem')

const email = ref()
const password = ref()

const cancel = () => emit('close')
const signIn = async () => {
  const succeeded = await userAPI.signIn(email.value, password.value)
  if (succeeded)
    await router.push({path: '/'})
}
const signUp = async () => {
  const succeeded = await userAPI.signUp(email.value, password.value)
  if (succeeded) {
    await dialog.show({component: UserInfoDialog})
    await router.push({path: '/'})
  }
}
</script>
