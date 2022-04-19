import {ChartScene} from "./ChartScene";
import {WaypointObject} from "../objects/WaypointObject";
import type {SystemEntity} from "../../../../nestjs/space-trader-api/systems/system.entity";
import {Application} from "pixi.js";

export class SystemChartScene extends ChartScene<WaypointObject> {
  public system: SystemEntity;

  constructor(
    app: Application,
  ) {
    super(app, []);
  }

  public setSystem(system: SystemEntity, waypointObjects: Array<WaypointObject>) {
    this.system = system;
    this.setObjects(waypointObjects);
  }
}
