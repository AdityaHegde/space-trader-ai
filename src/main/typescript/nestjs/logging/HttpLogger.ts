import { AppLogger } from "@nestjs-server/logging/AppLogger";
import { AxiosResponse, Method } from "axios";
import { createLogger, format, transports } from "winston";

const { combine, printf, timestamp } = format;
const TimestampLabelFormat = printf(({ message, timestamp }) => {
  return `${timestamp} ${message}`;
});

export class HttpLogger extends AppLogger {
  constructor() {
    super(null, createLogger({
      level: "debug",
      format: combine(
        timestamp(),
        TimestampLabelFormat,
      ),
      transports: [new transports.File({ filename: "log/http.log" })],
    }));
  }

  public httpRequest(method: Method, url: string, data?: any) {
    this.debug(`[${method}] ${url} ${data ? JSON.stringify(data) : ""}`);
  }

  public httpResponse(resp: AxiosResponse) {
    const log = `[${resp.status}] ${JSON.stringify(resp.data)}`;
    if (resp.status >= 400) {
      this.error(log);
    } else {
      this.debug(log);
    }
  }
}
