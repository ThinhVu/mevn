import $ from "../utils/safe-call";
import {getLogs, getLog, logSetting, enableLog, disableLog} from "../utils/logger-util";
import {requireAdmin} from "../middlewares/auth";
import Routerex from '@tvux/routerex'

export default async function useLog(parentRouter) {
   console.log('[route] useLog')

   const router = Routerex()

   router.get('/', {
      title: 'Get all logs file',
      desc: 'Get all logs file',
      schema: {query: {limit: 'number', offset: 'number'}},
      response: {200: {type: 'array', items: {type: 'string'}}}
   }, requireAdmin, $(async () => getLogs()))
   router.get('/file/:logFile', {
      schema: {params:{logFile: 'string'}},
      title: 'Read specified log file',
      desc: 'Read specified log file',
      response: {200: {type: 'string'}}
   }, requireAdmin, $(async (req, res) => {
      res.header('Content-Type', 'text/plain')
      return getLog(req.params.logFile)
   }))
   router.get('/setting', {
      title: 'Get all system setting',
      desc: 'get all system setting',
      response: {200: {type: 'object'}}
   }, requireAdmin, $(async () => logSetting))
   router.post('/setting', {
      title: 'update setting',
      schema: {body: {enable: 'boolean', maximumLogLine: 'number', keepLogInDays: 'number'}},
      desc: 'update setting',
      response: {200: {type: 'object'}}
   }, requireAdmin, $(async (req) => {
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
   }))

   parentRouter.use('/log', router)
}
