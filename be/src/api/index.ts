import express from 'express';
import UserCtl from './controllers/user';
import LogCtl from './controllers/log';
import SystemConfigCtl from './controllers/system-config';
import SystemMetricCtl from "./controllers/system-metric";
import config from "../config";

const router = express.Router()

router.get('/health-check', (_, res) => res.status(200).end())
router.use('/user', UserCtl)
router.use('/system-config', SystemConfigCtl)
router.use('/log', LogCtl)
if (config.useAPIMetric)
   router.use('/system-metric', SystemMetricCtl)

export default router
