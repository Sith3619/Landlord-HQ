import { useState } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "../components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { ScrollText, Plus, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { useApp, computeLeaseStatus, daysUntilExpiry } from "../context/AppContext";
import { toast } from "sonner";

function leaseStatusBadge(status: string): string {
  switch (status) {
    case "Active": return "bg-green-50 text-green-700 border border-green-100";
    case "Expiring Soon": return "bg-amber-50 text-amber-700 border border-amber-100";
    case "Expired": return "bg-muted text-muted-foreground border border-border";
    case "Terminated": return "bg-red-50 text-red-700 border border-red-100";
    case "Renewed": return "bg-blue-50 text-blue-700 border border-blue-100";
    case "Draft": return "bg-purple-50 text-purple-700 border border-purple-100";
    default: return "bg-muted text-muted-foreground border border-border";
  }
}

export function Leases() {
  const navigate = useNavigate();
  const { leases, properties, units, tenants, addLease } = useApp();
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    propertyId: "",
    unitId: "",
    tenantId: "",
    leaseType: "Fixed Term",
    startDate: "",
    endDate: "",
    rentAmount: "",
    rentDueDay: "1",
    securityDeposit: "",
    noticePeriodDays: "60",
    notes: "",
  });

  const leasesWithStatus = leases.map(l => ({ ...l, computedStatus: computeLeaseStatus(l) }));

  const filtered = leasesWithStatus.filter(l => {
    if (filter !== "All" && l.computedStatus !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const firstTenant = tenants.find(t => l.tenantIds.includes(t.id));
      return (
        l.propertyName.toLowerCase().includes(q) ||
        l.unitNumber.toLowerCase().includes(q) ||
        (firstTenant?.fullName.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const counts = {
    all: leasesWithStatus.length,
    active: leasesWithStatus.filter(l => l.computedStatus === "Active").length,
    expiringSoon: leasesWithStatus.filter(l => l.computedStatus === "Expiring Soon").length,
    expired: leasesWithStatus.filter(l => l.computedStatus === "Expired").length,
  };

  const filteredUnits = form.propertyId ? units.filter(u => u.propertyId === Number(form.propertyId)) : [];
  const filteredTenants = form.unitId
    ? tenants.filter(t => !t.unitId || t.unitId === Number(form.unitId))
    : tenants.filter(t => !t.unitId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId || !form.unitId || !form.rentAmount || !form.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    addLease({
      status: "Active",
      leaseType: form.leaseType,
      propertyId: Number(form.propertyId),
      unitId: Number(form.unitId),
      tenantIds: form.tenantId ? [Number(form.tenantId)] : [],
      startDate: form.startDate,
      endDate: form.leaseType === "Fixed Term" ? form.endDate || null : null,
      rentAmount: Number(form.rentAmount),
      rentDueDay: Number(form.rentDueDay),
      securityDeposit: Number(form.securityDeposit) || 0,
      noticePeriodDays: Number(form.noticePeriodDays) || 60,
      notes: form.notes,
    });
    toast.success("Lease created successfully");
    setDialogOpen(false);
    setForm({ propertyId: "", unitId: "", tenantId: "", leaseType: "Fixed Term", startDate: "", endDate: "", rentAmount: "", rentDueDay: "1", securityDeposit: "", noticePeriodDays: "60", notes: "" });
  };

  const tabs = [
    { label: "All", value: "All", count: counts.all },
    { label: "Active", value: "Active", count: counts.active },
    { label: "Expiring Soon", value: "Expiring Soon", count: counts.expiringSoon },
    { label: "Expired", value: "Expired", count: counts.expired },
  ];

  return (
    <MainLayout title="Leases">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Leases</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Track all rental agreements and key dates</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Lease
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Leases", value: counts.active, icon: CheckCircle2, color: "text-green-600" },
            { label: "Expiring Soon", value: counts.expiringSoon, icon: AlertTriangle, color: counts.expiringSoon > 0 ? "text-amber-600" : "text-foreground" },
            { label: "Expired", value: counts.expired, icon: Clock, color: "text-muted-foreground" },
            { label: "Total Leases", value: counts.all, icon: ScrollText, color: "text-foreground" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border border-border shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className={`text-2xl font-semibold ${color}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex border-b border-border gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-1.5 px-3 pb-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  filter === tab.value
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-muted-foreground hover:text-muted-foreground"
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.value ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <Input
            placeholder="Search leases..."
            className="h-9 w-full sm:w-56"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <Card className="border border-border shadow-none">
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <ScrollText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">No leases found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {search ? "Try a different search" : "Create your first lease to get started"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-accent/50">
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pl-6">Unit / Property</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Tenant</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Type</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Period</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Rent</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(lease => {
                    const primaryTenant = tenants.find(t => t.id === lease.tenantIds[0]);
                    const allTenants = tenants.filter(t => lease.tenantIds.includes(t.id));
                    const days = lease.endDate ? daysUntilExpiry(lease.endDate) : null;
                    return (
                      <TableRow
                        key={lease.id}
                        className="hover:bg-accent/50 cursor-pointer"
                        onClick={() => navigate(`/leases/${lease.id}`)}
                      >
                        <TableCell className="pl-6">
                          <p className="font-medium text-foreground">Unit {lease.unitNumber}</p>
                          <p className="text-xs text-muted-foreground">{lease.propertyName}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-foreground">{primaryTenant?.fullName || "—"}</p>
                          {allTenants.length > 1 && (
                            <p className="text-xs text-muted-foreground">+{allTenants.length - 1} co-tenant{allTenants.length > 2 ? "s" : ""}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{lease.leaseType}</span>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-foreground">{lease.startDate}</p>
                          {lease.endDate && (
                            <p className={`text-xs ${days !== null && days <= 60 && days >= 0 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                              {days !== null && days >= 0 ? `Ends ${lease.endDate}` : `Ended ${lease.endDate}`}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-foreground">${lease.rentAmount.toLocaleString()}/mo</span>
                        </TableCell>
                        <TableCell className="pr-6">
                          <div className="flex flex-col gap-1">
                            <Badge className={`text-xs font-medium w-fit ${leaseStatusBadge(lease.computedStatus)}`}>
                              {lease.computedStatus}
                            </Badge>
                            {lease.computedStatus === "Expiring Soon" && days !== null && days >= 0 && (
                              <span className="text-xs text-amber-600">{days}d remaining</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Lease Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>New Lease</DialogTitle>
              <DialogDescription>Create a new rental lease agreement</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property *</Label>
                  <Select value={form.propertyId} onValueChange={v => setForm(f => ({ ...f, propertyId: v, unitId: "", tenantId: "" }))}>
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select property" /></SelectTrigger>
                    <SelectContent>
                      {properties.filter(p => !p.isArchived).map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unit *</Label>
                  <Select value={form.unitId} onValueChange={v => setForm(f => ({ ...f, unitId: v, tenantId: "" }))} disabled={!form.propertyId}>
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select unit" /></SelectTrigger>
                    <SelectContent>
                      {filteredUnits.map(u => <SelectItem key={u.id} value={String(u.id)}>Unit {u.unitNumber}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary Tenant</Label>
                <Select value={form.tenantId} onValueChange={v => setForm(f => ({ ...f, tenantId: v }))}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="Select tenant (optional)" /></SelectTrigger>
                  <SelectContent>
                    {filteredTenants.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lease Type *</Label>
                  <Select value={form.leaseType} onValueChange={v => setForm(f => ({ ...f, leaseType: v }))}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fixed Term">Fixed Term</SelectItem>
                      <SelectItem value="Month-to-Month">Month-to-Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rent Due Day</Label>
                  <Input type="number" min="1" max="31" className="h-10" value={form.rentDueDay} onChange={e => setForm(f => ({ ...f, rentDueDay: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input type="date" className="h-10" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required />
                </div>
                {form.leaseType === "Fixed Term" && (
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" className="h-10" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Rent *</Label>
                  <Input type="number" placeholder="2000" className="h-10" value={form.rentAmount} onChange={e => setForm(f => ({ ...f, rentAmount: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit</Label>
                  <Input type="number" placeholder="3000" className="h-10" value={form.securityDeposit} onChange={e => setForm(f => ({ ...f, securityDeposit: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea className="resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Create Lease</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
