import { AppLogger } from "@nestjs-server/logging/AppLogger";
import { AxiosResponse } from "axios";
import { createLogger, format, transports } from "winston";
import { LOG_LEVEL } from "@commons/constants";
import type { AxiosCall } from "@space-trader-api/space-trader-client/space-trader-http.service";

const { combine, printf, timestamp } = format;
const TimestampLabelFormat = printf(({ message, timestamp }) => {
  return `${timestamp} ${message}`;
});

export class HttpLogger extends AppLogger {
  constructor() {
    super(null, createLogger({
      level: LOG_LEVEL,
      format: combine(
        timestamp(),
        TimestampLabelFormat,
      ),
      transports: [new transports.File({ filename: "log/http.log" })],
    }));
  }

  public httpRequest(axiosCall: AxiosCall) {
    this.debug(`[${axiosCall.method}] ${axiosCall.url} ` +
      `${axiosCall.data ? JSON.stringify(axiosCall.data) : ""}`);
  }

  public httpResponse(axiosCall: AxiosCall, resp: AxiosResponse) {
    if (!resp) {
      return;
    }
    const log = `[${axiosCall.method}] ${axiosCall.url} ` +
      `[${resp.status}] ${JSON.stringify(resp.data)}`;
    if (resp.status >= 400) {
      this.error(log);
    } else {
      this.debug(log);
    }
  }
}
