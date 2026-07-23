import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { AppBrand } from "./AppBrand";
import { AppNavigation } from "./AppNavigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
            />
        }
    >
  <Menu className="size-5" />
</SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-72 flex-col p-0"
      >
        <SheetTitle className="sr-only">
          Application navigation
        </SheetTitle>

        <SheetDescription className="sr-only">
          Navigate between application screens.
        </SheetDescription>

        <AppBrand onNavigate={() => setIsOpen(false)} />

        <div className="border-t" />

        <AppNavigation
          onNavigate={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}