import {Column, Entity, PrimaryColumn} from "typeorm";
import {Cooldown} from "../types/Cooldown";
import { Navigation } from "../types/Navigation";
import { hasExpired, hasTimeElapsed } from "@commons/dateUtils";

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

  public surveyCooldown: Cooldown;
  public extractCooldown: Cooldown;
  public navigation: Navigation;

  public canSurvey(): boolean {
    if (this.surveyCooldown) {
      if (hasExpired(this.surveyCooldown.expiration)) {
        this.surveyCooldown = undefined;
        return true;
      }
      return false;
    }
    return true;
  }
  public canExtract(): boolean {
    if (this.extractCooldown) {
      if (hasExpired(this.extractCooldown.expiration)) {
        this.extractCooldown = undefined;
        return true;
      }
      return false;
    }
    return true;
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

  public getUsedCargo(): number {
    return this.cargo.reduce(
      (usedCargo, cargo) => usedCargo + cargo.units,
      0,
    );
  }
  public isFull(): boolean {
    return this.getUsedCargo() >= this.stats.cargoLimit;
  }
  public isEmpty(): boolean {
    return this.getUsedCargo() === 0;
  }
  public getCargo(tradeSymbol: string): [number, Cargo] {
    const idx = this.cargo.findIndex(cargo =>
      cargo.tradeSymbol === tradeSymbol);
    if (idx === -1) return [-1, undefined];
    return [idx, this.cargo[idx]];
  }
  public addCargo(addedCargo: Cargo) {
    const [,existing] = this.getCargo(addedCargo.tradeSymbol);
    if (existing) existing.units += addedCargo.units;
    else this.cargo.push(addedCargo);
  }
  public removeCargo(removedCargo: Cargo) {
    const [idx, existing] = this.getCargo(removedCargo.tradeSymbol);
    if (existing.units === removedCargo.units) {
      this.cargo.splice(idx, 1);
    } else {
      existing.units -= removedCargo.units;
    }
  }
}
