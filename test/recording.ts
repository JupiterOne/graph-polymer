import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization', 'api-token'],
    redactedResponseHeaders: ['set-cookie', 'api-token'],
    mutateEntry: mutations.unzipGzippedRecordingEntry,
  });
}
