import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class SurveyEntity {
  @PrimaryColumn()
  signature: string;
  @Column()
  location: string;
  @Column("text", {array: true})
  deposits: Array<string>;
  @Column()
  expiration: string;
}
