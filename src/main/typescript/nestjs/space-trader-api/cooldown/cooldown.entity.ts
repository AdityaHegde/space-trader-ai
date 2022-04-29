import { Column, Entity, PrimaryColumn } from "typeorm";

export enum CooldownType {
  Jump = "Jump",
  Extract = "Extract",
  Survey = "Survey",
}

@Entity()
export class CooldownEntity {
  @PrimaryColumn()
  public symbol: string;
  @PrimaryColumn()
  public type: CooldownType;
  @Column("timestamptz")
  public finishAt: string;
}
