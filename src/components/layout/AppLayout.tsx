import { Outlet } from "react-router-dom";

import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AppSidebar />

      <div className="min-h-screen lg:pl-64">
        <AppHeader />

        <Outlet />
      </div>
    </div>
  );
}