import { Application, Request, Response } from 'express';
import { Types } from 'mongoose';
import { BaseController } from '../BaseController';
import {
  ResponseHandler
} from './../../helpers';

import { ListLib } from './list.lib';
import { IList } from './list.type';


export class ListController extends BaseController {
    constructor() {
      super();
      this.init();
    }

    public register(app: Application): void {
        app.use('/api/list', this.router);
    }

    public init(): void {
        this.router.post('/add-list', this.saveList);
        this.router.put('/:id', this.updateList);
        this.router.get('/:id', this.getListById);
      } 
      
    public async saveList(req: Request, res: Response): Promise<void> {
        try {
          const list: ListLib = new ListLib();
          const listData: IList = req.body;
          const listResult: IList = await list.saveList(listData);
          res.locals.data = listResult;
          ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
          res.locals.data = err;
          res.end('error');
          //ResponseHandler.JSONERROR(req, res, 'addUser');
        }
      }  

    public async updateList(req: Request, res: Response): Promise<void> {
        const body: IList = req.body;
        const id: Types.ObjectId = Types.ObjectId(req.params.id);
        try {
          const list: any = await new ListLib().updateList(id, body);
          res.locals.data = list;
          ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
          res.locals.data = err;
          ResponseHandler.JSONERROR(req, res, 'updateList');
        }
      }

    public async getListById(req: Request, res: Response): Promise<void> {
        try {
          const list: ListLib = new ListLib();
          const listDetails: IList = await list.getListById(req.params.id);
          res.locals.data = listDetails;
          ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
          res.locals.data = err;
          ResponseHandler.JSONERROR(req, res, 'getListById');
        }
      }

}