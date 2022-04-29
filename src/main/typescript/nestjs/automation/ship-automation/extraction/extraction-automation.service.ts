import { Injectable } from "@nestjs/common";
import { TradeService } from "@space-trader-api/trade/trade.service";
import { ExtractionService } from "@space-trader-api/extraction/extraction.service";
import { WaypointService } from "@space-trader-api/systems/waypoint.service";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { parseLocation } from "@commons/parseLocation";
import { SurveyEntity } from "@space-trader-api/extraction/survey.entity";
import { CooldownService } from "@space-trader-api/cooldown/cooldown.service";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";

@Injectable()
export class ExtractionAutomationService {
  private readonly logger = new ShipLogger("Extraction");

  public constructor(
    private readonly tradeService: TradeService,
    private readonly extractionService: ExtractionService,
    private readonly waypointService: WaypointService,
    private readonly shipService: ShipService,
    private readonly cooldownService: CooldownService,
  ) {}

  public async getTarget(ship: ShipEntity): Promise<string> {
    const {system} = parseLocation(ship.location);
    return (await this.waypointService.findAsteroidInSystem(system))?.symbol;
  }

  public async extract(ship: ShipEntity): Promise<void> {
    // survey if off cooldown
    await this.survey(ship);
    const survey = await this.getSurvey(ship);
    this.logger.shipCargoLog(ship, "Extracting with:" +
      `${survey ? survey.deposits.join(",") : "No Survey"}`);

    const {system} = parseLocation(ship.location);
    const {importPrices} = await this.tradeService.getPricesInSystem(system);

    const extraction = await this.extractionService.extract(ship, survey);
    this.logger.shipLog(ship,
      `Extracted Cargo=${extraction.yield.tradeSymbol}:${extraction.yield.units}`);
    if (!(extraction.yield.tradeSymbol in importPrices)) {
      // get rid of cargo that cannot be sold in system
      await this.shipService.jettisonCargo(ship, extraction.yield);
    } else {
      ship.addCargo(extraction.yield);
    }
  }

  public async survey(ship: ShipEntity): Promise<void> {
    await this.cooldownService.getSurveyCooldown(ship);
    await this.extractionService.survey(ship);
  }

  private async getSurvey(ship: ShipEntity): Promise<SurveyEntity> {
    const [survey] = await this.extractionService.getTopSurvey(ship.location);

    if (!survey) return undefined;
    return {
      signature: survey.signature,
      deposits: survey.deposits,
      expiration: survey.expiration,
    } as SurveyEntity;
  }
}
