<script>
import {isVNode} from 'vue';
import {filter, get} from 'lodash';
import {boxShadow} from '@/components/UiLib/System/shadow.js';

export default {
  setup(props, {slots}) {
    return () => {
      const vDOM = slots.default && slots.default() || [];
      filter(vDOM, isVNode).forEach(vNode => {
        if (vNode.props && vNode.props.hasOwnProperty('shadow')) {
          Object.assign(vNode.props, {
            style: {
              ...get(vNode.props, 'style', {}),
              ...boxShadow.value
            }
          })
        }
      })
      return vDOM;
    }
  }
}
</script>
