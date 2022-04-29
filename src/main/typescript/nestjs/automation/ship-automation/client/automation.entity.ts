import { Column, Entity, PrimaryColumn } from "typeorm";
import { FlightPathEntry } from "@nestjs-server/automation/ship-automation/navigation/navigation-automation.service";

export enum AutomationTask {
  Schedule = "schedule",
  Navigate = "navigate",
  Extract = "extract",
  Sell = "sell",
  Buy = "buy",
}

@Entity()
export class AutomationEntity {
  @PrimaryColumn()
  public shipSymbol: string;
  @Column("text", {nullable: true})
  public target: string;
  @Column("json", {nullable: true})
  public flightPath: Array<FlightPathEntry>;
  @Column("text", {nullable: true})
  public task: AutomationTask;
  @Column("text", {nullable: true})
  public nextTask: AutomationTask;
  @Column("timestamptz", {nullable: true})
  public runAfter: string;
  @Column("boolean")
  public pulled: boolean;

  public toString() {
    return JSON.stringify({
      shipSymbol: this.shipSymbol,
      target: this.target,
      flightPath: this.flightPath,
      task: this.task,
      nextTask: this.nextTask,
      runAfter: this.runAfter,
      pulled: this.pulled,
    });
  }
}
