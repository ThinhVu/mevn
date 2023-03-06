import {ref} from 'vue'
const loading = ref({})

export default {
  begin: (key) => loading.value[key] = true,
  end: (key) => delete loading.value[key],
  loading: (key) => !!loading.value[key],
}
