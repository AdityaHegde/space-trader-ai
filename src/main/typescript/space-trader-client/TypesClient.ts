import {ClientBase} from "./ClientBase";
import {Good} from "../database/models/Good";

export class TypesClient extends ClientBase {
  public async getAllGoods(): Promise<Array<Good>> {
    const resp = await this.httpClient.get("/types/goods");
    return resp.goods.map(Good.fromJson);
  }
}
