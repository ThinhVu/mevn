import {NextFunction, Request, Response} from 'express';
import {apiError} from '../utils/common-util';

export default function safeCall(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req, res, next) => fn(req, res, next).then(rs => res.send(rs)).catch(e => apiError(e, res));
}
