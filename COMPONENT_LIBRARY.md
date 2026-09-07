# Landlord HQ Component Library

## Overview

This document provides comprehensive guidance for using the Landlord HQ component system. All components follow consistent patterns for spacing, colors, typography, and responsive design.

---

## Core Design Principles

### Color System
- **Primary Action**: `bg-green-600 hover:bg-green-700` - Main CTA buttons
- **Background**: `bg-gray-50` (page), `bg-white` (cards)
- **Borders**: `border-gray-200` or `border-border`
- **Text**: `text-foreground` (primary), `text-muted-foreground` (secondary)

### Status Colors
- **Active/Success**: `bg-green-100 text-green-700`
- **Warning/Medium**: `bg-yellow-100 text-yellow-700`
- **Error/High**: `bg-red-100 text-red-700`
- **Info/Low**: `bg-blue-100 text-blue-700`
- **Neutral**: `bg-gray-100 text-gray-700`

### Spacing Scale
- **Page padding**: `py-8 px-6 lg:px-8`, `max-w-[1600px]`
- **Section spacing**: `space-y-6`
- **Card padding**: `p-6`
- **Form spacing**: `gap-5 py-4`
- **Field spacing**: `space-y-2`

### Typography
- **Page titles**: Handled by `MainLayout` component
- **Section headings**: `text-lg font-semibold`
- **Card titles**: `text-sm font-medium`
- **Body text**: `text-sm`
- **Captions**: `text-xs text-muted-foreground`

---

## Layout Components

### MainLayout

The primary layout wrapper for all authenticated pages.

```tsx
import { MainLayout } from "../components/layout/MainLayout";

<MainLayout title="Page Title">
  <div className="space-y-6">
    {/* Page content */}
  </div>
</MainLayout>
```

**Features:**
- Sidebar navigation (responsive)
- Top header with user menu
- Consistent page title
- Max-width container
- Responsive padding

---

## Common Components

### PageHeader

Page-level header with description and optional action button.

```tsx
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";

<PageHeader
  description="Manage your property portfolio • 12 properties"
  action={
    <Button className="bg-green-600 hover:bg-green-700">
      <Plus className="mr-2 h-4 w-4" />
      Add Property
    </Button>
  }
/>
```

### DetailPageHeader

Header for detail pages with back button, title, subtitle, and badges.

```tsx
import { DetailPageHeader } from "../components/common/DetailPageHeader";
import { StatusBadge } from "../components/common/StatusBadge";

<DetailPageHeader
  onBack={() => navigate("/properties")}
  title={property.name}
  subtitle={`${property.address}, ${property.city}`}
  badge={<StatusBadge status="Active" />}
/>
```

### MetricCard

Display key metrics with optional icons and trends.

```tsx
import { MetricCard } from "../components/common/MetricCard";
import { DollarSign } from "lucide-react";

<MetricCard
  title="Total Revenue"
  value="$12,500"
  caption="per month"
  icon={DollarSign}
  trend={{
    value: "+12.5% from last month",
    isPositive: true
  }}
/>
```

### SearchFilter

Search input with optional filter dropdowns.

```tsx
import { SearchFilter } from "../components/common/SearchFilter";
import { Select } from "../components/ui/select";

<SearchFilter
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search by name, address, or city..."
  filters={
    <Select value={filterType} onValueChange={setFilterType}>
      {/* Filter options */}
    </Select>
  }
/>
```

### EmptyState

Show when lists/tables have no data.

```tsx
import { EmptyState } from "../components/common/EmptyState";
import { Building2 } from "lucide-react";

<EmptyState
  icon={Building2}
  title="No properties found"
  description="Get started by adding your first property"
  action={{
    label: "Add Your First Property",
    onClick: () => setIsDialogOpen(true)
  }}
/>
```

### LoadingState

Display loading indicators.

