import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator/check';
import { ResponseHandler } from './response.handler';
import * as jwt from 'jsonwebtoken';
import * as HttpStatus from 'http-status-codes';
import { Messages } from './../constants/messages';


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
   
    public async guard(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const token: any = req.headers.authorization || req.query.token;
        if (token) {
          const auth: any = jwt.verify(token, process.env.SECRET);
          if (auth) {
  
            req.body.loggedinUserId = auth.id;
            next();
          } else {
            throw new Error(Messages.INVALID_CREDENTIALS);
          }
        } else {
          throw new Error(Messages.INVALID_CREDENTIALS);
        }
      } catch (err) {
        res.locals.data = err;
        res.locals.message = 'AuthenticationError';
        res.locals.statusCode = HttpStatus.UNAUTHORIZED;
        ResponseHandler.JSONERROR(req, res, 'Authorization');
      }
    } 
}