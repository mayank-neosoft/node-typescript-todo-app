import { PaginateResult, Types } from 'mongoose';
import { listModel } from './list.model';
import { IList, IListRequest } from './list.type';
import { userModel } from '../user/user.model';
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

  public async saveList(name: string,user_id: string): Promise<IList> {
    const listObj: IList = new listModel({name, user_id});
    return listObj.save();
  }

  public async pushListIdInUser(user_id: string, list_id: string): Promise<any> {
    return userModel.findOneAndUpdate(
      { _id: user_id },
      { $push: { todoList: list_id } },
    )
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
