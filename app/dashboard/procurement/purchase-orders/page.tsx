"use client";

import { useAuth } from "@/contexts/AuthContext";
import { StatsCard, ListCard, DataTableHeader } from "@/components/ui/layout-cards";
import { DataTable, TableColumn, StatusCell, DateCell, CurrencyCell, ActionCell } from "@/components/ui/data-table";
import { FormModal, FormField, useFormValidation, validationRules } from "@/components/ui/form-components";
import { useToast } from "@/components/ui/toast";
import { designSystem } from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  FileText
} from "lucide-react";
import React from "react";

// Sample data for purchase orders
const purchaseOrderStats = [
  {
    title: "Total Purchase Orders",
    value: "234",
    description: "All time",
    icon: <ShoppingCart className="h-8 w-8" />
  },
  {
    title: "Pending Approval",
    value: "12",
    description: "Awaiting review",
    icon: <Clock className="h-8 w-8" />
  },
  {
    title: "Approved This Month",
    value: "45",
    description: "Current month",
    trend: { value: "+8%", isPositive: true },
    icon: <CheckCircle className="h-8 w-8" />
  },
  {
    title: "Total Value",
    value: "$1.2M",
    description: "This quarter",
    trend: { value: "+15%", isPositive: true },
    icon: <DollarSign className="h-8 w-8" />
  }
];

const purchaseOrdersData = [
  {
    id: "PO-2024-001",
    poNumber: "PO-2024-001",
    supplier: "TechCorp Ltd",
    department: "IT",
    description: "Computer equipment and accessories",
    amount: 15234.50,
    status: "approved",
    priority: "high",
    requestedBy: "John Smith",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    approvedBy: "Jane Doe"
  },
  {
    id: "PO-2024-002",
    poNumber: "PO-2024-002",
    supplier: "BuildCorp Inc",
    department: "Facilities",
    description: "Construction materials for office renovation",
    amount: 45890.00,
    status: "pending",
    priority: "medium",
    requestedBy: "Mike Johnson",
    date: "2024-01-12",
    dueDate: "2024-02-12"
  },
  {
    id: "PO-2024-003",
    poNumber: "PO-2024-003",
    supplier: "OfficeSupply Co",
    department: "Admin",
    description: "Office supplies and stationery",
    amount: 2340.75,
    status: "approved",
    priority: "low",
    requestedBy: "Sarah Wilson",
    date: "2024-01-10",
    dueDate: "2024-01-25",
    approvedBy: "Bob Smith"
  },
  {
    id: "PO-2024-004",
    poNumber: "PO-2024-004",
    supplier: "SafetyFirst Ltd",
    department: "Operations",
    description: "Safety equipment and protective gear",
    amount: 8750.00,
    status: "draft",
    priority: "high",
    requestedBy: "Tom Brown",
    date: "2024-01-08",
    dueDate: "2024-01-30"
  },
  {
    id: "PO-2024-005",
    poNumber: "PO-2024-005",
    supplier: "EnergyTech Solutions",
    department: "Engineering",
    description: "Industrial equipment maintenance",
    amount: 32500.00,
    status: "rejected",
    priority: "medium",
    requestedBy: "Lisa Anderson",
    date: "2024-01-05",
    dueDate: "2024-02-05"
  }
];

const suppliers = ["TechCorp Ltd", "BuildCorp Inc", "OfficeSupply Co", "SafetyFirst Ltd", "EnergyTech Solutions"];
const departments = ["IT", "Facilities", "Admin", "Operations", "Engineering", "HR", "Finance"];
const priorities = ["low", "medium", "high"];

