import { Badge } from "../ui/badge";

type Priority = "High" | "Medium" | "Low";

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getClassName = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "Low":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      default:
        return "";
    }
  };

  return (
    <Badge className={getClassName()}>
      {priority} Priority
    </Badge>
  );
}
