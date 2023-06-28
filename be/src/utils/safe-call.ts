import {NextFunction, Request, Response} from 'express';
import {handleApiError} from './common-util';

type SafeCallHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type SafeCallResponse = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export default function safeCall(fn: SafeCallHandler): SafeCallResponse  {
  return async (req, res, next) => {
    try {
      const rs = await fn(req, res, next)
      res.send({data: rs})
    } catch(e) {
      handleApiError(e, res)
    }
  }
}
