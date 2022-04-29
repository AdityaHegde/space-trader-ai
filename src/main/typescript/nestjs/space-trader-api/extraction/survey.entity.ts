import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class SurveyEntity {
  @PrimaryColumn()
  public signature: string;
  @Column()
  public location: string;
  @Column("text", {array: true})
  public deposits: Array<string>;
  @Column("float8")
  public price: number;
  @Column("timestamptz")
  public expiration: string;
}
