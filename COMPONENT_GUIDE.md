# Component Usage Guide

## Reusable Components

### PageHeader

Use for page-level headers with optional action buttons.

```tsx
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
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

### EmptyState

Use for empty states with optional call-to-action.

```tsx
import { EmptyState } from "@/components/common/EmptyState";
import { Building2 } from "lucide-react";

<EmptyState
  icon={Building2}
  title="No properties found"
  description="Get started by adding your first property to the system"
  action={{
    label: "Add Your First Property",
    onClick: () => setIsDialogOpen(true)
  }}
/>
```

### LoadingState

Use for loading indicators and skeleton screens.

```tsx
import { LoadingState, TableSkeleton, CardSkeleton } from "@/components/common/LoadingState";

// Full page loading
<LoadingState message="Loading properties..." />

// Table loading
<TableSkeleton rows={5} />

// Card loading
<CardSkeleton />
```

### StatusBadge

Use for status indicators (Active, Occupied, Vacant, etc).

```tsx
import { StatusBadge } from "@/components/common/StatusBadge";

<StatusBadge status="Occupied" />
<StatusBadge status="Vacant" />
<StatusBadge status="Active" />
<StatusBadge status="In Progress" />
<StatusBadge status="Completed" />
```

### PriorityBadge

Use for priority indicators in maintenance tickets.

```tsx
import { PriorityBadge } from "@/components/common/PriorityBadge";

<PriorityBadge priority="High" />
<PriorityBadge priority="Medium" />
<PriorityBadge priority="Low" />
```

### SearchFilter

Use for search and filter sections at the top of list pages.

```tsx
import { SearchFilter } from "@/components/common/SearchFilter";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

<SearchFilter
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Search by name, address, or city..."
  filters={
    <Select value={filterType} onValueChange={setFilterType}>
      <SelectTrigger className="w-full sm:w-[200px] h-10">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value="duplex">Duplex</SelectItem>
      </SelectContent>
    </Select>
  }
/>
```

### DetailPageHeader

Use for detail page headers with back button.

```tsx
import { DetailPageHeader } from "@/components/common/DetailPageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";

<DetailPageHeader
  onBack={() => navigate("/properties")}
  title={property.name}
  subtitle={`${property.address}, ${property.city}, ${property.province}`}
  badge={<StatusBadge status="Active" />}
/>
```

### MetricCard

Use for dashboard and detail page metrics.

```tsx
import { MetricCard } from "@/components/common/MetricCard";
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

## Layout Patterns

### List Page Layout

```tsx
<MainLayout title="Page Title">
  <div className="space-y-6">
    {/* Header with action */}
    <PageHeader
      description="Description • count"
      action={<Button>Add New</Button>}
    />

    {/* Card container */}
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        {/* Search and filters */}
        <SearchFilter
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search..."
          filters={/* Filter components */}
        />

        {/* Data table or empty state */}
        {filteredItems.length === 0 ? (
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

### Detail Page Layout

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
      <MetricCard title="Metric 1" value="100" caption="caption" />
      <MetricCard title="Metric 2" value="200" caption="caption" />
    </div>

    {/* Info cards */}
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
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
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>{/* Table */}</Table>
      </CardContent>
    </Card>
  </div>
</MainLayout>
```

### Form Dialog Layout

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
          Description of what this form does
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
            required
          />
        </div>
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

## Table Patterns

### Standard Table

```tsx
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
            <DropdownMenu>
              {/* Actions */}
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

## Mobile Responsiveness

### Responsive Grid

```tsx
// 1 column on mobile, 2 on tablet, 4 on desktop
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {items.map(item => <Card key={item.id}>{/* Content */}</Card>)}
</div>
```

### Responsive Flex

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
  <div>{/* Content */}</div>
  <Button>{/* Action */}</Button>
</div>
```

### Responsive Width

```tsx
// Full width on mobile, fixed on desktop
<Select className="w-full sm:w-[200px] h-10">
  {/* Options */}
</Select>
```

## Utility Usage

### Formatting

Always use the shared formatters. Never format inline.

```tsx
import { formatCurrency, formatDate, formatRent, formatRelativeDate } from "@/lib/formatters";

formatCurrency(2200)           // "CA$2,200"
formatRent(2200)               // "$2,200/mo"
formatDate("2026-09-30")       // "Sep 30, 2026"
formatRelativeDate("2026-09-30")  // "In 6 weeks"
```

### Validation

Use validation functions in form submit handlers:

```tsx
import { required, email, validate } from "@/lib/validation";

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const err = validate(
    required(formData.name, "Property name"),
    required(formData.address, "Address"),
  );
  if (err) { toast.error(err); return; }
  addProperty(formData);
};
```

### Constants

Use constant arrays to populate select menus:

```tsx
import { PROPERTY_TYPES, UNIT_STATUSES } from "@/lib/constants";

<SelectContent>
  {PROPERTY_TYPES.map(type => (
    <SelectItem key={type} value={type}>{type}</SelectItem>
  ))}
</SelectContent>
```

### Accessibility — Dialog without Description

When a Dialog has no `DialogDescription`, suppress the Radix warning by passing `aria-describedby={undefined}` to `DialogContent`:

```tsx
<DialogContent className="max-w-lg" aria-describedby={undefined}>
  <DialogHeader>
    <DialogTitle>Confirm Action</DialogTitle>
  </DialogHeader>
  {/* No DialogDescription — aria-describedby={undefined} suppresses the warning */}
</DialogContent>
```

## Best Practices

### Spacing
- Use consistent spacing scale: `gap-4`, `gap-6`, `space-y-6`
- Page sections: `space-y-6`
- Card content: `space-y-4`
- Form fields: `gap-5`

### Typography
- Page titles are handled by `MainLayout`
- Section titles: `text-lg font-semibold`
- Card titles: Use `CardTitle` component
- Body text: `text-sm`
- Captions: `text-xs text-muted-foreground`

### Colors
- Primary actions: `bg-green-600 hover:bg-green-700`
- Status badges: Use `StatusBadge` component
- Priority badges: Use `PriorityBadge` component
- Borders: `border-border` or `border-gray-200`

### Accessibility
- Always provide labels for form inputs
- Use semantic HTML
- Include aria-labels for icon-only buttons
- Maintain proper heading hierarchy
- Ensure sufficient color contrast

### Performance
- Use React.memo for list items with many props
- Debounce search inputs
- Show loading states for async operations
- Lazy load detail pages
