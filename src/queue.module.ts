import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { QueueInterceptor } from './queue.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: QueueInterceptor,
      multi: true
    }
  ]
})
export class QueueModule { }
