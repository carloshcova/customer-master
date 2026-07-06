import { afterEach, expect } from '@rstest/core';
import * as jestDomMatchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(jestDomMatchers);

// Unmount React trees between tests so DOM state doesn't leak across cases.
afterEach(() => {
  cleanup();
});
