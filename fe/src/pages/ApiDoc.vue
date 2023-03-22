<template>
  <div>
    API Schema
    <table border>
      <thead>
      <tr><th>Path</th><th>Schema</th><th>Description</th></tr>
      </thead>
      <tbody>
      <tr v-for="(routeSchema, i) in routeSchemas" :key="i">
        <td>{{routeSchema.path}}</td>
        <td>{{JSON.stringify(routeSchema.schema)}}</td>
        <td>{{routeSchema.description}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
const routeSchemas = ref([])
onMounted(async () => {
  const rs = await hmm.routeSchema.find({}, {_id: 0}).$
  routeSchemas.value = rs;
})
</script>
