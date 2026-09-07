import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground/70" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button className="bg-green-600 hover:bg-green-700" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
