import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { fetchViolations } from '.';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { fetchAccountDetails } from '../account';
import { integrationConfig } from '../../../test/config';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-violations', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-violations',
  });

  const context = createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: integrationConfig,
  });

  await fetchAccountDetails(context);
  await fetchViolations(context);

  // Review snapshot, failure is a regression
  expect({
    numCollectedEntities: context.jobState.collectedEntities.length,
    numCollectedRelationships: context.jobState.collectedRelationships.length,
    collectedEntities: context.jobState.collectedEntities,
    collectedRelationships: context.jobState.collectedRelationships,
    encounteredTypes: context.jobState.encounteredTypes,
  }).toMatchSnapshot();
});
