import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import { Debounce } from '@decorators/common';
import { Observable } from 'rxjs/Observable';

import { QUEUE_SERVICE } from './token';
import { QueueService } from './queue.service';

@Injectable()
export class QueueInterceptor implements HttpInterceptor {

  constructor(
    @Inject(QUEUE_SERVICE) private queueService: QueueService
  ) { }

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
  private queueStarted = false

  public intercept(req: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    if (this.queueStarted === false) {
      this.startQueue();
    }

    this.pending += 1;

    return delegate
      .handle(req)
      .do((event) => {
        if (event.type === HttpEventType.Response) {
          this.pending -= 1;

          this.finishQueue();
        }
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

}