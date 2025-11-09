"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard, ListCard, DataTableHeader } from "@/components/ui/layout-cards";
import { DataTable, TableColumn, StatusCell, DateCell, ActionCell } from "@/components/ui/data-table";
import { FormModal, FormField, useFormValidation, validationRules } from "@/components/ui/form-components";
import { designSystem } from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  Box,
  Warehouse
} from "lucide-react";

// Sample data for item requisitions
const itemRequisitionStats = [
  {
    title: "Total Requisitions",
    value: "134",
    description: "All time",
    icon: <Package className="h-8 w-8" />
  },
  {
    title: "Pending Approval",
    value: "18",
    description: "Awaiting review",
    icon: <Clock className="h-8 w-8" />
  },
  {
    title: "Approved This Month",
    value: "32",
    description: "Current month",
    trend: { value: "+22%", isPositive: true },
    icon: <CheckCircle className="h-8 w-8" />
  },
  {
    title: "Items in Stock",
    value: "1,247",
    description: "Available inventory",
    icon: <Warehouse className="h-8 w-8" />
  }
];

const itemRequisitionsData = [
  {
    id: "IR-2024-001",
    requisitionNumber: "IR-2024-001",
    itemName: "Office Chairs - Ergonomic",
    category: "Furniture",
    quantity: 5,
    unitPrice: 250.00,
    totalCost: 1250.00,
    department: "Admin",
    priority: "medium",
    status: "approved",
    requestedBy: "Sarah Johnson",
    date: "2024-01-15",
    requiredBy: "2024-02-01",
    approvedBy: "Michael Davis"
  },
  {
    id: "IR-2024-002",
    requisitionNumber: "IR-2024-002",
    itemName: "Laptop - Dell XPS 15",
    category: "Technology",
    quantity: 2,
    unitPrice: 1500.00,
    totalCost: 3000.00,
    department: "IT",
    priority: "high",
    status: "pending",
    requestedBy: "Ahmed Hassan",
    date: "2024-01-18",
    requiredBy: "2024-01-30"
  },
  {
    id: "IR-2024-003",
    requisitionNumber: "IR-2024-003",
    itemName: "Safety Helmets",
    category: "Safety Equipment",
    quantity: 20,
    unitPrice: 45.00,
    totalCost: 900.00,
    department: "Operations",
    priority: "high",
    status: "approved",
    requestedBy: "Grace Adebayo",
    date: "2024-01-12",
    requiredBy: "2024-01-25",
    approvedBy: "Michael Davis"
  },
  {
    id: "IR-2024-004",
    requisitionNumber: "IR-2024-004",
    itemName: "Printer Paper - A4",
    category: "Office Supplies",
    quantity: 50,
    unitPrice: 12.00,
    totalCost: 600.00,
    department: "Admin",
    priority: "low",
    status: "draft",
    requestedBy: "Lisa Park",
    date: "2024-01-20",
    requiredBy: "2024-02-10"
  },
  {
    id: "IR-2024-005",
    requisitionNumber: "IR-2024-005",
    itemName: "Industrial Generators",
    category: "Equipment",
    quantity: 3,
    unitPrice: 5000.00,
    totalCost: 15000.00,
    department: "Operations",
    priority: "urgent",
    status: "rejected",
    requestedBy: "John Roberts",
    date: "2024-01-10",
    requiredBy: "2024-01-20",
    rejectedBy: "Michael Davis",
    rejectionReason: "Budget exceeded - requires management approval"
  }
];

const itemCategories = [
  "Office Supplies",
  "Technology",
  "Furniture",
  "Safety Equipment",
  "Equipment",
  "Cleaning Supplies",
  "Maintenance Tools",
  "Stationery"
];

const departments = ["Admin", "IT", "Operations", "Finance", "HR", "Marketing", "Procurement", "Logistics"];
const priorityLevels = ["low", "medium", "high", "urgent"];

const inventoryItems = [
  "Office Chairs - Ergonomic",
  "Laptop - Dell XPS 15",
  "Desktop Computer - HP",
  "Safety Helmets",
  "Printer Paper - A4",
  "Pens - Blue Ink",
  "Folders - Manila",
  "Notebooks - A5",
  "Industrial Generators",
  "Cleaning Supplies Kit"
];

