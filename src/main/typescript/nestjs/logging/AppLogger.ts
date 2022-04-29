import { ConsoleLogger } from "@nestjs/common";
import { createLogger, format, Logger as WinstonLogger, transports } from "winston";
import { LOG_LEVEL } from "@commons/constants";

const { combine, label, printf, timestamp } = format;
const TimestampLabelFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] [${label}]: ${message}`;
});

export class AppLogger extends ConsoleLogger {
  protected readonly logger: WinstonLogger;

  constructor(loggerLabel?: string, logger?: WinstonLogger) {
    super();
    this.logger = logger ?? createLogger({
      level: LOG_LEVEL,
      format: combine(
        label({ label: loggerLabel ?? "Nest" }),
        timestamp(),
        TimestampLabelFormat,
      ),
      transports: [new transports.Console()],
    });
  }

  public debug(message: any) {
    this.logger.debug(message);
  }
  public warn(message: any) {
    this.logger.warn(message);
  }
  public log(message: any) {
    this.logger.debug(message);
  }
  public verbose(message: any) {
    this.logger.verbose(message);
  }
  public error(message: any, stack?: string) {
    this.logger.error(`${message}${stack ? "\n" + stack : ""}`);
  }
}
