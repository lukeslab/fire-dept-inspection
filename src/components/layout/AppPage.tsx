import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AppPageProps {
  children: ReactNode;
  className?: string;
}

export function AppPage({
  children,
  className,
}: AppPageProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-6",
        "sm:px-6 sm:py-8 lg:px-8",
        className,
      )}
    >
      {children}
    </main>
  );
}