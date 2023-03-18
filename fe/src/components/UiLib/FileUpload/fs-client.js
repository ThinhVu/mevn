import axios from 'axios';
import {ref} from 'vue';
import {v4} from 'uuid';
import {FILE_API_URL} from '@/constants';

class FsClient {
  constructor({apiUrl}) {
    this.apiUrl = apiUrl;
  }

  uploadFile(file, { uploadCompletedCallback, uploadProgressCallback }) {
    const formData = new FormData()
    formData.append('file', file)

    const source = axios.CancelToken.source()

    const upload = ref({
      key: v4(),
      progress: 0,
      inProgress: true,
      cancel: source.cancel,
      mimeType: file.type,
      fileName: file.name,
    })

    function onUploadProgress(progress) {
      const progressPercentage = Math.round(progress.loaded * 100 / progress.total);
      upload.value.progress = progressPercentage;
      uploadProgressCallback && uploadProgressCallback(progressPercentage);
    }

    let responseData
    axios.post(this.apiUrl, formData, { cancelToken: source.token, onUploadProgress })
    .then(async (response) => {
      upload.value.progress = 100
      upload.value.success = true
      responseData = response
    })
    .catch(() => {
      upload.value.progress = 0
      upload.value.success = false
    })
    .finally(() => {
      upload.value.inProgress = false
      uploadCompletedCallback(responseData)
    })

    return upload
  }

  resolveFile(file) {
    return `${this.apiUrl}/${file}`;
  }
}

export default new FsClient({apiUrl: FILE_API_URL})