const tableColumns: TableColumn[] = [
  {
    id: "requisitionNumber",
    header: "Requisition #",
    accessorKey: "requisitionNumber",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.requisitionNumber}
      </div>
    )
  },
  {
    id: "itemName",
    header: "Item",
    cell: (row) => (
      <div>
        <div className="font-medium">{row.itemName}</div>
        <div className="text-sm text-gray-500">{row.category}</div>
      </div>
    )
  },
  {
    id: "quantity",
    header: "Qty",
    cell: (row) => (
      <div className="font-medium">
        {row.quantity}
      </div>
    )
  },
  {
    id: "totalCost",
    header: "Total Cost",
    cell: (row) => (
      <div className="font-medium">
        ${row.totalCost.toLocaleString()}
      </div>
    )
  },
  {
    id: "department",
    header: "Department",
    accessorKey: "department",
    sortable: true
  },
  {
    id: "priority",
    header: "Priority",
    cell: (row) => (
      <span className={designSystem.getBadge(
        row.priority === 'urgent' || row.priority === 'high' ? 'rejected' :
        row.priority === 'medium' ? 'pending' : 'approved'
      )}>
        {row.priority}
      </span>
    )
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusCell
        status={row.status}
        variant={
          row.status === 'approved' ? 'default' :
          row.status === 'pending' ? 'secondary' :
          row.status === 'rejected' ? 'destructive' : 'outline'
        }
      />
    )
  },
  {
    id: "date",
    header: "Date Requested",
    cell: (row) => <DateCell date={row.date} />
  }
];

