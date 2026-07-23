import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

import { navigationGroups } from "./navigation";

interface AppNavigationProps {
  onNavigate?: () => void;
}

export function AppNavigation({
  onNavigate,
}: AppNavigationProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="flex flex-1 flex-col gap-6 px-3 py-4"
    >
      {navigationGroups.map((group) => (
        <section key={group.label}>
          <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </h2>

          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-10 items-center gap-3 rounded-md px-3 py-2",
                      "text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )
                  }
                >
                  <Icon className="size-4 shrink-0" />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}