```tsx
import { LoadingState } from "../components/common/LoadingState";

// Full page loading
<LoadingState message="Loading properties..." />

// Table skeleton
<TableSkeleton rows={5} />

// Card skeleton
<CardSkeleton />
```

### StatusBadge

Standardized status indicators.

```tsx
import { StatusBadge } from "../components/common/StatusBadge";

<StatusBadge status="Active" />
<StatusBadge status="Occupied" />
<StatusBadge status="Vacant" />
<StatusBadge status="In Progress" />
<StatusBadge status="Completed" />
```

**Status Color Mapping:**
- `Active`, `Occupied`, `In Progress`: Green
- `Vacant`, `Completed`: Gray outline
- `New`: Secondary gray
- Custom handling in each component for specific needs

### PriorityBadge

Priority indicators for maintenance tickets.

```tsx
import { PriorityBadge } from "../components/common/PriorityBadge";

<PriorityBadge priority="High" />   // Red
<PriorityBadge priority="Medium" /> // Yellow
<PriorityBadge priority="Low" />    // Blue
```

### ConfirmDialog

Confirmation dialog for destructive actions.

```tsx
import { ConfirmDialog } from "../components/common/ConfirmDialog";

const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);

<ConfirmDialog
  open={deleteConfirmOpen}
  onOpenChange={setDeleteConfirmOpen}
  title="Delete Property"
  description="Are you sure? This action cannot be undone."
  confirmText="Delete Property"
  cancelText="Cancel"
  onConfirm={handleConfirmDelete}
  variant="danger" // or "default"
/>
```

---

## Toast Notifications

Use Sonner for all notifications.

```tsx
import { toast } from "sonner";

// Success
toast.success("Property added successfully");

// Error
toast.error("Please fill in all required fields");

// Info
toast.info("Changes saved as draft");

// Warning
toast.warning("Lease expires in 30 days");
```

**Best Practices:**
- Show success toast after successful operations
- Show error toast for validation failures
- Keep messages concise (under 50 characters)
- Use specific, actionable language

---

## UI Components (shadcn/ui)

### Button

```tsx
import { Button } from "../components/ui/button";

// Primary action
<Button className="bg-green-600 hover:bg-green-700">
  Primary Action
</Button>

// Secondary action
<Button variant="outline">
  Secondary Action
</Button>

// Destructive action
<Button variant="destructive">
  Delete
</Button>

// Ghost button
<Button variant="ghost">
  Cancel
</Button>

// With icon
<Button className="bg-green-600 hover:bg-green-700">
  <Plus className="mr-2 h-4 w-4" />
  Add New
</Button>

// Loading state
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

### Input

```tsx
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

<div className="space-y-2">
  <Label htmlFor="field">Field Label *</Label>
  <Input
    id="field"
    type="text"
    placeholder="Placeholder text"
    className="h-10"
    required
  />
</div>
```

### Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";

<div className="space-y-2">
  <Label htmlFor="field">Select Field *</Label>
  <Select value={value} onValueChange={setValue}>
    <SelectTrigger className="h-10">
      <SelectValue placeholder="Select option" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Textarea

```tsx
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

<div className="space-y-2">
  <Label htmlFor="notes">Notes (Optional)</Label>
  <Textarea
    id="notes"
    placeholder="Enter notes..."
    rows={3}
    className="resize-none"
  />
</div>
```

### Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

<Card className="border-0 shadow-sm">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

<div className="rounded-lg border border-border overflow-hidden">
  <Table>
    <TableHeader>
      <TableRow className="bg-gray-50 hover:bg-gray-50">
        <TableHead className="font-semibold">Column 1</TableHead>
        <TableHead className="font-semibold">Column 2</TableHead>
        <TableHead className="text-right font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id} className="hover:bg-gray-50">
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell className="text-muted-foreground">{item.value}</TableCell>
          <TableCell className="text-right">
            {/* Actions */}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[560px]">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-5 py-4">
      {/* Dialog content */}
    </div>
    <DialogFooter className="gap-2 sm:gap-0">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button className="bg-green-600 hover:bg-green-700">
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => navigate(`/items/${item.id}`)}>
      <Eye className="mr-2 h-4 w-4" />
      View Details
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleEdit(item)}>
      <Pencil className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem
      className="text-red-600"
      onClick={() => handleDelete(item.id)}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Badge

```tsx
import { Badge } from "../components/ui/badge";

