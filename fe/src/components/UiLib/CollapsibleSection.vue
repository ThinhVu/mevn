<template>
  <div>
    <div class="fr ai-c py-1 clickable" style="gap: 6px" @click="toggle">
      <icon v-if="showLeftCaret" color="#ddd">{{caretIcon}}</icon>
      <span @click="emit('titleClick')" style="color: #767676; font-size: 15px; font-weight: 600;">{{title}}</span>
      <icon v-if="showRightCaret" color="#ddd">{{caretIcon}}</icon>
      <slot name="more"></slot>
    </div>
    <template v-if="displayContent">
      <div>
        <slot></slot>
      </div>
    </template>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  caretPosition: {
    type: String,
    default: 'left'
  },
  showContent: Boolean
})
const emit = defineEmits(['titleClick'])
const displayContent = ref(props.showContent)
const toggle = () => displayContent.value = !displayContent.value
const caretIcon = computed(() => displayContent.value ? 'fas fa-caret-down@15' : 'fas fa-caret-up@15')
const showLeftCaret = computed(() => props.caretPosition === 'left')
const showRightCaret = computed(() => props.caretPosition === 'right')
</script>
