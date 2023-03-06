<script>
import dialogApi from './dialog'
import msgBoxApi from './msg-box'
import notificationApi from './notification'
import Icon from '../Icon'
import Overlay from '../Overlay'
import FileUploadProgressDialog from '@/components/UiLib/FileUpload/FileUploadProgressDialog';

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
