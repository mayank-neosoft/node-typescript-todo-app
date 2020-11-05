import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'yamljs';

import { registerRoutes } from './src/routes';

const swagOptions: any = { explorer: false };
const swaggerDocument: any = yaml.load('./swagger/swagger.yaml');

if (process.env.NODE_ENV === 'production') {
  swaggerDocument.host = '';
} else {
  swaggerDocument.host = `localhost:${process.env.PORT}`;
}

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
    this.express.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, swagOptions),
    );
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