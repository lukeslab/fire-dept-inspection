import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
        {icon && (
          <div className="mb-4 rounded-full bg-muted p-3 text-muted-foreground">
            {icon}
          </div>
        )}

        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {description}
        </p>

        {action && <div className="mt-5">{action}</div>}
      </CardContent>
    </Card>
  );
}