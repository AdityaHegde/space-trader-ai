import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {SystemService} from "./systems/system.service";
import {WaypointService} from "./systems/waypoint.service";
import {ShipService} from "./ships/ship.service";
import {ShipNavigationService} from "./ships/ship-navigation.service";
import {getCLIResponse} from "./utils/getCLIResponse";
import {parseLocation} from "./utils/parseLocation";
import {getDistance} from "./utils/pointUtils";
import {asyncWait} from "./utils/asyncWait";
import {ExtractionService} from "./ships/extraction.service";
import {getTimeRemaining} from "./utils/dateUtils";

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const waypointService = app.get(WaypointService);
  const shipService = app.get(ShipService);
  const shipNavigationService = app.get(ShipNavigationService);
  const extractionService = app.get(ExtractionService);

  const ships = await shipService.getAll();
  ships.forEach((ship, index) => console.log(`[${index}] ${ship.symbol} ${ship.location}`));
  const ship = await shipService.update(ships[Number(await getCLIResponse("Select a ship: "))].symbol);
  const {system} = parseLocation(ship.location);
  const shipLocation = await waypointService.get(system, ship.location);

  console.log("\n");
  const waypoints = await waypointService.getAll(system);
  waypoints.forEach((waypoint, index) => {
    console.log(`[${index}] [${waypoint.type}] ${waypoint.symbol} (${waypoint.x}, ${waypoint.y}) ${getDistance(shipLocation, waypoint)}`);
    console.log(`${waypoint.traits.join(",")} ${waypoint.features.join(",")}`)
  });
  const target = waypoints[Number(await getCLIResponse("Select a target: "))];

  if (target.symbol !== shipLocation.symbol) {
    const moveResp = await getCLIResponse(`Move to target? ${target.symbol} - ${getDistance(shipLocation, target)}? Y?`);
    if (moveResp !== "Y") return;
    const navigate = await shipNavigationService.navigate(ship.symbol, target.symbol);
    console.log(`Consumed ${navigate.fuelCost}. Reaching in ${navigate.navigation.durationRemaining}s`);
    await asyncWait(navigate.navigation.durationRemaining * 1000 + 2500);
  } else {
    await extractionService.surveyCooldown(ship);
    console.log("\n");
    const surveys = await extractionService.survey(ship);
    surveys.forEach((survey, index) =>
      console.log(`[${index}] ${survey.signature} ${getTimeRemaining(survey.expiration)} ${survey.deposits.join(",")}`));
    console.log(`Survey cooldown: ${ship.surveyCooldown.duration}`);
    const survey = surveys[Number(await getCLIResponse("Select a survey: "))];

    let usedCargo = ship.getUsedCargo();
    while (usedCargo < ship.stats.cargoLimit) {
      const extraction = await extractionService.extract(ship, survey);
      console.log(`Extracted ${extraction.yield.units} ${extraction.yield.tradeSymbol}`);
      usedCargo += extraction.yield.units;
      console.log(`On cooldown for ${ship.extractCooldown.duration}`);
      await asyncWait(ship.extractCooldown.duration * 1000 + 2500);
    }
  }

})();
