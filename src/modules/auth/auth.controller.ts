import { Application, Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { google } from 'googleapis';
import * as query from 'query-string';
import axios from 'axios';
import {
  AuthHelper,
  ResponseHandler
} from './../../helpers';

import * as dotenv from 'dotenv';
dotenv.config();
import { UserLib } from './../user/user.lib';
import { userRules } from './../user/user.rules';
import { IUser } from './../user/user.type';

export class AuthController extends BaseController {
    constructor() {
      super();
      this.init();
    }

    public register(app: Application): void {
        app.use('/api/auth', this.router);
    }

    public init(): void {
        const authHelper: AuthHelper = new AuthHelper();
        this.router.post('/sign-up', userRules.forSignUser, authHelper.validation, this.signUp);
        this.router.post('/login', userRules.forSignIn, authHelper.validation, this.login);
        this.router.get('/gmail-sign-request', this.gmailSignInRequest);
        this.router.get('/gmail-redirect-url', this.gmailSignInResponse);
      }

    public async gmailSignInRequest(req: Request, res: Response): Promise<void> {
      try {  
         const oauth2Client: any = new google.auth.OAuth2(process.env.GMAIL_CLIENT, process.env.GMAIL_SECRET, process.env.GMAIL_REDIRECT_URL); 
         const oauth_scopes: string[] = ['profile email openid'];
        
         const url: string = oauth2Client.generateAuthUrl({
                                     access_type: "offline",
                                     scope: oauth_scopes,
                                     state: JSON.stringify({
                                         callbackUrl: req.body.callbackUrl,
                                         userID: req.body.userid
                                    })
              });  
          const urltest: any = await axios.get(url);
          res.locals.data = { url };
          ResponseHandler.JSONSUCCESS(req, res);
        } catch(err) {
          res.locals.data = err;
          ResponseHandler.JSONERROR(req, res, 'gmailSignInRequest');
        }      
    }  

    public async gmailSignInResponse(req: Request, res: Response): Promise<void> {
        try {
          const oauth2Client: any = new google.auth.OAuth2(process.env.GMAIL_CLIENT, process.env.GMAIL_SECRET, process.env.GMAIL_REDIRECT_URL); 
          const parsedData: any = query.parse(req.url);
          const { tokens } = await oauth2Client.getToken(parsedData.code);
          const oauth2: any = new google.auth.OAuth2();
          oauth2.setCredentials({ access_token: tokens.access_token });
          const googleObj: any = google.oauth2({
                       auth: oauth2,
                       version: 'v2'
                });
          const { data } = await googleObj.userinfo.get(); 
          const user: UserLib = new UserLib();     
          const loggedInUser: any = await user.gmailSignInSignUp(
                                 data.email, 
                                 data.id, 
                                 data.given_name, 
                                 data.family_name );                                
          res.locals.data = loggedInUser ;
          ResponseHandler.JSONSUCCESS(req, res);
        } catch(err) {
          res.locals.data = err;
          ResponseHandler.JSONERROR(req, res, 'gmailSignInResponse');
        }
    }
    
    
    public async signUp(req: Request, res: Response): Promise<void> {
        try {
          const user: UserLib = new UserLib();
          const userData: IUser = req.body;
          const userResult: IUser = await user.saveUser(userData);
          res.locals.data = userResult;
          ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
          res.locals.data = err;
          ResponseHandler.JSONERROR(req, res, 'addUser');
        }
      }
    
    public async login(req: Request, res: Response): Promise<void> {
        try {
          const user: UserLib = new UserLib();
          const { email, password } = req.body;
          const loggedInUser: any = await user.loginUserAndCreateToken(
            email,
            password,
          );
          res.locals.data = loggedInUser;
          ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
          res.locals.errorCode = 401;
          res.locals.data = err;
          ResponseHandler.JSONERROR(req, res, 'login');
        }
      }
    

}