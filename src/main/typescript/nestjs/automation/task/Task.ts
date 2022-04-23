import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { AutomationEntity } from "../automation.entity";

export abstract class Task {
  public skip(ship: ShipEntity, automation: AutomationEntity): boolean {
    return false;
  }

  public abstract isDone(ship: ShipEntity, automation: AutomationEntity): boolean;

  public start(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    return Promise.resolve();
  }

  public hasTarget(ship: ShipEntity, automation: AutomationEntity): boolean {
    return !!automation.target;
  }

  public acquireTarget(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    return Promise.resolve();
  }

  public abstract doTask(ship: ShipEntity, automation: AutomationEntity): Promise<void>;

  public end(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    return Promise.resolve();
  }
}
