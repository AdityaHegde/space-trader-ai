import {BaseEntity} from "../../BaseEntity";
import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class TradeEntity extends BaseEntity {
  @PrimaryColumn()
  public waypointSymbol: string;
  @PrimaryColumn()
  public system: string;
  @PrimaryColumn()
  public tradeSymbol: string;
  @PrimaryColumn()
  public export: boolean;
  @Column()
  public price: number;
  @Column()
  public tariff: number;
}
