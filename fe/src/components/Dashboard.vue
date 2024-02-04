<template>
  <section data-name="dashboard" class="dashboard fc w-100 h-100 fg-12px py-3 px-3 ovf-y-s hide-scroll-bar">
    <section data-name="metric" class="fr ai-c jc-sb fg-8px">
      <div class="f1 metric-block bc-r-0">
        <p class="label c-r-4">Users</p>
        <p class="val c-r-7">{{ appMetric.user }}</p>
      </div>
    </section>

    <div class="fr ai-c py-1 fg-4px btns">
      <button :class="range === rangeOptions.Week && 'active'" @click="byWeek">This week</button>
      <button :class="range === rangeOptions.Month && 'active'" @click="byMonth">This month</button>
      <button :class="range === rangeOptions.LastMonth && 'active'" @click="byLastMonth">Last month</button>
      <button :class="range === rangeOptions.Prev3Months && 'active'" @click="by3Months">3 months</button>
      <button :class="range === rangeOptions.Prev6Months && 'active'" @click="by6Months">6 months</button>
      <button :class="range === rangeOptions.Prev12Months && 'active'" @click="by12Months">12 months</button>
      <button :class="range === rangeOptions.Ytd && 'active'" @click="byYtd">YTD</button>
      <button :class="range === rangeOptions.Entire && 'active'" @click="entire">Entire</button>
    </div>

    <div class="metric-block px-1 py-1" style="border-radius: 6px">
      <line-chart :chart-data="userMetricChartData" :chart-options="chartOptions"/>
    </div>

    <section class="grid gtc-1fr-1fr gg-8px">
      <div class="metric-block px-1 py-1" style="border-radius: 6px">
        <line-chart :chart-data="WAUChartData" :chart-options="chartOptions"/>
      </div>
      <div class="metric-block px-1 py-1" style="border-radius: 6px">
        <line-chart :chart-data="MAUChartData" :chart-options="chartOptions"/>
      </div>
    </section>
  </section>
</template>
<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip} from 'chart.js'
import {Line as LineChart} from 'vue-chartjs';
import dayjs from 'dayjs';
import {systemAPI} from '@/api';
import hmm from '@/api/hmm';
import {sortBy} from "lodash-es";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const appMetric = ref({
  callSession: 0,
  chatAction: 0,
  chatChannel: 0,
  chatMessage: 0,
  sticker: 0,
  theme: 0,
  themeAction: 0,
  user: 0,
})

const rangeOptions = {
  Week: 1,
  Month: 2,
  LastMonth: 3,
  Prev3Months: 4,
  Prev6Months: 5,
  Prev12Months: 6,
  Ytd: 7,
  Entire: 8
}
const range = ref(rangeOptions.Prev3Months)
const metricRange = ref({
  from: dayjs().subtract(3, 'month').startOf('month').toISOString(),
  to: dayjs().endOf('month').toISOString()
})
const byWeek = () => {
  range.value = rangeOptions.Week;
  metricRange.value = {
    from: dayjs().startOf('week').toISOString(),
    to: dayjs().endOf('week').toISOString()
  }
  loadData()
}
const setByMonth = (month) => {
  metricRange.value = {
    from: dayjs().subtract(month, 'month').startOf('month').toISOString(),
    to: dayjs().endOf('month').toISOString()
  }
  loadData()
}
const byMonth = () => {
  range.value = rangeOptions.Month;
  setByMonth(0)
  loadData()
}
const byLastMonth = () => {
  range.value = rangeOptions.LastMonth;
  metricRange.value = {
    from: dayjs().subtract(1, 'month').startOf('month').toISOString(),
    to: dayjs().subtract(1, 'month').endOf('month').toISOString()
  }
  loadData()
}
const by3Months = () => {
  range.value = rangeOptions.Prev3Months;
  setByMonth(3)
  loadData()
}
const by6Months = () => {
  range.value = rangeOptions.Prev6Months;
  setByMonth(6)
  loadData()
}
const by12Months = () => {
  range.value = rangeOptions.Prev12Months;
  setByMonth(12)
  loadData()
}
const byYtd = () => {
  range.value = rangeOptions.Ytd;
  metricRange.value = {
    from: dayjs().startOf('year').toISOString(),
    to: dayjs().endOf('month').toISOString()
  }
  loadData()
}
const entire = () => {
  range.value = rangeOptions.Entire;
  metricRange.value = {
    from: dayjs('1970-01-01'),
    to: dayjs().endOf('month').toISOString()
  }
  loadData()
}

