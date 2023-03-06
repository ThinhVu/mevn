<script>
import {computed} from 'vue';

export default {
  name: 'Switch',
  props: { label: String, modelValue: Boolean },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const toggleSwitch = () => {
      emit('update:modelValue', !props.modelValue)
    }

    const switchStyle = computed(() => {
      const style = {
        width: '50px',
        height: '25px',
        borderRadius: '25px',
      }
      return props.modelValue ? {
        ...style,
        background: '#b0cfff',
      } : {
        ...style,
        background: '#878787',
      }
    })

    const thumbStyle = computed(() => {
      const style = {
        height: '21px',
        width: '21px',
        borderRadius: '21px',
        marginTop: '2px',
        boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)'
      }
      return props.modelValue ? {
        ...style,
        marginLeft: '27px',
        background: '#1271FF',
      } : {
        ...style,
        marginLeft: '2px',
        background: '#fff',
      }
    })



    return () => <div class="fr ai-c">
      <span class="mr-1">{props.label}</span>
      <span onClick={toggleSwitch} class="clickable" style={switchStyle.value}>
        <div style={thumbStyle.value}/>
      </span>
    </div>
  }
}
</script>
