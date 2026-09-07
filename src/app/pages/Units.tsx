import { useState } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AddUnitDialog } from "../components/forms/AddUnitDialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Search, MoreHorizontal, DoorOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function Units() {
  const navigate = useNavigate();
  const { units, properties, deleteUnit, updateUnit } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<{ id: number; unitNumber: string } | null>(null);

  const [editFormData, setEditFormData] = useState({
    unitNumber: "",
    propertyId: 0,
    rent: "",
    status: "Vacant",
    leaseStart: "",
    leaseEnd: "",
    notes: "",
  });

  const filteredUnits = units.filter(unit => {
    const matchesSearch =
      unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.tenantName && unit.tenantName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "occupied" && unit.status === "Occupied") ||
      (filterStatus === "vacant" && unit.status === "Vacant") ||
      (filterStatus === "ending-soon" &&
        unit.leaseEnd &&
        new Date(unit.leaseEnd) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesFilter;
  });

  const handleEdit = (unit: any) => {
    setEditingUnit(unit);
    setEditFormData({
      unitNumber: unit.unitNumber,
      propertyId: unit.propertyId,
      rent: String(unit.rent),
      status: unit.status,
      leaseStart: unit.leaseStart || "",
      leaseEnd: unit.leaseEnd || "",
      notes: unit.notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.unitNumber || !editFormData.propertyId || !editFormData.rent) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateUnit(editingUnit.id, {
      ...editFormData,
      rent: Number(editFormData.rent),
      leaseStart: editFormData.leaseStart || null,
      leaseEnd: editFormData.leaseEnd || null,
    });

    toast.success("Unit updated successfully");
    setIsEditDialogOpen(false);
    setEditingUnit(null);
    setEditFormData({
      unitNumber: "",
      propertyId: 0,
      rent: "",
      status: "Vacant",
      leaseStart: "",
      leaseEnd: "",
      notes: "",
    });
  };

  const handleDeleteRequest = (id: number, unitNumber: string) => {
    setUnitToDelete({ id, unitNumber });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (unitToDelete) {
      deleteUnit(unitToDelete.id);
      toast.success(`Unit ${unitToDelete.unitNumber} deleted`);
      setUnitToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <MainLayout title="Units">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-sm text-muted-foreground">
            Manage all rental units · {filteredUnits.length}{" "}
            {filteredUnits.length === 1 ? "unit" : "units"}
          </p>
          <AddUnitDialog />
        </div>

        <Card className="border border-border shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  placeholder="Search by unit, property, or tenant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-muted/50 border-border"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[200px] h-10">
                  <SelectValue placeholder="All units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Units</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                  <SelectItem value="ending-soon">Lease Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredUnits.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                  <DoorOpen className="h-7 w-7 text-muted-foreground/70" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">No units found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding units to your properties"}
                </p>
                {!searchQuery && filterStatus === "all" && <AddUnitDialog />}
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-accent/50">
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Unit</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Property</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Tenant</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Rent / mo</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Lease End</TableHead>
                      <TableHead className="text-right font-medium text-xs uppercase tracking-wide text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.map((unit) => (
                      <TableRow
                        key={unit.id}
                        className="hover:bg-accent/50 cursor-pointer"
                        onClick={() => navigate(`/units/${unit.id}`)}
                      >
                        <TableCell className="font-medium text-foreground">Unit {unit.unitNumber}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{unit.propertyName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{unit.tenantName || <span className="text-muted-foreground/50">—</span>}</TableCell>
                        <TableCell className="text-sm font-medium text-foreground">${unit.rent.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              unit.status === "Occupied"
                                ? "bg-green-50 text-green-700 border border-green-100 hover:bg-green-50 font-medium"
                                : "bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-50 font-medium"
                            }
                          >
                            {unit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {unit.leaseEnd || <span className="text-muted-foreground/50">—</span>}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Unit actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/units/${unit.id}`)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(unit)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => handleDeleteRequest(unit.id, unit.unitNumber)}
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
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Unit</DialogTitle>
              <DialogDescription>Update the details of this rental unit</DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-unitNumber">Unit Number *</Label>
                <Input
                  id="edit-unitNumber"
                  placeholder="e.g., 101, A, Main"
                  className="h-10"
                  value={editFormData.unitNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, unitNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-property">Property *</Label>
                <Select
                  value={String(editFormData.propertyId)}
                  onValueChange={(value) => setEditFormData({ ...editFormData, propertyId: Number(value) })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a property" />
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
                <Label htmlFor="edit-rent">Monthly Rent ($) *</Label>
                <Input
                  id="edit-rent"
                  type="number"
                  placeholder="2200"
                  className="h-10"
                  value={editFormData.rent}
                  onChange={(e) => setEditFormData({ ...editFormData, rent: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Vacant">Vacant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-leaseStart">Lease Start</Label>
                  <Input
                    id="edit-leaseStart"
                    type="date"
                    className="h-10"
                    value={editFormData.leaseStart}
                    onChange={(e) => setEditFormData({ ...editFormData, leaseStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-leaseEnd">Lease End</Label>
                  <Input
                    id="edit-leaseEnd"
                    type="date"
                    className="h-10"
                    value={editFormData.leaseEnd}
                    onChange={(e) => setEditFormData({ ...editFormData, leaseEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Add any additional details..."
                  rows={3}
                  className="resize-none"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingUnit(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Update Unit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Unit"
        description={`Are you sure you want to delete Unit ${unitToDelete?.unitNumber}? This action cannot be undone.`}
        confirmText="Delete Unit"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="danger"
      />
    </MainLayout>
  );
}
