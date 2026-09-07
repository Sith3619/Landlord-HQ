import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  ArrowLeft,
  DollarSign,
  Shield,
  Wrench,
  FileText,
  Building2,
  AlertTriangle,
  ChevronRight,
  UserPlus,
  LogOut,
  Activity,
  Clock,
  ClipboardCheck,
  RefreshCw,
} from "lucide-react";
import { useApp, computeLeaseStatus, daysUntilExpiry } from "../context/AppContext";

// ─── Badge helpers ────────────────────────────────────────────────────────────

function unitStatusBadge(status: string) {
  switch (status) {
    case "Occupied": return "bg-green-50 text-green-700 border border-green-100";
    case "Vacant": return "bg-amber-50 text-amber-700 border border-amber-100";
    case "Under Maintenance": return "bg-orange-50 text-orange-700 border border-orange-100";
    case "Coming Soon": return "bg-blue-50 text-blue-700 border border-blue-100";
    default: return "bg-muted text-muted-foreground border border-border";
  }
}

function leaseStatusBadge(status: string) {
  switch (status) {
    case "Active": return "bg-green-50 text-green-700 border border-green-100";
    case "Expiring Soon": return "bg-amber-50 text-amber-700 border border-amber-100";
    case "Expired":
    case "Terminated": return "bg-red-50 text-red-700 border border-red-100";
    default: return "bg-muted text-muted-foreground border border-border";
  }
}

function priorityBadge(priority: string) {
  switch (priority) {
    case "Urgent": return "bg-red-50 text-red-700 border border-red-100";
    case "High": return "bg-orange-50 text-orange-700 border border-orange-100";
    case "Medium": return "bg-amber-50 text-amber-700 border border-amber-100";
    default: return "bg-muted text-muted-foreground border border-border";
  }
}

function maintenanceStatusBadge(status: string) {
  switch (status) {
    case "Completed": return "bg-green-50 text-green-700 border border-green-100";
    case "In Progress": return "bg-blue-50 text-blue-700 border border-blue-100";
    case "Scheduled": return "bg-purple-50 text-purple-700 border border-purple-100";
    default: return "bg-muted text-muted-foreground border border-border";
  }
}

function rentStatusBadge(status: string) {
  switch (status) {
    case "Paid": return "bg-green-50 text-green-700 border border-green-100";
    case "Due": return "bg-blue-50 text-blue-700 border border-blue-100";
    case "Overdue": return "bg-red-50 text-red-700 border border-red-100";
    case "Partially Paid": return "bg-amber-50 text-amber-700 border border-amber-100";
    default: return "bg-muted text-muted-foreground border border-border";
  }
}

function inspectionStatusBadge(status: string) {
  switch (status) {
    case "Completed": return "bg-green-50 text-green-700 border border-green-100";
    case "In Progress": return "bg-blue-50 text-blue-700 border border-blue-100";
    case "Follow-Up Required": return "bg-red-50 text-red-700 border border-red-100";
    default: return "bg-muted text-muted-foreground border border-border";
  }
}

const LABEL = "text-xs text-muted-foreground uppercase tracking-wide font-medium";
const today = new Date().toISOString().split("T")[0];

// ─── Move-In Dialog ───────────────────────────────────────────────────────────

