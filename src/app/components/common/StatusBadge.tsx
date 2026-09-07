import { Badge } from "../ui/badge";

type Status = "Active" | "Occupied" | "Vacant" | "Inactive" | "New" | "In Progress" | "Completed" | "No Unit Assigned";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "Active":
      case "Occupied":
      case "In Progress":
        return "default";
      case "Completed":
        return "outline";
      case "Vacant":
      case "Inactive":
      case "No Unit Assigned":
      case "New":
      default:
        return "secondary";
    }
  };

  const getClassName = () => {
    switch (status) {
      case "Active":
      case "Occupied":
        return "bg-green-100 text-green-700 hover:bg-green-100 font-medium";
      case "In Progress":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Completed":
        return "text-muted-foreground";
      case "Vacant":
      case "New":
        return "font-medium";
      default:
        return "";
    }
  };

  return (
    <Badge variant={getVariant()} className={getClassName()}>
      {status}
    </Badge>
  );
}
