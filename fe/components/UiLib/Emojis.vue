<template>
  <div class="fc fg-1 bc-white mx-a px-3 py-3 br-6" style="max-width: 600px; box-shadow: 0 2px 8px 0 rgba(0,0,0,0.3)">
    <div class="fr fw-w fg-1">
      <span v-for="(emojiK, v) in emojis" @click="emit('emoji', v)" class="clickable emj px-1 br-6">
        {{emojiK}}
      </span>
    </div>
    <div class="fr jc-fe">
      <button @click="emit('close')">Close</button>
    </div>
  </div>
</template>
<script setup>
import emojis from '@/assets/json/emoji'
const emit = defineEmits(['close'])
</script>
<style scoped>
.emj:hover {
  background: #aaa;

}
</style>