// Default
<Badge>Default</Badge>

// Secondary
<Badge variant="secondary">Secondary</Badge>

// Outline
<Badge variant="outline">Outline</Badge>

// Destructive
<Badge variant="destructive">Destructive</Badge>

// Custom colors
<Badge className="bg-green-100 text-green-700 hover:bg-green-100">
  Active
</Badge>
```

---

## Page Patterns

### List Page Pattern

Complete pattern for list/table pages:

```tsx
<MainLayout title="Page Title">
  <div className="space-y-6">
    {/* Header with action */}
    <PageHeader
      description="Description • count items"
      action={
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      }
    />

    {/* Search and filters */}
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <SearchFilter
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search..."
          filters={/* Filter components */}
        />

        {/* Loading state */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={Icon}
            title="No items found"
            description="Description"
          />
        ) : (
          <div className="rounded-lg border border-border overflow-hidden mt-6">
            <Table>{/* Table content */}</Table>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
</MainLayout>
```

### Detail Page Pattern

Complete pattern for detail pages:

```tsx
<MainLayout title={item.name}>
  <div className="space-y-6">
    {/* Header */}
    <DetailPageHeader
      onBack={() => navigate("/items")}
      title={item.name}
      subtitle="Subtitle"
      badge={<StatusBadge status={item.status} />}
    />

    {/* Metrics grid */}
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard title="Metric 1" value="100" />
      <MetricCard title="Metric 2" value="200" />
      <MetricCard title="Metric 3" value="300" />
      <MetricCard title="Metric 4" value="400" />
    </div>

    {/* Info cards */}
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Section 1</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Section 2</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content */}
        </CardContent>
      </Card>
    </div>

    {/* Related data */}
    <Card>
      <CardHeader>
        <CardTitle>Related Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>{/* Related items table */}</Table>
      </CardContent>
    </Card>
  </div>
</MainLayout>
```

### Form Dialog Pattern

Complete pattern for form dialogs:

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button className="bg-green-600 hover:bg-green-700">
      <Plus className="mr-2 h-4 w-4" />
      Add Item
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[560px]">
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Form Title</DialogTitle>
        <DialogDescription>
          Form description
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-5 py-4">
        {/* Form fields */}
        <div className="space-y-2">
          <Label htmlFor="field">Field Label *</Label>
          <Input
            id="field"
            placeholder="Placeholder"
            className="h-10"
            value={formData.field}
            onChange={(e) => setFormData({...formData, field: e.target.value})}
            required
          />
        </div>

        {/* More fields */}
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Submit
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

---

## Responsive Design

### Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (≥ 768px)
- **Desktop**: `lg:` (≥ 1024px)

### Responsive Patterns

```tsx
// Grid: 1 col mobile, 2 tablet, 4 desktop
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

// Flex: stack mobile, row desktop
<div className="flex flex-col sm:flex-row gap-4">

// Width: full mobile, fixed desktop
<Select className="w-full sm:w-[200px]">

// Hide on mobile, show on desktop
<div className="hidden md:flex">

// Show on mobile, hide on desktop
<div className="flex md:hidden">
```

---

## Form Validation

### Client-Side Validation

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Required fields
  if (!formData.field) {
    toast.error("Please fill in all required fields");
    return;
  }

  // Email validation
  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  // Password length
  if (formData.password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  // Password match
  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  // Submit form
  try {
    submitForm(formData);
    toast.success("Item created successfully");
    setIsOpen(false);
  } catch (error) {
    toast.error("Failed to create item");
  }
};
```

