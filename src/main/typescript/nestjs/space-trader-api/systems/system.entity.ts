import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {WaypointEntity} from "./waypoint.entity";
import {BaseEntity} from "../../BaseEntity";

@Entity()
export class SystemEntity extends BaseEntity {
  @PrimaryColumn()
  public symbol: string;
  @Column()
  public sector: string;
  @Column()
  public type: string;
  @Column()
  public x: number;
  @Column()
  public y: number;
  @OneToMany(
    () => WaypointEntity,
    (waypoint) => waypoint.system,
  )
  public waypoints: Array<WaypointEntity>;
  @Column("text", {array: true})
  public factions: Array<string>;
  @Column()
  public charted: boolean;
  @Column("text", {nullable: true})
  public chartedBy!: string | null;
}
