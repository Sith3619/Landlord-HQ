import { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      {(title || description) && (
        <div>
          {title && <h1 className="text-2xl font-semibold tracking-tight text-foreground sr-only">{title}</h1>}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
