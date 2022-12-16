import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  parseTimePropertyValue,
  RelationshipClass,
  Relationship,
  MappedRelationship,
  createMappedRelationship,
  RelationshipDirection,
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
        id: violation.id.toString(),
        name: violation.name,
        createdOn: parseTimePropertyValue(violation.time),
        category: 'other',
        severity: 'unknown', // TODO (adam-in-ict) If we begin getting a category and severity, update these
        numericSeverity: 0,
        open: true,
        fileId: violation.file?.id,
        fileName: violation.file?.name,
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

export function createMappedUserRelationship(
  violation: PolymerItem,
): MappedRelationship {
  return createMappedRelationship({
    _class: RelationshipClass.HAS,
    _type: 'user_has_polymer_violation',
    _mapping: {
      sourceEntityKey: generateViolationKey(violation.id),
      relationshipDirection: RelationshipDirection.REVERSE,
      skipTargetCreation: true,
      targetFilterKeys: [['_class', 'email']],
      targetEntity: {
        _class: 'Person',
        email: violation.user.email,
      },
    },
  });
}
