import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Building2, DoorOpen, User, Calendar, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

function priorityBadgeClass(priority: string) {
  switch (priority) {
    case "Urgent":
      return "bg-red-100 text-red-800 border border-red-200 font-semibold";
    case "High":
      return "bg-orange-50 text-orange-700 border border-orange-200 font-medium";
    case "Medium":
      return "bg-amber-50 text-amber-700 border border-amber-200 font-medium";
    case "Low":
      return "bg-blue-50 text-blue-700 border border-blue-200 font-medium";
    default:
      return "bg-muted text-muted-foreground border border-border font-medium";
  }
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-700 border border-green-200";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

export function MaintenanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { maintenanceTickets, properties, units, tenants, updateMaintenanceTicket } = useApp();

  const ticket = maintenanceTickets.find((t) => t.id === Number(id));

  if (!ticket) {
    return (
      <MainLayout title="Ticket Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">This maintenance ticket could not be found.</p>
          <Button onClick={() => navigate("/maintenance")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Maintenance
          </Button>
        </div>
      </MainLayout>
    );
  }

  const property = properties.find((p) => p.id === ticket.propertyId);
  const unit = units.find((u) => u.id === ticket.unitId);
  const tenant = tenants.find((t) => t.id === ticket.tenantId);

  return (
    <MainLayout title={ticket.title}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/maintenance")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Maintenance
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{ticket.title}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Created {ticket.createdDate}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`text-xs ${priorityBadgeClass(ticket.priority)}`}>
                {ticket.priority} Priority
              </Badge>
              <Badge className={`text-xs ${statusBadgeClass(ticket.status)}`}>
                {ticket.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Ticket Info */}
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Category", value: ticket.category },
                { label: "Priority", value: ticket.priority },
                { label: "Status", value: ticket.status },
                { label: "Created", value: ticket.createdDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                  <p className="text-sm text-foreground">{value}</p>
                </div>
              ))}
              {ticket.notes && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Internal Notes</p>
                  <p className="text-sm text-muted-foreground italic">{ticket.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Contact */}
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Location & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Property</p>
                  <button
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 hover:bg-accent transition-colors w-full text-left"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{property.name}</p>
                      <p className="text-xs text-muted-foreground">{property.address}</p>
                    </div>
                  </button>
                </div>
              )}
              {unit && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Unit</p>
                  <button
                    onClick={() => navigate(`/units/${unit.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 hover:bg-accent transition-colors w-full text-left"
                  >
                    <DoorOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Unit {unit.unitNumber}</p>
                      <p className="text-xs text-muted-foreground">${unit.rent.toLocaleString()}/month</p>
                    </div>
                  </button>
                </div>
              )}
              {tenant && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Tenant</p>
                  <button
                    onClick={() => navigate(`/tenants/${tenant.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 hover:bg-accent transition-colors w-full text-left"
                  >
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{tenant.fullName}</p>
                      <p className="text-xs text-muted-foreground">{tenant.email}</p>
                      <p className="text-xs text-muted-foreground">{tenant.phone}</p>
                    </div>
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card className="border border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{ticket.description}</p>
          </CardContent>
        </Card>

        {/* Actions */}
        {ticket.status !== "Completed" && (
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                {ticket.status !== "In Progress" && (
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      updateMaintenanceTicket(ticket.id, { status: "In Progress" });
                      toast.success("Ticket marked as In Progress");
                    }}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Mark as In Progress
                  </Button>
                )}
                <Button
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    updateMaintenanceTicket(ticket.id, { status: "Completed" });
                    toast.success("Ticket marked as completed");
                    navigate("/maintenance");
                  }}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {ticket.status === "Completed" && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            This ticket has been resolved and marked as completed.
          </div>
        )}
      </div>
    </MainLayout>
  );
}
