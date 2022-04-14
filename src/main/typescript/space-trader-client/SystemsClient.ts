import {ClientBase} from "./ClientBase";
import {Location} from "../database/models/Location";

export class SystemsClient extends ClientBase {
  public async getLocationsInSystem(systemSymbol: string): Promise<Array<Location>> {
    const resp = await this.httpClient.get(`/systems/${systemSymbol}/locations`);
    return resp.locations.map(Location.fromJson);
  }
}
