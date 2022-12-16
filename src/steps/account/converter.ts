import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createAccountEntity(organization: string): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: organization,
        name: 'Polymer Account',
      },
      assign: {
        _key: `${Entities.ACCOUNT._type}|organization`,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
      },
    },
  });
}