function MoveInDialog({ open, onOpenChange, unitId, propertyId }: {
  open: boolean; onOpenChange: (v: boolean) => void; unitId: number; propertyId: number;
}) {
  const { tenants, completeMoveIn } = useApp();
  const [step, setStep] = useState(1);
  const [tenantId, setTenantId] = useState("");
  const [leaseType, setLeaseType] = useState("Fixed Term");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [monthToMonth, setMonthToMonth] = useState(false);
  const [rentAmount, setRentAmount] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [rentDueDay, setRentDueDay] = useState("1");
  const [moveInDate, setMoveInDate] = useState(today);
  const [notes, setNotes] = useState("");

  const available = tenants.filter(t => !t.unitId || t.unitId === unitId);
  const selected = tenants.find(t => t.id === Number(tenantId));

  function reset() {
    setStep(1); setTenantId(""); setLeaseType("Fixed Term");
    setStartDate(today); setEndDate(""); setMonthToMonth(false);
    setRentAmount(""); setSecurityDeposit(""); setRentDueDay("1");
    setMoveInDate(today); setNotes("");
  }

  function close() { reset(); onOpenChange(false); }

  function complete() {
    if (!tenantId) return;
    completeMoveIn({
      tenantId: Number(tenantId), unitId, propertyId, leaseType,
      startDate, endDate: monthToMonth ? null : endDate || null,
      rentAmount: Number(rentAmount), rentDueDay: Number(rentDueDay),
      securityDeposit: Number(securityDeposit), moveInDate, notes,
    });
    toast.success(`Move-in complete for ${selected?.fullName}`);
    close();
  }

  const ok1 = !!tenantId && !!leaseType;
  const ok2 = !!startDate && !!rentAmount && !!securityDeposit && (monthToMonth || !!endDate);
  const ok3 = !!moveInDate;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Move-In Wizard — Step {step} of 3</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-green-600" : "bg-muted"}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className={LABEL}>Tenant</Label>
              <Select value={tenantId} onValueChange={setTenantId}>
                <SelectTrigger><SelectValue placeholder="Choose tenant…" /></SelectTrigger>
                <SelectContent>
                  {available.map(t => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.fullName} ({t.lifecycleStatus})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className={LABEL}>Lease Type</Label>
              <Select value={leaseType} onValueChange={setLeaseType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed Term">Fixed Term</SelectItem>
                  <SelectItem value="Month-to-Month">Month-to-Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className={LABEL}>Start Date</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className={LABEL}>End Date</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={monthToMonth} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="mtm" checked={monthToMonth}
                onChange={e => { setMonthToMonth(e.target.checked); if (e.target.checked) setEndDate(""); }}
                className="rounded" />
              <label htmlFor="mtm" className="text-sm text-muted-foreground">Month-to-Month (no end date)</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className={LABEL}>Monthly Rent ($)</Label>
                <Input type="number" placeholder="e.g. 1800" value={rentAmount} onChange={e => setRentAmount(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className={LABEL}>Security Deposit ($)</Label>
                <Input type="number" placeholder="e.g. 1800" value={securityDeposit} onChange={e => setSecurityDeposit(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className={LABEL}>Rent Due Day</Label>
              <Select value={rentDueDay} onValueChange={setRentDueDay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                    <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className={LABEL}>Move-In Date</Label>
              <Input type="date" value={moveInDate} onChange={e => setMoveInDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className={LABEL}>Notes</Label>
              <Textarea placeholder="Any notes…" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Summary</p>
              {[
                ["Tenant", selected?.fullName || "—"],
                ["Lease", leaseType],
                ["Start", startDate],
                ["End", monthToMonth ? "Month-to-Month" : endDate || "—"],
                ["Rent", rentAmount ? `$${Number(rentAmount).toLocaleString()}` : "—"],
                ["Deposit", securityDeposit ? `$${Number(securityDeposit).toLocaleString()}` : "—"],
                ["Move-In", moveInDate],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={step === 1 ? close : () => setStep(s => s - 1)}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          {step < 3 ? (
            <Button className="bg-green-600 hover:bg-green-700 text-white"
              disabled={step === 1 ? !ok1 : !ok2}
              onClick={() => setStep(s => s + 1)}>
              Next
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={!ok3} onClick={complete}>
              Complete Move-In
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Move-Out Dialog ──────────────────────────────────────────────────────────

function MoveOutDialog({ open, onOpenChange, tenantId, tenantName, unitId, leaseId }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  tenantId: number; tenantName: string; unitId: number; leaseId: number;
}) {
  const { completeMoveOut } = useApp();
  const [moveOutDate, setMoveOutDate] = useState(today);
  const [reason, setReason] = useState("End of Lease");
  const [unitNextStatus, setUnitNextStatus] = useState("Vacant");
  const [depositReturned, setDepositReturned] = useState("");
  const [notes, setNotes] = useState("");

  function close() {
    onOpenChange(false);
    setMoveOutDate(today); setReason("End of Lease");
    setUnitNextStatus("Vacant"); setDepositReturned(""); setNotes("");
  }

  function complete() {
    completeMoveOut({
      tenantId, unitId, leaseId, moveOutDate, reason, unitNextStatus,
      securityDepositReturned: Number(depositReturned) || 0, notes,
    });
    toast.success(`Move-out complete for ${tenantName}`);
    close();
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader><DialogTitle>Move-Out — {tenantName}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className={LABEL}>Move-Out Date</Label>
            <Input type="date" value={moveOutDate} onChange={e => setMoveOutDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className={LABEL}>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="End of Lease">End of Lease</SelectItem>
                <SelectItem value="Eviction">Eviction</SelectItem>
                <SelectItem value="Mutual Agreement">Mutual Agreement</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className={LABEL}>Unit After Move-Out</Label>
            <Select value={unitNextStatus} onValueChange={setUnitNextStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Vacant">Vacant</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className={LABEL}>Security Deposit Returned ($)</Label>
            <Input type="number" placeholder="0" value={depositReturned} onChange={e => setDepositReturned(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className={LABEL}>Notes</Label>
            <Textarea placeholder="Move-out notes…" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={!moveOutDate} onClick={complete}>
            <LogOut className="h-4 w-4 mr-2" />
            Complete Move-Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Record Payment Dialog ────────────────────────────────────────────────────

function RecordPaymentDialog({ open, onOpenChange, unitId, leaseId, tenantId, amountDue }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  unitId: number; leaseId: number | null; tenantId: number | null; amountDue: number;
}) {
  const { addRentPayment } = useApp();
  const [amountPaid, setAmountPaid] = useState(String(amountDue));
  const [dueDate, setDueDate] = useState(today);
  const [paidDate, setPaidDate] = useState(today);
  const [method, setMethod] = useState("e-Transfer");
  const [note, setNote] = useState("");

  function close() {
    onOpenChange(false);
    setAmountPaid(String(amountDue)); setDueDate(today);
    setPaidDate(today); setMethod("e-Transfer"); setNote("");
  }

  function submit() {
    if (!leaseId || !tenantId) { toast.error("No active lease found."); return; }
    const paid = Number(amountPaid);
    const status = paid >= amountDue ? "Paid" : paid > 0 ? "Partially Paid" : "Due";
    addRentPayment({ leaseId, unitId, tenantId, amountDue, amountPaid: paid, dueDate, paidDate, status, method, note });
    toast.success("Payment recorded");
    close();
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={LABEL}>Amount Due ($)</Label>
              <Input type="number" value={amountDue} readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label className={LABEL}>Amount Paid ($)</Label>
              <Input type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={LABEL}>Due Date</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className={LABEL}>Paid Date</Label>
              <Input type="date" value={paidDate} onChange={e => setPaidDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className={LABEL}>Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="e-Transfer">e-Transfer</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Direct Deposit">Direct Deposit</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className={LABEL}>Note</Label>
            <Textarea placeholder="Optional note…" rows={2} value={note} onChange={e => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={!amountPaid} onClick={submit}>
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function UnitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { units, properties, tenants, leases, rentPayments, maintenanceTickets, documents, inspections, activityEvents } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [moveInOpen, setMoveInOpen] = useState(false);
  const [moveOutTarget, setMoveOutTarget] = useState<{ tenantId: number; tenantName: string; leaseId: number } | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const unit = units.find(u => u.id === Number(id));

  if (!unit) {
    return (
      <MainLayout title="Unit Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">This unit could not be found.</p>
          <Button onClick={() => navigate("/units")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />Back to Units
          </Button>
        </div>
      </MainLayout>
    );
  }

  const property = properties.find(p => p.id === unit.propertyId);
  const unitTenants = tenants.filter(t => t.unitId === unit.id);
  const unitTickets = maintenanceTickets
    .filter(t => t.unitId === unit.id)
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  const unitDocuments = documents.filter(d => d.unitId === unit.id);
  const unitPayments = rentPayments
    .filter(p => p.unitId === unit.id)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  const unitInspections = inspections
    .filter(i => i.unitId === unit.id)
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  const unitActivity = activityEvents
    .filter(e => (e.entityType === "unit" && e.entityId === unit.id) || e.description.includes(unit.unitNumber))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const openTickets = unitTickets.filter(t => t.status !== "Completed").length;
  const activeLease = leases.find(l => l.unitId === unit.id && ["Active", "Expiring Soon"].includes(computeLeaseStatus(l)));

  const totalCollected = unitPayments
    .filter(p => p.paidDate && new Date(p.paidDate).getFullYear() === new Date().getFullYear())
    .reduce((sum, p) => sum + p.amountPaid, 0);
  const outstanding = unitPayments
    .filter(p => ["Overdue", "Partially Paid", "Due"].includes(p.status))
    .reduce((sum, p) => sum + (p.amountDue - p.amountPaid), 0);

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "occupants", label: `Occupants${unitTenants.length > 0 ? ` (${unitTenants.length})` : ""}` },
    { id: "lease", label: "Lease" },
    { id: "rent", label: "Rent" },
    { id: "maintenance", label: `Maintenance${openTickets > 0 ? ` (${openTickets})` : ""}` },
    { id: "inspections", label: "Inspections" },
    { id: "documents", label: "Documents" },
  ];

  const tabCls = (tabId: string) =>
    `px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
      activeTab === tabId ? "border-green-600 text-green-700" : "border-transparent text-muted-foreground hover:text-muted-foreground"
    }`;

  return (
    <MainLayout title={`Unit ${unit.unitNumber}`}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button onClick={() => navigate("/units")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-3.5 w-3.5" />Units
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Unit {unit.unitNumber}</h2>
              <button onClick={() => property && navigate(`/properties/${property.id}`)}
                className="text-sm text-green-600 hover:underline mt-0.5 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {property?.name || unit.propertyName}
              </button>
            </div>
            <Badge className={`font-medium ${unitStatusBadge(unit.status)}`}>{unit.status}</Badge>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Monthly Rent", value: `$${unit.rent.toLocaleString()}`, sub: "per month", icon: DollarSign },
            { label: "Security Deposit", value: unit.securityDeposit != null ? `$${unit.securityDeposit.toLocaleString()}` : "—", sub: "on file", icon: Shield },
            { label: "Open Tickets", value: String(openTickets), sub: "maintenance", icon: Wrench, warn: openTickets > 0 },
            { label: "Documents", value: String(unitDocuments.length), sub: "files stored", icon: FileText },
          ].map(({ label, value, sub, icon: Icon, warn }) => (
            <Card key={label} className="border border-border shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className={LABEL}>{label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className={`text-2xl font-semibold ${warn ? "text-orange-600" : "text-foreground"}`}>{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab bar */}
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={tabCls(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-border shadow-none">
              <CardHeader><CardTitle className="text-base">Unit Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Unit Number", value: unit.unitNumber },
                  { label: "Floor", value: unit.floor != null ? String(unit.floor) : "—" },
                  { label: "Bedrooms", value: unit.bedrooms != null ? String(unit.bedrooms) : "—" },
                  { label: "Bathrooms", value: unit.bathrooms != null ? String(unit.bathrooms) : "—" },
                  { label: "Square Footage", value: unit.sqft != null ? `${unit.sqft.toLocaleString()} sq ft` : "—" },
                  { label: "Furnished", value: unit.furnished ? "Yes" : "No" },
                  { label: "Status", value: unit.status },
                  { label: "Property", value: property?.name || unit.propertyName },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <p className={LABEL}>{label}</p>
                    <p className="text-sm text-foreground">{value}</p>
                  </div>
                ))}
                {unit.notes && (
                  <div className="flex flex-col gap-0.5">
                    <p className={LABEL}>Notes</p>
                    <p className="text-sm text-foreground whitespace-pre-line">{unit.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border shadow-none">
              <CardHeader><CardTitle className="text-base">Rental Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Monthly Rent", value: `$${unit.rent.toLocaleString()}` },
                  { label: "Security Deposit", value: unit.securityDeposit != null ? `$${unit.securityDeposit.toLocaleString()}` : "—" },
                  { label: "Rent Due Day", value: activeLease ? `${activeLease.rentDueDay}${["st","nd","rd"][activeLease.rentDueDay - 1] || "th"} of month` : "—" },
                  { label: "Utility Responsibility", value: unit.utilityResponsibility || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <p className={LABEL}>{label}</p>
                    <p className="text-sm text-foreground">{value}</p>
                  </div>
                ))}
                {unit.status === "Vacant" && unit.availabilityDate && (
                  <div className="flex flex-col gap-0.5">
                    <p className={LABEL}>Available From</p>
                    <p className="text-sm text-foreground">{unit.availabilityDate}</p>
                  </div>
                )}
                {unit.readinessStatus && (
                  <div className="flex flex-col gap-0.5">
                    <p className={LABEL}>Readiness</p>
                    <Badge className={`text-xs font-medium w-fit ${
                      unit.readinessStatus === "Ready" || unit.readinessStatus === "Available"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : unit.readinessStatus === "Under Maintenance"
                        ? "bg-orange-50 text-orange-700 border border-orange-100"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}>{unit.readinessStatus}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Occupants ── */}
        {activeTab === "occupants" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Current Occupants{unitTenants.length > 0 ? ` (${unitTenants.length})` : ""}
              </h3>
              {unit.status !== "Occupied" && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setMoveInOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />Move In
                </Button>
              )}
            </div>
            {unitTenants.length === 0 ? (
              <Card className="border border-border shadow-none">
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground text-sm mb-4">No occupants assigned to this unit.</p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setMoveInOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />Move In a Tenant
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border shadow-none">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className={`${LABEL} pl-6 py-3`}>Name</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Role</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Status</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Contact</TableHead>
                        <TableHead className={`${LABEL} py-3 pr-6`}>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unitTenants.map(t => (
                        <TableRow key={t.id} className="hover:bg-accent/50 cursor-pointer"
                          onClick={() => navigate(`/tenants/${t.id}`)}>
                          <TableCell className="font-medium text-foreground pl-6">
                            <div className="flex items-center gap-2">
                              {t.fullName}<ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs font-medium ${
                              t.role === "Primary" ? "bg-green-50 text-green-700 border border-green-100"
                              : t.role === "Co-tenant" ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-muted text-muted-foreground border border-border"
                            }`}>{t.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs font-medium ${
                              t.lifecycleStatus === "Active" ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-muted text-muted-foreground border border-border"
                            }`}>{t.lifecycleStatus}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            <div>{t.email}</div>
                            <div className="text-xs">{t.phone}</div>
                          </TableCell>
                          <TableCell className="pr-6" onClick={e => e.stopPropagation()}>
                            {activeLease && (
                              <Button size="sm" variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => setMoveOutTarget({ tenantId: t.id, tenantName: t.fullName, leaseId: activeLease.id })}>
                                <LogOut className="h-3.5 w-3.5 mr-1" />Move Out
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── Lease ── */}
        {activeTab === "lease" && (
          <div className="space-y-4">
            {activeLease ? (
              <>
                {computeLeaseStatus(activeLease) === "Expiring Soon" && activeLease.endDate && (
                  <div className="flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                      Lease expires in <strong>{daysUntilExpiry(activeLease.endDate)} days</strong> on {activeLease.endDate}.
                    </p>
                    <Button size="sm" className="ml-auto bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => navigate(`/leases/${activeLease.id}`)}>
                      Renew
                    </Button>
                  </div>
                )}
                <Card className="border border-border shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-base">Active Lease</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs font-medium ${leaseStatusBadge(computeLeaseStatus(activeLease))}`}>
                        {computeLeaseStatus(activeLease)}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/leases/${activeLease.id}`)}>
                        View Full Lease
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Lease Type", value: activeLease.leaseType },
                      { label: "Start Date", value: activeLease.startDate },
                      { label: "End Date", value: activeLease.endDate || "Month-to-Month" },
                      { label: "Monthly Rent", value: `$${activeLease.rentAmount.toLocaleString()}` },
                      { label: "Security Deposit", value: `$${activeLease.securityDeposit.toLocaleString()}` },
                      { label: "Rent Due Day", value: `${activeLease.rentDueDay}${["st","nd","rd"][activeLease.rentDueDay - 1] || "th"} of month` },
                      { label: "Notice Period", value: `${activeLease.noticePeriodDays} days` },
                      ...(activeLease.notes ? [{ label: "Notes", value: activeLease.notes }] : []),
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col gap-0.5">
                        <p className={LABEL}>{label}</p>
                        <p className="text-sm text-foreground">{value}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border border-border shadow-none">
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground text-sm mb-4">No active lease for this unit.</p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate("/leases")}>
                    Create Lease
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── Rent ── */}
        {activeTab === "rent" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border border-border shadow-none">
                <CardContent className="p-5">
                  <p className={`${LABEL} mb-2`}>Collected This Year</p>
                  <p className="text-2xl font-semibold text-green-700">${totalCollected.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="border border-border shadow-none">
                <CardContent className="p-5">
                  <p className={`${LABEL} mb-2`}>Outstanding Balance</p>
                  <p className={`text-2xl font-semibold ${outstanding > 0 ? "text-red-600" : "text-foreground"}`}>
                    ${outstanding.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Payment History</h3>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setPaymentOpen(true)}>
                Record Payment
              </Button>
            </div>
            {unitPayments.length === 0 ? (
              <Card className="border border-border shadow-none">
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground text-sm">No rent payments recorded for this unit.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border shadow-none">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className={`${LABEL} pl-6 py-3`}>Due Date</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Paid Date</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Amount Due</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Paid</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Balance</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Status</TableHead>
                        <TableHead className={`${LABEL} py-3 pr-6`}>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unitPayments.map(p => (
                        <TableRow key={p.id} className="hover:bg-accent/50">
                          <TableCell className="text-sm text-foreground pl-6">{p.dueDate}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{p.paidDate || "—"}</TableCell>
                          <TableCell className="text-sm text-foreground">${p.amountDue.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-foreground">${p.amountPaid.toLocaleString()}</TableCell>
                          <TableCell className={`text-sm font-medium ${(p.amountDue - p.amountPaid) > 0 ? "text-red-600" : "text-foreground"}`}>
                            ${(p.amountDue - p.amountPaid).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs font-medium ${rentStatusBadge(p.status)}`}>{p.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground pr-6">{p.method || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── Maintenance ── */}
        {activeTab === "maintenance" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Maintenance Tickets</h3>
              <Button size="sm" variant="outline" onClick={() => navigate("/maintenance")}>New Ticket</Button>
            </div>
            {unitTickets.length === 0 ? (
              <Card className="border border-border shadow-none">
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground text-sm">No maintenance tickets for this unit.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border shadow-none">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className={`${LABEL} pl-6 py-3`}>Issue</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Category</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Priority</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Status</TableHead>
                        <TableHead className={`${LABEL} py-3 pr-6 hidden sm:table-cell`}>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unitTickets.map(t => (
                        <TableRow key={t.id} className="hover:bg-accent/50 cursor-pointer"
                          onClick={() => navigate(`/maintenance/${t.id}`)}>
                          <TableCell className="font-medium text-foreground pl-6">
                            <div className="flex items-center gap-1.5">
                              {t.isRecurring && <RefreshCw className="h-3 w-3 text-blue-500 flex-shrink-0" />}
                              {t.title}
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="font-normal text-xs">{t.category}</Badge></TableCell>
                          <TableCell><Badge className={`text-xs font-medium ${priorityBadge(t.priority)}`}>{t.priority}</Badge></TableCell>
                          <TableCell><Badge className={`text-xs font-medium ${maintenanceStatusBadge(t.status)}`}>{t.status}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground pr-6 hidden sm:table-cell">{t.createdDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── Inspections ── */}
        {activeTab === "inspections" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Inspections</h3>
              <Button size="sm" variant="outline" onClick={() => navigate("/inspections")}>Schedule Inspection</Button>
            </div>
            {unitInspections.length === 0 ? (
              <Card className="border border-border shadow-none">
                <CardContent className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                    <ClipboardCheck className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">No inspections for this unit.</p>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate("/inspections")}>
                    Schedule Inspection
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border shadow-none">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className={`${LABEL} pl-6 py-3`}>Type</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Date</TableHead>
                        <TableHead className={`${LABEL} py-3 hidden sm:table-cell`}>Inspector</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Findings</TableHead>
                        <TableHead className={`${LABEL} py-3 pr-6`}>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unitInspections.map(insp => (
                        <TableRow key={insp.id} className="hover:bg-accent/50 cursor-pointer"
                          onClick={() => navigate(`/inspections/${insp.id}`)}>
                          <TableCell className="font-medium text-foreground pl-6">{insp.type}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{insp.scheduledDate}</TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {insp.inspectorName || <span className="text-muted-foreground/50">—</span>}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {insp.findings.length > 0 ? `${insp.findings.length} finding${insp.findings.length !== 1 ? "s" : ""}` : <span className="text-muted-foreground/50">—</span>}
                          </TableCell>
                          <TableCell className="pr-6">
                            <Badge className={`text-xs font-medium ${inspectionStatusBadge(insp.status)}`}>{insp.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── Documents ── */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Documents</h3>
              <Button size="sm" variant="outline" onClick={() => navigate("/documents")}>Upload Document</Button>
            </div>
            {unitDocuments.length === 0 ? (
              <Card className="border border-border shadow-none">
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground text-sm">No documents linked to this unit.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border shadow-none">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className={`${LABEL} pl-6 py-3`}>Name</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Type</TableHead>
                        <TableHead className={`${LABEL} py-3`}>Uploaded</TableHead>
                        <TableHead className={`${LABEL} py-3 pr-6`}>Expiry</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unitDocuments.map(doc => {
                        const days = doc.expirationDate ? daysUntilExpiry(doc.expirationDate) : null;
                        const warn = days !== null && days <= 60;
                        return (
                          <TableRow key={doc.id} className="hover:bg-accent/50 cursor-pointer"
                            onClick={() => navigate(`/documents/${doc.id}`)}>
                            <TableCell className="font-medium text-foreground pl-6">{doc.name}</TableCell>
                            <TableCell><Badge variant="outline" className="font-normal text-xs">{doc.documentType}</Badge></TableCell>
                            <TableCell className="text-sm text-muted-foreground">{doc.uploadDate}</TableCell>
                            <TableCell className="pr-6">
                              {doc.expirationDate ? (
                                <span className={`flex items-center gap-1 text-sm ${warn ? (days! < 0 ? "text-red-600" : "text-amber-600") : "text-muted-foreground"}`}>
                                  {warn && <AlertTriangle className="h-3.5 w-3.5" />}
                                  {doc.expirationDate}
                                </span>
                              ) : <span className="text-sm text-muted-foreground/50">—</span>}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Recent Activity */}
        {unitActivity.length > 0 && (
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unitActivity.map(event => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <MoveInDialog open={moveInOpen} onOpenChange={setMoveInOpen} unitId={unit.id} propertyId={unit.propertyId} />

      {moveOutTarget && (
        <MoveOutDialog
          open={!!moveOutTarget}
          onOpenChange={v => { if (!v) setMoveOutTarget(null); }}
          tenantId={moveOutTarget.tenantId}
          tenantName={moveOutTarget.tenantName}
          unitId={unit.id}
          leaseId={moveOutTarget.leaseId}
        />
      )}

      <RecordPaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        unitId={unit.id}
        leaseId={activeLease?.id ?? null}
        tenantId={activeLease ? (activeLease.tenantIds[0] ?? null) : null}
        amountDue={activeLease?.rentAmount ?? unit.rent}
      />
    </MainLayout>
  );
}
