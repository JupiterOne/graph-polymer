import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  apiToken: {
    type: 'string',
    mask: true,
  },
  baseUrl: {
    type: 'string',
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The provider API token used to authenticate requests.
   */
  apiToken: string;

  /**
   * The provider base URL used to make requests.
   */
  baseUrl: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;
  const { logger } = context;

  if (!config.apiToken || !config.baseUrl) {
    throw new IntegrationValidationError(
      'Config requires all of {apiToken, baseUrl}',
    );
  }

  const apiClient = createAPIClient({ config, logger });
  await apiClient.verifyAuthentication();
}
