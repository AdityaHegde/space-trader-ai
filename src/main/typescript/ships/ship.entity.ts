import {Column, Entity, PrimaryColumn} from "typeorm";
import {Cooldown} from "./Cooldown";

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
  public cargo: Array<{
    tradeSymbol: string;
    units: number;
  }>;

  @Column()
  public location: string;
  @Column()
  public status: string;

  public surveyCooldown: Cooldown;
  public extractCooldown: Cooldown;

  public getUsedCargo(): number {
    return this.cargo.reduce(
      (usedCargo, cargo) => usedCargo + cargo.units,
      0,
    );
  }
}
