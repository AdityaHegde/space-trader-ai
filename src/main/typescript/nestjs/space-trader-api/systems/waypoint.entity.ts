import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {SystemEntity} from "./system.entity";
import {BaseEntity} from "../../BaseEntity";

@Entity()
export class WaypointEntity extends BaseEntity {
  @PrimaryColumn()
  public symbol: string;
  @Column()
  public type: string;
  @ManyToOne(
    () => SystemEntity,
    (system) => system.waypoints,
    {cascade: true}
  )
  public system: SystemEntity;
  @Column()
  public x: number;
  @Column()
  public y: number;
  @Column("text", {array: true})
  public orbitals: Array<string>;
  @Column("text", {nullable: true})
  public faction!: string | null;
  @Column("text", {array: true})
  public features: Array<string>;
  @Column("text", {array: true})
  public traits: Array<string>;
  @Column()
  public charted: boolean;
  @Column("text", {nullable: true})
  public chartedBy!: string | null;
}
