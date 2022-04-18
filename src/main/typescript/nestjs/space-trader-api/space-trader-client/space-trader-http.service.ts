import axios, {AxiosResponse} from "axios";
import {RateLimiter} from "./RateLimiter";
import {Injectable} from "@nestjs/common";
import {SpaceTraderConfig} from "../../config/SpaceTraderConfig";

type AxiosCall = (page?: number) => Promise<AxiosResponse>;
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

  public constructor(
    private readonly config: SpaceTraderConfig,
    private readonly rateLimiter: RateLimiter,
  ) {
    this.urlBase = config.apiBase;
    this.authToken = config.authToken;
    this.rateLimiter.setLimit(2);
  }

  public async get<Rec>(url: string): Promise<Rec> {
    return this.sendPaginatedRequest<Rec>((page?: number) =>
      axios.get(this.getFullUrl(url, page), { headers: this.getHeaders(),  }));
  }

  public async post<Rec>(url: string, data: Record<string, any> = {}): Promise<Rec> {
    const resp = await this.sendRequest<Rec>(() =>
      axios.post(this.getFullUrl(url), data, { headers: this.getHeaders() }));
    return resp.data;
  }

  private async sendPaginatedRequest<Rec>(axiosCall: AxiosCall): Promise<Rec> {
    const respArrayJson = new Array<Rec>();
    let isDone = false;
    let page;

    while (!isDone) {
      const respJson = await this.sendRequest<Rec>(axiosCall, page);
      if (!respJson.meta) return respJson.data;
      if (respJson.meta.page * respJson.meta.limit >= respJson.meta.total) {
        isDone = true;
      } else {
        page = respJson.meta.page + 1;
      }
      respArrayJson.push(...(respJson.data as any));
    }

    return respArrayJson as any;
  }

  private async sendRequest<Rec>(axiosCall: AxiosCall, page?: number): Promise<SpaceTradersResponse<Rec>> {
    await this.rateLimiter.limit();

    let resp: AxiosResponse;
    try {
      resp = await axiosCall(page);
    } catch (err) {
      resp = err.response;
    }
    if (resp.status === 429) {
      this.rateLimiter.setRetryAfter(Number(resp.headers["retry-after"] ?? "5") * 1000);
      return this.sendRequest(axiosCall);
    }
    if (resp.status >= 400) {
      throw new Error(resp.data?.error?.message ?? resp.statusText);
    }

    return resp.data;
  }

  private getFullUrl(url: string, page?: number) {
    const pageArg = page ? `${url.includes("?") ? "&" : "/?"}page=${page}` : "";
    return `${this.urlBase}${url}${pageArg}`;
  }

  private getHeaders() {
    return { Authorization: `Bearer ${this.authToken}` };
  }
}
