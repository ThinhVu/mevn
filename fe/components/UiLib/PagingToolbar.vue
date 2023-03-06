<template>
  <template v-if="totalItems">
    <div>Tổng: {{totalItems}}</div>
    <button :disabled="!canPrev" @click="firstPage">|&lt;</button>
    <button :disabled="!canPrev" @click="prevPage">&lt;</button>
    <span>{{page}} / {{totalPages}}</span>
    <button :disabled="!canGoNext" @click="nextPage">&gt;</button>
    <button :disabled="!canGoNext" @click="lastPage">&gt;|</button>
  </template>
  <template v-else>
    Không có dữ liệu
  </template>
</template>
<script setup>
import {computed} from 'vue';
import _ from 'lodash';

const props = defineProps({
  page: Number,
  totalItems: Number,
  itemsPerPage: Number,
})
const emit = defineEmits(['update:page'])

const totalPages = computed(() => _.round(props.totalItems / props.itemsPerPage + 0.5, 0))

const canPrev = computed(() => props.page > 1)
const firstPage = () => emit('update:page', 1);
const prevPage = () => emit('update:page', Math.max(0, props.page - 1));

const canGoNext = computed(() => props.page < totalPages.value)
const nextPage = () => emit('update:page', props.page + 1);
const lastPage = () => emit('update:page', totalPages.value);
</script>
