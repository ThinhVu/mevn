import {envVar} from "./env-var"
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import compression from "compression"
import cookieParser from "cookie-parser"
import usePlugins from "./plugins"
import useRoutes from "./routes"
import registerAppHooks from "./business-logic/hooks/register-app-hooks"
import {createServer} from "http";
import helmet from "helmet"
import xss from "xss-clean"
import rateLimit from "express-rate-limit"
import hpp from "hpp"

process.on('uncaughtException', err => console.error((err && err.stack) ? err.stack : err))

export default async function createApp() {
    dotenv.config()
    envVar.parse(process.env)

    const app = express()
    // @ts-ignore
    app.$httpServer = createServer(app)
    const limiter = rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 200
    })
    app.use(limiter)
    app.use(helmet({
        crossOriginResourcePolicy: false
    }))
    app.use(xss())
    app.use(hpp())
    app.use(cors())
    app.use(compression())
    app.use(cookieParser())
    await usePlugins(app)
    await useRoutes(app)
    registerAppHooks()
    return app;
}
