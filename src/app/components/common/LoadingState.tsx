import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded animate-pulse" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
      <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
    </div>
  );
}
