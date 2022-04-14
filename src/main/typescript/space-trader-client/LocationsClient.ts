import {ClientBase} from "./ClientBase";
import {Marketplace} from "../database/models/Marketplace";

export class LocationsClient extends ClientBase {
  public async getMarketplace(locationSymbol: string): Promise<Array<Marketplace>> {
    const resp = await this.httpClient.get(`/locations/${locationSymbol}/marketplace`);
    return resp.marketplace.map(Marketplace.fromJson);
  }
}
