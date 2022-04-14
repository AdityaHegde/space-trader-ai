import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {System} from "./System";

@Entity()
export class Location {
  @PrimaryColumn()
  public symbol: string;

  @Column()
  public name: string;

  @Column()
  public type: string;

  @Column()
  public allowsConstruction: boolean;

  @Column()
  public traits: Array<string>;

  @Column()
  public x: number;

  @Column()
  public y: number;

  @ManyToOne(() => System, system => system.locations)
  public system: System;

  public static fromJson(json: Location) {
    const location = new Location();
    location.symbol = json.symbol;
    location.name = json.name;
    location.type = json.type;
    location.allowsConstruction = json.allowsConstruction;
    location.traits = json.traits;
    location.x = json.x;
    location.y = json.y;
    return location;
  }
}
