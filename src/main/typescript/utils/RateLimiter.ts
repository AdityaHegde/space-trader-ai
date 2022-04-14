import {asyncWait} from "./asyncWait";

export class RateLimiter {
  // calls per second
  private rate: number;
  private timeDiff: number;

  private previousTime: number;

  private retryAfter: number;

  public constructor(rate = 1) {
    this.setLimit(rate);
  }

  public setLimit(rate: number) {
    this.rate = rate;
    this.timeDiff = 1 / rate;
  }

  public setRetryAfter(retryAfter: number) {
    this.retryAfter = retryAfter;
  }

  public async limit() {
    const curTime = Date.now();

    if (this.retryAfter) {
      await asyncWait(this.retryAfter);
      this.retryAfter = 0;
    } else if (curTime - this.previousTime < this.timeDiff) {
      await asyncWait(curTime - this.previousTime - this.timeDiff);
    }

    this.previousTime = Date.now();
  }
}
