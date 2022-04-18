import {Body, Controller, Get, Inject, Param, Post} from "@nestjs/common";
import {ShipService} from "./ship.service";
import {ShipNavigationService} from "./ship-navigation.service";
import {ShipEntity} from "./ship.entity";
import {NavigateResponse} from "../types/Navigation";
import {JumpResponse} from "../types/Cooldown";

@Controller("ships")
export class ShipController {
  public constructor(
    @Inject(ShipService)
    private readonly shipService: ShipService,
    @Inject(ShipNavigationService)
    private readonly shipNavigationService: ShipNavigationService,
  ) {}

  @Get("/")
  public getShips(): Promise<Array<ShipEntity>> {
    return this.shipService.getAll();
  }

  @Post("/:shipSymbol/navigate")
  public navigate(
    @Param("shipSymbol") shipSymbol: string,
    @Body() navigateRequest: {destination: string},
  ): Promise<NavigateResponse> {
    return this.shipNavigationService.navigate(shipSymbol, navigateRequest.destination);
  }

  @Post("/:shipSymbol/jump")
  public jump(
    @Param("shipSymbol") shipSymbol: string,
    @Body() jumpRequest: {destination: string},
  ): Promise<JumpResponse> {
    return this.shipNavigationService.jump(shipSymbol, jumpRequest.destination);
  }

  @Post("/:shipSymbol/orbit")
  public orbitShip(
    @Param("shipSymbol") shipSymbol: string,
  ) {
    return this.shipNavigationService.orbitShip(shipSymbol);
  }

  @Post("/:shipSymbol/dock")
  public dockShip(
    @Param("shipSymbol") shipSymbol: string,
  ) {
    return this.shipNavigationService.dockShip(shipSymbol);
  }
}
