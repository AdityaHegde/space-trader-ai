import axios, {AxiosResponse} from "axios";
import {RateLimiter} from "./RateLimiter";
import {Injectable} from "@nestjs/common";
import {SpaceTraderConfig} from "../../config/SpaceTraderConfig";
import { HttpLogger } from "@nestjs-server/logging/HttpLogger";

export interface AxiosCall {
  url: string;
  method: ("GET" | "POST");
  data?: any;
  page?: number;
}
export interface SpaceTradersResponse<Rec> {
  data: Rec;
  meta?: {
    total: number;
    page: number;
    limit: number;
  }
}

@Injectable()
export class SpaceTraderHttpService {
  private readonly urlBase: string;
  private readonly authToken: string;

  private readonly logger = new HttpLogger();

  public constructor(
    private readonly config: SpaceTraderConfig,
    private readonly rateLimiter: RateLimiter,
  ) {
    this.urlBase = config.apiBase;
    this.authToken = config.authToken;
    this.rateLimiter.setLimit(2);
  }

  public async get<Rec>(url: string): Promise<Rec> {
    return this.sendPaginatedRequest<Rec>({
      url, method: "GET",
    });
  }

  public async post<Rec>(url: string, data: Record<string, any> = {}): Promise<Rec> {
    const resp = await this.sendRequest<Rec>({
      url, method: "POST", data,
    });

    return resp.data;
  }

  private async sendPaginatedRequest<Rec>(axiosCall: AxiosCall): Promise<Rec> {
    const respArrayJson = new Array<Rec>();
    let isDone = false;

    while (!isDone) {
      const respJson = await this.sendRequest<Rec>(axiosCall);
      if (!respJson.meta) return respJson.data;
      if (respJson.meta.page * respJson.meta.limit >= respJson.meta.total) {
        isDone = true;
      } else {
        axiosCall.page = respJson.meta.page + 1;
      }
      respArrayJson.push(...(respJson.data as any));
    }

    return respArrayJson as any;
  }

  private async sendRequest<Rec>(axiosCall: AxiosCall): Promise<SpaceTradersResponse<Rec>> {
    await this.rateLimiter.limit();
    const resp = await this.makeAxiosCall(axiosCall);

    if (resp.status === 429) {
      this.rateLimiter.setRetryAfter(Number(resp.headers["retry-after"] ?? "5") * 1000);
      return this.sendRequest(axiosCall);
    }
    if (resp.status >= 400) {
      throw new Error(resp.data?.error?.message ?? resp.statusText);
    }

    return resp.data;
  }

  private async makeAxiosCall(axiosCall: AxiosCall): Promise<AxiosResponse> {
    let resp: AxiosResponse;
    try {
      this.logger.httpRequest(axiosCall);
      resp = await axios({
        url: this.getFullUrl(axiosCall.url, axiosCall.page),
        method: axiosCall.method,
        ...axiosCall.data ? {data: axiosCall.data} : {},
        headers: this.getHeaders(),
      });
    } catch (err) {
      resp = err.response;
    }
    this.logger.httpResponse(axiosCall, resp);
    return resp;
  }

  private getFullUrl(url: string, page?: number) {
    const pageArg = page ? `${url.includes("?") ? "&" : "/?"}page=${page}` : "";
    return `${this.urlBase}${url}${pageArg}`;
  }

  private getHeaders() {
    return { Authorization: `Bearer ${this.authToken}` };
  }
}
