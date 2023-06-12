import UserCtl from './user';
import LogCtl from './log';
import KvCtl from './kv';
import SystemMetricCtl from "./system-metric";
import fileSystemCtl from "./file-system";
import config from "../config";
import Router from "routerex";

const router = Router()

router.get('/health-check', {
   title: 'Health check',
   desc: 'Server health monitor provides built-in capacity forecast charts and metrics designed to help you more easily identify when server resources reach warning',
   response: {200: {type: 'string', desc: 'The server is live'}, 408: {type: 'string', desc: 'The server is down'}}
}, (_, res) => res.status(200).end())
router.use('/user', UserCtl)
router.use('/kv', KvCtl)
router.use('/log', LogCtl)
if (config.useAPIMetric)
   router.use('/system-metric', SystemMetricCtl)
router.use('/file-system', fileSystemCtl)

export default router
