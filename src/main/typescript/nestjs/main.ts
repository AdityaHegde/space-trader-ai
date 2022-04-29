import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import {AppModule} from "./app.module";
import { AppLogger } from "@nestjs-server/logging/AppLogger";
import { AutomationService } from "@nestjs-server/automation/automation.service";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(AppLogger));
  await app.listen(3000);
}
bootstrap();
