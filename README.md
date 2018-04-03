# Angular 4.3.0+ Request Queue Module

This package provides ability to track queues of requests, e.g. if you need to display activity indicator during the requests.

> Package is given in completely 100% pure TypeScript.

```
npm install ngx-request-queue --save
npm install @decorators/common --save
```

## Full example
Full example you can find in this repo [serhiisol/ngx-request-queue-example](https://github.com/serhiisol/ngx-request-queue-example)

## Usage

1. Import `QueueService` interface to implement it with your custom queue service, e.g.:
```typescript
import { Injectable } from '@angular/core';

@Injectable()
export class QueueService {

  constructor(private progressService: NgProgressService) { }

  /**
   * Handler for queue started event
   */
  public queueStarted(): void {
    this.progressService.start();
    
  }

  /**
   * Handler for queue finsihed event
   */
  public queueFinished(): void {
    this.progressService.done();
  }
}
```

2. Provide `QUEUE_SERVICE`, `QueueModule` alongside with `HttpClientModule`, e.g.:
```typescript
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { QueueModule, QUEUE_SERVICE } from 'ngx-request-queue';

import { QueueService } from './queue.service';

@NgModule({
    imports: [ 
      HttpClientModule,
      QueueModule
     ],
    providers: [
      { provide: QUEUE_SERVICE, useClass: QueueService },
    ]
})
export class AppModule { }
```
