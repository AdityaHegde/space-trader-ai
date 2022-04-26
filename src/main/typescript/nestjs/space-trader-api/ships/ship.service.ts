import {BaseService} from "../../BaseService";
import { Cargo, ShipEntity } from "./ship.entity";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { ShipNavigationService } from "@space-trader-api/ships/ship-navigation.service";
import { ExtractionService } from "@space-trader-api/extraction/extraction.service";

@Injectable()
export class ShipService extends BaseService<ShipEntity> {
  public constructor(
    httpClient: SpaceTraderHttpService,
    @InjectRepository(ShipEntity) repository: Repository<ShipEntity>,
    private readonly shipNavigationService: ShipNavigationService,
    private readonly extractionService: ExtractionService,
  ) {
    super(httpClient, repository);
  }

  public async get(shipSymbol: string): Promise<ShipEntity> {
    return this.getFromDBOrFetch(
      shipSymbol,
      () => this.httpClient.get(`/my/ships/${shipSymbol}`),
    );
  }

  public async update(shipSymbol: string): Promise<ShipEntity> {
    return this.updateFromRemote(
      shipSymbol,
      () => this.httpClient.get(`/my/ships/${shipSymbol}`),
    );
  }
  public async updateExisting(ship: ShipEntity): Promise<void> {
    const newShip = await this.httpClient.get<ShipEntity>(`/my/ships/${ship.symbol}`);
    await this.fromJson(newShip, ship);
    await this.repository.save(ship);
  }

  public async getAll(): Promise<Array<ShipEntity>> {
    return this.getAllFromDBOrFetch(
      () => this.httpClient.get<Array<ShipEntity>>("/my/ships"),
      this.repository.createQueryBuilder().select(),
    );
  }

  public async updateAllShips(): Promise<Array<ShipEntity>> {
    const ships = await this.httpClient.get<Array<ShipEntity>>("/my/ships");
    const shipEntities = new Array<ShipEntity>();
    for (const ship of ships) {
      const newShip = await this.fromJson(ship);
      await this.extractionService.surveyCooldown(newShip);
      await this.extractionService.extractCooldown(newShip);
      newShip.navigation =
        (await this.shipNavigationService.navigationStatus(newShip.symbol)).navigation;
      newShip.jumpCooldown.setCooldown(
        (await this.shipNavigationService.jumpCooldown(newShip.symbol)).cooldown);
      shipEntities.push(newShip);
      await this.repository.save(newShip);
    }
    return shipEntities;
  }

  public async jettisonCargo(
    ship: ShipEntity, cargo: Cargo,
  ): Promise<Cargo> {
    const resp = await this.httpClient.post<Cargo>(
      `/my/ships/${ship.symbol}/jettison`,
      {tradeSymbol: cargo.tradeSymbol, units: cargo.units},
    );
    ship.removeCargo(resp);
    return resp;
  }

  protected async fromJson(json: ShipEntity, ship = new ShipEntity()): Promise<ShipEntity> {
    ship.symbol = json.symbol;
    ship.registration = json.registration;

    ship.frame = json.frame;
    ship.reactor = json.reactor;
    ship.engine = json.engine;
    ship.modules = json.modules;
    ship.mounts = json.mounts;

    ship.integrity = json.integrity;
    ship.stats = json.stats;
    ship.fuel = json.fuel;
    ship.cargo = json.cargo;

    ship.location = json.location ?? "";
    ship.status = json.status;
    return ship;
  }
}
