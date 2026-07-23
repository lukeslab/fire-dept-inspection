import { Badge } from "@/components/ui/badge";

export type StatusTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: StatusTone;
}

const toneClasses: Record<StatusTone, string> = {
  neutral:
    "border-border bg-muted text-muted-foreground",
  success:
    "border-success/25 bg-success/10 text-success",
  warning:
    "border-warning/30 bg-warning/15 text-warning-foreground",
  danger:
    "border-destructive/25 bg-destructive/10 text-destructive",
  info:
    "border-info/25 bg-info/10 text-info",
};

export function StatusBadge({
  children,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={toneClasses[tone]}
    >
      {children}
    </Badge>
  );
}