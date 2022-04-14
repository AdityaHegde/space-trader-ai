import axios, {AxiosResponse} from "axios";
import {RateLimiter} from "../utils/RateLimiter";

export class SpaceTraderHTTPClient {
  public constructor(private readonly urlBase: string,
                     private readonly authToken: string,
                     private readonly rateLimiter: RateLimiter) {}

  public async get(url: string) {
    return this.handleResponse(() =>
      axios.get(this.getFullUrl(url), { headers: this.getHeaders() }));
  }

  public async post(url: string, data: Record<string, any> = {}) {
    return this.handleResponse(() =>
      axios.post(this.getFullUrl(url), data, { headers: this.getHeaders() }));
  }

  private async handleResponse(axiosCall: () => Promise<AxiosResponse>) {
    await this.rateLimiter.limit();

    const resp = await axiosCall();
    if (resp.status === 429) {
      this.rateLimiter.setRetryAfter(Number(resp.headers["retry-after"] ?? "1") * 1000);
      return this.handleResponse(axiosCall);
    }
    if (resp.status >= 400) {
      throw new Error(resp.statusText ?? `${resp.status}`);
    }

    return resp.data;
  }

  private getFullUrl(url: string) {
    return `${this.urlBase}${url}`;
  }

  private getHeaders() {
    return { Authorization: `Bearer ${this.authToken}` };
  }
}
