<script>
import dialog from '@/components/UiLib/System/dialog';
import Imgx from '@/components/UiLib/Imgx.vue';

export default {
  components: {Imgx},
  props: {src: String},
  setup(props, {slots}) {
    const preview = () => {
      dialog.show((__, {emit}) => {
        const close = () => emit('close')
        return () => <div class="fr ai-c w-100 h-100 bc-gray-6-5 clickable" onClick={close}>
          <imgx class="mx-a" src={props.src}/>
        </div>
      })
    }
    return () => <span onClick={preview}>{slots.default && slots.default()}</span>
  }
}
</script>
