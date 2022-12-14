import { accountSteps } from './account';
import { violationSteps } from './violations';

const integrationSteps = [...accountSteps, ...violationSteps];

export { integrationSteps };
