import { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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
import { Plus, Search, MoreHorizontal, Eye, Building2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { toast } from "sonner";

export function Properties() {
  const { properties, addProperty, deleteProperty, updateProperty } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: number; name: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    propertyType: "",
    notes: "",
    status: "Active"
  });

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === "all" || property.propertyType === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.city || !formData.province || !formData.postalCode || !formData.propertyType) {
      toast.error("Please fill in all required fields");
      return;
    }
    addProperty(formData);
    toast.success(`${formData.name} has been added successfully`);
    setFormData({
      name: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      propertyType: "",
      notes: "",
      status: "Active"
    });
    setIsDialogOpen(false);
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      address: property.address,
      city: property.city,
      province: property.province,
      postalCode: property.postalCode,
      propertyType: property.propertyType,
      notes: property.notes,
      status: property.status
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.city || !formData.province || !formData.postalCode || !formData.propertyType) {
      toast.error("Please fill in all required fields");
      return;
    }
    updateProperty(editingProperty.id, formData);
    toast.success(`${formData.name} has been updated successfully`);
    setFormData({
      name: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      propertyType: "",
      notes: "",
      status: "Active"
    });
    setIsEditDialogOpen(false);
    setEditingProperty(null);
  };

  const handleDelete = (id: number, name: string) => {
    setPropertyToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      deleteProperty(propertyToDelete.id);
      toast.success(`${propertyToDelete.name} has been deleted`);
      setPropertyToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <MainLayout title="Properties">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your property portfolio • {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Property</DialogTitle>
                  <DialogDescription>
                    Add a property to your portfolio to start managing units and tenants
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyName">Property Name *</Label>
                    <Input
                      id="propertyName"
                      placeholder="e.g., Maple Street Duplex"
                      className="h-10"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      className="h-10"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="Vancouver"
                        className="h-10"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province *</Label>
                      <Input
                        id="province"
                        placeholder="BC"
                        className="h-10"
                        value={formData.province}
                        onChange={(e) => setFormData({...formData, province: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      placeholder="V6B 1A1"
                      className="h-10"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Duplex">Duplex</SelectItem>
                        <SelectItem value="Apartment">Apartment Building</SelectItem>
                        <SelectItem value="Single Family">Single Family Home</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional details about this property..."
                      rows={3}
                      className="resize-none"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Add Property
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={handleEditSubmit}>
                <DialogHeader>
                  <DialogTitle>Edit Property</DialogTitle>
                  <DialogDescription>
                    Update the details of this property
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-propertyName">Property Name *</Label>
                    <Input
                      id="edit-propertyName"
                      placeholder="e.g., Maple Street Duplex"
                      className="h-10"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-address">Street Address *</Label>
                    <Input
                      id="edit-address"
                      placeholder="123 Main Street"
                      className="h-10"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-city">City *</Label>
                      <Input
                        id="edit-city"
                        placeholder="Vancouver"
                        className="h-10"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-province">Province *</Label>
                      <Input
                        id="edit-province"
                        placeholder="BC"
                        className="h-10"
                        value={formData.province}
                        onChange={(e) => setFormData({...formData, province: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-postalCode">Postal Code *</Label>
                    <Input
                      id="edit-postalCode"
                      placeholder="V6B 1A1"
                      className="h-10"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-propertyType">Property Type *</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Duplex">Duplex</SelectItem>
                        <SelectItem value="Apartment">Apartment Building</SelectItem>
                        <SelectItem value="Single Family">Single Family Home</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-notes">Notes (Optional)</Label>
                    <Textarea
                      id="edit-notes"
                      placeholder="Add any additional details about this property..."
                      rows={3}
                      className="resize-none"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingProperty(null);
                    setFormData({
                      name: "",
                      address: "",
                      city: "",
                      province: "",
                      postalCode: "",
                      propertyType: "",
                      notes: "",
                      status: "Active"
                    });
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Update Property
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border border-border shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  placeholder="Search by name, address, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-muted/50 border-border"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[200px] h-10">
                  <SelectValue placeholder="All property types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Duplex">Duplex</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Building2 className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery || filterType !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first property"}
                </p>
                {!searchQuery && filterType === "all" && (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Property
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-accent/50">
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Property Name</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground hidden md:table-cell">Address</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">City</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Type</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Units</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Status</TableHead>
                      <TableHead className="text-right font-medium text-xs uppercase tracking-wide text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow
                        key={property.id}
                        className="hover:bg-accent/50 cursor-pointer"
                        onClick={() => navigate(`/properties/${property.id}`)}
                      >
                        <TableCell className="font-medium text-foreground">{property.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{property.address}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{property.city}, {property.province}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="font-normal text-xs">
                            {property.propertyType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{property.unitCount}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-50 text-green-700 border border-green-100 hover:bg-green-50 font-medium">
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Property actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/properties/${property.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(property)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => handleDelete(property.id, property.name)}
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

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Property"
        description={`Are you sure you want to delete ${propertyToDelete?.name}? This action cannot be undone and will remove all associated units, tenants, and data.`}
        confirmText="Delete Property"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="danger"
      />
    </MainLayout>
  );
}
