import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ClipboardCheck,
  ArrowLeft,
  Building2,
  DoorOpen,
  User,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Wrench,
} from "lucide-react";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Scheduled":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "In Progress":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Completed":
      return "bg-green-50 text-green-700 border border-green-200";
    case "Follow-Up Required":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

function getConditionBadgeClass(condition: string) {
  switch (condition) {
    case "Good":
      return "bg-green-50 text-green-700 border border-green-200";
    case "Fair":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Poor":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    case "Damaged":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

export function InspectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    inspections,
    properties,
    units,
    tenants,
    maintenanceTickets,
    updateInspection,
    addMaintenanceTicket,
  } = useApp();

  const inspection = inspections.find((i) => i.id === Number(id));

  const [newFinding, setNewFinding] = useState({ item: "", condition: "", notes: "" });
  const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
    assignedTo: "",
    scheduledDate: "",
  });

  if (!inspection) {
    return (
      <MainLayout title="Inspection Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">This inspection could not be found.</p>
          <Button onClick={() => navigate("/inspections")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inspections
          </Button>
        </div>
      </MainLayout>
    );
  }

  const property = properties.find((p) => p.id === inspection.propertyId);
  const unit = inspection.unitId ? units.find((u) => u.id === inspection.unitId) : null;
  const tenant = inspection.tenantId ? tenants.find((t) => t.id === inspection.tenantId) : null;
  const canEditFindings =
    inspection.status === "Scheduled" || inspection.status === "In Progress";

  const handleStatusUpdate = (status: string) => {
    updateInspection(inspection.id, {
      status,
      followUpRequired: status === "Follow-Up Required" ? true : inspection.followUpRequired,
    });
    toast.success(`Inspection marked as ${status}`);
  };

  const handleAddFinding = () => {
    if (!newFinding.item || !newFinding.condition) {
      toast.error("Please enter an item name and condition");
      return;
    }
    const nextId =
      inspection.findings.length > 0
        ? Math.max(...inspection.findings.map((f) => f.id)) + 1
        : 1;
    const updatedFindings = [
      ...inspection.findings,
      { id: nextId, item: newFinding.item, condition: newFinding.condition, notes: newFinding.notes },
    ];
    updateInspection(inspection.id, { findings: updatedFindings });
    setNewFinding({ item: "", condition: "", notes: "" });
    toast.success("Finding added");
  };

  const openTicketDialog = () => {
    setTicketForm({
      title: `Follow-Up: ${inspection.type} Inspection — ${inspection.propertyName}`,
      category: "General",
      priority: "Medium",
      description: inspection.notes
        ? `Follow-up required from ${inspection.type} inspection on ${inspection.scheduledDate}.\n\n${inspection.notes}`
        : `Follow-up required from ${inspection.type} inspection on ${inspection.scheduledDate}.`,
      assignedTo: "",
      scheduledDate: "",
    });
    setIsTicketDialogOpen(true);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.category || !ticketForm.priority || !ticketForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    addMaintenanceTicket({
      title: ticketForm.title,
      propertyId: inspection.propertyId,
      unitId: inspection.unitId ?? 0,
      tenantId: inspection.tenantId ?? 0,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: "New",
      description: ticketForm.description,
      scheduledDate: ticketForm.scheduledDate || null,
      completionDate: null,
      assignedTo: ticketForm.assignedTo,
      estimatedCost: null,
      actualCost: null,
      notes: "",
      isRecurring: false,
      recurringFrequency: null,
    });
    toast.success("Maintenance ticket created");
    setIsTicketDialogOpen(false);
  };

  return (
    <MainLayout title={`${inspection.type} Inspection`}>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div>
          <button
            onClick={() => navigate("/inspections")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Inspections
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {inspection.type} Inspection — {inspection.propertyName}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {inspection.scheduledDate}
              </div>
            </div>
            <Badge className={`text-xs ${getStatusBadgeClass(inspection.status)}`}>
              {inspection.status}
            </Badge>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Type</p>
              <p className="text-sm font-medium text-foreground">{inspection.type}</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Date</p>
              <p className="text-sm font-medium text-foreground">{inspection.scheduledDate}</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Inspector</p>
              <p className="text-sm font-medium text-foreground">{inspection.inspectorName}</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Status</p>
              <Badge className={`text-xs ${getStatusBadgeClass(inspection.status)}`}>
                {inspection.status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Two-column: details + location */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Inspection Details */}
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Inspection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Type", value: inspection.type },
                { label: "Date", value: inspection.scheduledDate },
                { label: "Inspector", value: inspection.inspectorName },
                { label: "Status", value: inspection.status },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {label}
                  </p>
                  <p className="text-sm text-foreground">{value}</p>
                </div>
              ))}
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Follow-Up Required
                </p>
                <p className="text-sm text-foreground">
                  {inspection.followUpRequired ? "Yes" : "No"}
                </p>
              </div>
              {inspection.notes && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{inspection.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Tenant */}
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Location & Tenant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                    Property
                  </p>
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                    Unit
                  </p>
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                    Tenant
                  </p>
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
              {!property && !unit && !tenant && (
                <p className="text-sm text-muted-foreground">No location or tenant details.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Findings (full width) */}
        <Card className="border border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Findings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {inspection.findings.length === 0 && !canEditFindings ? (
              <div className="text-center py-10 px-6">
                <ClipboardCheck className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No findings recorded yet</p>
              </div>
            ) : (
              <>
                {inspection.findings.length > 0 && (
                  <div className="rounded-lg overflow-hidden border-b border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-accent/50">
                          <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                            Item
                          </TableHead>
                          <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                            Condition
                          </TableHead>
                          <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                            Notes
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inspection.findings.map((finding) => (
                          <TableRow key={finding.id} className="hover:bg-accent/50">
                            <TableCell className="text-sm font-medium text-foreground">
                              {finding.item}
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-xs ${getConditionBadgeClass(finding.condition)}`}>
                                {finding.condition}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {finding.notes || <span className="text-muted-foreground/50">—</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {inspection.findings.length === 0 && canEditFindings && (
                  <div className="text-center py-6 px-6 border-b border-border">
                    <p className="text-sm text-muted-foreground">No findings recorded yet. Add one below.</p>
                  </div>
                )}

                {/* Inline add finding form */}
                {canEditFindings && (
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
                      Add Finding
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        placeholder="Item (e.g., Kitchen)"
                        className="h-9 flex-1"
                        value={newFinding.item}
                        onChange={(e) => setNewFinding({ ...newFinding, item: e.target.value })}
                      />
                      <Select
                        value={newFinding.condition}
                        onValueChange={(value) => setNewFinding({ ...newFinding, condition: value })}
                      >
                        <SelectTrigger className="h-9 w-full sm:w-[140px]">
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                          <SelectItem value="Damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Notes (optional)"
                        className="h-9 flex-1"
                        value={newFinding.notes}
                        onChange={(e) => setNewFinding({ ...newFinding, notes: e.target.value })}
                      />
                      <Button
                        size="sm"
                        className="h-9 bg-green-600 hover:bg-green-700 shrink-0"
                        onClick={handleAddFinding}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions card (only if not Completed) */}
        {inspection.status !== "Completed" && (
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                {inspection.status === "Scheduled" && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate("In Progress")}
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Mark as In Progress
                  </Button>
                )}
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setIsCompleteConfirmOpen(true)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("Follow-Up Required")}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Mark as Follow-Up Required
                </Button>
              </div>

              {/* Create maintenance ticket */}
              {inspection.followUpRequired && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    This inspection requires follow-up. Create a maintenance ticket to track the work.
                  </p>
                  <Button variant="outline" onClick={openTicketDialog}>
                    <Wrench className="mr-2 h-4 w-4" />
                    Create Maintenance Ticket
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Completed banner */}
        {inspection.status === "Completed" && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            This inspection has been completed and all findings have been recorded.
          </div>
        )}

        <ConfirmDialog
          open={isCompleteConfirmOpen}
          onOpenChange={setIsCompleteConfirmOpen}
          title="Mark Inspection as Completed"
          description="Are you sure you want to mark this inspection as completed? This will record it as finished."
          confirmText="Mark as Completed"
          cancelText="Cancel"
          onConfirm={() => {
            handleStatusUpdate("Completed");
            setIsCompleteConfirmOpen(false);
          }}
        />

        {/* Create Maintenance Ticket dialog */}
        <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
          <DialogContent className="sm:max-w-[560px]">
            <form onSubmit={handleCreateTicket}>
              <DialogHeader>
                <DialogTitle>Create Maintenance Ticket</DialogTitle>
                <DialogDescription>
                  Create a maintenance ticket linked to this inspection for follow-up work
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket-title">Title *</Label>
                  <Input
                    id="ticket-title"
                    className="h-10"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={ticketForm.category}
                      onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="HVAC">HVAC</SelectItem>
                        <SelectItem value="Appliance">Appliance</SelectItem>
                        <SelectItem value="Pest Control">Pest Control</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority *</Label>
                    <Select
                      value={ticketForm.priority}
                      onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket-description">Description *</Label>
                  <Textarea
                    id="ticket-description"
                    rows={4}
                    className="resize-none"
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-assigned">Assigned To (Optional)</Label>
                    <Input
                      id="ticket-assigned"
                      placeholder="e.g., Self, Contractor"
                      className="h-10"
                      value={ticketForm.assignedTo}
                      onChange={(e) => setTicketForm({ ...ticketForm, assignedTo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticket-scheduled">Scheduled Date (Optional)</Label>
                    <Input
                      id="ticket-scheduled"
                      type="date"
                      className="h-10"
                      value={ticketForm.scheduledDate}
                      onChange={(e) => setTicketForm({ ...ticketForm, scheduledDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Linked to
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {inspection.propertyName}
                    {inspection.unitNumber ? ` · Unit ${inspection.unitNumber}` : ""}
                    {inspection.tenantName ? ` · ${inspection.tenantName}` : ""}
                  </p>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsTicketDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Create Ticket
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
