export function openUploadFileDialog(options, onFileOpened) {
  options = options || { multiple: false, mimeType: '*/*' }
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = options.mimeType
  input.multiple = options.multiple
  input.addEventListener('change', e => {
    onFileOpened?.(e.target.files)
  });
  document.body.appendChild(input)
  input.style.display = 'none'
  input.click()
  input.parentNode.removeChild(input)
}
export async function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', event => resolve(event.target.result));
    reader.readAsText(file, 'utf-8');
  })
}
