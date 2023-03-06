import {markRaw, ref} from 'vue'
import {v4} from 'uuid'
import layer from './layer';

const dialogState = ref([])

const show = (target) => {
  let component, data
  if (target && typeof target.setup === 'function') {
    component= markRaw(target)
  } else if (typeof target === 'function') {
    component = markRaw({setup: target})
  } else if (target && target.component) {
    component = markRaw(target.component)
    data = target.data
  } else {
    throw "Neither component or setup is provided"
  }

  return new Promise(resolve => {
    const dlgId = v4()
    dialogState.value.push({
      __close: result => {
        dialogState.value = dialogState.value.filter(dialog => dialog.__uuid !== dlgId)
        resolve(result)
      },
      __zIndex: layer.getNextZIndex(),
      __data: data || {},
      __uuid: dlgId,
      __component: component
    })
  })
}

const render = () => dialogState.value.map(dialog =>
    <overlay key={dialog.__uuid} zIndex={dialog.__zIndex}>
      <dialog.__component onClose={dialog.__close} {...dialog.__data}/>
    </overlay>)

export default {
  show,
  render
}
