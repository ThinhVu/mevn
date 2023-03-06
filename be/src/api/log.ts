import {logSetting, enableLog, disableLog, getLogs, getLog} from "../utils/logger-util";
import {apiError} from "../utils/common-util";

export default {
   async getLogSetting(req, res) {
      res.send(logSetting);
   },
   async updateLogSetting(req, res) {
      try {
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
         res.send('OK')
      } catch (e) {
         apiError(e, res);
      }
   },
   async getLogs(req, res) {
      res.send(getLogs());
   },
   async getLog(req, res) {
      try {
         res.header('Content-Type', 'text/plain');
         res.send(getLog(req.params.logFile));
      } catch (e) {
         apiError(e, res);
      }
   }
}
