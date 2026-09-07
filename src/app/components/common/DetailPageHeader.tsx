import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface DetailPageHeaderProps {
  onBack: () => void;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function DetailPageHeader({
  onBack,
  title,
  subtitle,
  badge,
  actions
}: DetailPageHeaderProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-semibold truncate">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      {badge && <div className="flex-shrink-0">{badge}</div>}
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
}
