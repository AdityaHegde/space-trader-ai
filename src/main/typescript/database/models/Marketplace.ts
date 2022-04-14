export class Marketplace {
  public symbol: string;
  public quantityAvailable: number;
  public pricePerUnit: number;
  public purchasePricePerUnit: number;
  public sellPricePerUnit: number;
  public spread: number;
  public volumePerUnit: number;

  public static fromJson(json: Marketplace) {
    const marketplace = new Marketplace();
    marketplace.symbol = json.symbol;
    marketplace.quantityAvailable = json.quantityAvailable;
    marketplace.pricePerUnit = json.pricePerUnit;
    marketplace.purchasePricePerUnit = json.purchasePricePerUnit;
    marketplace.sellPricePerUnit = json.sellPricePerUnit;
    marketplace.spread = json.spread;
    marketplace.volumePerUnit = json.volumePerUnit;
    return marketplace;
  }
}
