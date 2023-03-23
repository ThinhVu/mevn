import ApiMetricBL from "../../business-logic/metric/api-metric";
import {requireAdmin} from "../../middlewares/auth";
import $ from "../../middlewares/safe-call";
import Router from "routerex";

const router = Router()

router.get('/api-call', {
   title: 'API Call',
   description: 'Get current API call count',
   response: {
      type: 'object',
      desc: 'metric object'
   }
}, requireAdmin, $(async () => ApiMetricBL.getCurrent()))
router.get('/api-call-history', {
   title: 'API Call History',
   description: 'Get API call history',
   response: {
      type: 'array',
      desc: 'metric array'
   }
}, requireAdmin, $(async () => await ApiMetricBL.getHistory()))

export default router;
