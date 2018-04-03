import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Debounce } from '@decorators/common';
import { Observable } from 'rxjs/Observable';
import { _finally } from 'rxjs/operator/finally';

import { QUEUE_SERVICE } from './token';
import { QueueService } from './queue.service';

@Injectable()
export class QueueInterceptor implements HttpInterceptor {

  /**
   * Number of pending requests
   */
  private pending = 0;

  /**
   * Flag, that indicates whether queue is started or not
   */
  private queueStarted = false;

  constructor(
    @Inject(QUEUE_SERVICE) private queueService: QueueService
  ) { }

  public intercept(req: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    this.startQueue();

    this.pending += 1;

    return _finally.call(delegate.handle(req), () => this.decrease());
  }

  /**
   * Publish event, that queue just started
   */
  private startQueue(): void {
    if (this.queueStarted === false) {
      this.queueStarted = true;

      this.queueService.queueStarted();
    }
  }

  /**
   * Publish event, that queue just started.
   * Debounced, just to be sure, that following request won't trigger any side effects.
   */
  @Debounce(300)
  private finishQueue(): void {
    if (this.pending === 0) {
      this.queueStarted = false;

      this.queueService.queueFinished();
    }
  }

  /**
   * Decrease counter
   */
  private decrease() {
    this.pending -= 1;

    this.finishQueue();
  }

}
