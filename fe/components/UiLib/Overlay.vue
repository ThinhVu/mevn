<script>
export default {
  name: 'Overlay',
  props: {zIndex: Number, raiseEvent: Boolean},
  emits: ['click'],
  setup(props, ctx) {
    const handleOnClick = (e) => {
      if (props.raiseEvent) {
        ctx.emit('click', e);
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    return () => <div
        class="w-100vw h-100vh fr ai-c fix top-0 left-0"
        style={{zIndex: props.zIndex}}
        onClick={handleOnClick}>
      {ctx.slots.default && ctx.slots.default()}
    </div>
  }
}
</script>
