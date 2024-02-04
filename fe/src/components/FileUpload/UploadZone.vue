<script lang="jsx">
import {uploadFiles} from './fs-util';
import {openUploadFileDialog} from '@/utils/file';
import {inject} from 'vue';

export default {
  emits: ['uploaded'],
  props: {
    multiple: Boolean,
    mimeType: {
      type: String,
      default: '*/*'
    }
  },
  setup(props, {emit, slots}) {
    const {notification} = inject('TSystem')
    const addNewFile = async () => {
      openUploadFileDialog({multiple: props.multiple, mimeType: props.mimeType}, async (files) => {
        if (!files.length) return
        uploadFiles(files, {
          onSuccess: (uploadedFile) => {
            emit('uploaded', {
              name: uploadedFile.name,
              src: uploadedFile.src,
              size: uploadedFile.size,
              type: uploadedFile.type,
              thumbnail: uploadedFile.thumbnail,
              createdAt: new Date()
            })
          },
          onError: (e) => {
            console.error(e)
            notification.err('failed to upload file')
          }
        })
      })
    }

    return () => <div class="clickable" onClick={addNewFile}>{slots.default ? slots.default() : 'Upload'}</div>
  }
}
</script>
