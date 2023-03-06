<template>
  <div>
    <div class="fr ai-c fg-1 py-1" @click="toggle">
      <icon size="15" color="#ddd">{{caretIcon}}</icon>
      <span class="clickable" @click="emit('titleClick')" style="color: #767676; font-size: 15px; font-weight: 600;">{{title}}</span>
      <slot name="more"></slot>
    </div>
    <template v-if="displayContent">
      <div style="padding-left: 30px">
        <slot></slot>
      </div>
    </template>
  </div>
</template>
<script setup>
import {ref, computed} from 'vue';
import Icon from './Icon';

const props = defineProps({
  title: String,
  showContent: Boolean
})
const emit = defineEmits(['titleClick'])
const displayContent = ref(props.showContent)
const toggle = () => displayContent.value = !displayContent.value
const caretIcon = computed(() => displayContent.value ? 'fas fa-caret-down' : 'fas fa-caret-up')
</script>
