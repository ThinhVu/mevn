import Transport from 'winston-transport';
import {WebhookClient} from 'discord.js'

export class WinstonTransport extends Transport {
   client: WebhookClient;

   constructor(opts) {
      super(opts);
      if (opts.webHookUrl) {
         this.client = new WebhookClient({ url: opts.webHookUrl })
      }
   }
   log(info, callback) {
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