const tableColumns: TableColumn[] = [
  {
    id: "poNumber",
    header: "PO Number",
    accessorKey: "poNumber",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.poNumber}
      </div>
    )
  },
  {
    id: "supplier",
    header: "Supplier",
    accessorKey: "supplier",
    sortable: true
  },
  {
    id: "department",
    header: "Department",
    accessorKey: "department",
    sortable: true
  },
  {
    id: "description",
    header: "Description",
    cell: (row) => (
      <div className="max-w-xs truncate" title={row.description}>
        {row.description}
      </div>
    )
  },
  {
    id: "amount",
    header: "Amount",
    cell: (row) => <CurrencyCell amount={row.amount} />
  },
  {
    id: "priority",
    header: "Priority",
    cell: (row) => (
      <span className={designSystem.getBadge(
        row.priority === 'high' ? 'rejected' :
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
    header: "Date Created",
    cell: (row) => <DateCell date={row.date} />
  }
];

export default function PurchaseOrdersPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [selectedPOs, setSelectedPOs] = React.useState<string[]>([]);

  // Form validation for new purchase order
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      supplier: '',
      department: '',
      description: '',
      amount: '',
      priority: 'medium',
      dueDate: ''
    },
    {
      supplier: validationRules.required,
      department: validationRules.required,
      description: validationRules.required,
      amount: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      dueDate: validationRules.required
    }
  );

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Purchase Order created successfully!");
      reset();
    } else {
      error("Please fill all required fields");
    }
  };

  const handleBulkApprove = () => {
    if (selectedPOs.length === 0) {
      error("Please select purchase orders to approve");
      return;
    }
    success(`${selectedPOs.length} purchase order(s) approved`);
    setSelectedPOs([]);
  };

  const handleExport = () => {
    success("Purchase orders exported to CSV");
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Purchase Orders</h1>
        <p className={designSystem.getBody("small")}>
          Create, track, and manage purchase orders for all departments
        </p>
      </div>

      {/* Stats Cards */}
      <div className={designSystem.getGrid("cols4")}>
        {purchaseOrderStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions & Filters */}
      <section className="space-y-4">
        <DataTableHeader
          title="All Purchase Orders"
          description="Complete list of purchase orders across all departments"
          searchPlaceholder="Search by PO number, supplier, or description..."
          onSearch={(value) => console.log("Search:", value)}
          onRefresh={() => success("Purchase orders refreshed")}
          onExport={handleExport}
          actions={
            <div className="flex space-x-2">
              {selectedPOs.length > 0 && (
                <Button variant="outline" onClick={handleBulkApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Selected ({selectedPOs.length})
                </Button>
              )}
              <FormModal
                title="Create New Purchase Order"
                description="Fill out the details to create a new purchase order"
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Purchase Order
                  </Button>
                }
                onSubmit={handleCreatePO}
                submitLabel="Create PO"
                size="lg"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Supplier" required error={errors.supplier}>
                    <Select value={values.supplier} onValueChange={(value) => setValue('supplier', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

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
                </div>

                <FormField label="Description" required error={errors.description}>
                  <Textarea
                    value={values.description}
                    onChange={(e) => setValue('description', e.target.value)}
                    placeholder="Describe the items or services being purchased"
                    rows={3}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Amount" required error={errors.amount}>
                    <Input
                      type="number"
                      value={values.amount}
                      onChange={(e) => setValue('amount', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </FormField>

                  <FormField label="Priority" required>
                    <Select value={values.priority} onValueChange={(value) => setValue('priority', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Due Date" required error={errors.dueDate}>
                  <Input
                    type="date"
                    value={values.dueDate}
                    onChange={(e) => setValue('dueDate', e.target.value)}
                  />
                </FormField>
              </FormModal>
            </div>
          }
        />

        {/* Purchase Orders Table */}
        <DataTable
          data={purchaseOrdersData}
          columns={tableColumns}
          pagination={{
            page: 1,
            pageSize: 10,
            total: purchaseOrdersData.length,
            onPageChange: (page) => console.log("Page:", page),
            onPageSizeChange: (size) => console.log("Page size:", size)
          }}
          sorting={{
            column: "date",
            direction: "desc",
            onSortChange: (column, direction) => console.log("Sort:", column, direction)
          }}
          selection={{
            selectedRows: selectedPOs,
            onRowSelect: (id) => {
              setSelectedPOs(prev =>
                prev.includes(id)
                  ? prev.filter(item => item !== id)
                  : [...prev, id]
              );
            },
            onSelectAll: () => {
              setSelectedPOs(prev =>
                prev.length === purchaseOrdersData.length
                  ? []
                  : purchaseOrdersData.map(po => po.id)
              );
            }
          }}
          actions={{
            row: (row) => (
              <ActionCell
                actions={[
                  {
                    label: "View",
                    onClick: () => success(`Viewing ${row.poNumber}`),
                    variant: "outline"
                  },
                  {
                    label: "Edit",
                    onClick: () => success(`Editing ${row.poNumber}`),
                    variant: "outline"
                  }
                ]}
              />
            ),
            bulk: selectedPOs.length > 0 ? (
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
            message: "No purchase orders found",
            action: (
              <Button onClick={() => success("Creating first purchase order...")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Purchase Order
              </Button>
            )
          }}
        />
      </section>

      {/* Recent Activity Summary */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h3")}>Recent Purchase Order Activity</h2>

        <ListCard
          title="Latest Updates"
          items={[
            {
              id: "1",
              title: "PO-2024-001 - Computer Equipment",
              description: "Approved by Jane Doe • TechCorp Ltd • $15,234.50",
              status: { label: "Approved", variant: "default" },
              metadata: [
                { label: "Department", value: "IT" },
                { label: "Due", value: "Feb 15, 2024" }
              ],
              actions: (
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              )
            },
            {
              id: "2",
              title: "PO-2024-002 - Construction Materials",
              description: "Pending approval • BuildCorp Inc • $45,890.00",
              status: { label: "Pending", variant: "secondary" },
              metadata: [
                { label: "Department", value: "Facilities" },
                { label: "Due", value: "Feb 12, 2024" }
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
              label: "Create Purchase Order",
              onClick: () => success("Creating new purchase order...")
            }
          }}
        />
      </section>
    </div>
  );
}