import { Bell, CircleUserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

import { MobileNavigation } from "./MobileNavigation";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <MobileNavigation />

        <span className="text-sm font-medium lg:hidden">
          Apparatus Manager
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="View notifications"
        >
          <Bell className="size-5" />
        </Button>

        <Button
          variant="ghost"
          className="gap-2 px-2"
          aria-label="Open user menu"
        >
          <CircleUserRound className="size-6" />

          <span className="hidden text-sm sm:inline">
            Luke
          </span>
        </Button>
      </div>
    </header>
  );
}