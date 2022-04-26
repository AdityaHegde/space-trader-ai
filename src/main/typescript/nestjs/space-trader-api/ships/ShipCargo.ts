import type { Cargo, ShipEntity } from "@space-trader-api/ships/ship.entity";

export class ShipCargo {
  public constructor(private readonly ship: ShipEntity) {}

  public getUsedCargo(): number {
    return this.ship.cargo.reduce(
      (usedCargo, cargo) => usedCargo + cargo.units,
      0,
    );
  }

  public isFull(): boolean {
    return this.getUsedCargo() >= this.ship.stats.cargoLimit;
  }

  public isEmpty(): boolean {
    return this.getUsedCargo() === 0;
  }

  public getCargo(tradeSymbol: string): [number, Cargo] {
    const idx = this.ship.cargo.findIndex(cargo =>
      cargo.tradeSymbol === tradeSymbol);
    if (idx === -1) return [-1, undefined];
    return [idx, this.ship.cargo[idx]];
  }

  public addCargo(addedCargo: Cargo) {
    const [,existing] = this.getCargo(addedCargo.tradeSymbol);
    if (existing) existing.units += addedCargo.units;
    else this.ship.cargo.push(addedCargo);
  }

  public removeCargo(removedCargo: Cargo) {
    const [idx, existing] = this.getCargo(removedCargo.tradeSymbol);
    if (existing.units === removedCargo.units) {
      this.ship.cargo.splice(idx, 1);
    } else {
      existing.units -= removedCargo.units;
    }
  }
}
