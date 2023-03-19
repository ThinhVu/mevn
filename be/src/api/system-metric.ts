import {apiError} from "../utils/common-util";
import ApiMetricBL from "../business-logic/metric/api-metric";

export default {
   apiCallMetric: async (req, res): Promise<any> => {
      try {
         res.json(ApiMetricBL.getCurrent());
      } catch (e) {
         apiError(e, res);
      }
   },
   apiCallMetricHistory: async (req, res) => {
      try {
         const metricHistory = await ApiMetricBL.getHistory()
         res.json(metricHistory)
      } catch (e) {
         apiError(e, res)
      }
   }
}
