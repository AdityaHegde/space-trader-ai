import {Column, Entity, PrimaryColumn} from "typeorm";
import {BaseEntity} from "../../BaseEntity";

@Entity()
export class FactionEntity extends BaseEntity {
  @PrimaryColumn()
  public symbol: string;
  @Column()
  public name: string;
  @Column()
  public description: string;
  @Column()
  public headquarters: string;
  @Column("text", {array: true})
  public traits: Array<string>;
}
