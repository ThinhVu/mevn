<script lang="tsx">
import _ from 'lodash';
import {ref, onMounted} from 'vue';
import msgBox from '@/components/UiLib/System/msg-box';
import dialog from '@/components/UiLib/System/dialog.jsx';
import notification from '@/components/UiLib/System/notification';
import CreateFolderDlg from './CreateFolderDlg.vue';
import PageHeader from '@/components/App/PageHeader.vue';
import IcoFolder from '@/assets/images/folder.svg';
import UploadZone from '@/components/UiLib/FileUpload/UploadZone.vue';
import File from './File.vue';
import {feAPI} from '@/api/index.js';
import Imgx from "../../UiLib/Imgx.vue";

export default {
  components: {PageHeader, File, UploadZone},
  setup() {
    const folderTree = ref([])
    const selectedFolder = ref();

    const loadFolderTree = async () => {
      folderTree.value = await feAPI.folder.getFolderTree()
    }

    onMounted(loadFolderTree)

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

    const addNewFile = async (files) => {
      try {
        const createdItems = await Promise.all(files.map(file => feAPI.file.create(file, selectedFolder.value && selectedFolder.value._id)));
        selectedFolder.value.files.push(...createdItems);
        notification.success('[addNewFile] Upload completed');
      } catch (e) {
        console.error(e, '[addNewFile]')
        notification.err(e.message);
      }
    }

    const onFileClicked = async (file) => {
      console.log('onFileClicked', file)
      dialog.show({
        component: {
          components: {Imgx},
          setup: (__, {emit}) => {
            const close = () => emit('close')
            return () => <div class="fr ai-c w-100 h-100 bc-gray-6-5 clickable" onClick={close}>
              <imgx class="mx-a" src={file.src}/>
            </div>
          }
        }
      })
    }

    const selectCategory = async (e, category) => {
      e.preventDefault();
      e.stopPropagation();
      selectedFolder.value = category;
      loadFilesInSelectedFolder().then();
    }

    const loadingFiles = ref(false);
    const loadFilesInSelectedFolder = async () => {
      loadingFiles.value = true;
      try {
        selectedFolder.value.files = await feAPI.folder.getFiles(selectedFolder.value._id)
      } catch (e) {
        console.warn(e);
      }
      loadingFiles.value = false;
    }

    const renderFolderTree = (folders, isChild) => <div class="fc">
      {folders.map(folder => <><div
            class={['clickable py-1', isChild ? 'pr-1' : 'px-1']}
            style={['color: #fff', { background: selectedFolder.value === folder ? '#ffffff33' : 'transparent' }]}
            onClick={(e) => selectCategory(e, folder)}>
        {isChild && <span>-- </span>}
          <img src={IcoFolder} width="16"/>
          <span class="ml-1">{folder.name}</span>
        </div>
        {Array.isArray(folder.folders) ? <div class="rel" style="margin-left: 15px;">
          <div class="abs" style="margin-top: -10px; border-left: 1px dashed white; width: 1px; height: 100%"/>
          <div>
            {renderFolderTree(folder.folders, true)}
          </div>
        </div> : null }
      </>)}
    </div>

    const renderFiles = () => <div
        class="w-100 h-100 ovf-y-s hide-scroll-bar px-1 py-1 grid"
        style="grid-template-columns: repeat(auto-fill, 100px); grid-template-rows: 160px; grid-auto-rows: 160px; gap: 0.5rem">
      {loadingFiles.value ? <span>Loading...</span> : null}
      {_.get(selectedFolder.value, 'files', []).map(v => <file {...v} onClick={() => onFileClicked(v)}/>)}
    </div>

    return () => <div class="fc w-100 h-100">
      <page-header title="File Explorer">
        <upload-zone class="mr-1" multiple onUploaded={addNewFile}><button>Upload</button></upload-zone>
        <button class="mr-1" onClick={createFolder}>New Folder</button>
        <button class="mr-1" onClick={createSubFolder}>New Sub Folder</button>
        {selectedFolder.value && <button class="mr-1" onClick={showDeleteFolderDialog}>Delete</button> }
      </page-header>
      <div class="fr f1" style="height: calc(100% - 50px)">
        <div style="width: 200px; min-width: 200px; border-right: 1px solid #575665">
          {renderFolderTree(folderTree.value)}
        </div>
        {renderFiles()}
      </div>
    </div>
  }
}
</script>