export default function ItemRequisitionPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedRequisitions, setSelectedRequisitions] = React.useState<string[]>([]);

  // Form validation for new item requisition
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      itemName: '',
      category: '',
      quantity: '',
      unitPrice: '',
      department: '',
      priority: 'medium',
      requiredBy: '',
      justification: '',
      specifications: ''
    },
    {
      itemName: validationRules.required,
      category: validationRules.required,
      quantity: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      unitPrice: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      department: validationRules.required,
      requiredBy: validationRules.required,
      justification: validationRules.required
    }
  );

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Item requisition created successfully and sent for approval!");
      reset();
    } else {
      error("Please fill all required fields");
    }
  };

  const handleBulkApprove = () => {
    if (selectedRequisitions.length === 0) {
      error("Please select requisitions to approve");
      return;
    }
    success(`${selectedRequisitions.length} requisition(s) approved`);
    setSelectedRequisitions([]);
  };

  const handleExport = () => {
    success("Item requisitions exported to Excel");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>Item Requisition</h1>
          <p className={designSystem.getBody("small")}>
            Request items from the organizational inventory system
          </p>
        </div>

        {/* Stats Cards */}
        <div className={designSystem.getGrid("cols4")}>
          {itemRequisitionStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions & Filters */}
        <section className="space-y-4">
          <DataTableHeader
            title="All Item Requisitions"
            description="Submit new requisitions and track inventory requests"
            searchPlaceholder="Search by requisition number, item name, or department..."
            onSearch={(value) => console.log("Search:", value)}
            onRefresh={() => success("Item requisitions refreshed")}
            onExport={handleExport}
            actions={
              <div className="flex space-x-2">
                {selectedRequisitions.length > 0 && (
                  <Button variant="outline" onClick={handleBulkApprove}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Selected ({selectedRequisitions.length})
                  </Button>
                )}
                <FormModal
                  title="New Item Requisition"
                  description="Request items from organizational inventory"
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Requisition
                    </Button>
                  }
                  onSubmit={handleCreateRequisition}
                  submitLabel="Submit Requisition"
                  size="lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Item Name" required error={errors.itemName}>
                      <Select value={values.itemName} onValueChange={(value) => setValue('itemName', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item from inventory" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Category" required error={errors.category}>
                      <Select value={values.category} onValueChange={(value) => setValue('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Quantity" required error={errors.quantity}>
                      <Input
                        type="number"
                        value={values.quantity}
                        onChange={(e) => setValue('quantity', e.target.value)}
                        placeholder="0"
                        min="1"
                      />
                    </FormField>

                    <FormField label="Unit Price" required error={errors.unitPrice}>
                      <Input
                        type="number"
                        value={values.unitPrice}
                        onChange={(e) => setValue('unitPrice', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Department" required error={errors.department}>
                      <Select value={values.department} onValueChange={(value) => setValue('department', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Priority" required>
                      <Select value={values.priority} onValueChange={(value) => setValue('priority', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityLevels.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Required By Date" required error={errors.requiredBy}>
                    <Input
                      type="date"
                      value={values.requiredBy}
                      onChange={(e) => setValue('requiredBy', e.target.value)}
                    />
                  </FormField>

                  <FormField label="Business Justification" required error={errors.justification}>
                    <Textarea
                      value={values.justification}
                      onChange={(e) => setValue('justification', e.target.value)}
                      placeholder="Explain why this item is needed for business operations"
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Item Specifications (Optional)">
                    <Textarea
                      value={values.specifications}
                      onChange={(e) => setValue('specifications', e.target.value)}
                      placeholder="Specific requirements, models, or technical specifications"
                      rows={4}
                    />
                  </FormField>
                </FormModal>
              </div>
            }
          />

          {/* Item Requisitions Table */}
          <DataTable
            data={itemRequisitionsData}
            columns={tableColumns}
            pagination={{
              page: 1,
              pageSize: 10,
              total: itemRequisitionsData.length,
              onPageChange: (page) => console.log("Page:", page),
              onPageSizeChange: (size) => console.log("Page size:", size)
            }}
            sorting={{
              column: "date",
              direction: "desc",
              onSortChange: (column, direction) => console.log("Sort:", column, direction)
            }}
            selection={{
              selectedRows: selectedRequisitions,
              onRowSelect: (id) => {
                setSelectedRequisitions(prev =>
                  prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
                );
              },
              onSelectAll: () => {
                setSelectedRequisitions(prev =>
                  prev.length === itemRequisitionsData.length
                    ? []
                    : itemRequisitionsData.map(req => req.id)
                );
              }
            }}
            actions={{
              row: (row) => (
                <ActionCell
                  actions={[
                    {
                      label: "View",
                      onClick: () => success(`Viewing ${row.requisitionNumber}`),
                      variant: "outline"
                    },
                    {
                      label: "Edit",
                      onClick: () => success(`Editing ${row.requisitionNumber}`),
                      variant: "outline",
                      disabled: row.status === 'approved' || row.status === 'rejected'
                    }
                  ]}
                />
              ),
              bulk: selectedRequisitions.length > 0 ? (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkApprove}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => success("Bulk export started")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              ) : undefined
            }}
            emptyState={{
              message: "No item requisitions found",
              action: (
                <Button onClick={() => success("Creating first requisition...")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Requisition
                </Button>
              )
            }}
          />
        </section>

        {/* Recent Activity Summary */}
        <section className="space-y-4">
          <h2 className={designSystem.getHeading("h3")}>Recent Requisition Activity</h2>

          <ListCard
            title="Latest Updates"
            items={[
              {
                id: "1",
                title: "IR-2024-003 - Safety Helmets",
                description: "Approved by Michael Davis • Operations • 20 units • $900.00",
                status: { label: "Approved", variant: "default" },
                metadata: [
                  { label: "Category", value: "Safety Equipment" },
                  { label: "Required", value: "Jan 25, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Box className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "2",
                title: "IR-2024-002 - Laptop - Dell XPS 15",
                description: "Pending approval • IT Department • 2 units • $3,000.00",
                status: { label: "Pending", variant: "secondary" },
                metadata: [
                  { label: "Category", value: "Technology" },
                  { label: "Required", value: "Jan 30, 2024" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )
              }
            ]}
            emptyState={{
              message: "No recent activity",
              action: {
                label: "Create Requisition",
                onClick: () => success("Creating new requisition...")
              }
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}