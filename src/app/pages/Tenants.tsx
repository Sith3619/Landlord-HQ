import { useState } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
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
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Plus, Search, MoreHorizontal, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function Tenants() {
  const navigate = useNavigate();
  const { tenants, units, properties, addTenant, deleteTenant, updateTenant } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<{ id: number; name: string } | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    unitId: null as number | null,
    propertyId: null as number | null,
    leaseStart: "",
    leaseEnd: "",
    leaseStatus: "No Unit Assigned",
    notes: "",
  });

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tenant.propertyName && tenant.propertyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && tenant.leaseStatus === "Active") ||
      (filterStatus === "no-unit" && tenant.leaseStatus === "No Unit Assigned");

    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      unitId: null,
      propertyId: null,
      leaseStart: "",
      leaseEnd: "",
      leaseStatus: "No Unit Assigned",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedUnit = formData.unitId ? units.find((u) => u.id === formData.unitId) : null;

    addTenant({
      ...formData,
      propertyId: selectedUnit?.propertyId || null,
      leaseStatus: formData.unitId ? "Active" : "No Unit Assigned",
    });

    toast.success(`${formData.fullName} added successfully`);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (tenant: any) => {
    setEditingTenant(tenant);
    setFormData({
      fullName: tenant.fullName,
      email: tenant.email,
      phone: tenant.phone,
      unitId: tenant.unitId,
      propertyId: tenant.propertyId,
      leaseStart: tenant.leaseStart || "",
      leaseEnd: tenant.leaseEnd || "",
      leaseStatus: tenant.leaseStatus,
      notes: tenant.notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateTenant(editingTenant.id, {
      ...formData,
      leaseStart: formData.leaseStart || null,
      leaseEnd: formData.leaseEnd || null,
    });

    toast.success(`${formData.fullName} updated successfully`);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingTenant(null);
  };

  const handleDeleteRequest = (id: number, name: string) => {
    setTenantToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (tenantToDelete) {
      deleteTenant(tenantToDelete.id);
      toast.success(`${tenantToDelete.name} removed`);
      setTenantToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const vacantUnits = units.filter((u) => u.status === "Vacant");

  return (
    <MainLayout title="Tenants">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-sm text-muted-foreground">
            Manage tenant information and leases · {filteredTenants.length}{" "}
            {filteredTenants.length === 1 ? "tenant" : "tenants"}
          </p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Tenant</DialogTitle>
                  <DialogDescription>Add a tenant and optionally assign them to a vacant unit</DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="e.g., Jane Smith"
                      className="h-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@example.com"
                        className="h-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(604) 555-0123"
                        className="h-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedUnit">Assign to Unit (Optional)</Label>
                    <Select
                      value={formData.unitId ? String(formData.unitId) : "none"}
                      onValueChange={(value) =>
                        setFormData({ ...formData, unitId: value === "none" ? null : Number(value) })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a vacant unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No unit assigned</SelectItem>
                        {vacantUnits.map((unit) => (
                          <SelectItem key={unit.id} value={String(unit.id)}>
                            {unit.propertyName} — Unit {unit.unitNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {vacantUnits.length === 0 && (
                      <p className="text-xs text-muted-foreground">No vacant units available.</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leaseStart">Lease Start</Label>
                      <Input
                        id="leaseStart"
                        type="date"
                        className="h-10"
                        value={formData.leaseStart}
                        onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leaseEnd">Lease End</Label>
                      <Input
                        id="leaseEnd"
                        type="date"
                        className="h-10"
                        value={formData.leaseEnd}
                        onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional notes about this tenant..."
                      rows={3}
                      className="resize-none"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Add Tenant
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={handleEditSubmit}>
                <DialogHeader>
                  <DialogTitle>Edit Tenant</DialogTitle>
                  <DialogDescription>Update tenant information and lease details</DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-fullName">Full Name *</Label>
                    <Input
                      id="edit-fullName"
                      placeholder="Jane Smith"
                      className="h-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email *</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        placeholder="jane@example.com"
                        className="h-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone *</Label>
                      <Input
                        id="edit-phone"
                        type="tel"
                        placeholder="(604) 555-0123"
                        className="h-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-property">Property</Label>
                      <Select
                        value={formData.propertyId ? String(formData.propertyId) : "none"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            propertyId: value === "none" ? null : Number(value),
                            unitId: null,
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={String(property.id)}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-unit">Unit</Label>
                      <Select
                        value={formData.unitId ? String(formData.unitId) : "none"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            unitId: value === "none" ? null : Number(value),
                            leaseStatus: value === "none" ? "No Unit Assigned" : "Active",
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {units
                            .filter((u) => !formData.propertyId || u.propertyId === formData.propertyId)
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
                      <Label htmlFor="edit-leaseStart">Lease Start</Label>
                      <Input
                        id="edit-leaseStart"
                        type="date"
                        className="h-10"
                        value={formData.leaseStart}
                        onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-leaseEnd">Lease End</Label>
                      <Input
                        id="edit-leaseEnd"
                        type="date"
                        className="h-10"
                        value={formData.leaseEnd}
                        onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-notes">Notes (Optional)</Label>
                    <Textarea
                      id="edit-notes"
                      placeholder="Any additional details..."
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
                      setIsEditDialogOpen(false);
                      setEditingTenant(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Update Tenant
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border border-border shadow-none">
          <CardContent className="p-6">
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  placeholder="Search tenants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-muted/50 border-border"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px] sm:w-[200px] h-10 flex-shrink-0">
                  <SelectValue placeholder="All tenants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="no-unit">No Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredTenants.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                  <Users className="h-7 w-7 text-muted-foreground/70" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">No tenants found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first tenant"}
                </p>
                {!searchQuery && filterStatus === "all" && (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Tenant
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Mobile card list */}
                <div className="md:hidden space-y-2">
                  {filteredTenants.map((tenant) => (
                    <div
                      key={tenant.id}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/tenants/${tenant.id}`)}
                    >
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                          {tenant.fullName.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{tenant.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {tenant.propertyName
                            ? `${tenant.propertyName}${tenant.unitNumber ? ` · Unit ${tenant.unitNumber}` : ""}`
                            : tenant.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          className={
                            tenant.leaseStatus === "Active"
                              ? "bg-green-50 text-green-700 border border-green-100 hover:bg-green-50 font-medium text-xs"
                              : "bg-muted text-muted-foreground border border-border hover:bg-accent font-medium text-xs"
                          }
                        >
                          {tenant.leaseStatus}
                        </Badge>
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Tenant actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/tenants/${tenant.id}`)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(tenant)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => handleDeleteRequest(tenant.id, tenant.fullName)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-accent/50">
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Name</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Email</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Phone</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Property</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Unit</TableHead>
                        <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right font-medium text-xs uppercase tracking-wide text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTenants.map((tenant) => (
                        <TableRow
                          key={tenant.id}
                          className="hover:bg-accent/50 cursor-pointer"
                          onClick={() => navigate(`/tenants/${tenant.id}`)}
                        >
                          <TableCell className="font-medium text-foreground">{tenant.fullName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tenant.email}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tenant.phone}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tenant.propertyName || <span className="text-muted-foreground/50">—</span>}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {tenant.unitNumber ? `Unit ${tenant.unitNumber}` : <span className="text-muted-foreground/50">—</span>}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                tenant.leaseStatus === "Active"
                                  ? "bg-green-50 text-green-700 border border-green-100 hover:bg-green-50 font-medium"
                                  : "bg-muted text-muted-foreground border border-border hover:bg-accent font-medium"
                              }
                            >
                              {tenant.leaseStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Tenant actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/tenants/${tenant.id}`)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(tenant)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                  onClick={() => handleDeleteRequest(tenant.id, tenant.fullName)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Remove Tenant"
        description={`Are you sure you want to remove ${tenantToDelete?.name}? This action cannot be undone.`}
        confirmText="Remove Tenant"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="danger"
      />
    </MainLayout>
  );
}
