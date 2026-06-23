/**
 * Public API of the `customer-list` feature. Other layers import ONLY from
 * here — never reach into the feature's internal files directly.
 */

export { customersQueryKey, useCustomers } from './api/get-customers';
export { CustomerList } from './components/CustomerList';
export type { Customer } from './types/customer';
