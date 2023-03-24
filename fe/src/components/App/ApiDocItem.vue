<template>
  <div class="grid gtc-1fr-1fr">
    <div class="fc fg-1 px-3">
      <div class="pt-2 fs-l" :id="`${methodName}:${path}`">{{metadata.title}}</div>
      <div style="border: 1px solid #ddd; line-height: 30px" class="fr ai-c br-6px mb-2 ovf-h">
        <span class="h-100 min-w-80px fs-s c-b-0 ta-c t-t--u" style="display: inline-block" :style="{backgroundColor: methodColor}">{{methodName}}</span>
        <span class="h-100 ml-1 c:#555 path">{{path}}</span>
      </div>
      <p class="fs-s mb-3">{{metadata.desc}}</p>
      <field-spec title="Headers" :value="metadata.schema?.headers"/>
      <field-spec title="Path parameters" :value="metadata.schema?.params"/>
      <field-spec title="Query string" :value="metadata.schema?.query"/>
      <field-spec title="Request body" :value="metadata.schema?.body"/>
      <field-spec title="Response" :value="metadata.response"/>
      <hr/>
    </div>
    <div class="bc:#1e204c c:#fff" style="border-radius: 0 0 6px 6px">

    </div>
  </div>
</template>
<script setup>
import {computed} from 'vue';
import FieldSpec from '@/components/App/FieldSpec.vue';
const props = defineProps({
  path: String,
  methods: Object,
  metadata: Object
})
const methodName = computed(() => Object.keys(props.methods).find(k => props.methods[k]))
const methodColor = computed(() => methodColors[methodName.value] || '#aaa')
const methodColors = {
  'get': '#1ccc11',
  'post': '#f6871a',
  'put': '#009cde',
  'delete': '#ec5050',
}
</script>
<style scoped>
.path {
  font-size: 0.9375rem;
  color: #555;
  font-weight: 400;
}
</style>
