import * as express from 'express';

import { ListController } from './modules/list/list.controller';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';


export function registerRoutes(app: express.Application): void {
  new ListController().register(app);
  new AuthController().register(app);
  new UserController().register(app);
}
