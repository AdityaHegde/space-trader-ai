import { Module } from "@nestjs/common";
import { AppLogger } from "@nestjs-server/logging/AppLogger";
import { HttpLogger } from "@nestjs-server/logging/HttpLogger";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";

const Loggers = [AppLogger, HttpLogger, ShipLogger];

@Module({
  providers: Loggers,
  exports: Loggers,
})
export class LoggerModule {}
