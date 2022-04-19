import type {SystemEntity} from "../../../nestjs/space-trader-api/systems/system.entity";
import {Application} from "pixi.js";
import {SystemObject} from "./objects/SystemObject";
import {CelestialObjectsTexture, CHART_HEIGHT, SCALE} from "../SystemChartConstants";
import {TextureFactory} from "../TextureFactory";
import {SectorChartScene} from "./scenes/SectorChartScene";
import {SystemChartScene} from "./scenes/SystemChartScene";
import {ChartScene} from "./scenes/ChartScene";
import {WaypointObject} from "./objects/WaypointObject";

export class PixiApp {
  private readonly app: Application;

  private initialized = false;
  private textureFactory: TextureFactory;

  public sectorScene: SectorChartScene;
  private sectorX: number;
  private sectorY: number;

  public systemScene: SystemChartScene;
  public currentScene: ChartScene;

  public sceneListener: (scene: ChartScene) => void;

  public constructor(
    private readonly systems: Array<SystemEntity>,
  ) {
    this.app = new Application({ height: CHART_HEIGHT });
  }

  public async init(container: HTMLElement) {
    if (this.initialized) return;
    this.initialized = true;

    container.appendChild(this.app.view);

    await this.loadAssets();

    this.loadScenes();

    this.render();
    this.app.ticker.add(() => {
      this.render();
    });

    this.handleMoveChart();
  }

  public viewSystem(system: SystemEntity) {
    this.systemScene.setSystem(system,
      system.waypoints.map(waypoint => new WaypointObject(this.textureFactory, system, waypoint)));
    if (this.currentScene && this.currentScene !== this.systemScene) {
      this.currentScene.scene.visible = false;

      this.sectorX = this.app.stage.x;
      this.sectorY = this.app.stage.y;
      this.app.stage.x = 0;
      this.app.stage.y = 0;
    }
    this.systemScene.scene.visible = true;
    this.currentScene = this.systemScene;
    if (this.sceneListener) this.sceneListener(this.currentScene);
  }

  public viewSector() {
    if (this.currentScene && this.currentScene !== this.sectorScene) {
      this.currentScene.scene.visible = false;
    }
    this.sectorScene.scene.visible = true;
    this.app.stage.x = this.sectorX ?? 0;
    this.app.stage.y = this.sectorY ?? 0;
    this.currentScene = this.sectorScene;
    if (this.sceneListener) this.sceneListener(this.currentScene);
  }

  private async loadAssets() {
    await new Promise<void>(resolve => {
      this.app.loader.add("celestialObjects", CelestialObjectsTexture);
      this.app.loader.load((loader, resources) => {
        this.textureFactory = new TextureFactory(resources.celestialObjects.texture as any);
        resolve();
      });
    });
  }

  private loadScenes() {
    this.sectorScene =
      new SectorChartScene(this.app,
        this.systems.map(system => new SystemObject(this.textureFactory, system)));
    this.systemScene = new SystemChartScene(this.app);
    this.viewSector();
  }

  private render() {
    this.currentScene?.render();
  }

  private handleMoveChart() {
    this.app.view.addEventListener("mousemove", (e) => {
      if ((e.buttons & 1) === 1) {
        this.app.stage.setTransform(
          this.app.stage.x + e.movementX,
          this.app.stage.y + e.movementY,
        );
      }
    });
    this.app.view.addEventListener("mouseup", (e) => {
      const x = (e.offsetX - this.app.stage.x - 1) / SCALE;
      const y = (e.offsetY - this.app.stage.y - 1) / SCALE;
      this.currentScene.select(x, y);
    });
  }
}
