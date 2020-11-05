import { Application, Request, Response } from 'express';
import { PaginateResult } from 'mongoose';
import { BaseController } from '../BaseController';
import { AuthHelper, ResponseHandler } from './../../helpers';
import { logger } from './../../logger';
import { UserLib } from './user.lib';
import { userRules } from './user.rules';
import { IUser } from './user.type';

/**
 * UserController
 */
export class UserController extends BaseController {
  constructor() {
    super();
    this.init();
  }
 
  public register(app: Application): void {
    app.use('/api/user', this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();

    this.router.get('/', authHelper.guard, this.getUserById);
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const userDetails: IUser = await user.getUserById(req.body.loggedinUserId);
      res.locals.data = userDetails;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getUserById');
    }
  }

}
