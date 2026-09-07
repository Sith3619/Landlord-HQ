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
import { Plus, Search, MoreHorizontal, Download, Eye, FileText, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const DOC_TYPE_LABELS: Record<string, string> = {
  Lease: "Lease Agreement",
  Notice: "Notice",
  Inspection: "Inspection Report",
  Insurance: "Insurance",
  Other: "Other",
};

const DOC_TYPE_COLORS: Record<string, string> = {
  Lease: "bg-blue-50 text-blue-700 border-blue-100",
  Notice: "bg-amber-50 text-amber-700 border-amber-100",
  Inspection: "bg-violet-50 text-violet-700 border-violet-100",
  Insurance: "bg-sky-50 text-sky-700 border-sky-100",
  Other: "bg-muted text-muted-foreground border-border",
};

export function Documents() {
  const navigate = useNavigate();
  const { documents, properties, units, tenants, addDocument, deleteDocument, updateDocument } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<{ id: number; name: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    documentType: "",
    propertyId: null as number | null,
    unitId: null as number | null,
    tenantId: null as number | null,
    notes: "",
  });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.propertyName && doc.propertyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.tenantName && doc.tenantName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = filterType === "all" || doc.documentType === filterType;

    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      documentType: "",
      propertyId: null,
      unitId: null,
      tenantId: null,
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.documentType) {
      toast.error("Please fill in all required fields");
      return;
    }

    addDocument(formData);
    toast.success(`"${formData.name}" uploaded successfully`);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (doc: any) => {
    setEditingDocument(doc);
    setFormData({
      name: doc.name,
      documentType: doc.documentType,
      propertyId: doc.propertyId,
      unitId: doc.unitId,
      tenantId: doc.tenantId,
      notes: doc.notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.documentType) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateDocument(editingDocument.id, formData);
    toast.success(`"${formData.name}" updated successfully`);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingDocument(null);
  };

  const handleDeleteRequest = (id: number, name: string) => {
    setDocToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (docToDelete) {
      deleteDocument(docToDelete.id);
      toast.success(`"${docToDelete.name}" deleted`);
      setDocToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const DocumentForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-5 py-4">
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-documentName" : "documentName"}>Document Name *</Label>
        <Input
          id={isEdit ? "edit-documentName" : "documentName"}
          placeholder="e.g., Lease Agreement — Jane Smith"
          className="h-10"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-documentType" : "documentType"}>Document Type *</Label>
        <Select
          value={formData.documentType}
          onValueChange={(value) => setFormData({ ...formData, documentType: value })}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lease">Lease Agreement</SelectItem>
            <SelectItem value="Notice">Notice</SelectItem>
            <SelectItem value="Inspection">Inspection Report</SelectItem>
            <SelectItem value="Insurance">Insurance</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Property (Optional)</Label>
          <Select
            value={formData.propertyId ? String(formData.propertyId) : "none"}
            onValueChange={(value) =>
              setFormData({ ...formData, propertyId: value === "none" ? null : Number(value), unitId: null })
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
          <Label>Unit (Optional)</Label>
          <Select
            value={formData.unitId ? String(formData.unitId) : "none"}
            onValueChange={(value) =>
              setFormData({ ...formData, unitId: value === "none" ? null : Number(value) })
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
            {tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={String(tenant.id)}>
                {tenant.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {!isEdit && (
        <div className="space-y-2">
          <Label>File Upload</Label>
          <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer">
            <Upload className="h-7 w-7 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, JPG, PNG — up to 10 MB</p>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label>Notes (Optional)</Label>
        <Textarea
          placeholder="Add any additional context..."
          rows={2}
          className="resize-none"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <MainLayout title="Documents">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-sm text-muted-foreground">
            Store and organize important files · {filteredDocuments.length}{" "}
            {filteredDocuments.length === 1 ? "document" : "documents"}
          </p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>
                    Upload and categorize a document for your records
                  </DialogDescription>
                </DialogHeader>
                <DocumentForm />
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Upload Document
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={handleEditSubmit}>
                <DialogHeader>
                  <DialogTitle>Edit Document</DialogTitle>
                  <DialogDescription>Update document details and categorization</DialogDescription>
                </DialogHeader>
                <DocumentForm isEdit />
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingDocument(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Update Document
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
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-muted/50 border-border"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[200px] h-10">
                  <SelectValue placeholder="All document types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Lease">Lease</SelectItem>
                  <SelectItem value="Notice">Notice</SelectItem>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                  <FileText className="h-7 w-7 text-muted-foreground/70" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">No documents found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery || filterType !== "all"
                    ? "Try adjusting your search or filters"
                    : "Upload documents to keep everything organized in one place"}
                </p>
                {!searchQuery && filterType === "all" && (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Your First Document
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-accent/50">
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Document Name</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Type</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground hidden md:table-cell">Property</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground hidden lg:table-cell">Tenant</TableHead>
                      <TableHead className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Uploaded</TableHead>
                      <TableHead className="text-right font-medium text-xs uppercase tracking-wide text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow
                        key={doc.id}
                        className="hover:bg-accent/50 cursor-pointer"
                        onClick={() => navigate(`/documents/${doc.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium text-foreground text-sm leading-snug">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`border font-medium text-xs ${DOC_TYPE_COLORS[doc.documentType] || DOC_TYPE_COLORS.Other}`}
                          >
                            {doc.documentType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                          {doc.propertyName || <span className="text-muted-foreground/50">—</span>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                          {doc.tenantName || <span className="text-muted-foreground/50">—</span>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{doc.uploadDate}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Document actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/documents/${doc.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(doc)}>
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => handleDeleteRequest(doc.id, doc.name)}
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
        title="Delete Document"
        description={`Are you sure you want to delete "${docToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Document"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="danger"
      />
    </MainLayout>
  );
}
