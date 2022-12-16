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
  organization: {
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
   * The organization from the provider URL used to make requests.
   *
   * I.E. https://testorg.polymerhq.io would result in an organization value of testorg
   */
  organization: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;
  const { logger } = context;

  if (!config.apiToken || !config.organization) {
    throw new IntegrationValidationError(
      'Config requires all of {apiToken, organization}',
    );
  }

  const apiClient = createAPIClient({ config, logger });
  await apiClient.verifyAuthentication();
}
