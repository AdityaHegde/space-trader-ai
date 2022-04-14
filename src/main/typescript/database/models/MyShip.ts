import {Column, Entity, PrimaryColumn} from "typeorm";
import {Cargo} from "./Cargo";
import {ShipBase} from "./ShipBase";

@Entity()
export class MyShip extends ShipBase {
  @PrimaryColumn()
  public id: string;

  public location: string;

  public spaceAvailable: number;

  public x: number;

  public y: number;

  public cargo: Array<Cargo>;

  public updateCargo(json: MyShip) {
    this.spaceAvailable = json.spaceAvailable;
    const newCargo = new Array<Cargo>();
    json.cargo.forEach((jsonCargo) => {
      const existing = this.cargo
        .find(cargo => cargo.good === jsonCargo.good);
      if (existing) {
        existing.quantity = jsonCargo.quantity;
        existing.totalVolume = jsonCargo.totalVolume;
        newCargo.push(existing);
      } else {
        newCargo.push(Cargo.fromJson(jsonCargo));
      }
    });
    this.cargo = json.cargo.map(Cargo.fromJson);
  }

  public static fromJson(json: MyShip) {
    const myShip = new MyShip();
    myShip.id = json.id;
    myShip.type = json.type;
    myShip.class = json.class;
    myShip.manufacturer = json.manufacturer;
    myShip.maxCargo = json.maxCargo;
    myShip.speed = json.speed;
    myShip.loadingSpeed = json.loadingSpeed;
    myShip.location = json.location;
    myShip.spaceAvailable = json.spaceAvailable;
    myShip.x = json.x;
    myShip.y = json.y;
    myShip.cargo = json.cargo.map(Cargo.fromJson);
    return myShip;
  }
}
