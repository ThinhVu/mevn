<template>
  <span v-if="title && isLoading" class="mr-1">{{title}}</span>
  <progress-circular v-if="isLoading" indeterminate size="20"/>
  <template v-else>
    <slot/>
  </template>
</template>
<script setup>
import {computed} from 'vue';
import loading from '@/components/UiLib/System/loading';
import ProgressCircular from '@/components/UiLib/ProgressCircular.vue';
const props = defineProps({ action: String, title: String })
const isLoading = computed(() => loading.loading(props.action))
</script>
