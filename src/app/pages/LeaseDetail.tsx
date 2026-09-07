import { useState } from "react";
import { useParams, useNavigate } from "react-router";
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
import {
  ArrowLeft, Building2, DoorOpen, User, Calendar, DollarSign, CheckCircle2,
  AlertTriangle, RefreshCw, Plus,
} from "lucide-react";
import { useApp, computeLeaseStatus, daysUntilExpiry } from "../context/AppContext";
import { toast } from "sonner";
import { ConfirmDialog } from "../components/common/ConfirmDialog";

function statusBadgeClass(status: string): string {
  switch (status) {
    case "Active": return "bg-green-50 text-green-700 border border-green-100";
    case "Expiring Soon": return "bg-amber-50 text-amber-700 border border-amber-100";
    case "Expired": return "bg-muted text-muted-foreground border border-border";
    case "Terminated": return "bg-red-50 text-red-700 border border-red-100";
    case "Renewed": return "bg-blue-50 text-blue-700 border border-blue-100";
    default: return "bg-muted text-muted-foreground border border-border";
  }
}

function rentStatusBadge(status: string): string {
  switch (status) {
    case "Paid": return "bg-green-50 text-green-700 border border-green-100";
    case "Due": return "bg-blue-50 text-blue-700 border border-blue-100";
    case "Overdue": return "bg-red-50 text-red-700 border border-red-100";
    case "Partially Paid": return "bg-amber-50 text-amber-700 border border-amber-100";
    default: return "bg-muted text-muted-foreground border border-border";
  }
}

