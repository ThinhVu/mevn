import express from 'express';
import ApiMetricBL from "../../business-logic/metric/api-metric";
import {requireAdmin} from "../../middlewares/auth";
import $ from "../../middlewares/safe-call";

const router = express.Router();

router.get('/api-call', requireAdmin, $(async () => ApiMetricBL.getCurrent()))
router.get('/api-call-history', requireAdmin, $(async () => await ApiMetricBL.getHistory()))

export default router;