const appMetricHistory = ref([])
const appMetricHistoryLabels = computed(() => appMetricHistory.value.map(appMetric => dayjs(appMetric.at).format('MM-DD')))
const appMetricHistoryDiff = computed(() => {
  const diff = [{
    users: 0,
    chatChannels: 0,
    worldCategories: 0,
    worldScenes: 0,
    worldMaps: 0,
    worldRooms: 0
  }]
  const metrics = appMetricHistory.value
  for (let i = 1; i < metrics.length; ++i) {
    diff.push({
      users: metrics[i].users - metrics[i - 1].users,
      chatChannels: metrics[i].chatChannels - metrics[i - 1].chatChannels,
      worldCategories: metrics[i].worldCategories - metrics[i - 1].worldCategories,
      worldScenes: metrics[i].worldScenes - metrics[i - 1].worldScenes,
      worldMaps: metrics[i].worldMaps - metrics[i - 1].worldMaps,
      worldRooms: metrics[i].worldRooms - metrics[i - 1].worldRooms
    })
  }
  return diff;
})

function loadAppMetric() {
  systemAPI.getAppMetric().then(resp => appMetric.value = resp)
}

function loadAppMetricHistory() {
  systemAPI.getAppMetricHistory(metricRange.value.from, metricRange.value.to).then(resp => {
    appMetricHistory.value = sortBy(resp, item => item.at)
  })
}
// charts
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const userMetrics = ref([])
const loadUserMetrics = () => {
  hmm.userMetric.find({t: {
    $gte: metricRange.value.from,
    $lt: metricRange.value.to}
  }).toArray().$.then(resp => {
    console.log('resp', resp)
    userMetrics.value = resp
  })
}
const userMetricChartData = computed(() => {
  return {
    labels: userMetrics.value.map(item => dayjs(item.t).format('MM-DD')),
    datasets: [
      {
        label: 'New user',
        backgroundColor: '#79f8d6',
        borderColor: '#478d7b',
        tension: 0.2,
        data: userMetrics.value.map(item => item.new)
      },
      {
        label: 'Daily active user',
        backgroundColor: '#7997f8',
        borderColor: '#47688d',
        tension: 0.2,
        data: userMetrics.value.map(item => item.dau)
      },
      {
        label: 'At risk WAU',
        backgroundColor: '#bbf879',
        borderColor: '#7e8d47',
        tension: 0.2,
        data: userMetrics.value.map(item => item.arwau)
      },
      {
        label: 'At risk MAU',
        backgroundColor: '#ac79f8',
        borderColor: '#66478d',
        tension: 0.2,
        data: userMetrics.value.map(item => item.armau)
      },
      {
        label: 'Dead user',
        backgroundColor: '#f87984',
        borderColor: '#8d4747',
        tension: 0.2,
        data: userMetrics.value.map(item => item.dead)
      },
      {
        label: 'Total user',
        backgroundColor: '#f8cc79',
        borderColor: '#8d7547',
        tension: 0.2,
        data: userMetrics.value.map(item => item.total)
      },
    ]
  }
})

const WAUs = ref([])
const loadWAUHistory = () => systemAPI.getWAUHistory(metricRange.value.from, metricRange.value.to).then(resp => WAUs.value = resp)
const WAUChartData = computed(() => {
  return {
    labels: WAUs.value.map(item => dayjs(item.t).format('MM-DD')),
    datasets: [{
      label: 'Weekly active user',
      backgroundColor: '#79f8d6',
      borderColor: '#478d7b',
      tension: 0.2,
      data: WAUs.value.map(item => item.n)
    }]
  }
})

const MAUs = ref([])
const loadMAUHistory = () => systemAPI.getMAUHistory(metricRange.value.from, metricRange.value.to).then(resp => MAUs.value = resp)
const MAUChartData = computed(() => {
  return {
    labels: MAUs.value.map(item => dayjs(item.t).format('MM-DD')),
    datasets: [{
      label: 'Monthly active user',
      backgroundColor: '#79f8d6',
      borderColor: '#478d7b',
      tension: 0.2,
      data: MAUs.value.map(item => item.n)
    }]
  }
})

// const userCountriesChartData = {
//   labels: ['Vietnam', 'Lao', 'Campuchia'],
//   datasets: [{
//     labels: 'Vietnam',
//
//   }]
// }
// const options = {
//   indexAxis: 'y',
//   // Elements options apply to all of the options unless overridden in a dataset
//   // In this case, we are setting the border of each horizontal bar to be 2px wide
//   elements: {
//     bar: {
//       borderWidth: 2,
//     }
//   },
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'right',
//     },
//     title: {
//       display: true,
//       text: 'Chart.js Horizontal Bar Chart'
//     }
//   }
// }

function loadData() {
  loadAppMetricHistory()
  loadUserMetrics()
  loadWAUHistory()
  loadMAUHistory()
}

let interval;
onMounted(() => {
  loadAppMetric()
  loadData()
  interval = setInterval(loadAppMetric, 10000)
})
onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>
<style scoped>
.dashboard {
}

.metric-block {
  border: 1px solid rgb(216, 222, 228);
  box-shadow: 0 3px 6px rgba(140,149,159,0.15);
  border-radius: 10px;
  padding: 20px;
  color: #676b79;
}

.metric-block .label {
  font-size: 12px;
  color: #adaeaf;
}

.metric-block  .val {
  font-size: 30px;
}
</style>
