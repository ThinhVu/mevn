import dotenv from "dotenv"
dotenv.config({path: `.env.${process.env.NODE_ENV}`})
import express from "express"
import cors from "cors"
import compression from "compression"
import cookieParser from "cookie-parser"
import usePlugin from "./plugins"
import useRoutes from "./routes"
import registerAppHooks from "./hooks/register-app-hooks"
import {_console} from "./utils/logger-util"

process.on('uncaughtException', err => console.error((err && err.stack) ? err.stack : err))

async function main() {
   const app = express()
   app.use(cors())
   app.use(compression())
   app.use(cookieParser())
   await usePlugin(app)
   await useRoutes(app)
   registerAppHooks()
   app.listen(process.env.PORT, () => _console.log(`[http server] ready at http://localhost:${process.env.PORT}`))
}

main()
