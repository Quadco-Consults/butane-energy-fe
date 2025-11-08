# Design System Components

This directory contains reusable UI components and design system utilities for consistent application styling and functionality.

## Core Components

### 1. Modal (`modal.tsx`)
Reusable modal dialogs with different sizes and consistent styling.

```tsx
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalTrigger } from "@/components/ui/modal";

// Basic Usage
<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent size="md">
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
      <ModalDescription>Modal description</ModalDescription>
    </ModalHeader>
    {/* Modal content */}
    <ModalFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

**Available sizes:** `sm`, `md`, `lg`, `xl`, `full`

### 2. Form Components (`form-components.tsx`)
Complete form system with validation and consistent styling.

```tsx
import { FormField, FormContainer, FormModal, useFormValidation, validationRules } from "@/components/ui/form-components";

// Basic Form Field
<FormField label="Email" required error={errors.email}>
  <Input
    type="email"
    value={values.email}
    onChange={(e) => setValue('email', e.target.value)}
  />
</FormField>

// Form with Validation
const { values, errors, setValue, validate } = useFormValidation(
  { email: '', name: '' },
  {
    email: (value) => validationRules.required(value) || validationRules.email(value),
    name: validationRules.required
  }
);

// Form Container
<FormContainer
  title="User Information"
  description="Please fill out the form below"
  onSubmit={handleSubmit}
  footer={
    <div className="flex space-x-2">
      <Button type="button" variant="outline">Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  }
>
  {/* Form fields */}
</FormContainer>

// Form Modal
<FormModal
  title="Create New Item"
  description="Fill out the details below"
  trigger={<Button>Create Item</Button>}
  onSubmit={handleSubmit}
>
  {/* Form fields */}
</FormModal>
```

### 3. Layout Cards (`layout-cards.tsx`)
Pre-designed card components for common layout patterns.

```tsx
import { StatsCard, ActionCard, ListCard, DataTableHeader, QuickActions, ComingSoonCard } from "@/components/ui/layout-cards";

// Stats Card
<StatsCard
  title="Total Revenue"
  value="$12,450"
  description="Last 30 days"
  trend={{ value: "+12%", isPositive: true }}
  icon={<DollarSign className="h-8 w-8" />}
/>

// Action Card
<ActionCard
  title="Purchase Requests"
  description="Create and manage purchase requests"
  icon={<ShoppingCart className="h-6 w-6" />}
  actions={[
    { label: "Create Request", onClick: () => {}, icon: <Plus className="h-4 w-4" /> },
    { label: "View All", onClick: () => {}, variant: "outline" }
  ]}
/>

// List Card
<ListCard
  title="Recent Requests"
  items={[
    {
      id: "1",
      title: "Office Supplies",
      description: "Requested by John Doe",
      status: { label: "Pending", variant: "warning" },
      actions: <Button size="sm">Review</Button>
    }
  ]}
  emptyState={{
    message: "No requests found",
    action: { label: "Create Request", onClick: () => {} }
  }}
/>

// Coming Soon Card
<ComingSoonCard
  title="Analytics Dashboard"
  description="Comprehensive analytics and reporting"
  icon={<BarChart className="h-5 w-5" />}
  features={["Real-time metrics", "Custom reports", "Data export"]}
  estimatedLaunch="Q2 2024"
/>
```

### 4. Data Table (`data-table.tsx`)
Comprehensive data table with sorting, filtering, pagination, and selection.

```tsx
import { DataTable, TableColumn, StatusCell, DateCell, CurrencyCell, ActionCell } from "@/components/ui/data-table";

const columns: TableColumn[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    sortable: true
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusCell status={row.status} variant="default" />
  },
  {
    id: "amount",
    header: "Amount",
    cell: (row) => <CurrencyCell amount={row.amount} />
  },
  {
    id: "actions",
    header: "Actions",
    cell: (row) => (
      <ActionCell
        actions={[
          { label: "Edit", onClick: () => edit(row.id) },
          { label: "Delete", onClick: () => delete(row.id), variant: "destructive" }
        ]}
      />
    )
  }
];

<DataTable
  data={data}
  columns={columns}
  pagination={{
    page: 1,
    pageSize: 10,
    total: 100,
    onPageChange: setPage,
    onPageSizeChange: setPageSize
  }}
  sorting={{
    column: "name",
    direction: "asc",
    onSortChange: handleSort
  }}
  selection={{
    selectedRows: selected,
    onRowSelect: selectRow,
    onSelectAll: selectAll
  }}
