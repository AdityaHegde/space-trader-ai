import {Column, Entity, PrimaryColumn} from "typeorm";
import {GoodType} from "./GoodType";

@Entity()
export class Good {
  @PrimaryColumn()
  public symbol: GoodType;

  @Column()
  public name: string;

  @Column()
  public volumePerUnit: number;

  public static fromJson(json: Good) {
    const good = new Good();
    good.symbol = json.symbol;
    good.name = json.name;
    good.volumePerUnit = json.volumePerUnit;
    return good;
  }
}
