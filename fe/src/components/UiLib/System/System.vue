<script lang="jsx">
import dialogApi from './dialog'
import msgBoxApi from './msg-box'
import notificationApi from './notification'
import Icon from '../Icon.vue'
import Overlay from '../Layer/Overlay.vue'
import FileUploadProgressDialog from '../FileUpload/FileUploadProgressDialog.vue'

export default {
  components: {Icon, Overlay, FileUploadProgressDialog},
  setup() {
    return () => <>
      {dialogApi.render()}
      {msgBoxApi.render()}
      {notificationApi.render()}
      <FileUploadProgressDialog/>
    </>
  }
}
</script>
