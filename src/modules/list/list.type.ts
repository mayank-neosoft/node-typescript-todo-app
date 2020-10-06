import { Document } from 'mongoose';
export interface IList extends Document {
  _id: string;
  name: string;
}

export interface IListRequest {
  _id: string;
  name: string;
}
