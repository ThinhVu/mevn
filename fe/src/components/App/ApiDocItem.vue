<template>
  <div>
    <div class="grid gtc-1fr-1fr gg-20px">
      <div class="fc fg-1 py-2">
        <div class="fs-l">{{metadata.title}}</div>
        <div style="border: 1px solid #aaa; line-height: 30px" class="br-6px mb-2 ovf-h">
          <span class="min-w-80px bc-b-8 c-b-0 ta-c t-t--u" style="display: inline-block">{{methodName}}</span>
          <span class="ml-1 c:#555">{{path}}</span>
        </div>
        <p class="fs-s">{{metadata.description}}</p>
        <field-spec title="Parameters" :value="metadata.schema?.params"/>
        <field-spec title="Query" :value="metadata.schema?.query"/>
        <field-spec title="Body" :value="metadata.schema?.body"/>
        <field-spec title="Response" :value="metadata.schema?.response"/>
      </div>
      <div class="bc:#1e204c c:#fff">
        Example code here
      </div>
    </div>
    <hr/>
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
</script>
<style scoped>
</style>
