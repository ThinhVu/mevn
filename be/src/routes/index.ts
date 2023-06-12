import UserCtl from './user';
import LogCtl from './log';
import KvCtl from './kv';
import SystemMetricCtl from "./system-metric";
import fileSystemCtl from "./file-system";
import express from 'express';
import Routerex from "routerex";
import Exdogen from "exdogen";

export default async function useRoutes(app) {
   const router = Routerex()
   router.get('/health-check', {
      title: 'Health check',
      desc: 'Server health monitor provides built-in capacity forecast charts and metrics designed to help you more easily identify when server resources reach warning',
      response: {200: {type: 'string', desc: 'The server is live'}, 408: {type: 'string', desc: 'The server is down'}}
   }, (_, res) => res.status(200).end())
   router.use('/user', UserCtl)
   router.use('/kv', KvCtl)
   router.use('/log', LogCtl)
   if (process.env.USE_API_METRIC)
      router.use('/system-metric', SystemMetricCtl)
   router.use('/file-system', fileSystemCtl)

   const cache = {html: '', postman: ''};
   const exdogen = Exdogen({
      onHtmlGenerated: html => cache.html = html,
      onPostmanGenerated: postman => cache.postman = postman,
      onError: console.error
   })
   app.use(...exdogen('/',
      express.json({limit: process.env.REQUEST_BODY_MAX_SIZE || '50mb'}),
      express.urlencoded({limit: process.env.REQUEST_BODY_MAX_SIZE || '50mb'}),
      function realIp(req, res, next) {
         req.realIp = req.headers['x-real-ip'] || req.ip
         next()
      }, router));
   app.get('/docs', (req, res) => res.send(cache.html));
   app.get('/docs/index.html', (req, res) => res.send(cache.html));
   app.get('/docs/postman.json', (req, res) => res.send(cache.postman));
}
