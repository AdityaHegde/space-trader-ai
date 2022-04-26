import { Task } from "@nestjs-server/automation/task/Task";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { AutomationEntity } from "@nestjs-server/automation/automation.entity";
import { ExtractionService } from "@space-trader-api/extraction/extraction.service";
import { TradeService } from "@space-trader-api/trade/trade.service";
import { parseLocation } from "@commons/parseLocation";
import { hasExpired } from "@commons/dateUtils";
import { SurveyEntity } from "@space-trader-api/extraction/survey.entity";
import { getMaxInArray } from "@commons/arrayUtils";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { WaypointService } from "@space-trader-api/systems/waypoint.service";
import { Injectable } from "@nestjs/common";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";

@Injectable()
export class ExtractTask extends Task {
  private logger = new ShipLogger("ExtractTask");

  constructor(
    private tradeService: TradeService,
    private extractionService: ExtractionService,
    private waypointService: WaypointService,
    private shipService: ShipService,
  ) {
    super();
  }

  public skip(ship: ShipEntity): boolean {
    return !ship.canExtract();
  }

  public isDone(ship: ShipEntity): boolean {
    return ship.isCargoFull();
  }

  public async acquireTarget(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    const {system} = parseLocation(ship.location);
    automation.target = (await this.waypointService.findAsteroidInSystem(system))?.symbol;
  }

  public async doTask(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    if (!automation.survey || hasExpired(automation.survey.expiration)) {
      automation.survey = await this.selectSurvey(ship);
    }
    this.logger.shipCargoLog(ship, "Extracting with:" +
      `${automation.survey ? automation.survey.deposits.join(",") : "No Survey"}`);
    const {system} = parseLocation(ship.location);
    const {importPrices} = await this.tradeService.getPricesInSystem(system);

    const extraction = await this.extractionService.extract(ship, automation.survey);
    this.logger.shipLog(ship,
      `Extracted Cargo=${extraction.yield.tradeSymbol}:${extraction.yield.units}`);
    if (!(extraction.yield.tradeSymbol in importPrices)) {
      // get rid of cargo that cannot be sold in system
      await this.shipService.jettisonCargo(ship, extraction.yield);
    } else {
      ship.addCargo(extraction.yield);
    }
  }

  private async selectSurvey(ship: ShipEntity): Promise<SurveyEntity> {
    const {system} = parseLocation(ship.location);
    const {importPrices} = await this.tradeService.getPricesInSystem(system);

    const surveys = (await this.extractionService.survey(ship))
      .filter(survey => !hasExpired(survey.expiration));
    const [survey] = getMaxInArray(surveys,
        survey => survey.getAverageValue(importPrices));

    if (!survey) return undefined;
    return {
      signature: survey.signature,
      deposits: survey.deposits,
      expiration: survey.expiration,
    } as SurveyEntity;
  }
}
