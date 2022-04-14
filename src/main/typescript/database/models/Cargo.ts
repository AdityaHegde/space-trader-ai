import {GoodType} from "./GoodType";

export class Cargo {
  public good: GoodType;
  public quantity: number;
  public totalVolume: number;

  public static fromJson(json: Cargo) {
    const cargo = new Cargo();
    cargo.good = json.good;
    cargo.quantity = json.quantity;
    cargo.totalVolume = json.totalVolume;
    return json;
  }
}