/>
```

### 5. Toast/Notification System (`toast.tsx`)
Toast notifications and inline notifications.

```tsx
import { useToast, ToastProvider, Notification } from "@/components/ui/toast";

// In your app root:
<ToastProvider>
  {/* Your app */}
</ToastProvider>

// In components:
const { success, error, warning, info } = useToast();

// Usage
success("Data saved successfully!");
error("Failed to save data", {
  title: "Error",
  action: { label: "Retry", onClick: retry }
});

// Inline Notification
<Notification
  type="success"
  title="Success"
  message="Operation completed successfully"
  onClose={() => setShow(false)}
/>
```

## Design System Utilities (`design-system.ts`)

### Typography
```tsx
import { designSystem } from "@/lib/design-system";

<h1 className={designSystem.getHeading("h1")}>Page Title</h1>
<p className={designSystem.getBody("base")}>Body text</p>
<span className={designSystem.getBody("small")}>Small text</span>
```

### Colors
```tsx
// Department colors
<div className={designSystem.getDepartmentColor("finance", "light")}>
  Finance section
</div>

// Status colors
<div className={designSystem.getStatusColor("success", "bg")}>
  Success message
</div>
```

### Layout
```tsx
// Grid layouts
<div className={designSystem.getGrid("cols3")}>
  {/* 3-column responsive grid */}
</div>

// Cards
<div className={designSystem.getCard("elevated")}>
  Card content
</div>
```

### Badges
```tsx
<span className={designSystem.getBadge("approved")}>Approved</span>
<span className={designSystem.getBadge("pending")}>Pending</span>
```

## Enhanced Button Variants

Our button component now includes additional variants:

```tsx
import { Button } from "@/components/ui/button";

<Button variant="success">Success Action</Button>
<Button variant="warning">Warning Action</Button>
<Button variant="info">Info Action</Button>
<Button variant="destructive">Delete</Button>
```

## Best Practices

### 1. Consistent Spacing
Use the spacing system from `design-system.ts`:
```tsx
import { spacing } from "@/lib/design-system";

<div className="space-y-6"> {/* Use consistent spacing */}
  <div className="p-6">Content</div>
</div>
```

### 2. Typography Hierarchy
Always use the design system typography:
```tsx
// Good
<h1 className={designSystem.getHeading("h1")}>Title</h1>

// Bad
<h1 className="text-3xl font-bold">Title</h1>
```

### 3. Color Usage
Use semantic color names and design system utilities:
```tsx
// Good
<div className={designSystem.getStatusColor("success", "bg")}>
  Success message
</div>

// Bad
<div className="bg-green-100">
  Success message
</div>
```

### 4. Component Composition
Prefer composition over custom styling:
```tsx
// Good
<FormField label="Email" required>
  <Input type="email" />
</FormField>

// Bad
<div className="space-y-2">
  <label className="text-sm font-medium">Email *</label>
  <Input type="email" />
</div>
```

### 5. Responsive Design
Use the responsive grid system:
```tsx
// Good
<div className={designSystem.getGrid("cols3")}>
  {items.map(item => <Card key={item.id} />)}
</div>

// Bad
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

## Common Patterns

### Page Layout
```tsx
export default function MyPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Page Title</h1>
        <p className={designSystem.getBody("small")}>Page description</p>
      </div>

      {/* Page Content */}
      <div className={designSystem.getGrid("cols2")}>
        {/* Cards or content */}
      </div>
    </div>
  );
}
```

### Form Page
```tsx
export default function CreateForm() {
  const { values, errors, setValue, validate } = useFormValidation(
    initialValues,
    validationRules
  );

  return (
    <FormContainer
      title="Create New Item"
      description="Fill out the details below"
      onSubmit={handleSubmit}
    >
      <FormField label="Name" required error={errors.name}>
        <Input value={values.name} onChange={(e) => setValue('name', e.target.value)} />
      </FormField>
      {/* More fields */}
    </FormContainer>
  );
}
```

### Data Display
```tsx
export default function DataPage() {
  return (
    <div className="space-y-6">
      <DataTableHeader
        title="Items"
        description="Manage your items"
        onSearch={setSearch}
        onRefresh={refresh}
        actions={<Button>Add Item</Button>}
      />

      <DataTable
        data={data}
        columns={columns}
        pagination={pagination}
      />
    </div>
  );
}
```

This design system ensures consistency across the entire application while providing flexibility for different use cases.