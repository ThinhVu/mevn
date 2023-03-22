import $ from "../../middlewares/safe-call";
import {getLogs, getLog, logSetting, enableLog, disableLog} from "../../utils/logger-util";
import {requireAdmin} from "../../middlewares/auth";
import RouterX from "../../utils/routerx"
const router = RouterX()

router.get('/', {description: 'Get all logs file'}, requireAdmin, $(async () => getLogs()))
router.get('/file/:logFile', {schema: {params:{logFile: 'string'}}, description: 'Read specified log file'}, requireAdmin, $(async (req, res) => {
   res.header('Content-Type', 'text/plain')
   return getLog(req.params.logFile)
}));
router.get('/setting', {description: 'get all system setting'}, requireAdmin, $(async () => logSetting));
router.post('/setting', {description: 'update setting'}, requireAdmin, $(async (req) => {
   const {enable, maximumLogLine, keepLogInDays} = req.body
   if (maximumLogLine !== undefined)
      logSetting.maximumLogLine = maximumLogLine;
   if (keepLogInDays !== undefined)
      logSetting.keepLogInDays = keepLogInDays;
   if (enable !== undefined) {
      if (enable)
         enableLog()
      else
         disableLog()
   }
}));

export default router
