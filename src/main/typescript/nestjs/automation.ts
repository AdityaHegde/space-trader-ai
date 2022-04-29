import { NestFactory } from "@nestjs/core";
import { AppModule } from "@nestjs-server/app.module";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AutomationService } from "@nestjs-server/automation/automation.service";
import { AppLogger } from "@nestjs-server/logging/AppLogger";
import { KafkaClientConfig } from "@nestjs-server/automation/ship-automation/client/KafkaClientConfig";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    bufferLogs: true,
    ...KafkaClientConfig,
  });
  app.useLogger(app.get(AppLogger));
  await app.listen();
  const automationService = app.get(AutomationService);
  await automationService.initShips();
}
bootstrap();
