import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import compression from "compression"
import cookieParser from "cookie-parser"
import usePlugins from "./plugins"
import useRoutes from "./routes"
import registerAppHooks from "./business-logic/hooks/register-app-hooks"
import {_console} from "./utils/logger-util"
import {createServer} from "http";

process.on('uncaughtException', err => console.error((err && err.stack) ? err.stack : err))

async function main() {
   const app = express()
   // @ts-ignore
   app.$httpServer = createServer(app)
   app.use(cors())
   app.use(compression())
   app.use(cookieParser())
   await usePlugins(app)
   await useRoutes(app)
   registerAppHooks()
   // @ts-ignore
   app.$httpServer.listen(process.env.PORT, () => _console.log(`[http server] ready at http://localhost:${process.env.PORT}`))
}

main()
