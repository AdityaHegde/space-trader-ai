import {SpaceTraderHTTPClient} from "./SpaceTraderHTTPClient";

export class ClientBase {
  public constructor(protected readonly httpClient: SpaceTraderHTTPClient) {}
}
