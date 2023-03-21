import express from "express";
import $ from "../../middlewares/safe-call";
import {getLogs, getLog, logSetting, enableLog, disableLog} from "../../utils/logger-util";
import {requireAdmin} from "../../middlewares/auth";

const router = express.Router()

router.get('/', requireAdmin, $(async () => getLogs()));
router.get('/file/:logFile', requireAdmin, $(async (req, res) => {
   res.header('Content-Type', 'text/plain');
   return getLog(req.params.logFile)
}));
router.get('/setting', requireAdmin, $(async () => logSetting));
router.post('/setting', requireAdmin, $(async (req) => {
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

export default router;
