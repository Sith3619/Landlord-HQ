import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  caption?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, caption, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {caption && (
          <p className="text-xs text-muted-foreground mt-1">{caption}</p>
        )}
        {trend && (
          <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
