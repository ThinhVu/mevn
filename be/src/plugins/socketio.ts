import jwt from 'jsonwebtoken'
import _ from 'lodash'
import {Server, Socket} from 'socket.io'
import {createAdapter as createRedisAdapter} from "@socket.io/redis-adapter"
import {createAdapter as createMongoDbAdapter} from '@socket.io/mongo-adapter'
import {createClient} from "redis"
import {instrument} from "@socket.io/admin-ui"
import appHook from "../business-logic/hooks"
import UserModel, {UserRole} from "../db/models/user"
import process from "process";

/**
 * https://socket.io/docs/v4/migrating-from-3-x-to-4-0/#the-default-value-of-pingtimeout-was-increased
 */
const SOCKET_PING_TIMEOUT_IN_MS = 20000

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
const UserId_SocketId_Map = {}

async function createSocketServer(app) {
   console.log('[socket.io] createSocketServer')
   const httpServer = app.$httpServer
   const corsOrigins = (process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173' /*VITE*/).split(',')
   console.log('[socket.io] corsOrigins', corsOrigins)
   const transports = (process.env.SOCKET_IO_TRANSPORTS_METHOD || 'polling,websocket').split(',')
   console.log('[socket.io] transports', transports)
   const io = new Server(httpServer, {
      cors: {
         origin: corsOrigins,
         methods: ['GET', 'POST', 'DELETE', 'PUT'],
         credentials: true
      },
      // @ts-ignore
      transports
   })

   // socket io adapter
   const useSocketIoAdapter = process.env.USE_SOCKET_IO_REDIS_ADAPTER || process.env.USE_SOCKET_IO_MONGO_ADAPTER
   if (process.env.USE_SOCKET_IO_REDIS_ADAPTER) {
      console.log('[socket.io] use redis adapter')
      const redisAdapter = {
         url: process.env.SOCKET_IO_REDIS_ADAPTER_URL,
         password: process.env.SOCKET_IO_REDIS_ADAPTER_PASSWORD
      }
      const pubClient = createClient(redisAdapter)
      const subClient = pubClient.duplicate()
      Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
         pubClient.ping().then(console.log);
         // @ts-ignore
         io.adapter(createRedisAdapter(pubClient, subClient))
      })
   } else if (process.env.USE_SOCKET_IO_MONGO_ADAPTER) {
      console.log('[socket-io] use mongodb adapter')
      const mongoCollection = app.$db.connections[0].db.collection(process.env.SOCKET_IO_MONGODB_ADAPTER_COLLECTION || 'socket-io');
      await mongoCollection.createIndex(
         {createdAt: 1},
         {expireAfterSeconds: 3600, background: true}
      )
      // @ts-ignore
      io.adapter(createMongoDbAdapter(mongoCollection, {addCreatedAtField: true}))
   }

   // socket io admin
   const instrumentOptions = {
      user: process.env.SOCKET_IO_INSTRUMENT_USERNAME,
      pass: process.env.SOCKET_IO_INSTRUMENT_PASSWORD
   }
   if (instrumentOptions.user && instrumentOptions.pass) {
      instrument(io, {
         auth: {
            type: "basic",
            username: instrumentOptions.user,
            password: instrumentOptions.pass
         },
      })
   }

   const adminNs = io.of('/admin');
   adminNs.use((socket: Socket, next) => {
      const token = _.get(socket, 'handshake.query.token')
      if (token) {
         try {
            const {user} = jwt.verify(token, process.env.JWT_SECRET)
            if (user.role !== UserRole.Admin)
               next(new Error('Not admin user'))
            if (user) {
               // @ts-ignore
               socket.authUser = user
               next()
            } else {
               next(new Error('Authentication error'))
            }
         } catch (e) {
            next(new Error(e.message))
         }
      } else {
         next(new Error('Authentication error'))
      }
   })
   adminNs.on('connection', socket => {
      console.log('[socket.io/admin] socket connected')

      socket.on('watch', (...args) => {
         const gr = args.join(':')
         console.log('[socket.io] watch', gr)
         socket.join(gr)
      })

      socket.on('un-watch', (...args) => {
         const gr = args.join(':')
         console.log('[socket.io] unwatch', gr)
         socket.leave(gr)
      })
   })

   const appNs = io.of('/app')
   appNs.use((socket: Socket, next) => {
      const token = _.get(socket, 'handshake.query.token')
      if (token) {
         try {
            const {user} = jwt.verify(token, process.env.JWT_SECRET)
            if (user) {
               // @ts-ignore
               socket.authUser = user
               next()
            } else {
               next(new Error('Authentication error'))
            }
         } catch (e) {
            next(new Error(e.message))
         }
      } else {
         next(new Error('Authentication error'))
      }
   })
   // @ts-ignore
   appNs.toUser = (userId: string) => {
      const socketId = UserId_SocketId_Map[userId]
      if (socketId) {
         // https://socket.io/docs/v4/redis-adapter/
         // each socket connected to server will join room = its id
         // so emit to socket is equal to emit to a room, the message will be sent to all server
         return appNs.to(socketId)
      } else {
         return {
            emit: () => {/* nothing */
            }
         }
      }
   }

   function onUserOnline(userId, socketId) {
      UserId_SocketId_Map[userId] = socketId
   }

   function onUserOffline(userId, socketId) {
      if (UserId_SocketId_Map[userId] === socketId)
         delete UserId_SocketId_Map[userId]
   }

   appNs.on(SSE_EVENTS.connection, onUserOnline)
   appNs.on(SSE_EVENTS.disconnect, onUserOffline)

   appNs.on('connection', async (socket: Socket) => {
      // @ts-ignore
      const userId = socket.authUser._id
      console.log(`[socket.io] ${userId} connect`)
      await UserModel.updateOne({_id: userId}, {isOnline: true})

      // update socket connection status in current server
      onUserOnline(userId, socket.id)

      // update socket connection status in remote servers
      // https://socket.io/docs/v4/adapter/
      if (useSocketIoAdapter)
         appNs.serverSideEmit(SSE_EVENTS.connection, userId, socket.id)

      appHook.trigger('user:online', userId)

      socket.on('disconnect', async reason => {
         console.log(`[socket.io] ${userId} disconnect with reason ${reason}`)
         console.log(`[socket.io] trigger "user:offline" after ${SOCKET_PING_TIMEOUT_IN_MS}ms if the user not re-connect`)
         onUserOffline(userId, socket.id)
         if (useSocketIoAdapter)
            appNs.serverSideEmit(SSE_EVENTS.disconnect, userId, socket.id) // https://socket.io/docs/v4/adapter/
         await UserModel.updateOne({_id: userId}, {isOnline: false})
         // There is a case when user disconnect from server A at time (t)
         // Then connect to server B at time (t + x) with x < SOCKET_PING_TIMEOUT
         // The 'disconnect' event will be raise in server A at time (t + SOCKET_PING_TIMEOUT)
         // In this case, we just ignore the disconnection of socket in server A.
         setTimeout(async () => {
            const isUserFinallyOffline = await UserModel.count({_id: userId, isOnline: false})
            if (isUserFinallyOffline)
               appHook.trigger('user:offline', userId)
         }, SOCKET_PING_TIMEOUT_IN_MS)
      });

      socket.emit("__TEST__", "__TEST__")
   });

   return io
}

export default async function useSocketIO(app) {
   if (!process.env.USE_SOCKET_IO) return
   console.log('[plugin] socket.io')
   // @ts-ignore
   global.io = await createSocketServer(app)
}
