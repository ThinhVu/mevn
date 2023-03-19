import express from 'express';
import rateLimit from "express-rate-limit";
import {requireAdmin, requireUser} from "../middlewares/auth";
import {apiError} from "../utils/common-util";
import UserCtl from './user';
import LogCtl from './log';
import SystemConfigCtl from './system-config';
import SytemMetricCtl from "./system-metric";

const router = express.Router();
const $ = fn => (req, res) => fn(req, res).then(rs => res.send(rs)).catch(e => apiError(e, res));

// user
router.post('/user/sign-up', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), UserCtl.signUp);
router.post('/user/sign-in', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), UserCtl.signIn);
router.get('/user/auth', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), UserCtl.auth);
router.post('/user/logout', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), UserCtl.logout);
router.post('/user/change-password', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false }), UserCtl.changePassword);
router.post('/user/forgot-password', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false }), UserCtl.forgotPassword);
router.post('/user/reset-password', rateLimit({windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false}), UserCtl.resetPassword);
router.get('/user/profile/:id', requireUser, UserCtl.getProfile);
router.put('/user/profile', requireUser, UserCtl.updateProfile);
router.get('/users', requireAdmin, UserCtl.getAll);

// health check
router.get('/health-check', (req, res) => res.status(200).end())

// system config
router.get('/system-configs', requireAdmin, $(() => SystemConfigCtl.getAll()))
router.get('/system-config/:key', $(async req => await SystemConfigCtl.get(req.params.key)))
router.post('/system-config/:key', requireAdmin, $(async req => await SystemConfigCtl.set(req.params.key, req.body.payload)))
router.delete('/system-config/:key', $(async req => await SystemConfigCtl.unset(req.params.key)))

// logs
router.get('/logs', requireAdmin, LogCtl.getLogs)
router.get('/log/:logFile', requireAdmin, LogCtl.getLog)

// log setting
router.get('/log-setting', requireAdmin, LogCtl.getLogSetting)
router.post('/log-setting', requireAdmin, LogCtl.updateLogSetting)

// ================== metric ==================
router.get('/metric/api-call', requireAdmin, SytemMetricCtl.apiCallMetric);
router.get('/metric/api-call-history', requireAdmin, SytemMetricCtl.apiCallMetricHistory)

export default router;