export function LeaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leases, units, properties, tenants, rentPayments, documents, updateLease, addRentPayment, addLease } = useApp();

  const lease = leases.find(l => l.id === Number(id));

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [payment, setPayment] = useState({ amountPaid: "", date: new Date().toISOString().split("T")[0], method: "Bank Transfer", note: "" });
  const [renewal, setRenewal] = useState({ newEndDate: "", rentAmount: "", notes: "" });

  if (!lease) {
    return (
      <MainLayout title="Lease Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">This lease could not be found.</p>
          <Button onClick={() => navigate("/leases")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leases
          </Button>
        </div>
      </MainLayout>
    );
  }

  const computedStatus = computeLeaseStatus(lease);
  const days = lease.endDate ? daysUntilExpiry(lease.endDate) : null;
  const unit = units.find(u => u.id === lease.unitId);
  const property = properties.find(p => p.id === lease.propertyId);
  const leaseTenants = tenants.filter(t => lease.tenantIds.includes(t.id));
  const primaryTenant = leaseTenants[0] ?? null;
  const leasePayments = rentPayments.filter(p => p.leaseId === lease.id).sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  const leaseDocuments = documents.filter(d => d.leaseId === lease.id);

  const totalPaid = leasePayments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amountPaid, 0);
  const outstanding = leasePayments.filter(p => p.status !== "Paid").reduce((s, p) => s + (p.amountDue - p.amountPaid), 0);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment.amountPaid || !payment.date) {
      toast.error("Please fill in payment amount and date");
      return;
    }
    if (!primaryTenant) {
      toast.error("No tenant associated with this lease");
      return;
    }
    addRentPayment({
      leaseId: lease.id,
      unitId: lease.unitId,
      tenantId: primaryTenant.id,
      amountDue: lease.rentAmount,
      amountPaid: Number(payment.amountPaid),
      dueDate: payment.date,
      paidDate: payment.date,
      status: Number(payment.amountPaid) >= lease.rentAmount ? "Paid" : "Partially Paid",
      method: payment.method,
      note: payment.note,
    });
    toast.success("Payment recorded successfully");
    setPaymentOpen(false);
    setPayment({ amountPaid: "", date: new Date().toISOString().split("T")[0], method: "Bank Transfer", note: "" });
  };

  const handleRenew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewal.newEndDate) {
      toast.error("Please enter the new end date");
      return;
    }
    const newRent = Number(renewal.rentAmount) || lease.rentAmount;
    addLease({
      status: "Active",
      leaseType: lease.leaseType,
      propertyId: lease.propertyId,
      unitId: lease.unitId,
      tenantIds: lease.tenantIds,
      startDate: new Date().toISOString().split("T")[0],
      endDate: renewal.newEndDate,
      rentAmount: newRent,
      rentDueDay: lease.rentDueDay,
      securityDeposit: lease.securityDeposit,
      noticePeriodDays: lease.noticePeriodDays,
      notes: renewal.notes || `Renewed from Lease #${lease.id}`,
    });
    updateLease(lease.id, { status: "Renewed" });
    toast.success("Lease renewed successfully");
    setRenewOpen(false);
    navigate("/leases");
  };

  const handleTerminate = () => {
    updateLease(lease.id, { status: "Terminated" });
    toast.success("Lease marked as terminated");
    setTerminateOpen(false);
  };

  return (
    <MainLayout title={`Lease — Unit ${lease.unitNumber}`}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/leases")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Leases
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Lease — Unit {lease.unitNumber}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">{lease.propertyName} · {lease.leaseType}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`text-xs font-medium ${statusBadgeClass(computedStatus)}`}>
                {computedStatus}
              </Badge>
              {computedStatus === "Expiring Soon" && days !== null && (
                <span className="text-xs text-amber-600 font-medium">Expires in {days} days</span>
              )}
            </div>
          </div>
        </div>

        {/* Expiring Soon Banner */}
        {computedStatus === "Expiring Soon" && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Lease expiring soon</p>
              <p className="text-xs text-amber-700">This lease expires on {lease.endDate} ({days} days). Consider discussing renewal with the tenant.</p>
            </div>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white flex-shrink-0" onClick={() => setRenewOpen(true)}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Renew
            </Button>
          </div>
        )}

        {/* Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Monthly Rent", value: `$${lease.rentAmount.toLocaleString()}`, sub: `Due day ${lease.rentDueDay}`, icon: DollarSign },
            { label: "Security Deposit", value: `$${lease.securityDeposit.toLocaleString()}`, sub: "held", icon: DollarSign },
            { label: "Total Collected", value: `$${totalPaid.toLocaleString()}`, sub: "this lease", icon: CheckCircle2 },
            { label: "Outstanding", value: `$${outstanding.toLocaleString()}`, sub: "balance", icon: AlertTriangle },
          ].map(({ label, value, sub, icon: Icon }) => (
            <Card key={label} className="border border-border shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className={`text-xl font-semibold ${label === "Outstanding" && outstanding > 0 ? "text-red-600" : "text-foreground"}`}>{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Lease Details */}
          <Card className="border border-border shadow-none">
            <CardHeader><CardTitle className="text-base">Lease Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Lease Type", value: lease.leaseType },
                { label: "Status", value: computedStatus },
                { label: "Start Date", value: lease.startDate },
                { label: "End Date", value: lease.endDate || "Month-to-Month" },
                { label: "Monthly Rent", value: `$${lease.rentAmount.toLocaleString()}` },
                { label: "Security Deposit", value: `$${lease.securityDeposit.toLocaleString()}` },
                { label: "Rent Due Day", value: `Day ${lease.rentDueDay} of each month` },
                { label: "Notice Period", value: `${lease.noticePeriodDays} days` },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                  <p className="text-sm text-foreground">{value}</p>
                </div>
              ))}
              {lease.notes && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground italic">{lease.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Associated Entities */}
          <div className="space-y-4">
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
                    <p className="text-xs text-muted-foreground">{property.address}, {property.city}</p>
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
                    <p className="text-xs text-muted-foreground">{unit.status} · ${unit.rent.toLocaleString()}/mo</p>
                  </div>
                </button>
              </div>
            )}
            {leaseTenants.map(tenant => (
              <div key={tenant.id}>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">
                  {tenant.id === primaryTenant?.id ? "Primary Tenant" : "Co-Tenant"}
                </p>
                <button
                  onClick={() => navigate(`/tenants/${tenant.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 hover:bg-accent transition-colors w-full text-left"
                >
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{tenant.fullName}</p>
                    <p className="text-xs text-muted-foreground">{tenant.email}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <Card className="border border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Rent Payment History</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setPaymentOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Record Payment
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {leasePayments.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No payments recorded yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-accent/50">
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pl-6">Due Date</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Paid Date</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Amount Due</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Amount Paid</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Method</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leasePayments.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="pl-6 text-sm text-foreground">{p.dueDate}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.paidDate || "—"}</TableCell>
                      <TableCell className="text-sm text-foreground">${p.amountDue.toLocaleString()}</TableCell>
                      <TableCell className={`text-sm font-medium ${p.amountPaid < p.amountDue ? "text-amber-700" : "text-foreground"}`}>
                        {p.amountPaid > 0 ? `$${p.amountPaid.toLocaleString()}` : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.method || "—"}</TableCell>
                      <TableCell className="pr-6">
                        <Badge className={`text-xs font-medium ${rentStatusBadge(p.status)}`}>{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        {leaseDocuments.length > 0 && (
          <Card className="border border-border shadow-none">
            <CardHeader><CardTitle className="text-base">Lease Documents</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-accent/50">
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pl-6">Document</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Type</TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground pr-6">Uploaded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaseDocuments.map(doc => (
                    <TableRow
                      key={doc.id}
                      className="hover:bg-accent/50 cursor-pointer"
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    >
                      <TableCell className="font-medium text-foreground pl-6">{doc.name}</TableCell>
                      <TableCell><Badge variant="outline" className="font-normal text-xs">{doc.documentType}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground pr-6">{doc.uploadDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {!["Expired", "Terminated", "Renewed"].includes(computedStatus) && (
          <Card className="border border-border shadow-none">
            <CardHeader><CardTitle className="text-base">Lease Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setRenewOpen(true)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Renew Lease
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => setTerminateOpen(true)}
                >
                  Terminate Lease
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Record Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <form onSubmit={handleRecordPayment}>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>Record a rent payment for this lease (${lease.rentAmount.toLocaleString()}/mo)</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Amount Paid *</Label>
                <Input type="number" placeholder={String(lease.rentAmount)} className="h-10" value={payment.amountPaid} onChange={e => setPayment(p => ({ ...p, amountPaid: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Payment Date *</Label>
                <Input type="date" className="h-10" value={payment.date} onChange={e => setPayment(p => ({ ...p, date: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={payment.method} onValueChange={v => setPayment(p => ({ ...p, method: v }))}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Bank Transfer", "Cash", "Cheque", "Other"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Note</Label>
                <Input className="h-10" placeholder="Optional note" value={payment.note} onChange={e => setPayment(p => ({ ...p, note: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Record Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <form onSubmit={handleRenew}>
            <DialogHeader>
              <DialogTitle>Renew Lease</DialogTitle>
              <DialogDescription>Create a new lease term for this unit and tenant</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>New End Date *</Label>
                <Input type="date" className="h-10" value={renewal.newEndDate} onChange={e => setRenewal(r => ({ ...r, newEndDate: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>New Monthly Rent</Label>
                <Input type="number" placeholder={String(lease.rentAmount)} className="h-10" value={renewal.rentAmount} onChange={e => setRenewal(r => ({ ...r, rentAmount: e.target.value }))} />
                <p className="text-xs text-muted-foreground">Leave blank to keep current rent (${lease.rentAmount.toLocaleString()}/mo)</p>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input className="h-10" value={renewal.notes} onChange={e => setRenewal(r => ({ ...r, notes: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRenewOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Renew Lease</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Terminate Confirm */}
      <ConfirmDialog
        open={terminateOpen}
        onOpenChange={setTerminateOpen}
        title="Terminate Lease"
        description="Are you sure you want to terminate this lease? This action marks the lease as terminated. Tenant and payment records are preserved."
        confirmText="Terminate Lease"
        variant="danger"
        onConfirm={handleTerminate}
      />
    </MainLayout>
  );
}
