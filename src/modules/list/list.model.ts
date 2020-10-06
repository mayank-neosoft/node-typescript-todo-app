import { Document, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { IList } from './list.type';

export const listSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

listSchema.plugin(mongoosePaginate);
interface IListModel<T extends Document> extends PaginateModel<T> {}

export const listModel: IListModel<IList> = model<IList>('List', listSchema);
