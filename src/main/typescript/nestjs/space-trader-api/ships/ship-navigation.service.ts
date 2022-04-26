import {BaseService} from "../../BaseService";
import {ShipEntity} from "./ship.entity";
import {NavigateResponse, Navigation} from "../types/Navigation";
import {Cooldown, JumpResponse} from "../types/Cooldown";
import {Injectable} from "@nestjs/common";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ShipNavigationService extends BaseService<ShipEntity> {
  public constructor(
    httpClient: SpaceTraderHttpService,
    @InjectRepository(ShipEntity) repository: Repository<ShipEntity>
  ) {
    super(httpClient, repository);
  }

  public async dockShip(shipSymbol: string): Promise<void> {
    return this.httpClient.post(`/my/ships/${shipSymbol}/dock`);
  }
  public async orbitShip(shipSymbol: string): Promise<void> {
    return this.httpClient.post(`/my/ships/${shipSymbol}/orbit`);
  }

  public async navigate(shipSymbol: string, destination: string): Promise<NavigateResponse> {
    return this.httpClient.post<NavigateResponse>(`/my/ships/${shipSymbol}/navigate`, {destination});
  }
  public async navigationStatus(shipSymbol: string): Promise<NavigateResponse> {
    return this.httpClient.get<NavigateResponse>(`/my/ships/${shipSymbol}/navigate`);
  }

  public async jump(shipSymbol: string, destination: string): Promise<JumpResponse> {
    return this.httpClient.post<JumpResponse>(`/my/ships/${shipSymbol}/jump`, {destination});
  }
  public async jumpCooldown(shipSymbol: string): Promise<JumpResponse> {
    return this.httpClient.get<JumpResponse>(`/my/ships/${shipSymbol}/jump`);
  }

  public async refuelShip(shipSymbol: string): Promise<{credits: number, fuel: number}> {
    return this.httpClient.post(`/my/ships/${shipSymbol}/refuel`);
  }

  protected async fromJson(json: ShipEntity, ship = new ShipEntity()): Promise<ShipEntity> {
    return ship;
  }
}
