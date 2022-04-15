import {Injectable} from "@nestjs/common";

@Injectable()
export class SpaceTraderConfig {
  public apiBase = "https://v2-0-0.alpha.spacetraders.io";
  public callSign = process.env.SPACE_TRADER_NAME;
  public authToken = process.env.SPACE_TRADER_TOKEN;
}
