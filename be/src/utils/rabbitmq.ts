import amqp from 'amqplib/callback_api'
import {Channel, Connection} from "amqplib";

class RabbitMQ {
   private connection: Connection
   private channelCache: Map<String, Channel>

   constructor(url) {
      amqp.connect(url, (error0, connection) => {
         if (error0) throw error0;
         this.connection = <Connection>connection;
         this.channelCache = new Map<String, Channel>()
      })
   }

   async channel(exchange) {
      if (!this.channelCache.has(exchange)) {
         const channel = await this.connection.createChannel();
         await channel.assertExchange(exchange, 'fanout', { durable: false })
         this.channelCache.set(exchange, channel)
      }
      return this.channelCache.get(exchange)
   }

   async send(exchange: string, data: any) {
      console.log('send', data, 'to', exchange)
      const channel = await this.channel(exchange)
      return channel.publish(exchange, '', Buffer.from(data));
   }
}

export default RabbitMQ
