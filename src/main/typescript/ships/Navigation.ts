export interface Navigation {
  shipSymbol: string;
  departure: string;
  destination: string;
  durationRemaining: number;
  arrivedAt: string | null;
}

export interface NavigateResponse {
  fuelCost: number;
  navigation: Navigation;
}
