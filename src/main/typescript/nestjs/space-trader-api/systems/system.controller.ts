import {Controller, Get, Inject, Param} from "@nestjs/common";
import {SystemService} from "./system.service";
import {WaypointService} from "./waypoint.service";
import {WaypointEntity} from "./waypoint.entity";
import {SystemEntity} from "./system.entity";

@Controller("systems")
export class SystemController {
  public constructor(
    private readonly systemService: SystemService,
    private readonly waypointService: WaypointService,
  ) {}

  @Get("/")
  public getSystems(): Promise<Array<SystemEntity>> {
    return this.systemService.getAll();
  }

  @Get("/:systemSymbol")
  public getWaypoints(@Param("systemSymbol") systemSymbol: string): Promise<Array<WaypointEntity>> {
    return this.waypointService.getAll(systemSymbol)
  }
}
