import {ChartObject} from "./ChartObject";
import type {SystemEntity} from "../../../../nestjs/space-trader-api/systems/system.entity";
import type {WaypointEntity} from "../../../../nestjs/space-trader-api/systems/waypoint.entity";
import {TextureFactory, TextureType} from "../../TextureFactory";

export class WaypointObject extends ChartObject {
  public constructor(
    textureFactory: TextureFactory,
    public readonly system: SystemEntity,
    public readonly waypoint: WaypointEntity,
  ) {
    super();
    this.x = waypoint.x;
    this.y = waypoint.y;
    this.createSprite(textureFactory.getTexture(TextureType.Planet), waypoint.symbol);
  }
}
