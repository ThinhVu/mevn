import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import Timeout = NodeJS.Timeout;
import _ from 'lodash';
import appHooks from "../hooks";

// TODO: extract file logger to another file, this file should only contain log interface
// log implementations (file logger, frontend pipe, jeager, sentry) should be in another files.

export const logSetting = {
   enableLog: false,
   logDirPath: './logs',
   maximumLogLine: 1000,
   keepLogInDays: 1
}
export let _console = { log: console.log, info: console.info, warn: console.warn, error: console.error, debug: console.debug }
let writeStream : fs.WriteStream = null;
let lineCtr = 0;
let cleanThreadId : Timeout;

function ensureLogFolderExist() {
   if (!fs.existsSync(logSetting.logDirPath)) {
      _console.log('log file directory doesn\'t exist. create new one at: ', logSetting.logDirPath);
      fs.mkdirSync(logSetting.logDirPath);
   }
}

/**
 * Generate log file name base on current timestamp
 * @return {string} log file name
 */
function generateFileName() : string {
   return dayjs().toISOString()
}

/**
 * Create new log file
 * @return {string} path to created log file
 */
function createNewLogFile() : string {
   ensureLogFolderExist()
   const filePath = path.join(logSetting.logDirPath, generateFileName());
   _console.log(`creating log file: ${filePath}`);
   lineCtr = 0;
   writeStream = fs.createWriteStream(filePath);
   return filePath;
}

/**
 * Ensure log file is writeable
 * @return {void}
 */
function ensureWritable() : void {
   if (lineCtr > logSetting.maximumLogLine) {
      writeStream.end()
      createNewLogFile()
      return
   }

   if (!writeStream || !writeStream.writable)
      createNewLogFile()
}

/**
 * Convert log params to string
 * @param methodArgs {any[]} params passed to console functions
 * @return {string[]} params in string
 */
function getMethodArgsString(methodArgs) {
   try {
      return JSON.stringify(methodArgs)
   } catch (e) {
      methodArgs.map(arg => {
         try {
            return JSON.stringify(arg)
         } catch (ignored) {
            return '<cannot_parse_to_JSON>'
         }
      }).join(',')
   }
}

function write(level: string, methodArgs: any[]) {
   ensureWritable();
   writeStream.write(`[${dayjs().toISOString()}] [${level}] ${getMethodArgsString(methodArgs)}\n`,);
   appHooks.trigger('logger:write', level, methodArgs);
   lineCtr++;
}

function logToFile(...args: any[]) {
   const [method, ...methodArgs] = args
   write(method, methodArgs)
}

export function cleanOldLogs() {
   _console.log('cleanOldLogs')
   if (!fs.existsSync(logSetting.logDirPath))
      return;
   const files = fs.readdirSync(path.resolve(logSetting.logDirPath));
   for (const file of files) {
      try {
         const filePath = path.resolve(logSetting.logDirPath, file)
         fs.unlink(filePath, () => _console.log(`${filePath} will be removed due to out-date.`))
      } catch (e) {
         _console.warn(e.message)
      }
   }
}

export function enableLog() {
   cleanOldLogs()
   if (!logSetting.enableLog) {
      _console = {
         log: console.log,
         warn: console.warn,
         error: console.error,
         debug: console.debug,
         info: console.info
      }

      console.log = function (...args) { logToFile('log', ...args) }
      console.warn = function (...args) { logToFile('warn', ...args) }
      console.error = function (e) {
         if (e instanceof Error)
            logToFile('error', e.message, e.stack)
         else
            logToFile('error', e)
      }
      console.debug = function (...args) { logToFile('debug', ...args) }
      console.info = function (...args) { logToFile('info', ...args) }

      cleanThreadId = setInterval(cleanOldLogs, logSetting.keepLogInDays * 24 * 60 * 60 * 1000);

      logSetting.enableLog = true
      ensureLogFolderExist()
   }
}

export function disableLog() {
   if (logSetting.enableLog) {
      console.log = _console.log
      console.warn = _console.warn
      console.error = _console.error
      console.debug = _console.debug
      console.info = _console.info

      clearInterval(cleanThreadId);

      logSetting.enableLog = false
   }
}

export function getLogs() {
   return _.reverse(fs.readdirSync(logSetting.logDirPath));
}

export function getLog(logFile) {
   return fs.readFileSync(path.resolve(logSetting.logDirPath, logFile), { encoding: 'utf-8' })
}
