<template>
  <div class="mx-2">
    <h3 class="my-2">API Schema</h3>
    <hr/>
    <div class="grid gtc-240px-1fr gg-40px">
      <div style="border-right: 1px solid #ddd">

      </div>
      <div>
        <api-doc-item v-for="(item, i) in routeMetadatas"
                      :key="i"
                      v-bind="item"
                      class="mb-3"/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import ApiDocItem from '@/components/App/ApiDocItem.vue';
const routeMetadatas = ref([])
onMounted(async () => {
  const rs = await hmm.routeMetadata.find({}, {_id: 0}).$
  routeMetadatas.value = rs;
})
</script>
