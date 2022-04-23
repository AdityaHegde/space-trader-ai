import {ChartObject} from "../objects/ChartObject";
import {Application, Container} from "pixi.js";

export class ChartScene<CObject extends ChartObject = ChartObject> {
  protected objects: Array<CObject>;
  public scene: Container;
  public selected: CObject;
  private selectedIndex = 0;

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

  public select(x: number, y: number, scale: number) {
    if (this.objects.length === 0) return;
    // TODO: build a binary search table
    const startIdx = (this.selectedIndex + 1) % this.objects.length;
    let i = startIdx;
    do {
      if (this.objects[i].isWithin(x, y, scale)) {
        this.selected = this.objects[i];
        this.selectedIndex = i;
        break;
      }
      i = (i + 1) % this.objects.length;
    } while (i !== startIdx);
    if (this.selectedListener) this.selectedListener(this.selected);
  }
}
