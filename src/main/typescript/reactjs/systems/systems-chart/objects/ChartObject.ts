import {Sprite, Texture, Text, TextStyle} from "pixi.js";
import {COLLISION_RANGE, SCALE} from "../../SystemChartConstants";

export class ChartObject {
  protected object: Sprite;
  protected label: Text;
  protected x: number;
  protected y: number;
  public sprites: Array<Sprite>;

  public render() {
    this.object.x = this.x * SCALE;
    this.object.y = this.y * SCALE;
    this.label.x = (this.x - 2) * SCALE;
    this.label.y = (this.y - 2.5) * SCALE;
  }

  public isWithin(x: number, y: number) {
    return this.x > x - COLLISION_RANGE && this.x < x + COLLISION_RANGE &&
      this.y > y - COLLISION_RANGE && this.y < y + COLLISION_RANGE;
  }

  protected createSprite(texture: Texture, label: string) {
    this.object = new Sprite(texture);
    this.label = new Text(label, new TextStyle({
      fontFamily: "Arial",
      fontSize: 10,
      fill: "white",
    }));
    this.sprites = [this.object, this.label];
  }
}
