import {ref, isRef} from 'vue';
import axios from "axios";
import {v4} from "uuid";
import {feAPI} from "@/api";

export const uploadingItems = ref([])
export const showFileUploadProgressDialog = ref(false)

export function uploadFiles(files, {onSuccess, onError}) {
  for (const file of files) {
    showFileUploadProgressDialog.value = true
    const source = axios.CancelToken.source()
    const upload = ref({
      key: v4(),
      progress: 0,
      inProgress: true,
      cancel: source.cancel,
      fileName: file.name,
      success: false,
      error: null,
    })
    uploadingItems.value.push(upload)
    function handleUploadFailed(context, e) {
      console.error(e, `[fs-util] ${context} failed`)
      upload.value.progress = 0
      upload.value.inProgress = false
      upload.value.success = false
      upload.value.error = e
      onError(e)
    }
    console.log('[fs-util] upload file', file.name)
    feAPI.file.uploadForm(file.name, file.type).then(uploadForm => {
      const {url, fields, imageUrl} = uploadForm;
      const formData = new FormData();
      Object.keys(fields).forEach(key => formData.append(key, fields[key]));
      formData.append('file', file);
      axios.post(url, formData, {
        cancelToken: source.token,
        headers: {"Content-Type": "multipart/form-data"},
        onUploadProgress: (progress) => {
          upload.value.progress = Math.round(progress.loaded * 100 / progress.total)
        }
      }).then(() => {
        upload.value.progress = 100
        upload.value.success = true
        upload.value.inProgress = false
        onSuccess({
          name: file.name,
          src: `https://${imageUrl}`,
          size: file.size,
          type: file.type,
          thumbnail: undefined,
        })
      }).catch(e => handleUploadFailed('upload', e))
    }).catch(e => handleUploadFailed('get upload form', e))
  }
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
