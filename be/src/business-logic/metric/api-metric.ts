import ApiMetricModel from "../../db/models/metric/api-metric";
import {apiMetric} from "../../middlewares/performance";
import dayjs from "dayjs";

export default {
   create() {
      const metricDoc = { metric: apiMetric, at: dayjs().toDate() }
      // @ts-ignore
      global.io.to('metric').emit('metric:update', metricDoc)
      return ApiMetricModel.create(metricDoc)
   },
   async clearMetric() {
      await ApiMetricModel.deleteMany({})
   },
   getCurrent() {
      return apiMetric;
   },
   getHistory() {
      return ApiMetricModel.find({}).sort({at: -1}).limit(60)
   }
}
