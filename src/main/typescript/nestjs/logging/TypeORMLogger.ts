import { Logger } from "typeorm";
import { createLogger, format, transports } from "winston";
import { LOG_LEVEL } from "@commons/constants";

const { combine, printf, timestamp } = format;
const TimestampLabelFormat = printf(({ message, timestamp }) => {
  return `${timestamp} ${message}`;
});

export class TypeORMLogger implements Logger {
  private readonly logger = createLogger({
    level: LOG_LEVEL,
    format: combine(
      timestamp(),
      TimestampLabelFormat,
    ),
    transports: [new transports.File({ filename: "log/typeorm.log" })],
  });

  public log(level: "log" | "info" | "warn", message: any): any {
    this.logger[level](message);
  }

  public logMigration(message: string): any {
    this.logger.debug(message);
  }

  public logQuery(query: string, parameters?: any[]): any {
    this.logger.debug(TypeORMLogger.getQueryLog(query, parameters));
  }

  public logQueryError(error: string | Error, query: string, parameters?: any[]): any {
    this.logger.error(`${error} ${TypeORMLogger.getQueryLog(query, parameters)}`);
  }

  public logQuerySlow(time: number, query: string, parameters?: any[]): any {
    this.logger.warn(`SLOW:[${time}] ${TypeORMLogger.getQueryLog(query, parameters)}`);
  }

  public logSchemaBuild(message: string): any {
    this.logger.debug(message);
  }

  private static getQueryLog(query: string, parameters?: any[]): string {
    return `QUERY=${query} -- PARAMS=${JSON.stringify(parameters)}`;
  }
}
