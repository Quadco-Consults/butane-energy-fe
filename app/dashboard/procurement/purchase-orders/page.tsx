"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard, ListCard, DataTableHeader } from "@/components/ui/layout-cards";
import { DataTable, TableColumn, StatusCell, DateCell, CurrencyCell, ActionCell } from "@/components/ui/data-table";
import { FormModal, FormField, useFormValidation, validationRules } from "@/components/ui/form-components";
// import { useToast } from "@/components/ui/toast";
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
  FileText,
  X,
  Calculator,
  Building,
  User,
  List,
  Banknote
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

// Available approved purchase requests that can be converted to POs
const approvedPurchaseRequests = [
  {
    id: "PR-2024-002",
    requestNumber: "PR-2024-002",
    description: "Computer Hardware Upgrade",
    department: "IT",
    estimatedCost: 15000.00,
    requestedBy: "Mike Chen",
    approvedBy: "David Wilson",
    items: [
      { id: "1", description: "Desktop Computer - Dell OptiPlex", quantity: 5, unitPrice: 1200.00, total: 6000.00 },
      { id: "2", description: "Monitor - 24 inch LED", quantity: 5, unitPrice: 300.00, total: 1500.00 },
      { id: "3", description: "Keyboard & Mouse Combo", quantity: 5, unitPrice: 50.00, total: 250.00 },
      { id: "4", description: "Server Hardware Upgrade", quantity: 1, unitPrice: 7250.00, total: 7250.00 }
    ]
  },
  {
    id: "PR-2024-003",
    requestNumber: "PR-2024-003",
    description: "Safety Equipment and PPE",
    department: "Operations",
    estimatedCost: 3200.00,
    requestedBy: "Ahmed Hassan",
    approvedBy: "David Wilson",
    items: [
      { id: "1", description: "Hard Hats - ANSI Approved", quantity: 20, unitPrice: 25.00, total: 500.00 },
      { id: "2", description: "Safety Vests - High Visibility", quantity: 30, unitPrice: 15.00, total: 450.00 },
      { id: "3", description: "Safety Goggles", quantity: 25, unitPrice: 12.00, total: 300.00 },
      { id: "4", description: "Work Gloves - Cut Resistant", quantity: 50, unitPrice: 8.00, total: 400.00 },
      { id: "5", description: "First Aid Kit - Industrial", quantity: 5, unitPrice: 150.00, total: 750.00 },
      { id: "6", description: "Emergency Shower Kit", quantity: 2, unitPrice: 400.00, total: 800.00 }
    ]
  }
];

