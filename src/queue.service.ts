export interface QueueService {
  /**
   * Handler for queue started event
   *
   * @memberof QueueService
   */
  queueStarted(): void;

  /**
   * Handler for queue finsihed event
   *
   * @memberof QueueService
   */
  queueFinished(): void;
}
