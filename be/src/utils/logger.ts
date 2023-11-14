import winston from 'winston'
import { WinstonTransport as AxiomTransport } from '@axiomhq/winston';
import { WinstonTransport as DiscordBotTransport } from "./discord-bot-transport";

const logger = winston.createLogger({
   level: process.env.LOG_LEVEL || 'error',
   format: winston.format.json(),
   defaultMeta: { pid: process.pid, pod: process.env.POD_NAME },
   transports: [],
})

if (process.env.NODE_ENV === 'production') {
   // logger.add(new AxiomTransport({
   //    dataset: process.env.AXIOM_DATA_SET,
   //    token: process.env.AXIOM_TOKEN,
   //    orgId: process.env.AXIOM_ORG,
   // }))

   // logger.add(new DiscordBotTransport({
   //    webHookUrl: process.env.DISCORD_WEBHOOK_URL
   // }))

   logger.add(new winston.transports.Console({
      format: winston.format.simple(),
   }))
} else {
   logger.add(new winston.transports.Console({
      format: winston.format.simple(),
   }))
}

export default logger;
