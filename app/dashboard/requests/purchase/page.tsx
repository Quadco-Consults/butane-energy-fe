"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard, ListCard, DataTableHeader } from "@/components/ui/layout-cards";
import { DataTable, TableColumn, StatusCell, DateCell, CurrencyCell, ActionCell } from "@/components/ui/data-table";
import { FormModal, FormField, useFormValidation, validationRules } from "@/components/ui/form-components";
import { designSystem } from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  DollarSign,
  FileText
} from "lucide-react";

// Sample data for purchase requests
const purchaseRequestStats = [
  {
    title: "Total Requests",
    value: "89",
    description: "All time",
    icon: <ShoppingCart className="h-8 w-8" />
  },
  {
    title: "Pending Review",
    value: "15",
    description: "Awaiting approval",
    icon: <Clock className="h-8 w-8" />
  },
  {
    title: "Approved This Month",
    value: "28",
    description: "Current month",
    trend: { value: "+18%", isPositive: true },
    icon: <CheckCircle className="h-8 w-8" />
  },
  {
    title: "Total Value",
    value: "$45,670",
    description: "This quarter",
    trend: { value: "+8%", isPositive: true },
    icon: <DollarSign className="h-8 w-8" />
  }
];

const purchaseRequestsData = [
  {
    id: "PR-2024-001",
    requestNumber: "PR-2024-001",
    description: "Office Furniture for New Workspace",
    department: "Admin",
    category: "Furniture & Fixtures",
    estimatedCost: 8500.00,
    urgency: "medium",
    status: "pending",
    requestedBy: "Sarah Johnson",
    date: "2024-01-15",
    requiredBy: "2024-02-01"
  },
  {
    id: "PR-2024-002",
    requestNumber: "PR-2024-002",
    description: "Computer Hardware Upgrade",
    department: "IT",
    category: "Technology",
    estimatedCost: 15000.00,
    urgency: "high",
    status: "approved",
    requestedBy: "Mike Chen",
    date: "2024-01-12",
    requiredBy: "2024-01-25",
    approvedBy: "David Wilson"
  },
  {
    id: "PR-2024-003",
    requestNumber: "PR-2024-003",
    description: "Safety Equipment and PPE",
    department: "Operations",
    category: "Safety Equipment",
    estimatedCost: 3200.00,
    urgency: "high",
    status: "approved",
    requestedBy: "Ahmed Hassan",
    date: "2024-01-10",
    requiredBy: "2024-01-20",
    approvedBy: "David Wilson"
  },
  {
    id: "PR-2024-004",
    requestNumber: "PR-2024-004",
    description: "Marketing Materials and Promotional Items",
    department: "Marketing",
    category: "Marketing & Promotional",
    estimatedCost: 2750.00,
    urgency: "low",
    status: "draft",
    requestedBy: "Lisa Park",
    date: "2024-01-08",
    requiredBy: "2024-02-15"
  },
  {
    id: "PR-2024-005",
    requestNumber: "PR-2024-005",
    description: "Vehicle Maintenance Services",
    department: "Logistics",
    category: "Maintenance Services",
    estimatedCost: 4500.00,
    urgency: "medium",
    status: "rejected",
    requestedBy: "John Roberts",
    date: "2024-01-05",
    requiredBy: "2024-01-18",
    rejectedBy: "David Wilson",
    rejectionReason: "Budget constraints - resubmit next quarter"
  }
];

const categories = [
  "Technology",
  "Furniture & Fixtures",
  "Office Supplies",
  "Safety Equipment",
  "Maintenance Services",
  "Marketing & Promotional",
  "Professional Services",
  "Travel & Transportation"
];

const departments = ["Admin", "IT", "Operations", "Marketing", "Finance", "HR", "Logistics", "Procurement"];
const urgencyLevels = ["low", "medium", "high", "urgent"];

