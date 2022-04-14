import {ClientBase} from "./ClientBase";
import {MyShip} from "../database/models/MyShip";
import {Order} from "../database/models/Order";
import {FlightPlan} from "../database/models/FlightPlan";

export interface GoodTransactionResponse {
  order: Order;
  credits: number;
}

export class ShipsClient extends ClientBase {
  public async getMyShips(): Promise<Array<MyShip>> {
    const resp = await this.httpClient.get("/my/ships");
    return resp.ships.map(MyShip.fromJson);
  }

  public async getMyShip(shipId: string): Promise<MyShip> {
    const resp = await this.httpClient.get(`/my/ships/${shipId}`);
    return MyShip.fromJson(resp.ship);
  }

  public async purchaseGood(ship: MyShip, good: string, quantity: number): Promise<GoodTransactionResponse> {
    return this.goodTransaction("/my/purchase-orders/", ship, good, quantity);
  }

  public async sellGood(ship: MyShip, good: string, quantity: number): Promise<GoodTransactionResponse> {
    return this.goodTransaction("/my/sell-orders/", ship, good, quantity);
  }

  public async moveTo(ship: MyShip, destination: string): Promise<FlightPlan> {
    const resp = await this.httpClient.post("/my/flight-plans", {shipId: ship, destination});
    return FlightPlan.fromJson(resp.flightPlan);
  }

  private async goodTransaction(path: string, ship: MyShip, good: string, quantity: number): Promise<GoodTransactionResponse> {
    const resp = await this.httpClient.post(path, {shipId: ship.id, good, quantity});
    ship.updateCargo(resp.ship);
    return {
      order: resp.order,
      credits: resp.credits,
    };
  }
}
