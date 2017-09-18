import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import { Debounce } from '@decorators/common';
import { Observable } from 'rxjs/Observable';

import { QUEUE_SERVICE } from './token';
import { QueueService } from './queue.service';

@Injectable()
export class QueueInterceptor implements HttpInterceptor {

  /**
   * Number of pending requests
   *
   * @private
   */
  private pending = 0;

  /**
   * Flag, that indicates whether queue is started or not
   *
   * @private
   */
  private queueStarted = false;

  constructor(
    @Inject(QUEUE_SERVICE) private queueService: QueueService
  ) { }

  public intercept(req: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    if (this.queueStarted === false) {
      this.startQueue();
    }

    this.pending += 1;

    return delegate
      .handle(req)
      .do((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          this.decrease();
        }
      })
      .catch((err: any) => {
        this.decrease();

        return Observable.throw(err);
      });
  }

  /**
   * Publish event, that queue just started
   *
   * @private
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
   *
   * @private
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
