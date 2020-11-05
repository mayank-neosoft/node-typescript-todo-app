import { Document } from 'mongoose';
export interface IList extends Document {
  _id: string;
  name: string;
  user_id: string;
}

export interface IListRequest {
  _id: string;
  name: string;
  user_id: string;
}
