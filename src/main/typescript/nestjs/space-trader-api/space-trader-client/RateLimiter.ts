import {asyncWait} from "../../../commons/asyncWait";
import {Injectable, Scope} from "@nestjs/common";

@Injectable({scope: Scope.TRANSIENT})
export class RateLimiter {
  // calls per second
  private rate: number;
  private timeDiff: number;

  private previousTime: number;

  private retryAfter: number;

  public setLimit(rate: number) {
    this.rate = rate;
    this.timeDiff = 1000 / rate;
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
      await asyncWait(this.timeDiff - (curTime - this.previousTime));
    }

    this.previousTime = Date.now();
  }
}
