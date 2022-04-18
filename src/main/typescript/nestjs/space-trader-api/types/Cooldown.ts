export interface Cooldown {
  duration: number;
  expiration: string;
}

export interface JumpResponse {
  jump: {
    shipSymbol: string;
    destination: string;
  },
  cooldown: Cooldown;
}
