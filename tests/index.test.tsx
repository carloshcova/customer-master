import { expect, rs, test } from '@rstest/core';
import { screen } from '@testing-library/react';
import { CustomerList } from '../src/features/customer-list';
import { apiClient } from '../src/lib/api-client';
import { renderWithProviders } from '../src/testing/test-utils';

test('renders the customers returned by the API', async () => {
  rs.spyOn(apiClient, 'get').mockResolvedValue({
    data: [{ id: '1', name: 'Ada Lovelace', email: 'ada@example.com' }],
  });

  renderWithProviders(<CustomerList />);

  expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
  expect(screen.getByText('ada@example.com')).toBeInTheDocument();
});
