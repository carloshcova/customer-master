import {
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import { useCustomers } from '../api/get-customers';

/**
 * Renders the customers list, handling loading and error states. UI scoped to
 * this feature lives here; it is re-exported via the feature's Public API.
 */
export function CustomerList() {
  const { data, isPending, isError, error } = useCustomers();

  if (isPending) {
    return (
      <Stack sx={{ alignItems: 'center', py: 4 }}>
        <CircularProgress aria-label="Loading customers" />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">Failed to load customers: {error.message}</Alert>
    );
  }

  return (
    <List>
      {data.map((customer) => (
        <ListItem key={customer.id} divider>
          <ListItemText primary={customer.name} secondary={customer.email} />
        </ListItem>
      ))}
    </List>
  );
}
