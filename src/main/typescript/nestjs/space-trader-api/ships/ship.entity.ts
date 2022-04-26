import {Column, Entity, PrimaryColumn} from "typeorm";
import { Navigation } from "../types/Navigation";
import { getTimeRemaining, hasTimeElapsed } from "@commons/dateUtils";
import { ShipCooldown } from "@space-trader-api/ships/ShipCooldown";
import { ShipCargo } from "@space-trader-api/ships/ShipCargo";

export interface Cargo {
  tradeSymbol: string;
  units: number;
}

@Entity()
export class ShipEntity {
  @PrimaryColumn()
  public symbol: string;
  @Column("json")
  public registration: {
    factionSymbol: string;
    agentSymbol: string;
    fee: number;
    role: string;
  };

  @Column()
  public frame: string;
  @Column()
  public reactor: string;
  @Column()
  public engine: string;
  @Column("text", {array: true})
  public modules: Array<string>;
  @Column("text", {array: true})
  public mounts: Array<string>;

  @Column("json")
  public integrity: {
    frame: number;
    reactor: number;
    engine: number;
  };
  @Column("json")
  public stats: {
    fuelTank: number;
    cargoLimit: number;
    jumpRange: number;
  };
  @Column()
  public fuel: number;
  @Column("json")
  public cargo: Array<Cargo>;

  @Column()
  public location: string;
  @Column()
  public status: string;

  public surveyCooldown = new ShipCooldown();
  public extractCooldown = new ShipCooldown();
  public navigation: Navigation;
  public jumpCooldown = new ShipCooldown();

  public shipCargo = new ShipCargo(this);

  public canSurvey(): boolean {
    return this.surveyCooldown.finishedCooldown();
  }
  public canExtract(): boolean {
    return this.extractCooldown.finishedCooldown();
  }
  public hasNavigated(): boolean {
    if (this.navigation) {
      if (hasTimeElapsed(this.navigation.departedAt, this.navigation.durationRemaining)) {
        this.navigation = undefined;
        return true;
      }
      return false;
    }
    return true;
  }
  public canJump(): boolean {
    return this.jumpCooldown.finishedCooldown();
  }

  public isCargoFull(): boolean {
    return this.shipCargo.isFull();
  }
  public isCargoEmpty(): boolean {
    return this.shipCargo.isEmpty();
  }
  public addCargo(addedCargo: Cargo) {
    this.shipCargo.addCargo(addedCargo);
  }
  public removeCargo(removedCargo: Cargo) {
    this.shipCargo.removeCargo(removedCargo);
  }
}
