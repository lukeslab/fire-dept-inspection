import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import RigList from "@/pages/RigList";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import EquipmentList from "./pages/EquipmentList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <PlaceholderPage
                title="Dashboard"
                description="View department inspection activity and equipment status."
              />
            }
          />

          <Route path="rigs" element={<RigList />} />

          <Route
            path="equipment"
            element={<EquipmentList />}
          />

          <Route
            path="inspections"
            element={
              <PlaceholderPage
                title="Inspections"
                description="Start and review apparatus inspections."
              />
            }
          />

          <Route
            path="service-alerts"
            element={
              <PlaceholderPage
                title="Service Alerts"
                description="Review missing and non-functional equipment."
              />
            }
          />

          <Route
            path="users"
            element={
              <PlaceholderPage
                title="Users"
                description="Manage members and access permissions."
              />
            }
          />

          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Settings"
                description="Configure department and application settings."
              />
            }
          />

          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page Not Found"
                description="The requested page does not exist."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}