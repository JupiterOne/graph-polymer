import fetch from 'node-fetch';
import { retry, sleep } from '@lifeomic/attempt'; //todo add back in sleep?

import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { PolymerItem, PolymerResponse } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

function getUnixTimeNow() {
  return Date.now() / 1000;
}

type AttemptOptions = {
  maxAttempts: number;
  delay: number;
  timeout: number;
  factor: number;
};

export const DEFAULT_ATTEMPT_OPTIONS = {
  maxAttempts: 5,
  delay: 30_000,
  timeout: 180_000,
  factor: 2,
};

export type PolymerClientConfig = {
  readonly config: IntegrationConfig;
  logger: IntegrationLogger;
  attemptOptions?: AttemptOptions;
};

export type PolymerResourceIterationCallback<T> = (
  resources: T[],
) => boolean | void | Promise<boolean | void>;

export class APIClient {
  private apiToken: string;
  private requestUrl: string;
  private logger: IntegrationLogger;
  private attemptOptions: AttemptOptions;
  private retryAfter: number; // It appears that Polymer currently provides this in seconds

  constructor({ config, logger, attemptOptions }: PolymerClientConfig) {
    this.apiToken = config.apiToken;
    this.requestUrl =
      'https://' + config.organization + '.polymerhq.io/api/v1/violations';
    this.logger = logger;
    this.attemptOptions = attemptOptions ?? DEFAULT_ATTEMPT_OPTIONS;
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      const response = await fetch(this.requestUrl, {
        headers: { 'api-token': this.apiToken },
      });
      if (!response.ok) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: this.requestUrl,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each violation from Polymer.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateViolations(
    iteratee: ResourceIteratee<PolymerItem>,
  ): Promise<void> {
    let queryUrl: string | null = this.requestUrl;
    do {
      this.logger.info({ queryUrl }, 'Calling API with url');
      const response = await this.executeAPIRequestWithRetries<PolymerResponse>(
        queryUrl,
      );
      // this.logger.info({ response }, `Full response`);
      for (const violation of response.items) {
        await iteratee(violation);
      }

      this.logger.info(
        { ...response.pagination },
        `Pagination is being set from`,
      );
      queryUrl = response.pagination.next_url;

      this.logger.info(
        { queryUrl },
        'Continuing with query using provided next_url',
      );
    } while (queryUrl);
  }

  private async executeAPIRequestWithRetries<T>(queryUrl: string): Promise<T> {
    /**
     * This is the logic to be retried in the case of an error.
     */
    const requestAttempt = async () => {
      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: { 'api-token': this.apiToken },
      });

      this.retryAfter = Number(response.headers.get('Retry-after'));

      if (response.ok) {
        return response.json();
      }

      if (response.status === 401) {
        throw new IntegrationProviderAuthenticationError({
          status: response.status,
          statusText: response.statusText,
          endpoint: queryUrl,
        });
      }
      if (response.status === 403) {
        throw new IntegrationProviderAuthorizationError({
          status: response.status,
          statusText: response.statusText,
          endpoint: queryUrl,
        });
      }

      throw new IntegrationProviderAPIError({
        status: response.status,
        statusText: response.statusText,
        endpoint: queryUrl,
      });
    };

    return retry(requestAttempt, {
      ...this.attemptOptions,
      handleError: async (error, attemptContext) => {
        this.logger.debug(
          { error, attemptContext },
          'Error being handled in handleError.',
        );

        if (error.status === 401 || error.status === 403) {
          attemptContext.abort();
          return;
        }
        if (error.status === 429) {
          await this.handle429Error();
        }

        this.logger.warn(
          { attemptContext, error },
          `Hit a possibly recoverable error when requesting data. Waiting before trying again.`,
        );
      },
    });
  }

  private async handle429Error() {
    const unixTimeNow = getUnixTimeNow();
    const timeToSleepInSeconds = this.retryAfter; // Currently in seconds, but we can inject changes here if/when that changes
    this.logger.info(
      {
        unixTimeNow,
        timeToSleepInSeconds,
      },
      'Encountered 429 response. Waiting to retry request.',
    );
    await sleep(timeToSleepInSeconds * 1000);
  }
}

export function createAPIClient(config: PolymerClientConfig): APIClient {
  return new APIClient(config);
}
