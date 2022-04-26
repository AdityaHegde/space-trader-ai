import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import {AppModule} from "./app.module";
import { AppLogger } from "@nestjs-server/logging/AppLogger";
import { AutomationService } from "@nestjs-server/automation/automation.service";
import { AUTOMATION_INTERVAL } from "@commons/constants";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(AppLogger));
  await app.listen(3000);

  setTimeout(async () => {
    const automation = app.get(AutomationService);
    await automation.runAutomation();
  }, AUTOMATION_INTERVAL * 2);
}
bootstrap();
