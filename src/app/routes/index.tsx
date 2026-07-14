import { Route, Routes } from 'react-router-dom';
import { AgentCreatePage } from './agents/AgentCreatePage';
import { AgentEditPage } from './agents/AgentEditPage';
import { AgentsPage } from './agents/AgentsPage';
import { CustomerMasterCreatePage } from './customer-master/CustomerMasterCreatePage';
import { CustomerMasterEditPage } from './customer-master/CustomerMasterEditPage';
import { CustomerMasterPage } from './customer-master/CustomerMasterPage';
import { HomePage } from './HomePage';
import { SecuritySensorCreatePage } from './security-sensor/SecuritySensorCreatePage';
import { SecuritySensorEditPage } from './security-sensor/SecuritySensorEditPage';
import { SecuritySensorPage } from './security-sensor/SecuritySensorPage';

/**
 * Content routes for the customer module, relative to the App's BrowserRouter
 * basename (`/customer-master` in the portal). The host shell provides the chrome
 * (header/sidebar), so this MFE renders content only — no ShellLayout.
 *
 * The customer records section lives at `/customer-master/customers` (a distinct,
 * flat segment — not the doubled `/customer-master/customer-master`). Sub-routes:
 * list (index), `new`, `:id/edit`.
 */
export function CustomerRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="customers">
        <Route index element={<CustomerMasterPage />} />
        <Route path="new" element={<CustomerMasterCreatePage />} />
        <Route path=":id/edit" element={<CustomerMasterEditPage />} />
      </Route>
      <Route path="agents">
        <Route index element={<AgentsPage />} />
        <Route path="new" element={<AgentCreatePage />} />
        <Route path=":id/edit" element={<AgentEditPage />} />
      </Route>
      <Route path="security-sensor">
        <Route index element={<SecuritySensorPage />} />
        <Route path="new" element={<SecuritySensorCreatePage />} />
        <Route path=":id/edit" element={<SecuritySensorEditPage />} />
      </Route>
    </Routes>
  );
}
