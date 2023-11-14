import Transport, {TransportStreamOptions} from 'winston-transport';
import {WebhookClient} from 'discord.js'

interface Options extends TransportStreamOptions {
   webHookUrl: string
}

export class WinstonTransport extends Transport {
   client: WebhookClient;

   constructor(opts: Options) {
      super(opts);
      if (opts.webHookUrl) {
         this.client = new WebhookClient({ url: opts.webHookUrl })
      }
   }
   log(info: any, callback: any) {
      if (this.client) {
         setImmediate(async () => {
            try {
               await this.client.send({content: JSON.stringify(info)})
               this.emit('logged', info)
            } catch (err) {
               this.emit('error', err)
            }
         })
      }

      if (callback) {
         setImmediate(callback);
      }
   }
}
