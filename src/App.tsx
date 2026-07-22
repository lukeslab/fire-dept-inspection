import { Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import RigList from "./pages/RigList";
import EquipmentList from "./pages/EquipmentList";
import InspectionList from "./pages/InspectionList";
import InspectionDetail from "./pages/InspectionDetail";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rigs" element={<RigList />} />
        <Route path="/equipment" element={<EquipmentList />} />
        <Route path="/inspections" element={<InspectionList />} />
        <Route path="/inspections/:id" element={<InspectionDetail />} />
      </Route>
    </Routes>
  );
}
