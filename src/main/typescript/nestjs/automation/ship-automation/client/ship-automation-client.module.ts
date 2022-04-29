import { Module } from "@nestjs/common";
import { ShipAutomationClient } from "@nestjs-server/automation/ship-automation/client/ShipAutomationClient";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AutomationEntity } from "@nestjs-server/automation/ship-automation/client/automation.entity";
import { ClientsModule } from "@nestjs/microservices";
import { KafkaClientConfig } from "@nestjs-server/automation/ship-automation/client/KafkaClientConfig";

@Module({
  imports: [
    TypeOrmModule.forFeature([AutomationEntity]),
    ClientsModule.register([
      {
        name: "SHIP_AUTOMATION_CLIENT",
        ...KafkaClientConfig,
      },
    ]),
  ],
  providers: [
    ShipAutomationClient
  ],
  exports: [
    TypeOrmModule,
    ShipAutomationClient,
  ]
})
export class ShipAutomationClientModule {}
