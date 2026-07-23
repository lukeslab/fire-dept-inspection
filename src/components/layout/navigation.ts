import {
  AlertTriangle,
  ClipboardCheck,
  LayoutDashboard,
  Package,
  Settings,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Operations",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        end: true,
      },
      {
        label: "Inspections",
        href: "/inspections",
        icon: ClipboardCheck,
      },
      {
        label: "Service Alerts",
        href: "/service-alerts",
        icon: AlertTriangle,
      },
    ],
  },
  {
    label: "Inventory",
    items: [
      {
        label: "Rigs",
        href: "/rigs",
        icon: Truck,
      },
      {
        label: "Equipment",
        href: "/equipment",
        icon: Package,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Users",
        href: "/users",
        icon: Users,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];