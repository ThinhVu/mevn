<template>
  <section data-name="dashboard" class="fc w-100 h-100 fg-3 py-3 px-3 ovf-y-s hide-scroll-bar">
    <section class="bc-lb-0 px-2 py-2" style="border-radius: 6px">
      <p class="mb-2" style="font-size: 20px; font-weight: 600">Health check</p>
      <span v-for="hc in healthCheck" class="mr-2">
        <span class="mr-1" :style="[
              'display: inline-block; border-radius: 6px; width: 12px; height: 12px;',
              { backgroundColor: hc.alive === 0 ? '#ffe05d' : hc.alive === 1 ? '#66bb6a': '#ff5d5d' }
          ]"/>
        {{hc.serviceName}}
      </span>
    </section>

    <section data-name="chart" class="bc-r-2 px-2 py-2" style="border-radius: 6px">
      <div class="fr ai-c fg-1 mb-2">
        <span style="font-size: 20px; font-weight: 600">API Call ({{viewMode}})</span>
        <spacer/>
        <button @click="viewMode = CHART_MODE.PER_MINUTES">Per minutes</button>
        <button @click="viewMode = CHART_MODE.OVERTIME">Overtime</button>
      </div>

      <section>
        <div class="bc-r-0 px-1 py-1" style="border-radius: 6px">
          <line-chart :chart-data="apiMetricHistoryChart" :chart-options="chartOptions"/>
        </div>
      </section>
    </section>

    <collapsable-section title="Api Call">
      <table style="width: 500px" bordered class="c-b-0">
        <thead>
        <tr>
          <td @click="sortApiMetricByName"><b>Api</b></td>
          <td @click="sortApiMetricByCalled"><b>Called</b></td>
          <td @click="sortApiMetricByAvgs"><b>Average (ms)</b></td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="apiCall in apiCallCounterCpt" :key="apiCall.api">
          <td>
            {{apiCall.api}}
          </td>
          <td>
            {{apiCall.called.n}}
          </td>
          <td>
            {{apiCall.called.avg_ms}}
          </td>
        </tr>
        </tbody>
      </table>
    </collapsable-section>
  </section>
</template>
<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip as CharTooltip} from 'chart.js'
import {Line as LineChart} from 'vue-chartjs'
import dayjs from 'dayjs'
import _ from 'lodash'
import hmm from '@/api/hmm.js'
import {systemAPI} from '@/api'
import loading from '@/components/UiLib/System/loading'
import Spacer from '@/components/UiLib/Spacer.vue'
import CollapsableSection from '@/components/UiLib/CollapsableSection.vue'

