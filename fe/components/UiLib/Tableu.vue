<template>
  <div class="tableu fc w-100 h-100">
    <div class="table ovf-y-s ovf-x-s hide-scroll-bar" @dragover.prevent @drop="handleDrop">
      <Load :action="`${edge}:load-items`">
        <table class="w-100">
          <slot name="thead"/>
          <slot name="body" :items="items" :deleteItem="deleteItem"></slot>
        </table>
        <div class="ta-c mt-2">
          <span>Thả file vào bảng để import</span>
        </div>
      </Load>
    </div>
    <div class="paging fr ai-c jc-fe fg-1 px-2">
      <slot name="footer"></slot>
      <div class="f1"/>
      <Load :action="`${edge}:load-items`">
        <paging-toolbar :page="page" :total-items="totalItems" :items-per-page="20" @update:page="updatePage"/>
      </Load>
    </div>
  </div>
</template>
<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import notification from '@/components/UiLib/Api/notification';
import msgBox from '@/components/UiLib/Api/msg-box';
import {notEmpty, readFile, removeCarry} from '@/logic/utils';
import PagingToolbar from '@/components/UiLib/PagingToolbar';
import loading from '@/components/UiLib/Api/loading';
import Load from '@/components/UiLib/Load';

const props = defineProps({
  api: Object,
  edge: String,
  parseItem: Function,
  enrichItem: Function,
  itemsLoaded: Function,
  dragFileToImport: {
    type: Boolean,
    default: true
  }
})

const page = ref(1)
const updatePage = v => page.value = v

const items = ref([])
const totalItems = ref(0)

const getTotalItem = () => props.api.total().then(resp => totalItems.value = resp)
const loadItems = () => {
  loading.begin(`${props.edge}:load-items`)
  props.api.readAll(page.value).then(resp => {
    items.value = props.itemsLoaded ? props.itemsLoaded(resp) : resp;
    if (props.enrichItem)
      items.value.forEach(props.enrichItem)
  }).finally(() => loading.end(`${props.edge}:load-items`))
};
const importFiles = async (files) => {
  const importTasks = []
  for (const file of files) {
    const fileContent = (await readFile(file))
    const items = fileContent.split('\n').filter(notEmpty).map(removeCarry).map(props.parseItem)
    importTasks.push(() => props.api.create(items))
  }
  (Promise.all(importTasks.map(task => task()))
  .then(() => notification.success('Dữ liệu đã được nhập thành công'))
  .then(() => loadItems())
  .catch(e => notification.err(e.message)))
}
const handleDrop = async (ev) => {
  ev.preventDefault();
  ev.stopPropagation();
  if (props.dragFileToImport) {
    await importFiles(ev.dataTransfer.files)
  } else {
    notification.err('Không hỗ trợ thả file để nhập dữ liệu')
  }
}
const deleteItem = (payload) => {
  msgBox.show('Xác nhận xoá', 'Bạn có chắc chắn không?', msgBox.Buttons.YesNo, msgBox.Icons.Question).then(rs => {
    if (rs === msgBox.Results.no) {
      return
    }
    (props.api.delete(payload)
    .then(() => notification.success('Đã xoá'))
    .then(() => loadItems())
    .catch(e => notification.err(e.message)))
  })
}

watch(page, () => loadItems())
onMounted(() => {
  getTotalItem()
  loadItems()

  console.log(`listen on "${props.edge}:update"`)
  window.socket.emit('watch', props.edge)
  window.socket.on(`${props.edge}:update`, (_id, change) => {
    for (const item of items.value) {
      if (item._id === _id) {
        Object.keys(change).forEach(k => item[k] = change[k])
      }
    }
  })
  window.socket.on(`${props.edge}:delete`, ids => {
    items.value = items.value.filter(item => !ids.includes(item._id))
  })
})
onBeforeUnmount(() => {
  console.log(`listen off "${props.edge}:update"`)
  window.socket.emit('un-watch', props.edge)
  window.socket.off(`${props.edge}:update`)
  window.socket.off(`${props.edge}:delete`)
})

defineExpose({ loadItems })
</script>
<style scoped lang="scss">
.tableu {
  color: #ddd;

  .table {
    height: calc(100% - 50px);
    font-size: 12px;

    table {
      border-collapse: collapse;

      :deep {
        tr {
          th, td {
            background-color: #1e1e1e;
          }
        }

        tr:hover {
          td {
            background-color: #404040;
          }
        }

        th, td {
          height: 30px;
          padding: 0 16px;

          color: #ddd;
          border-bottom: thin solid hsla(0, 0%, 100%, .12);
        }

        th {
          text-align: left;
          position: sticky;
          top: 0;
          color: #aaa;
          height: 48px;
        }
      }
    }
  }

  .paging {
    height: 50px;
    border-top: 1px solid hsla(0deg, 0%, 100%, 0.12);
    color: #ddd;
    font-size: 12px;
  }
}
</style>
