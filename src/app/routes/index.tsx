import { Container, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { CustomerList } from '@/features/customer-list';

/**
 * Relative routes for the customer module. Mounted under whatever base path
 * the host shell assigns (e.g. `/customers/*`). Do NOT use absolute paths or a
 * Router here — the host owns the Router.
 */
export function CustomerRoutes() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customers
      </Typography>
      <Routes>
        <Route index element={<CustomerList />} />
      </Routes>
    </Container>
  );
}