ChartJS.register(Title, CharTooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const ACTIONS = {
  GET_API_METRIC_HISTORY: 'db:api:history'
}

const CHART_MODE = {
  PER_MINUTES: 'PER_MINUTES',
  OVERTIME: 'OVERTIME'
}
const viewMode = ref(CHART_MODE.PER_MINUTES)
const apiMetricHistory = ref([])
const chartLabels = computed(() => {
  const labels = _.reverse(apiMetricHistory.value.map(item => dayjs(item.at).format('HH:mm')))
  labels.shift()
  return labels
})
const chartData = computed(() => {
  // from original
  // [
  //  { at: '', metric: { a: a1, b: b1, c: c1 } },
  //  { at: '', metric: { a: a2, b: b2, c: c2 } },
  //  { at: '', metric: { a: a3, b: b3, c: c3 } }
  // ]
  // to immediate
  // { a: [a1, a2, a3], b: [b1, b2, b3], c: [c1, c2, c3] }
  // to final
  // [
  //  { label: a, backgroundColor: '', data: [a1, a2, a3] },
  //  { label: b, backgroundColor: '', data: [b1, b2, b3] },
  //  { label: c, backgroundColor: '', data: [c1, c2, c3] }
  // ]

  // step 1: raw -> imme
  const immediate = {}
  for (let i = 0; i<apiMetricHistory.value.length; ++i) {
    const {metric} = apiMetricHistory.value[i]
    if (i === 0) {
      const metricKeys = Object.keys(metric)
      for (const key of metricKeys) {
        immediate[key] = [metric[key].n]
      }
    } else {
      const immeKeys = Object.keys(immediate)
      for (const key of immeKeys) {
        try {
          immediate[key].push(metric[key] ? metric[key].n : 0)
        } catch (e) {
          debugger
        }
      }
    }
  }

  // step 2: imme -> final
  const interests = {}
  const hasInterest = Object.keys(interests).length > 0

  const color = [
    '#ffcdd2', '#f44336', '#b71c1c',
    '#f8bbd0', '#e91e63', '#880e4f',
    '#e1bee7', '#9c27b0', '#4a148c',
    '#d1c4e9', '#673ab7', '#311b92',
    '#c5cae9', '#3f51b5', '#1a237e',
    '#bbdefb', '#2196f3', '#0d47a1',
    '#b3e5fc', '#03a9f4', '#01579b',
    '#c8e6c9', '#66bb6a', '#1b5e20'
  ]
  const final = []
  const total = [0]
  Object.keys(immediate).forEach(key => {
    const metric = _.reverse(immediate[key])
    const diffs = [0]
    for (let i = 1; i < metric.length; ++i) {
      const diff = metric[i] - metric[i - 1]
      diffs.push(diff)
      if (!total[i])
        total[i] = 0
      total[i] += diff
    }

    if (!hasInterest || interests[key]) {
      if (viewMode.value === CHART_MODE.OVERTIME) {
        metric.shift()
        final.push({
          label: key,
          backgroundColor: color[final.length],
          data: metric
        })
      } else {
        diffs.shift()
        final.push({
          label: key,
          backgroundColor: color[final.length],
          data: diffs
        })
      }
    }
  })

  // add total
  total.shift()
  final.push({
    label: 'Total',
    backdropColor: '#000',
    data: total
  })
  return final
})

const loadApiMetricHistory = () => {
  loading.begin(ACTIONS.GET_API_METRIC_HISTORY)
  systemAPI.getApiCallHistory(dayjs().subtract(1, 'hour').toDate(), dayjs().toDate())
             .then(resp => apiMetricHistory.value = resp)
             .finally(() => loading.end(ACTIONS.GET_API_METRIC_HISTORY))
}
// charts
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
const apiMetricHistoryChart = computed(() => {
  return {
    labels: chartLabels.value,
    datasets: chartData.value
  }
})

const healthCheck = ref([])
const doHealthCheck = async () => {
  for (const api of healthCheck.value) {
    api.alive = 0
    systemAPI.healthCheck(api.url).then(() => api.alive = 1).catch(() => api.alive = -1)
  }
}


const apiCallMetric = ref({});
const apiCallMetricSorters = ref({
  field: 'api',
  order: 'asc'
});
const apiCallCounterCpt = computed(() => {
  const apiMetric = Object.entries(apiCallMetric.value).map(([api, called]) => ({api, called}));
  return _.orderBy(apiMetric, [ apiCallMetricSorters.value.field ], [ apiCallMetricSorters.value.order ]);
})
const sortApiMetricByName = () => {
  apiCallMetricSorters.value.field = 'api';
  apiCallMetricSorters.value.order = 'asc';
}
const sortApiMetricByCalled = () => {
  apiCallMetricSorters.value.field = 'called.n';
  apiCallMetricSorters.value.order = 'desc';
}
const sortApiMetricByAvgs = () => {
  apiCallMetricSorters.value.field = 'called.avg_ms';
  apiCallMetricSorters.value.order = 'desc';
}

let healthCheckInterval

onMounted(() => {
  hmm.healthCheck.find({}).$.then(rs => healthCheck.value = rs.map(rs => ({...rs, alive: 0})))
  systemAPI.getApiCallCounter().then(rs => apiCallMetric.value = rs);
  loadApiMetricHistory()
  doHealthCheck()
  healthCheckInterval = setInterval(doHealthCheck, 10000)
  window.$socket.emit('watch', 'metric')
  window.$socket.on('metric:update', metric => apiMetricHistory.value.unshift(metric))
})
onBeforeUnmount(() => {
  clearInterval(healthCheckInterval)
  window.$socket.emit('un-watch', 'metric')
  window.$socket.off('metric:update')
})
</script>
<style scoped>
.metric-block {
  border-radius: 6px;
  padding: 20px;
}

.label {
  font-size: 18px;
  font-weight: 600;
}

.val {
  font-size: 30px;
}
</style>
