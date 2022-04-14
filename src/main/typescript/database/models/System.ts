import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {Location} from "./Location";

@Entity()
export class System {
  @PrimaryColumn()
  public symbol: string;

  @Column()
  public name: string;

  @OneToMany(() => Location, location => location.system)
  public locations: Array<Location>;
}
