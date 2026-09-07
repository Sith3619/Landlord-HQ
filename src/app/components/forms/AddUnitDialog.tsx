import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";

export function AddUnitDialog() {
  const { properties, addUnit } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    unitNumber: "",
    propertyId: 0,
    tenantId: null as number | null,
    rent: "",
    status: "Vacant",
    leaseStart: "",
    leaseEnd: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.unitNumber || !formData.propertyId || !formData.rent) {
      toast.error("Please fill in all required fields");
      return;
    }

    addUnit({
      unitNumber: formData.unitNumber,
      propertyId: formData.propertyId,
      tenantId: formData.tenantId,
      rent: Number(formData.rent),
      status: formData.status,
      leaseStart: formData.leaseStart || null,
      leaseEnd: formData.leaseEnd || null,
      notes: formData.notes,
    });

    toast.success(`Unit ${formData.unitNumber} added successfully`);
    setFormData({
      unitNumber: "",
      propertyId: 0,
      tenantId: null,
      rent: "",
      status: "Vacant",
      leaseStart: "",
      leaseEnd: "",
      notes: "",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Unit</DialogTitle>
            <DialogDescription>
              Create a new rental unit within one of your properties
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="unitNumber">Unit Number *</Label>
              <Input
                id="unitNumber"
                placeholder="e.g., 101, A, Main"
                className="h-10"
                value={formData.unitNumber}
                onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property">Property *</Label>
              <Select value={String(formData.propertyId || "")} onValueChange={(value) => setFormData({...formData, propertyId: Number(value)})}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={String(property.id)}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent *</Label>
              <Input
                id="rent"
                type="number"
                placeholder="2200"
                className="h-10"
                value={formData.rent}
                onChange={(e) => setFormData({...formData, rent: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
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
                <Label htmlFor="leaseStart">Lease Start</Label>
                <Input
                  id="leaseStart"
                  type="date"
                  className="h-10"
                  value={formData.leaseStart}
                  onChange={(e) => setFormData({...formData, leaseStart: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseEnd">Lease End</Label>
                <Input
                  id="leaseEnd"
                  type="date"
                  className="h-10"
                  value={formData.leaseEnd}
                  onChange={(e) => setFormData({...formData, leaseEnd: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details..."
                rows={3}
                className="resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Unit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
