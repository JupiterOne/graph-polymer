import {
  RelationshipClass,
  RelationshipDirection,
  StepSpec,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const violationsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://localhost/api/v1/violations
     * PATTERN: Fetch Entities
     */
    id: 'fetch-violations',
    name: 'Fetch Violations',
    entities: [
      {
        resourceName: 'Violation',
        _type: 'polymer_violation',
        _class: ['Finding'],
      },
      {
        resourceName: 'Rule',
        _type: 'polymer_rule',
        _class: ['Rule'],
      },
    ],
    relationships: [
      {
        _type: 'polymer_account_has_rule',
        sourceType: 'polymer_account',
        _class: RelationshipClass.HAS,
        targetType: 'polymer_rule',
      },
      {
        _type: 'polymer_rule_identified_violation',
        sourceType: 'polymer_rule',
        _class: RelationshipClass.IDENTIFIED,
        targetType: 'polymer_violation',
      },
    ],
    mappedRelationships: [
      {
        _type: 'polymer_violation_has_user',
        sourceType: 'polymer_violation',
        _class: RelationshipClass.HAS,
        targetType: 'User',
        direction: RelationshipDirection.FORWARD,
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
