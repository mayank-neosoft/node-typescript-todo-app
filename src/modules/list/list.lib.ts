import { PaginateResult, Types } from 'mongoose';
import { listModel } from './list.model';
import { IList, IListRequest } from './list.type';
/**
 * ListLib
 *
 */
export class ListLib {
  public async getList(
    filters: any,
    projection: any,
    options: any,
  ): Promise<PaginateResult<IList>> {
    return listModel.paginate(filters, options);
  }

  public async getListById(id: string): Promise<IList> {
    return listModel.findById(id);
  }

  public async saveList(listData: IList): Promise<IList> {
    const listObj: IList = new listModel(listData);
    return listObj.save();
  }

  /**
   * updateUser
   * @param userId
   * @param userData
   */
  public async updateList(
    listId: Types.ObjectId,
    listData: IListRequest,
  ): Promise<any> {
    const list: IList = await listModel.findById(listId);
    list.set(listData);

    return list.save();
  }

}
