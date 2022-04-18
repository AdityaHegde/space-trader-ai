import {Injectable} from "@nestjs/common";
import {SPACE_TRADER_API_SERVER} from "../../commons/constants";

@Injectable()
export class SpaceTraderConfig {
  public apiBase = SPACE_TRADER_API_SERVER;
  public callSign = process.env.SPACE_TRADER_NAME;
  public authToken = process.env.SPACE_TRADER_TOKEN;
}
