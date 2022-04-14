import {Column} from "typeorm";

export class ShipBase {
  @Column()
  public class: string;

  @Column()
  public manufacturer: string;

  @Column()
  public maxCargo: number;

  @Column()
  public speed: number;

  @Column()
  public type: string;

  @Column()
  public loadingSpeed: number;
}
