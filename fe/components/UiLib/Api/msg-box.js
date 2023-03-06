/**
 * https://mdbootstrap.com/docs/angular/css/colors/
 * https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.messagebox.show
 */

import {ref} from 'vue';
import layer from './layer';

const Buttons = {
  OK: 0,
  OKCancel: 1,
  AbortRetryIgnore: 2,
  YesNoCancel: 3,
  YesNo: 4,
  RetryCancel: 5,
};

const Icons = {
  None: 0,
  Information: 1,
  Warning: 2,
  Error: 3,
  Question: 4,
  Success: 5,
};

const Results = {
  abort: 'abort',
  cancel: 'cancel',
  ignore: 'ignore',
  no: 'no',
  ok: 'ok',
  retry: 'retry',
  yes: 'yes'
}

const msgData = ref({
  show: false,
  btn: Buttons.OKCancel,
  icon: Icons.None,
  title: '',
  content: '',
  resultHandlerFn: result => console.log(result)
});

const renderBtn = (uiLabel, onClick, isDefaultBtn) => {
  const style = {
    backgroundColor: isDefaultBtn ? '#1271ff': '#e0e0e0',
    color: isDefaultBtn ? '#fff' : '#1f1f1f',
    minWidth: '100px',
  }
  return <button class="px-2 py-1 clickable ta-c" style={style} onClick={onClick}>{uiLabel.toUpperCase()}</button>
}

const btnRenders = {
  [Buttons.OK]: (on) => renderBtn('ok', () => on(Results.ok)),
  [Buttons.OKCancel]: (on) => <>
    {renderBtn('cancel', () => on(Results.cancel))}
    {renderBtn('ok', () => on(Results.ok), true)}
  </>,
  [Buttons.AbortRetryIgnore]: (t, on) => <>
    {renderBtn('abort', () => on(Results.abort))}
    {renderBtn('retry', () => on(Results.retry))}
    {renderBtn('ignore', () => on(Results.ignore))}
  </>,
  [Buttons.YesNoCancel]: (on) => <>
    {renderBtn('cancel', () => on(Results.cancel))}
    {renderBtn('no', () => on(Results.no))}
    {renderBtn('yes', () => on(Results.yes), true)}
  </>,
  [Buttons.YesNo]: (on) => <>
    {renderBtn('no', () => on(Results.no))}
    {renderBtn('yes', () => on(Results.yes), true)}
  </>,
  [Buttons.RetryCancel]: (on) => <>
    {renderBtn('cancel', () => on(Results.cancel))}
    {renderBtn('retry', () => on(Results.retry), true)}
  </>,

};
const iconRenders = {
  [Icons.None]: () => null,
  [Icons.Success]: () => <icon>fas fa-check-circle:#43a047</icon>,
  [Icons.Information]: () => <icon>fas fa-info-circle:#039be5</icon>,
  [Icons.Warning]: () => <icon>fas fa-exclamation-triangle:#d32f2f</icon>,
  [Icons.Error]: () => <icon>fas fa-times-circle@48px:#d32f2f</icon>,
  [Icons.Question]: () => <icon>fas fa-question-circle:#757575</icon>,
};

const render = () => {
  if (!msgData.value.show)
    return

  return <overlay zIndex={msgData.value.zIndex}>
    <div class="bc-gray-0 br-1 my-0 mx-a" style={{width: '70%', maxWidth: '500px'}}>
      <div class="px-2 py-2" style="border-bottom: 1px solid #e0e0e0">
        <b>{msgData.value.title}</b>
      </div>
      <div class="px-2 py-2">
        <div class="fr jc-fs fg-2">
          {iconRenders[msgData.value.icon]()}
          {typeof (msgData.value.content) === 'function' ? msgData.value.content() : msgData.value.content}
        </div>
      </div>
      <div class="fr ai-c jc-fe fg-1 px-2 py-2">
        {btnRenders[msgData.value.btn](msgData.value.resultHandlerFn)}
      </div>
    </div>
  </overlay>
};

function show(title, content, btn, icon) {
  return new Promise(resolve => {
    msgData.value = {
      title,
      content,
      btn: btn || Buttons.YesNo,
      icon: icon || Icons.Question,
      zIndex: layer.getNextZIndex(),
      resultHandlerFn: result => {
        msgData.value.show = false
        resolve(result)
      },
      show: true
    }
  })
}

export default {
  Buttons,
  Icons,
  Results,
  show,
  render
}
