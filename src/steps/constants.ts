import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  VIOLATIONS: 'fetch-violations',
};

export const Entities: Record<
  'ACCOUNT' | 'RULE' | 'VIOLATION',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'polymer_account',
    _class: ['Account'],
    schema: {
      required: [],
    },
  },
  RULE: {
    resourceName: 'Rule',
    _type: 'polymer_rule',
    _class: ['Rule'],
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        content: { type: 'string' },
      },
      required: ['id', 'name', 'content'],
    },
  },
  VIOLATION: {
    resourceName: 'Violation',
    _type: 'polymer_violation',
    _class: ['Finding'],
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        time: { type: 'string' },
        category: { type: 'string' },
        severity: { type: 'string' },
        numericSeverity: { type: 'number' },
        open: { type: 'boolean' },
      },
      required: ['id', 'name', 'category', 'severity'],
    },
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_RULE' | 'RULE_IDENTIFIED_VIOLATION',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_RULE: {
    _type: 'polymer_account_has_rule',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.RULE._type,
  },
  RULE_IDENTIFIED_VIOLATION: {
    _type: 'polymer_rule_identified_violation',
    sourceType: Entities.RULE._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.VIOLATION._type,
  },
};

export const MappedRelationships: Record<
  'USER_HAS_VIOLATION',
  StepMappedRelationshipMetadata
> = {
  USER_HAS_VIOLATION: {
    _type: 'user_has_polymer_violation',
    sourceType: Entities.VIOLATION._type,
    _class: RelationshipClass.HAS,
    targetType: 'Person',
    direction: RelationshipDirection.REVERSE,
  },
};
