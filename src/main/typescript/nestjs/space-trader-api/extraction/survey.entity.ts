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

  public getAverageValue(values: Record<string, number>) {
    return this.deposits.reduce(
      (sum, deposit) => sum + (values[deposit] ?? 0), 0
    ) / this.deposits.length;
  }
}
