<script>
import {computed} from 'vue';
import uploadCompleted from '@/assets/images/upload-completed.svg';
import uploadFailed from '@/assets/images/upload-failed.svg';
import {
  cancelAllUploads,
  cancelUpload,
  clearUploadingItems,
  showFileUploadProgressDialog,
  uploadingItems
} from '@/components/UiLib/FileUpload/fileUploadLogic';
import msgBox from '@/components/UiLib/Api/msg-box';
import ProgressCircular from '@/components/UiLib/FileUpload/ProgressCircular';

export default {
  components: {ProgressCircular},
  setup() {
    const isUploading = computed(() => uploadingItems.value.find(item => item.value.inProgress))
    const title = computed(() => {
      if (isUploading.value) {
        return `Uploading ${uploadingItems.value.length} ${uploadingItems.value.length === 1 ? 'file' : 'files'}`
      } else {
        return `Upload ${uploadingItems.value.length} ${uploadingItems.value.length === 1 ? 'file' : 'files'} complete`
      }
    })

    function mouseEnterUploadProgress(file) {
      file.hovered = true;
    }

    function mouseLeaveUploadProgress(file) {
      file.hovered = false;
    }

    async function close() {
      if (isUploading.value) {
        const cancelConfirmed = await msgBox.show(
            'Confirm cancel',
            'Are you sure you want to cancel upload progress?',
            msgBox.Buttons.YesNo,
            msgBox.Icons.Question
        );
        if (cancelConfirmed === msgBox.Results.yes) {
          cancelAllUploads();
        }
      }

      clearUploadingItems();
      showFileUploadProgressDialog.value = false
    }

    const renderUploadItemStatusIcon = (uploadItem) => {
      if (uploadItem.value.hovered && !uploadItem.value.success) {
        return <button small onClick={() => cancelUpload(uploadItem)}>
          <icon color="#757575" medium>fas fa-times-circle</icon>
        </button>
      }

      if (uploadItem.value.inProgress) {
        return <progress-circular
            class="upload-item__progress--uploading"
            size="25"
            color="#536DFE"
            value={uploadItem.value.progress}
        />
      }

      if (uploadItem.value.success) {
        return <div class="upload-item__progress--finished">
          <img alt src={uploadCompleted}/>
        </div>
      }

      return <div class="upload-item__progress--failed">
        <img alt src={uploadFailed}/>
      </div>
    }

    const renderUploadItem = (uploadItem, index) => {
      return <div class={['upload-item', uploadItem.value.progress < 100 && 'upload-item--uploading']}
                  key={uploadItem.value.key}>
        <div class="upload-item__title">{uploadItem.value.fileName}</div>
        <div class="f1"/>
        <div class="upload-item__progress" key={`${uploadItem.value.fileName}_${index}`}
             onMouseEnter={() => mouseEnterUploadProgress(uploadItem)}
             onMouseLeave={() => mouseLeaveUploadProgress(uploadItem)}>
          {renderUploadItemStatusIcon(uploadItem)}
        </div>
      </div>
    }

    const renderUploadItemsDialog = () => <div class="file-upload-dialog">
      <div class="file-upload-dialog__header fr ai-c jc-sb">
        <div class="file-upload-dialog__header__title">{title.value}</div>
        <button onClick={close}>x</button>
      </div>
      <div class="file-upload-dialog__items">
        {uploadingItems.value.map(renderUploadItem)}
      </div>
    </div>

    return () => {
      if (!showFileUploadProgressDialog.value) {
        return;
      }
      return renderUploadItemsDialog()
    }
  }
}
</script>

<style scoped>
.file-upload-dialog {
  flex-direction: column;
  background: white;
  position: absolute;
  bottom: 10px;
  right: 10px;
  max-height: 500px !important;
  border: 1px solid #212121;
  z-index: 9999;
}

.file-upload-dialog__header {
  display: flex;
  background: #212121;
  padding: 10px;
  position: relative;
}

.file-upload-dialog__header__title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
}


.file-upload-dialog__status {
  background: #F5F5F5;
  padding: 16px 24px;
  color: #212121;
  font-size: 15px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-upload-dialog__items {
  overflow: auto;
}

.upload-item:not(:last-child) {
  border-bottom: 0.5px solid #f5f5f5;
}

.upload-item--uploading {
  opacity: 0.7;
}

.upload-item__title {
  width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #333333;
  font-size: 14px;
  line-height: 36px;
}

.upload-item__progress-finished {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.upload-item__progress-finished > img {
  width: 25px;
  height: 25px;
}

.upload-item__progress-hover {
  z-index: 2;
  visibility: hidden;
}

.upload-item__progress {
  position: relative;
  width: 25px;
  height: 25px;

}

.upload-item {
  display: flex;
  padding: 8px 12px;
  align-items: center;
}

</style>
