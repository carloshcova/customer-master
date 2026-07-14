import { expect, test } from '@rstest/core';
import { HomePage } from '../src/app/routes/HomePage';
import { renderWithProviders, screen } from '../src/testing/test-utils';

// Minimal smoke test kept so `bun run test` stays green. Full test coverage
// comes in the dedicated testing phase.
test('home page renders the section navigation cards', () => {
  renderWithProviders(<HomePage />);
  expect(screen.getByText('Customer Master')).toBeTruthy();
  expect(screen.getByText('Agents')).toBeTruthy();
  expect(screen.getByText('Security Sensor')).toBeTruthy();
});
