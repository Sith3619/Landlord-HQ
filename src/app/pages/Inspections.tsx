import { useState } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
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
  DialogTrigger,
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
  Plus,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
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

const TAB_FILTERS = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Follow-Up Required", value: "Follow-Up Required" },
];

export function Inspections() {
  const navigate = useNavigate();
  const { inspections, properties, units, tenants, addInspection } = useApp();

  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: "",
    propertyId: 0,
    unitId: null as number | null,
    tenantId: null as number | null,
    scheduledDate: "",
    inspectorName: "",
    notes: "",
  });

  const filteredInspections = inspections.filter((insp) => {
    if (activeTab === "all") return true;
    return insp.status === activeTab;
  });

  const scheduledCount = inspections.filter((i) => i.status === "Scheduled").length;
  const completedCount = inspections.filter((i) => i.status === "Completed").length;
  const followUpCount = inspections.filter((i) => i.status === "Follow-Up Required").length;
  const totalCount = inspections.length;

  const resetForm = () => {
    setFormData({
      type: "",
      propertyId: 0,
      unitId: null,
      tenantId: null,
      scheduledDate: "",
      inspectorName: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.propertyId || !formData.scheduledDate || !formData.inspectorName) {
      toast.error("Please fill in all required fields");
      return;
    }
    addInspection({
      type: formData.type,
      propertyId: formData.propertyId,
      unitId: formData.unitId,
      tenantId: formData.tenantId,
      scheduledDate: formData.scheduledDate,
      inspectorName: formData.inspectorName,
      status: "Scheduled",
      notes: formData.notes,
      findings: [],
      followUpRequired: false,
    });
    toast.success("Inspection scheduled");
    resetForm();
    setIsDialogOpen(false);
  };

  const filteredUnits = formData.propertyId
    ? units.filter((u) => u.propertyId === formData.propertyId)
    : [];

  const filteredTenants = formData.unitId
    ? tenants.filter((t) => t.unitId === formData.unitId)
    : tenants;

  return (
    <MainLayout title="Inspections">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Inspections</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Schedule and track property inspections · {totalCount}{" "}
              {totalCount === 1 ? "inspection" : "inspections"}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Inspection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Schedule Inspection</DialogTitle>
                  <DialogDescription>
                    Add a new inspection to your schedule
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="space-y-2">
                    <Label>Inspection Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Move-In">Move-In</SelectItem>
                        <SelectItem value="Move-Out">Move-Out</SelectItem>
                        <SelectItem value="Routine">Routine</SelectItem>
                        <SelectItem value="Annual">Annual</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Property *</Label>
                    <Select
                      value={formData.propertyId ? String(formData.propertyId) : ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, propertyId: Number(value), unitId: null, tenantId: null })
                      }
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unit (Optional)</Label>
                      <Select
                        value={formData.unitId ? String(formData.unitId) : "none"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, unitId: value === "none" ? null : Number(value), tenantId: null })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {filteredUnits.map((unit) => (
                            <SelectItem key={unit.id} value={String(unit.id)}>
                              Unit {unit.unitNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tenant (Optional)</Label>
                      <Select
                        value={formData.tenantId ? String(formData.tenantId) : "none"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, tenantId: value === "none" ? null : Number(value) })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {filteredTenants.map((tenant) => (
                            <SelectItem key={tenant.id} value={String(tenant.id)}>
                              {tenant.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insp-date">Inspection Date *</Label>
                      <Input
                        id="insp-date"
                        type="date"
                        className="h-10"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insp-inspector">Inspector *</Label>
                      <Input
                        id="insp-inspector"
                        placeholder="e.g., Property Manager"
                        className="h-10"
                        value={formData.inspectorName}
                        onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insp-notes">Notes (Optional)</Label>
                    <Textarea
                      id="insp-notes"
                      placeholder="Add any notes or instructions..."
                      rows={3}
                      className="resize-none"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Schedule Inspection
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Scheduled</p>
                <Calendar className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{scheduledCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">upcoming</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completed</p>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{completedCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">finished</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Follow-Up</p>
                <AlertTriangle className="h-4 w-4 text-orange-400" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{followUpCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">require action</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total</p>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground/70" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{totalCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">all time</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab filter */}
        <div className="border-b border-border overflow-x-auto">
          <nav className="flex gap-0 -mb-px min-w-max" aria-label="Filter inspections">
            {TAB_FILTERS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-muted-foreground hover:text-muted-foreground hover:border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Table */}
        <Card className="border border-border shadow-none">
          <CardContent className="p-0">
            {filteredInspections.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                  <ClipboardCheck className="h-7 w-7 text-muted-foreground/70" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">No inspections found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {activeTab !== "all"
                    ? "No inspections match this filter"
                    : "Schedule your first inspection to get started"}
                </p>
                {activeTab === "all" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Inspection
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-accent/50">
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                        Type
                      </TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                        Property
                      </TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                        Unit
                      </TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                        Inspector
                      </TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-right font-medium text-xs uppercase tracking-wide text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspections.map((insp) => (
                      <TableRow
                        key={insp.id}
                        className="hover:bg-accent/50 cursor-pointer"
                        onClick={() => navigate(`/inspections/${insp.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium text-foreground text-sm">{insp.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">{insp.propertyName}</div>
                          {insp.tenantName && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <User className="h-3 w-3" />
                              {insp.tenantName}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                          {insp.unitNumber ? (
                            <span>Unit {insp.unitNumber}</span>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            {insp.scheduledDate}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                          {insp.inspectorName}
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getStatusBadgeClass(insp.status)}`}>
                            {insp.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => navigate(`/inspections/${insp.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
