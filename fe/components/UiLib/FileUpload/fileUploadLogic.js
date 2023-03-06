import {ref, isRef} from 'vue'
import FsClient from '@/logic/fsClient';

export const uploadingItems = ref([])
export const showFileUploadProgressDialog = ref(false)

window.uploadingItems = uploadingItems;

/**
 * Upload file
 * @param files {[File]} selected files
 * @return {[Promise<any>]} promise contain the results
 */
export function uploadFile(files) {
  const uploadProgress = []
  for (const file of files) {
    uploadProgress.push(new Promise((resolve, reject) => {
      showFileUploadProgressDialog.value = true
      uploadingItems.value.push(FsClient.uploadFile(file, {
        uploadCompletedCallback: async response => {
          if (response && response.status === 200) {
            resolve(FsClient.resolveFile(response.data.data));
          } else {
            reject(response.data)
          }
        },
        uploadProgressCallback: console.log
      }))
    }))
  }
  return uploadProgress;
}

export function openUploadFileDialog(options = { multiple: false, mimeType: '*/*' }, onFileOpened) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = options.mimeType
  input.multiple = options.multiple
  input.addEventListener('change', e => {
    onFileOpened && onFileOpened(e.target.files)
  });
  document.body.appendChild(input)
  input.style.display = 'none'
  input.click()
  input.parentNode.removeChild(input)
}

export function clearUploadingItems() {
  uploadingItems.value = []
}

export function cancelAllUploads() {
  uploadingItems.value.forEach(uploadItem => uploadItem.value.cancel())
}

export function cancelUpload(uploadItem) {
  if (isRef(uploadItem))
    uploadItem = uploadItem.value

  const itemIndex = uploadingItems.value.findIndex(item => item.value.key === uploadItem.key)

  if (itemIndex >= 0)
    uploadingItems.value.splice(itemIndex, 1)

  if (uploadItem.inProgress)
    uploadItem.cancel()
}
