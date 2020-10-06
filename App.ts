import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';

import { registerRoutes } from './src/routes';



export class App { 
  public express: express.Application;
  public mongoUrl: string = process.env.MONGO_URL;
  public httpServer: http.Server;

  public async init():Promise<void> {
      this.express = express();
      this.httpServer = http.createServer(this.express);
      await this.middleware();
      await this.mongoSetup();
      this.setupRoutes();
  }

  private async middleware(): Promise<void> {
    // cors
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
  }


  private async mongoSetup(): Promise<void> {
      mongoose.set('debug', true);
      try {
      await mongoose.connect(this.mongoUrl, {
        autoIndex: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      }); 
      console.log('database connected');
      } catch (error) {
        throw new Error('Database not connected');
      }
  }

  private setupRoutes(): void {
    registerRoutes(this.express);
  }

}