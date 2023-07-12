<template>
  <div class="w-100 h-100 fr ai-c fix z-index-999">
    <div class="px-4 py-4 br-10px mx-a fc fg-16px"
         style="border: 1px solid rgba(255,255,255,0.2); min-width: 300px">
      <h3>MEVN</h3>

      <p><t-text v-model="email" class="w-100" label="Email address" placeholder="Email address..."/></p>
      <p><t-password v-model="password" class="w-100" label="Password"/></p>

      <div class="fr ai-c jc-fs fg-4px">
        <t-btn primary @click="signIn">Log In</t-btn>
        <t-btn save @click="signUp">Create Account</t-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, inject} from 'vue';
import {useRouter} from 'vue-router';
import {userAPI} from '@/api';

const {notification} = inject('TSystem')

const router = useRouter()

const email = ref('')
const password = ref('')

const signIn = () => userAPI.signIn(email.value, password.value).catch(e => {
  notification.err(e.response.data.reason)
})
const signUp = () => userAPI.signUp(email.value, password.value).catch(e => {
  notification.err(e.response.data.reason)
})
</script>
