import ApiMetricBL from "../../business-logic/metric/api-metric";
import {requireAdmin} from "../../middlewares/auth";
import $ from "../../middlewares/safe-call";
import Router from "routerex";

const router = Router()

router.get('/api-call', requireAdmin, $(async () => ApiMetricBL.getCurrent()))
router.get('/api-call-history', requireAdmin, $(async () => await ApiMetricBL.getHistory()))

export default router;
