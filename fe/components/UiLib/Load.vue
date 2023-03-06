<template>
  <span v-if="title && isLoading" class="mr-1">{{title}}</span>
  <dot3 v-if="isLoading"/>
  <template v-else>
    <slot/>
  </template>
</template>
<script setup>
import {computed} from 'vue';
import Dot3 from '@/components/UiLib/Dot3';
import loading from '@/components/UiLib/Api/loading';
const props = defineProps({ action: String, title: String })
const isLoading = computed(() => loading.loading(props.action))
</script>
