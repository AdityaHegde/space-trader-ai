import {BaseTexture, Texture} from "pixi.js";
import {Rectangle} from "@pixi/math";

export enum TextureType {
  Sun,
  Planet,
  Moon,
  Asteroid,
  Gate,
}

export class TextureFactory {
  protected textureMap = new Map<TextureType, Texture>();

  public constructor(private readonly celestialObjects: BaseTexture) {
    this.textureMap.set(TextureType.Sun, this.createSunTexture());
    this.textureMap.set(TextureType.Planet, this.createPlanetTexture());
    this.textureMap.set(TextureType.Moon, this.createMoonTexture());
    this.textureMap.set(TextureType.Asteroid, this.createAsteroidTexture());
    this.textureMap.set(TextureType.Gate, this.createGateTexture());
  }

  public getTexture(type: TextureType) {
    return this.textureMap.get(type);
  }

  protected createSunTexture() {
    return new Texture(
      this.celestialObjects,
      new Rectangle(192, 192, 32, 32),
      null, null, null,
      { x: 0.5, y: 0.5 },
    );
  }

  protected createPlanetTexture() {
    return new Texture(
      this.celestialObjects,
      new Rectangle(192, 64, 64, 64),
      null, null, null,
      { x: 0.5, y: 0.5 },
    );
  }

  protected createMoonTexture() {
    return new Texture(
      this.celestialObjects,
      new Rectangle(0, 192, 32, 32),
      null, null, null,
      { x: 0.5, y: 0.5 },
    );
  }

  protected createAsteroidTexture() {
    return new Texture(
      this.celestialObjects,
      new Rectangle(0, 224, 32, 32),
      null, null, null,
      { x: 0.5, y: 0.5 },
    );
  }

  protected createGateTexture() {
    return new Texture(
      this.celestialObjects,
      new Rectangle(96, 192, 32, 32),
      null, null, null,
      { x: 0.5, y: 0.5 },
    );
  }
}
