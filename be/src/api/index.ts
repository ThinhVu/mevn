import UserCtl from './controllers/user';
import LogCtl from './controllers/log';
import SystemConfigCtl from './controllers/system-config';
import SystemMetricCtl from "./controllers/system-metric";
import config from "../config";
import Router from "routerex";

const router = Router()

router.get('/health-check', {
   title: 'Health check',
   description: 'Server health monitor provides built-in capacity forecast charts and metrics designed to help you more easily identify when server resources reach warning'
}, (_, res) => res.status(200).end())
router.use('/user', UserCtl)
router.use('/system-config', SystemConfigCtl)
router.use('/log', LogCtl)
if (config.useAPIMetric)
   router.use('/system-metric', SystemMetricCtl)

export default router
