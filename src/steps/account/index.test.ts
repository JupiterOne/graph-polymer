import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

function isRecordingEnabled() {
  return Boolean(process.env.LOAD_ENV) === true;
}

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-account', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-account',
    options: {
      mode: isRecordingEnabled() ? 'record' : 'replay',
    },
  });

  const stepConfig = buildStepTestConfigForStep(Steps.ACCOUNT);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