// Default item structure for manual item addition
interface POItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

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
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedPOs, setSelectedPOs] = React.useState<string[]>([]);

  // Enhanced state for PO creation
  const [creationMethod, setCreationMethod] = React.useState<'manual' | 'from_pr'>('manual');
  const [selectedPR, setSelectedPR] = React.useState<string>('');
  const [items, setItems] = React.useState<POItem[]>([]);
  const [currency, setCurrency] = React.useState<'NGN' | 'USD' | 'EUR' | 'GBP'>('NGN');
  const [taxRate] = React.useState(7.5); // 7.5% VAT for Nigeria

  // Form validation for new purchase order
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      supplier: '',
      department: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      paymentTerms: '',
      deliveryAddress: '',
      contactPerson: '',
      notes: ''
    },
    {
      supplier: validationRules.required,
      department: validationRules.required,
      description: validationRules.required,
      dueDate: validationRules.required,
      contactPerson: validationRules.required
    }
  );

  // Helper functions for item management
  const addNewItem = () => {
    const newItem: POItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, field: keyof POItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Handle PR selection
  const handlePRSelection = (prId: string) => {
    setSelectedPR(prId);
    const pr = approvedPurchaseRequests.find(pr => pr.id === prId);
    if (pr) {
      setValue('department', pr.department);
      setValue('description', pr.description);
      setItems(pr.items);
    }
  };

  // Reset form
  const resetForm = () => {
    reset();
    setItems([]);
    setSelectedPR('');
    setCreationMethod('manual');
    setCurrency('NGN');
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (items.length === 0) {
        error("Please add at least one item to the purchase order");
        return;
      }
      success(`Purchase Order created successfully! Total: ${formatCurrency(grandTotal)}`);
      resetForm();
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
    <DashboardLayout>
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
                description="Create a PO manually or from an approved Purchase Request"
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Purchase Order
                  </Button>
                }
                onSubmit={handleCreatePO}
                submitLabel="Create PO"
                size="2xl"
              >
                {/* Creation Method Selection */}
                <div className="space-y-4 border-b pb-4">
                  <FormField label="Creation Method">
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="manual"
                          checked={creationMethod === 'manual'}
                          onChange={(e) => setCreationMethod(e.target.value as 'manual' | 'from_pr')}
                        />
                        <span>Manual Creation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="from_pr"
                          checked={creationMethod === 'from_pr'}
                          onChange={(e) => setCreationMethod(e.target.value as 'manual' | 'from_pr')}
                        />
                        <span>From Approved Purchase Request</span>
                      </label>
                    </div>
                  </FormField>

                  {creationMethod === 'from_pr' && (
                    <FormField label="Select Approved Purchase Request">
                      <Select value={selectedPR} onValueChange={handlePRSelection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an approved PR" />
                        </SelectTrigger>
                        <SelectContent>
                          {approvedPurchaseRequests.map((pr) => (
                            <SelectItem key={pr.id} value={pr.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{pr.requestNumber}</span>
                                <span className="text-sm text-gray-600">{pr.description} - {formatCurrency(pr.estimatedCost)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  )}
                </div>

                {/* Basic Information */}
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
                    placeholder="Describe the overall purpose of this purchase order"
                    rows={2}
                  />
                </FormField>

                <div className="grid grid-cols-3 gap-4">
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

                  <FormField label="Currency" required>
                    <Select value={currency} onValueChange={(value) => setCurrency(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN (₦)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Due Date" required error={errors.dueDate}>
                    <Input
                      type="date"
                      value={values.dueDate}
                      onChange={(e) => setValue('dueDate', e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Contact Person" required error={errors.contactPerson}>
                    <Input
                      value={values.contactPerson}
                      onChange={(e) => setValue('contactPerson', e.target.value)}
                      placeholder="Procurement contact"
                    />
                  </FormField>

                  <FormField label="Payment Terms">
                    <Input
                      value={values.paymentTerms}
                      onChange={(e) => setValue('paymentTerms', e.target.value)}
                      placeholder="e.g., Net 30 days"
                    />
                  </FormField>
                </div>

                <FormField label="Delivery Address">
                  <Textarea
                    value={values.deliveryAddress}
                    onChange={(e) => setValue('deliveryAddress', e.target.value)}
                    placeholder="Full delivery address"
                    rows={2}
                  />
                </FormField>

                {/* Items Section */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <List className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Purchase Order Items</h3>
                    </div>
                    {creationMethod === 'manual' && (
                      <Button type="button" onClick={addNewItem} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <List className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        {creationMethod === 'from_pr'
                          ? 'Select an approved Purchase Request to load items'
                          : 'No items added yet. Click "Add Item" to start building your order.'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-600 bg-gray-50 p-2 rounded">
                        <div className="col-span-2">Description</div>
                        <div>Quantity</div>
                        <div>Unit Price</div>
                        <div>Total</div>
                        <div>Action</div>
                      </div>

                      {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-6 gap-2 items-center p-2 border rounded">
                          <div className="col-span-2">
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Item description"
                              size="sm"
                              disabled={creationMethod === 'from_pr'}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                              min="1"
                              size="sm"
                              disabled={creationMethod === 'from_pr'}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                              min="0"
                              step="0.01"
                              size="sm"
                              disabled={creationMethod === 'from_pr'}
                            />
                          </div>
                          <div className="font-medium">
                            {formatCurrency(item.total)}
                          </div>
                          <div>
                            {creationMethod === 'manual' && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                {items.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calculator className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Financial Summary</h3>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax ({taxRate}% VAT):</span>
                        <span className="font-medium">{formatCurrency(taxAmount)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Grand Total:</span>
                        <span className="text-green-600">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <FormField label="Additional Notes">
                  <Textarea
                    value={values.notes}
                    onChange={(e) => setValue('notes', e.target.value)}
                    placeholder="Any additional instructions or notes for this order"
                    rows={2}
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
    </DashboardLayout>
  );
}