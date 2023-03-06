import { ref } from 'vue';
import {v1} from 'uuid'

const notifyState = ref({})

/**
 * Show system notify
 * @param {String} content notify content
 * @param {String} color [save: #536dfe, error: #E57373]
 * @param {Number} duration milliseconds
 */
function showNotify(content, color = '#cce5ff', duration = 2000) {
  let msg;
  if (content instanceof Error) {
    if (content.response)
      msg = content.response.data.error
    else
      msg = content.message
  } else {
    msg = content || 'Saved';
  }
  const notifyId = v1()
  notifyState.value[notifyId] = {
    content: msg,
    color: color,
    duration: duration,
  }
  setTimeout(() => delete notifyState.value[notifyId], duration)
}

const norm = (content, duration) => showNotify(content, '#fafafa', duration)
const info = (content, duration) => showNotify(content, '#cce5ff', duration)
const err = (content, duration) => showNotify(content, '#f8d7da', duration)
const warn = (content, duration) => showNotify(content, '#fff3cd', duration)
const success = (content, duration) => showNotify(content, '#d4edda', duration)

const render = () => {
  const marginTop = i => ({marginTop: ((i * 60 + 10) + 'px')})
  return <>
    {Object.values(notifyState.value).map((notify, i) =>
        <div class="fix fr top-0 right-0 ai-c jc-c px-2 py-2 br-1" style={[marginTop(i), { marginRight: '10px', backgroundColor: notify.color}]}>
          <span style="color: #444;">{notify.content}</span>
        </div>)}
  </>
}

export default {
  render,
  norm,
  info,
  err,
  warn,
  success,
}
