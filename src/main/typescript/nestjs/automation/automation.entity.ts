import { Column, Entity, PrimaryColumn } from "typeorm";
import { SurveyEntity } from "@space-trader-api/extraction/survey.entity";

export enum AutomationTask {
  Extract = "Extract",
  Buy = "Buy",
  Sell = "Sell",
}
export enum AutomationStatus {
  Travelling = "Travelling",
  Idle = "Idle",
}

@Entity()
export class AutomationEntity {
  @PrimaryColumn()
  public shipSymbol: string;

  @Column()
  public taskIndex: number;
  @Column("text", {array: true, nullable: true})
  public tasks: Array<AutomationTask>;
  public get task(): AutomationTask {
    return this.tasks?.[this.taskIndex];
  }
  public nextTask(): void {
    this.taskIndex = (this.taskIndex + 1) % this.tasks.length;
  }

  @Column("text", {nullable: true})
  public status: AutomationStatus;

  @Column("text", {array: true, nullable: true})
  public travelPath: Array<string>;

  @Column("json", {nullable: true})
  public survey: SurveyEntity;

  @Column("text", {nullable: true})
  public target: string;
}
