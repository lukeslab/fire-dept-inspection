import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface AppBrandProps {
  onNavigate?: () => void;
}

export function AppBrand({
  onNavigate,
}: AppBrandProps) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className="flex min-h-16 items-center gap-3 px-5"
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Shield className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">
          Apparatus Manager
        </p>

        <p className="truncate text-xs text-muted-foreground">
          Purchase Fire Department
        </p>
      </div>
    </Link>
  );
}