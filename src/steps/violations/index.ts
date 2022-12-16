import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import {
  Entities,
  Steps,
  Relationships,
  MappedRelationships,
} from '../constants';
import {
  createViolationEntity,
  generateRuleKey,
  createRuleEntity,
  createAccountRuleRelationship,
  createRuleViolationRelationship,
  createMappedUserRelationship,
} from './converter';

export async function fetchViolations({
  instance,
  logger,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient({ config: instance.config, logger });

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateViolations(async (violation) => {
    const violationEntity = await jobState.addEntity(
      createViolationEntity(violation),
    );

    await jobState.addRelationship(createMappedUserRelationship(violation));

    for (const rule of violation.rules) {
      let ruleEntity = await jobState.findEntity(generateRuleKey(rule.id));
      if (!ruleEntity) {
        ruleEntity = await jobState.addEntity(createRuleEntity(rule));
        await jobState.addRelationship(
          createAccountRuleRelationship(accountEntity, ruleEntity),
        );
      }
      await jobState.addRelationship(
        createRuleViolationRelationship(
          ruleEntity,
          violationEntity,
          Number(rule.count),
        ),
      );
    }
  });
}

export const violationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.VIOLATIONS,
    name: 'Fetch Violations',
    entities: [Entities.VIOLATION, Entities.RULE],
    relationships: [
      Relationships.ACCOUNT_HAS_RULE,
      Relationships.RULE_IDENTIFIED_VIOLATION,
    ],
    mappedRelationships: [MappedRelationships.USER_HAS_VIOLATION],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchViolations,
  },
];
