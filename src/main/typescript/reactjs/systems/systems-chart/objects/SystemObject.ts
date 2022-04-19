import type {SystemEntity} from "../../../../nestjs/space-trader-api/systems/system.entity";
import {ChartObject} from "./ChartObject";
import {TextureFactory, TextureType} from "../../TextureFactory";

export class SystemObject extends ChartObject {
  public constructor(
    textureFactory: TextureFactory,
    public readonly system: SystemEntity,
  ) {
    super();
    this.x = system.x;
    this.y = system.y;
    this.createSprite(textureFactory.getTexture(TextureType.Sun), system.symbol);
  }
}
