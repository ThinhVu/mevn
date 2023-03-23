<template>
  <div class="w-100vw h-100vh">
    <div style="height: 40px; line-height: 40px; border-bottom: 1px solid #ddd">
      <h3 class="mx-2">API Documentation</h3>
    </div>
    <div class="grid gtc-240px-1fr ovf-h" style="height: calc(100% - 40px)">
      <div class="h-100 ovf-y-s" style="border-right: 1px solid #ddd">
        <ul class="mx-2">
          <li class="my-1" v-for="(item, i) in routeMetadatas" :key="i">
            <a style="text-decoration: none; color: #0c0c0d" :href="`#${methodName(item)}:${item.path}`">
              {{item.metadata.title || toLower(item.path)}}
            </a>
          </li>
        </ul>
      </div>
      <div class="h-100 ovf-y-s">
        <api-doc-item v-for="(item, i) in routeMetadatas"
                      :key="i"
                      v-bind="item"
                      class="mb-3"/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue';
import ApiDocItem from '@/components/App/ApiDocItem.vue';
import {toLower} from 'lodash';

const routeMetadatas = ref([])
onMounted(async () => {
  const rs = await hmm.routeMetadata.find({}, {_id: 0}).$
  routeMetadatas.value = rs;
})
const methodName = (item) => Object.keys(item.methods).find(k => item.methods[k])
</script>
