<script lang="jsx">
import {get} from 'lodash-es';
import CreateFolderDlg from './CreateFolderDlg.vue';
import IcoFolder from '@/assets/images/folder.svg';
import UploadZone from '@/components/FileUpload/UploadZone.vue';
import FileUploadProgressDialog from '@/components/FileUpload/FileUploadProgressDialog.vue';
import File from './File.vue';
import {feAPI} from '@/api/index.js';
import {ref, inject, onMounted} from 'vue';

export default {
  components: {File, UploadZone, FileUploadProgressDialog},
  setup() {
    const folderTree = ref([])
    const selectedFolder = ref();
    const {dialog, msgBox, notification, loading} = inject('TSystem')

    // toolbar
    const showDeleteFolderDialog = async () => {
      const deleteConfirm = await msgBox.show(
          'Delete folder',
          'Are you sure you want to delete this folder, sub folders & files inside it?',
          msgBox.Buttons.YesNo,
          msgBox.Icons.Question
      );
      if (deleteConfirm === msgBox.Results.no)
        return;

      await feAPI.folder.remove(selectedFolder.value._id)
      await loadFolderTree()
    }

    const createFolder = async () => {
      const name = await dialog.show({ component: CreateFolderDlg })
      if (name) {
        await feAPI.folder.create(name);
        await loadFolderTree();
      }
    }
    const createSubFolder = async () => {
      const name = await dialog.show({ component: CreateFolderDlg })
      if (name) {
        await feAPI.folder.create(name, selectedFolder.value && selectedFolder.value._id);
        await loadFolderTree();
      }
    }
    const addNewFile = async (file) => {
      try {
        console.log('[FileExplorer] addNewFile', file)
        const createdFile = await feAPI.file.create(file, selectedFolder.value && selectedFolder.value._id)
        selectedFolder.value.files.push(createdFile);
        console.log('[addNewFile] Upload completed');
        notification.success('[addNewFile] Upload completed');
      } catch (e) {
        console.error(e, '[addNewFile]')
        notification.err(e.message);
      }
    }
    const deleteFile = async (file) => {
      const deleteConfirm = await msgBox.show(
        'Delete file',
        'Are you sure you want to delete this file?',
        msgBox.Buttons.YesNo,
        msgBox.Icons.Question
      );
      if (deleteConfirm === msgBox.Results.no)
        return;
      await feAPI.file.remove(file._id, selectedFolder.value._id)
      await loadFilesInSelectedFolder()
    }

    // folder tree
    const selectCategory = async (e, category) => {
      e.preventDefault();
      e.stopPropagation();
      selectedFolder.value = category;
      loadFilesInSelectedFolder().then();
    }
    const loadFolderTree = async () => {
      folderTree.value = await feAPI.folder.getFolderTree()
    }
    onMounted(loadFolderTree)
    const renderFolderTree = (folders, isChild) => <div class="fc">
      {folders.map(folder => <><div
          class={['clickable py-1', isChild ? 'pr-1' : 'px-1']}
          style={['color: #000', { background: selectedFolder.value === folder ? '#e3e3e3' : 'transparent' }]}
          onClick={(e) => selectCategory(e, folder)}>
        {isChild && <span></span>}
        <img src={IcoFolder} width="16"/>
        <span class="ml-1">{folder.name}</span>
      </div>
        {Array.isArray(folder.folders) ? <div class="rel" style="margin-left: 15px;">
          <div>
            {renderFolderTree(folder.folders, true)}
          </div>
        </div> : null }
      </>)}
    </div>

    // files
    const LOADING_FILES_KEY = 'loading-file'
    const onFileClicked = async (file) => {
      console.log('onFileClicked', file)
      dialog.show({
        component: {
          setup: (__, {emit}) => {
            const close = () => emit('close')
            return () => <div class="fr ai-c w-100 h-100 bc-gray-6-5 clickable" onClick={close}>
              <TImg class="mx-a" src={file.src}/>
            </div>
          }
        }
      })
    }
    const loadFilesInSelectedFolder = async () => {
      console.log('loadFilesInSelectedFolder')
      loading.begin(LOADING_FILES_KEY)
      try {
        selectedFolder.value.files = await feAPI.folder.getFiles(selectedFolder.value._id)
        console.log('selectedFolder.value.files', selectedFolder.value.files)
      } catch (e) {
        console.warn(e);
      }
      console.log('loadFilesInSelectedFolder completed')
      loading.end(LOADING_FILES_KEY)
    }
    const renderFiles = () =>
      <TLoading
          action={LOADING_FILES_KEY}
          class="w-100 h-100"
          v-slots={{
            default: () => (
                <div class="w-100 h-100 ovf-y-s sb-h fc fg-4px">
                  {get(selectedFolder.value, 'files', []).map(v =>
                    <file {...v}
                          style="border-bottom: 1px solid #000"
                          onClick={() => onFileClicked(v)}
                          onDelete={() => deleteFile(v)}
                    />
                  )}
                </div>
            )
      }}/>

    return () => <div class="fc w-100 h-100">
      <div class="fr ai-c fg-8px px-2 h-50px" style="border-bottom: 1px solid #ddd">
        <TBtn secondary onClick={createFolder}>New Folder</TBtn>
        {selectedFolder.value && <>
          <TBtn secondary onClick={createSubFolder}>New Sub Folder</TBtn>
          <UploadZone multiple onUploaded={addNewFile}><TBtn secondary>Upload</TBtn></UploadZone>
          <TSpacer/>
          <TBtn delete onClick={showDeleteFolderDialog}>Delete</TBtn>
        </> }
      </div>
      <div class="fr f1" style="height: calc(100% - 50px)">
        <div style="width: 200px; min-width: 200px; border-right: 1px solid #ddd">
          {renderFolderTree(folderTree.value, false)}
        </div>
        {renderFiles()}
        <FileUploadProgressDialog/>
      </div>
    </div>
  }
}
</script>
