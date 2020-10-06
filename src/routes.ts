import * as express from 'express';

import { ListController } from './modules/list/list.controller';

export function registerRoutes(app: express.Application): void {
  new ListController().register(app);
}
