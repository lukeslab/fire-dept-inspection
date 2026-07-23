import { Separator } from "@/components/ui/separator";

import { AppBrand } from "./AppBrand";
import { AppNavigation } from "./AppNavigation";

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card lg:flex">
      <AppBrand />

      <Separator />

      <AppNavigation />

      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          Equipment Inspection System
        </p>
      </div>
    </aside>
  );
}