const tableColumns: TableColumn[] = [
  {
    id: "requestNumber",
    header: "Request #",
    accessorKey: "requestNumber",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.requestNumber}
      </div>
    )
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
    id: "department",
    header: "Department",
    accessorKey: "department",
    sortable: true
  },
  {
    id: "category",
    header: "Category",
    accessorKey: "category",
    sortable: true,
    cell: (row) => (
      <div className="text-sm text-gray-600">
        {row.category}
      </div>
    )
  },
  {
    id: "estimatedCost",
    header: "Est. Cost",
    cell: (row) => <CurrencyCell amount={row.estimatedCost} />
  },
  {
    id: "urgency",
    header: "Urgency",
    cell: (row) => (
      <span className={designSystem.getBadge(
        row.urgency === 'urgent' || row.urgency === 'high' ? 'rejected' :
        row.urgency === 'medium' ? 'pending' : 'approved'
      )}>
        {row.urgency}
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

export default function PurchaseRequestPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedRequests, setSelectedRequests] = React.useState<string[]>([]);

  // Form validation for new purchase request
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      description: '',
      department: '',
      category: '',
      estimatedCost: '',
      urgency: 'medium',
      requiredBy: '',
      justification: '',
      specifications: ''
    },
    {
      description: validationRules.required,
      department: validationRules.required,
      category: validationRules.required,
      estimatedCost: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      requiredBy: validationRules.required,
      justification: validationRules.required
    }
  );

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Purchase request created successfully and sent for approval!");
      reset();
    } else {
      error("Please fill all required fields");
    }
  };

  const handleBulkApprove = () => {
    if (selectedRequests.length === 0) {
      error("Please select purchase requests to approve");
      return;
    }
    success(`${selectedRequests.length} purchase request(s) approved`);
    setSelectedRequests([]);
  };

  const handleExport = () => {
    success("Purchase requests exported to Excel");
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={designSystem.getHeading("h1")}>Purchase Requests</h1>
        <p className={designSystem.getBody("small")}>
          Submit and manage purchase requests for procurement approval
        </p>
      </div>

      {/* Stats Cards */}
      <div className={designSystem.getGrid("cols4")}>
        {purchaseRequestStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions & Filters */}
      <section className="space-y-4">
        <DataTableHeader
          title="All Purchase Requests"
          description="Submit new requests and track approval status"
          searchPlaceholder="Search by request number, description, or department..."
          onSearch={(value) => console.log("Search:", value)}
          onRefresh={() => success("Purchase requests refreshed")}
          onExport={handleExport}
          actions={
            <div className="flex space-x-2">
              {selectedRequests.length > 0 && (
                <Button variant="outline" onClick={handleBulkApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Selected ({selectedRequests.length})
                </Button>
              )}
              <FormModal
                title="New Purchase Request"
                description="Submit a new purchase request for approval"
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                }
                onSubmit={handleCreateRequest}
                submitLabel="Submit Request"
                size="lg"
              >
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

                  <FormField label="Category" required error={errors.category}>
                    <Select value={values.category} onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Description" required error={errors.description}>
                  <Input
                    value={values.description}
                    onChange={(e) => setValue('description', e.target.value)}
                    placeholder="Brief description of what you need to purchase"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Estimated Cost" required error={errors.estimatedCost}>
                    <Input
                      type="number"
                      value={values.estimatedCost}
                      onChange={(e) => setValue('estimatedCost', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </FormField>

                  <FormField label="Urgency" required>
                    <Select value={values.urgency} onValueChange={(value) => setValue('urgency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((urgency) => (
                          <SelectItem key={urgency} value={urgency}>
                            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
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
                    placeholder="Explain why this purchase is necessary for business operations"
                    rows={3}
                  />
                </FormField>

                <FormField label="Detailed Specifications (Optional)">
                  <Textarea
                    value={values.specifications}
                    onChange={(e) => setValue('specifications', e.target.value)}
                    placeholder="Provide detailed specifications, preferred suppliers, or other relevant information"
                    rows={4}
                  />
                </FormField>
              </FormModal>
            </div>
          }
        />

        {/* Purchase Requests Table */}
        <DataTable
          data={purchaseRequestsData}
          columns={tableColumns}
          pagination={{
            page: 1,
            pageSize: 10,
            total: purchaseRequestsData.length,
            onPageChange: (page) => console.log("Page:", page),
            onPageSizeChange: (size) => console.log("Page size:", size)
          }}
          sorting={{
            column: "date",
            direction: "desc",
            onSortChange: (column, direction) => console.log("Sort:", column, direction)
          }}
          selection={{
            selectedRows: selectedRequests,
            onRowSelect: (id) => {
              setSelectedRequests(prev =>
                prev.includes(id)
                  ? prev.filter(item => item !== id)
                  : [...prev, id]
              );
            },
            onSelectAll: () => {
              setSelectedRequests(prev =>
                prev.length === purchaseRequestsData.length
                  ? []
                  : purchaseRequestsData.map(request => request.id)
              );
            }
          }}
          actions={{
            row: (row) => (
              <ActionCell
                actions={[
                  {
                    label: "View",
                    onClick: () => success(`Viewing ${row.requestNumber}`),
                    variant: "outline"
                  },
                  {
                    label: "Edit",
                    onClick: () => success(`Editing ${row.requestNumber}`),
                    variant: "outline",
                    disabled: row.status === 'approved' || row.status === 'rejected'
                  }
                ]}
              />
            ),
            bulk: selectedRequests.length > 0 ? (
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
            message: "No purchase requests found",
            action: (
              <Button onClick={() => success("Creating first purchase request...")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Request
              </Button>
            )
          }}
        />
      </section>

      {/* Recent Activity Summary */}
      <section className="space-y-4">
        <h2 className={designSystem.getHeading("h3")}>Recent Request Activity</h2>

        <ListCard
          title="Latest Updates"
          items={[
            {
              id: "1",
              title: "PR-2024-002 - Computer Hardware Upgrade",
              description: "Approved by David Wilson • IT Department • $15,000.00",
              status: { label: "Approved", variant: "default" },
              metadata: [
                { label: "Department", value: "IT" },
                { label: "Required", value: "Jan 25, 2024" }
              ],
              actions: (
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <FileText className="h-3 w-3" />
                  </Button>
                </div>
              )
            },
            {
              id: "2",
              title: "PR-2024-001 - Office Furniture",
              description: "Pending approval • Admin Department • $8,500.00",
              status: { label: "Pending", variant: "secondary" },
              metadata: [
                { label: "Department", value: "Admin" },
                { label: "Required", value: "Feb 01, 2024" }
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
              label: "Create Request",
              onClick: () => success("Creating new request...")
            }
          }}
        />
      </section>
    </div>
  );
}