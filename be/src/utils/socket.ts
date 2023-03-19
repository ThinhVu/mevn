import jwt from 'jsonwebtoken';
import {get} from 'lodash';
import {Server, Socket} from 'socket.io';
import {createAdapter} from "@socket.io/redis-adapter";
import {createClient} from "redis";
import {instrument} from "@socket.io/admin-ui";
import * as DAULog from "../business-logic/metric/DAULog";
import appHooks from "../hooks";
import config from "../config";

/**
 * https://socket.io/docs/v4/migrating-from-3-x-to-4-0/#the-default-value-of-pingtimeout-was-increased
 */
const SOCKET_PING_TIMEOUT_IN_MS = 20000;
/**
 * Now with Redis adapter, userSockets is not only contain user-socket pairs in local server
 * but also contain user-socket pairs in multiple server
 *
 * Sync by SSE_EVENTS.connection & SSE_EVENTS.disconnect
 */
const SSE_EVENTS = {
   connection: 'sse_connection',
   disconnect: 'sse_disconnect'
}
const SOCKET_MAPS = {
   userId_SocketId: {},
   onlineSockets: {}
}

export default (httpServer) => {
   const io = new Server(httpServer, {
      cors: {
         origin: config.socketIO.corsOrigins,
         methods: ['GET', 'POST', 'DELETE', 'PUT'],
         credentials: true
      }
   });

   // socket io adapter
   const isRedisAdapterAvailable = config.socketIO.redisAdapter.url && config.socketIO.redisAdapter.password;
   if (isRedisAdapterAvailable) {
      const pubClient = createClient(config.socketIO.redisAdapter);
      const subClient = pubClient.duplicate();

      Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
         pubClient.ping().then(console.log);
         // @ts-ignore
         io.adapter(createAdapter(pubClient, subClient));
      })
   }


   // socket io admin
   if (config.socketIO.instrument.user && config.socketIO.instrument.pass) {
      instrument(io, {
         auth: {
            type: "basic",
            username: config.socketIO.instrument.user,
            password: config.socketIO.instrument.pass
         },
      })
   }

   io.use((socket: Socket, next) => {
      const token = get(socket, 'handshake.query.token')
      if (token) {
         try {
            const {user} = jwt.decode(token, config.jwtSecret);
            if (user) {
               // @ts-ignore
               socket.authUser = user;
               next();
            } else {
               next(new Error('Authentication error'));
            }
         } catch (e) {
            next(new Error(e.message));
         }
      } else {
         next(new Error('Authentication error'));
      }
   });

   // @ts-ignore
   io.toUser = (userId: string) => {
      const socketId = SOCKET_MAPS.userId_SocketId[userId];
      if (socketId) {
         return io.to(socketId);
      } else {
         return {
            emit: () => {/* nothing */
            }
         }
      }
   }

   function onUserOnline(userId, socketId) {
      SOCKET_MAPS.userId_SocketId[userId] = socketId;
      SOCKET_MAPS.onlineSockets[socketId] = Date.now();
   }

   function onUserOffline(userId, socketId) {
      delete SOCKET_MAPS.userId_SocketId[userId];
      delete SOCKET_MAPS.onlineSockets[socketId];
   }

   io.on(SSE_EVENTS.connection, (userId, socketId) => onUserOnline(userId, socketId));
   io.on(SSE_EVENTS.disconnect, (userId, socketId) => onUserOffline(userId, socketId));

   appHooks.on('logger:write', (level, ...methodArgs) => io.to('server-log').emit('server-log:data', level, ...methodArgs))

   io.on('connection', async (socket: Socket) => {
      // @ts-ignore
      const userId = socket.authUser._id;
      console.log(`[Socket] ${userId} connect`);
      DAULog.log(userId)
      // update socket connection status in current server
      onUserOnline(userId, socket.id);
      // update socket connection status in remote servers
      isRedisAdapterAvailable && io.serverSideEmit(SSE_EVENTS.connection, userId, socket.id);
      appHooks.trigger('user:online', userId);
      socket.on('disconnect', reason => {
         console.log(`Socket: ${userId} disconnect with reason ${reason}`);
         // There is a case when user disconnect from server A at time (t)
         // Then connect to server B at time (t + x) with x < SOCKET_PING_TIMEOUT
         // The 'disconnect' event will be raise in server A at time (t + SOCKET_PING_TIMEOUT)
         // In this case, we just ignore the disconnection of socket in server A.
         // NOTE: The assumption may not correct due to Redis network latency.
         if (SOCKET_MAPS.onlineSockets[socket.id] < Date.now() - SOCKET_PING_TIMEOUT_IN_MS) {
            onUserOffline(userId, socket.id);
            isRedisAdapterAvailable && io.serverSideEmit(SSE_EVENTS.disconnect, userId, socket.id);
            appHooks.trigger('user:offline', userId);
         }
      });
      socket.emit("__TEST__", "__TEST__");
      socket.on('watch', (...args) => {
         const gr = args.join(':');
         console.log('[Socket] watch', gr)
         socket.join(gr);
      })
      socket.on('un-watch', (...args) => {
         const gr = args.join(':');
         console.log('[Socket] unwatch', gr)
         socket.leave(gr)
      })
   });

   return io;
};
