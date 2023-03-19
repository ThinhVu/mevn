<script lang="jsx">
import {ref, onMounted} from 'vue';
import MSwitch from '@/components/UiLib/Switch.vue'
import LogPresenter from '@/components/App/SystemLog/LogPresenter.vue';
import PageHeader from '@/components/App/PageHeader.vue';
import {systemAPI} from '@/api'
import dayjs from 'dayjs';

export default {
  name: 'SystemLog',
  components: {LogPresenter, MSwitch, PageHeader},
  props: {},
  setup() {
    const logSetting = ref({ })
    const logFiles = ref([])
    const logFile = ref()
    const logContent = ref()

    // log present
    const showErrorOnly = ref()
    const fallback = ref()

    onMounted(async () => {
      logSetting.value = await systemAPI.getLogSetting();
      logFiles.value = await systemAPI.getLogs();
    })

    async function showLogFile(file) {
      logFile.value = file
      logContent.value = await systemAPI.getLog(file);
    }

    async function setLogEnable(enable) {
      await systemAPI.updateLogSetting({enable})
    }

    return () => <div class="h-100 w-100">
      <page-header title="System Log">
        <div class="fr ai-c">
          <m-switch v-model={logSetting.value.enableLog} onUpdate:modelValue={setLogEnable} label="Enable Log"/>
        </div>
      </page-header>
      <div class="fr" style="height: calc(100% - 50px); color: #ddd;">
        <div style="width: 160px; border-right: 1px solid hsla(0deg, 0%, 100%, 0.12)" class="ovf-y-s hide-scroll-bar">
          {logFiles.value.map(logFile => <div style="padding: 5px 10px; border-bottom: 1px solid hsla(0deg, 0%, 100%, 0.12); font-size: 12px; cursor: pointer;"
                                              onClick={() => showLogFile(logFile)}>{dayjs(logFile).format('YYYY-MM-DD HH:mm:ss')}</div>)}
        </div>
        <div class="f1">
          {logFile.value && <div style="height: 41px;" class="fr ai-c fg-2 px-1 py-1">
            <span class="fw-700">File:</span> {dayjs(logFile.value).format('YYYY-MM-DD HH:mm:ss')}
            <span style="flex: 1"></span>
            <m-switch v-model={showErrorOnly.value} label="Error only"/>
            <m-switch v-model={fallback.value} label="Fallback"/>
          </div>}
          { (!!logContent.value) && <log-presenter
              class="ovf-y-s hide-scroll-bar"
              style="height: calc(100% - 41px);"
              content={logContent.value}
              showErrorOnly={showErrorOnly.value}
              fallback={fallback.value}/> }
        </div>
      </div>
    </div>
  }
}
</script>