### Required Field Indicators

```tsx
<Label htmlFor="field">
  Field Label <span className="text-red-500">*</span>
</Label>
// Or use the shorter:
<Label htmlFor="field">Field Label *</Label>
```

---

## Best Practices

### Spacing
- Use consistent spacing: `gap-4`, `gap-6`, `space-y-6`
- Page sections: `space-y-6`
- Card content: `space-y-4`
- Form fields: `gap-5 py-4`

### Typography
- Page titles: Use `MainLayout` title prop
- Section headers: `text-lg font-semibold`
- Card titles: Use `CardTitle`
- Body text: `text-sm`
- Captions: `text-xs text-muted-foreground`

### Colors
- Primary buttons: `bg-green-600 hover:bg-green-700`
- Destructive: `bg-red-600 hover:bg-red-700`
- Borders: `border-border` or `border-gray-200`
- Backgrounds: `bg-gray-50` (page), `bg-white` (cards)

### Icons
- Use lucide-react icons
- Standard size: `h-4 w-4`
- Button icons: `mr-2 h-4 w-4`
- Large icons: `h-5 w-5` or `h-6 w-6`

### Loading States
- Buttons: Show spinner with "Loading..." text
- Tables: Use `TableSkeleton`
- Pages: Use `LoadingState` component
- Disable interactions during loading

### Error Handling
- Use toast.error() for validation errors
- Show specific, actionable error messages
- Keep form data on error (don't clear)
- Highlight problematic fields

### Confirmations
- Use `ConfirmDialog` for destructive actions
- Clear confirmation messages
- "Delete" buttons use variant="danger"
- Success toast after confirmation

### Accessibility
- Always pair inputs with labels
- Use semantic HTML
- Provide aria-labels for icon-only buttons
- Ensure keyboard navigation works
- Maintain color contrast (WCAG AA)
- Proper heading hierarchy

---

## Common Patterns

### CRUD Operations

```tsx
// Create
const handleCreate = async (formData) => {
  if (!validateForm(formData)) return;

  try {
    await createItem(formData);
    toast.success("Item created successfully");
    setIsDialogOpen(false);
    resetForm();
  } catch (error) {
    toast.error("Failed to create item");
  }
};

// Update
const handleUpdate = async (id, formData) => {
  if (!validateForm(formData)) return;

  try {
    await updateItem(id, formData);
    toast.success("Item updated successfully");
    setIsEditDialogOpen(false);
  } catch (error) {
    toast.error("Failed to update item");
  }
};

// Delete
const handleDelete = (id, name) => {
  setItemToDelete({ id, name });
  setDeleteConfirmOpen(true);
};

const confirmDelete = async () => {
  if (!itemToDelete) return;

  try {
    await deleteItem(itemToDelete.id);
    toast.success(`${itemToDelete.name} deleted successfully`);
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  } catch (error) {
    toast.error("Failed to delete item");
  }
};
```

### Search and Filter

```tsx
const [searchQuery, setSearchQuery] = useState("");
const [filterStatus, setFilterStatus] = useState("all");

const filteredItems = items.filter(item => {
  const matchesSearch =
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesFilter =
    filterStatus === "all" || item.status === filterStatus;

  return matchesSearch && matchesFilter;
});
```

---

## File Upload Pattern

```tsx
<div className="space-y-2">
  <Label htmlFor="file">Upload File</Label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
    <p className="text-sm text-muted-foreground">
      Click to upload or drag and drop
      <br />
      <span className="text-xs">PNG, JPG up to 10MB</span>
    </p>
  </div>
</div>
```

---

## Summary

This component library provides:
- ✅ Consistent design patterns
- ✅ Reusable components
- ✅ Responsive layouts
- ✅ Accessible UI elements
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications
- ✅ Confirmation dialogs

Follow these patterns to maintain consistency across the entire application.
