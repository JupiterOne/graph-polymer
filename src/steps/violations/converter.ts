import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  parseTimePropertyValue,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { PolymerRule, PolymerItem } from '../../types';

export function generatePolymerKey(input: {
  type: string;
  id: string;
}): string {
  return `${input.type}|${input.id}`;
}

export function generateRuleKey(id: string): string {
  return generatePolymerKey({ type: Entities.RULE._type, id });
}

export function generateViolationKey(id: number): string {
  return generatePolymerKey({
    type: Entities.VIOLATION._type,
    id: id.toString(),
  });
}

export function createRuleEntity(rule: PolymerRule): Entity {
  return createIntegrationEntity({
    entityData: {
      source: rule,
      assign: {
        _type: Entities.RULE._type,
        _class: Entities.RULE._class,
        _key: generateRuleKey(rule.id),
        id: rule.id,
        name: rule.name,
        content: rule.name,
      },
    },
  });
}

export function createViolationEntity(violation: PolymerItem): Entity {
  return createIntegrationEntity({
    entityData: {
      source: violation,
      assign: {
        _type: Entities.VIOLATION._type,
        _class: Entities.VIOLATION._class,
        _key: generateViolationKey(violation.id),
        name: violation.name,
        time: parseTimePropertyValue(violation.time),
        category: 'other',
        severity: 'unknown', // TODO (adam-in-ict) If we begin getting a category and severity, update these
        numericSeverity: 0,
        open: true,
      },
    },
  });
}

export function createAccountRuleRelationship(
  account: Entity,
  rule: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: rule,
  });
}

export function createRuleViolationRelationship(
  rule: Entity,
  violation: Entity,
  count: number,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.IDENTIFIED,
    from: rule,
    to: violation,
    properties: {
      count: count,
    },
  });
}
