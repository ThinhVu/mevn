<template>
  <collapsable-section :title="title" v-if="visible">
    <div class="fc fg-1">
      <div v-for="(entry, i) of entries" :key="i" style="border: 1px solid #ddd" class="px-3 py-3 br-10px">
        <p class="mb-3 fs-12px">
          <span class="mr-2 fw-7">{{ entry[0] }}</span>
          <span class="c:#6c7378 mr-2">{{ entry[1].type }}</span>
          <span v-if="entry[1].required" class="c:#f08d00">required</span>
        </p>
        <p class="fs-xs">{{ entry[1].desc }}</p>
      </div>
    </div>
  </collapsable-section>
</template>
<script setup>
const props = defineProps({
  title: String,
  value: Object
})
const visible = computed(() => props.value != undefined)
const entries = computed(() => Object.entries(props.value || {}))
</script>
