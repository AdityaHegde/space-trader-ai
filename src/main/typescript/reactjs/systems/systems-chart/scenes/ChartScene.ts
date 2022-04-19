import {ChartObject} from "../objects/ChartObject";
import {Application, Container} from "pixi.js";

export class ChartScene<CObject extends ChartObject = ChartObject> {
  protected objects: Array<CObject>;
  public scene: Container;
  public selected: CObject;

  public selectedListener: (selected: CObject) => void;

  public constructor(
    protected readonly app: Application,
    objects: Array<CObject>,
  ) {
    this.setObjects(objects);
  }

  public setObjects(objects: Array<CObject>) {
    if (this.scene && this.objects) {
      this.objects.forEach(object => this.scene.removeChild(...object.sprites));
    } else {
      this.scene = new Container();
      this.app.stage.addChild(this.scene);
    }
    this.objects = objects;
    objects.forEach(object => this.scene.addChild(...object.sprites));
    this.selected = null;
  }

  public render() {
    this.objects.forEach(object => object.render());
  }

  public select(x: number, y: number) {
    // TODO: build a binary search table
    this.selected = this.objects.find(object => object.isWithin(x, y));
    if (this.selectedListener) this.selectedListener(this.selected);
  }
}
