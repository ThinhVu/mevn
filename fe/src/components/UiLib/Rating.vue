<script lang="jsx">s
import {range} from 'lodash';
import Icon from '@/components/UiLib/Icon.vue';
export default {
  components: {Icon},
  props: {
    max: {
      type: Number,
      default: 5
    },
    modelValue: Number
  },
  setup(props, ctx) {
    return () => <span class="clickable">
      {range(1, props.max + 1).map(i => <icon
          style="margin-left: 5px"
          onClick={() => ctx.emit('update:modelValue', i)}
          color={i <= props.modelValue ? '#fab23d': 'gray'}>fa fa-star@20</icon>
      )}
    </span>
  }
}
</script>
