<template>
  <div style="height: 50px; background-color: rgba(0,0,0,0.2); color: #fff" class="fr ai-c jc-sb px-2">
    <h3>{{title}}</h3>
    <div class="f1"></div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'PageHeader',
  props: {
    title: String
  },
}
</script>
