<script>
import {ref} from 'vue';
import _ from 'lodash';

export default {
  name: 'Time',
  props: {},
  setup() {
    const now = ref(new Date())
    setInterval(() => now.value = new Date(), 60000);
    return () => <div>{_.padStart(now.value.getHours(), 2, '0')}:{_.padStart(now.value.getMinutes(), 2, '0')}</div>
  }
}
</script>
