import { useState } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useApp } from "../context/AppContext";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Plus, Search, Wrench, Calendar, MapPin, MoreHorizontal, User, CheckCircle2, Clock } from "lucide-react";

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Urgent":
      return { badge: "bg-red-100 text-red-800 border border-red-200 font-semibold", bar: "bg-red-500" };
    case "High":
      return { badge: "bg-orange-50 text-orange-700 border border-orange-200 font-medium", bar: "bg-orange-500" };
    case "Medium":
      return { badge: "bg-amber-50 text-amber-700 border border-amber-200 font-medium", bar: "bg-amber-400" };
    case "Low":
      return { badge: "bg-blue-50 text-blue-700 border border-blue-200 font-medium", bar: "bg-blue-400" };
    default:
      return { badge: "bg-muted text-muted-foreground border border-border font-medium", bar: "bg-border" };
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "New":
      return "bg-muted text-muted-foreground border border-border";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Completed":
      return "bg-green-50 text-green-700 border border-green-200";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

export function Maintenance() {
  const navigate = useNavigate();
  const { maintenanceTickets, properties, units, tenants, addMaintenanceTicket, deleteMaintenanceTicket, updateMaintenanceTicket } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<{ id: number; title: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    propertyId: 0,
    unitId: 0,
    tenantId: 0,
    category: "",
    priority: "",
    status: "New",
    description: "",
    notes: "",
  });

  const filteredTickets = maintenanceTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "new" && ticket.status === "New") ||
      (filterStatus === "in-progress" && ticket.status === "In Progress") ||
      (filterStatus === "completed" && ticket.status === "Completed") ||
      (filterStatus === "urgent" && ticket.priority === "Urgent") ||
      (filterStatus === "high-priority" && ticket.priority === "High");

    return matchesSearch && matchesFilter;
  });

  const openCount = maintenanceTickets.filter((t) => t.status !== "Completed").length;

  const resetForm = () => {
    setFormData({
      title: "",
      propertyId: 0,
      unitId: 0,
      tenantId: 0,
      category: "",
      priority: "",
      status: "New",
      description: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.propertyId || !formData.unitId || !formData.category || !formData.priority || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const unit = units.find((u) => u.id === formData.unitId);

    addMaintenanceTicket({
      ...formData,
      tenantId: unit?.tenantId || 0,
    });

    toast.success("Maintenance ticket created");
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (ticket: any) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      propertyId: ticket.propertyId,
      unitId: ticket.unitId,
      tenantId: ticket.tenantId,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      description: ticket.description,
      notes: ticket.notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.propertyId || !formData.unitId || !formData.category || !formData.priority || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateMaintenanceTicket(editingTicket.id, formData);
    toast.success("Ticket updated successfully");
    resetForm();
    setIsEditDialogOpen(false);
    setEditingTicket(null);
  };

  const handleDeleteRequest = (id: number, title: string) => {
    setTicketToDelete({ id, title });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (ticketToDelete) {
      deleteMaintenanceTicket(ticketToDelete.id);
      toast.success("Ticket deleted");
      setTicketToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const TicketForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-5 py-4">
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-title" : "title"}>Issue Title *</Label>
        <Input
          id={isEdit ? "edit-title" : "title"}
          placeholder="e.g., Kitchen sink leaking"
          className="h-10"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Property *</Label>
          <Select
            value={String(formData.propertyId || "")}
            onValueChange={(value) => setFormData({ ...formData, propertyId: Number(value), unitId: 0 })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={String(property.id)}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Unit *</Label>
          <Select
            value={String(formData.unitId || "")}
            onValueChange={(value) => setFormData({ ...formData, unitId: Number(value) })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units
                .filter((u) => u.propertyId === formData.propertyId)
                .map((unit) => (
                  <SelectItem key={unit.id} value={String(unit.id)}>
                    Unit {unit.unitNumber}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
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
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value })}
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
      {isEdit && (
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label>Description *</Label>
        <Textarea
          placeholder="Describe the issue in detail..."
          rows={4}
          className="resize-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Internal Notes (Optional)</Label>
        <Textarea
          placeholder="Add internal notes or follow-up details..."
          rows={2}
          className="resize-none"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <MainLayout title="Maintenance">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-sm text-muted-foreground">
            Track and manage maintenance requests · {openCount} open{" "}
            {openCount === 1 ? "ticket" : "tickets"}
          </p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create Maintenance Ticket</DialogTitle>
                  <DialogDescription>Report a new maintenance issue or request</DialogDescription>
                </DialogHeader>
                <TicketForm />
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Create Ticket
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={handleEditSubmit}>
                <DialogHeader>
                  <DialogTitle>Edit Maintenance Ticket</DialogTitle>
                  <DialogDescription>Update the maintenance request details</DialogDescription>
                </DialogHeader>
                <TicketForm isEdit />
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingTicket(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Update Ticket
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-muted/50 border-border"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px] sm:w-[200px] h-10 flex-shrink-0">
              <SelectValue placeholder="All tickets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tickets</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high-priority">High Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          {filteredTickets.length === 0 ? (
            <Card className="border border-border shadow-none">
              <CardContent className="text-center py-16">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                  <Wrench className="h-7 w-7 text-muted-foreground/70" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">No maintenance tickets found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Maintenance requests will appear here"}
                </p>
                {!searchQuery && filterStatus === "all" && (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Ticket
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredTickets.map((ticket) => {
              const priorityStyle = getPriorityStyle(ticket.priority);
              const isHighPriority = ticket.priority === "Urgent" || ticket.priority === "High";
              return (
                <Card
                  key={ticket.id}
                  className={`border shadow-none transition-shadow hover:shadow-sm overflow-hidden ${
                    isHighPriority && ticket.status !== "Completed"
                      ? "border-orange-100"
                      : "border-border"
                  }`}
                >
                  <div className="flex">
                    {/* Priority bar */}
                    <div className={`w-1 flex-shrink-0 ${ticket.status === "Completed" ? "bg-green-200" : priorityStyle.bar}`} />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Badges row */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge className={`text-xs ${getStatusStyle(ticket.status)}`}>
                              {ticket.status}
                            </Badge>
                            <Badge className={`text-xs ${priorityStyle.badge}`}>
                              {ticket.priority} Priority
                            </Badge>
                            <Badge variant="outline" className="text-xs font-normal">
                              {ticket.category}
                            </Badge>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm font-semibold text-foreground leading-snug mb-1.5">
                            {ticket.title}
                          </h3>

                          {/* Location + tenant */}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              {ticket.propertyName} · Unit {ticket.unitNumber}
                            </span>
                            {ticket.tenantName && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3 flex-shrink-0" />
                                {ticket.tenantName}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              {ticket.createdDate}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-2">
                            {ticket.description}
                          </p>

                          {/* Notes */}
                          {ticket.notes && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Note: {ticket.notes}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {ticket.status !== "In Progress" && ticket.status !== "Completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8"
                              onClick={() => {
                                updateMaintenanceTicket(ticket.id, { status: "In Progress" });
                                toast.success("Ticket marked as In Progress");
                              }}
                            >
                              <Clock className="mr-1.5 h-3 w-3" />
                              Start
                            </Button>
                          )}
                          {ticket.status !== "Completed" && (
                            <Button
                              size="sm"
                              className="text-xs h-8 bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                updateMaintenanceTicket(ticket.id, { status: "Completed" });
                                toast.success("Ticket marked as completed");
                              }}
                            >
                              <CheckCircle2 className="mr-1.5 h-3 w-3" />
                              Complete
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Ticket actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/maintenance/${ticket.id}`)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(ticket)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => handleDeleteRequest(ticket.id, ticket.title)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Ticket"
        description={`Are you sure you want to delete "${ticketToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Ticket"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="danger"
      />
    </MainLayout>
  );
}
