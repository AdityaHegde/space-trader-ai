import {ShipBase} from "./ShipBase";
import {Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Ship extends ShipBase {
  @PrimaryColumn()
  type: string;

  purchaseLocations: Array<{
    location: string;
    price: number;
    system: string;
  }>;
}
