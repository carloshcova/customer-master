import { afterEach, expect } from '@rstest/core';
import * as jestDomMatchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
// Initialize i18n once for the whole suite so `useTranslation()` resolves keys
// (defaults to English with no shell). Components under test render real labels.
import '@/config/i18n';

expect.extend(jestDomMatchers);

// Unmount React trees between tests so DOM state doesn't leak across cases.
afterEach(() => {
  cleanup();
});
