export function openFileDialog(options = { multiple: false, mimeType: '*/*' }) {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = options.mimeType
    input.multiple = options.multiple
    input.addEventListener('change', e => resolve(e.target.files));
    document.body.appendChild(input)
    input.style.display = 'none'
    input.click()
    input.parentNode.removeChild(input)
  })
}

export async function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', event => resolve(event.target.result));
    reader.readAsText(file, 'utf-8');
  })
}

export async function copyToClipboard(content) {
  await navigator.clipboard.writeText(content)
}
