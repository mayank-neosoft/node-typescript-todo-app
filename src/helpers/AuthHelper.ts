import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator/check';
import { ResponseHandler } from './response.handler';



/**
 * auth helper
 */
export class AuthHelper {
    public async validation(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const errors: Result<{}> = validationResult(req);
        if (!errors.isEmpty()) {
          res.locals.data = errors.array();
          throw new Error('ValidationError');
        } else {
          next();
        }
      } catch (err) {
        res.locals.data.message = err.message;
        res.locals.details = err;
        res.locals.name = 'ValidationError';
        ResponseHandler.JSONERROR(req, res, 'validation');
      }
    }
}