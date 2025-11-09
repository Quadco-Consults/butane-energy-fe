"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Receipt,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Truck,
  Building2,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { filterByPlantAccess } from "@/lib/filters";

// Mock Purchase Orders Data
const purchaseOrders = [
  {
    id: "PO-2024-001",
    vendorName: "Shell Nigeria Gas",
    description: "LPG Stock Procurement - 500MT",
    amount: 45500000,
    orderDate: "2024-01-10",
    expectedDelivery: "2024-01-25",
    status: "pending_delivery",
    category: "LPG Procurement",
    priority: "high",
    plantId: "plant-lagos-1",
    paymentStatus: "paid",
    paymentDate: "2024-01-12",
    invoiceNumber: "INV-SNG-2024-015",
    approvedBy: "CFO",
    requestedBy: "Operations Manager",
    department: "Operations"
  },
  {
    id: "PO-2024-002",
    vendorName: "Mobil Oil Nigeria",
    description: "Equipment Maintenance & Spare Parts",
    amount: 8750000,
    orderDate: "2024-01-12",
    expectedDelivery: "2024-01-20",
    status: "delivered",
    category: "Maintenance",
    priority: "medium",
    plantId: "plant-kano-1",
    paymentStatus: "pending_payment",
    paymentDate: null,
    invoiceNumber: "INV-MON-2024-087",
    approvedBy: "Plant Manager",
    requestedBy: "Maintenance Engineer",
    department: "Operations"
  },
  {
    id: "PO-2024-003",
    vendorName: "Total Nigeria PLC",
    description: "Transport & Logistics Services - Q1 2024",
    amount: 12300000,
    orderDate: "2024-01-08",
    expectedDelivery: "2024-03-31",
    status: "approved",
    category: "Logistics",
    priority: "medium",
    plantId: "plant-abuja-1",
    paymentStatus: "partial_payment",
    paymentDate: "2024-01-15",
    invoiceNumber: "INV-TNP-2024-112",
    approvedBy: "CFO",
    requestedBy: "Logistics Manager",
    department: "Logistics"
  },
  {
    id: "PO-2024-004",
    vendorName: "Dangote Cement",
    description: "Infrastructure Development - Storage Facility",
    amount: 85000000,
    orderDate: "2024-01-05",
    expectedDelivery: "2024-04-30",
    status: "in_progress",
    category: "Infrastructure",
    priority: "high",
    plantId: "plant-lagos-1",
    paymentStatus: "milestone_payment",
    paymentDate: "2024-01-10",
    invoiceNumber: "INV-DCL-2024-203",
    approvedBy: "CEO",
    requestedBy: "Project Manager",
    department: "Admin"
  },
  {
    id: "PO-2024-005",
    vendorName: "Oando PLC",
    description: "Fleet Fuel Supply - Monthly Contract",
    amount: 2500000,
    orderDate: "2024-01-14",
    expectedDelivery: "2024-01-31",
    status: "pending_approval",
    category: "Fleet Operations",
    priority: "low",
    plantId: "plant-kano-1",
    paymentStatus: "not_applicable",
    paymentDate: null,
    invoiceNumber: null,
    approvedBy: null,
    requestedBy: "Fleet Manager",
    department: "Logistics"
  }
];

const vendorPayments = [
  {
    id: "PAY-2024-001",
    vendorName: "Shell Nigeria Gas",
    poNumber: "PO-2024-001",
    amount: 45500000,
    paymentDate: "2024-01-12",
    paymentMethod: "Bank Transfer",
    status: "completed",
    bankAccount: "GTB - 0123456789",
    reference: "TRF/2024/001234",
    plantId: "plant-lagos-1",
    approvedBy: "CFO",
    processedBy: "Finance Officer"
  },
  {
    id: "PAY-2024-002",
    vendorName: "Total Nigeria PLC",
    poNumber: "PO-2024-003",
    amount: 6150000, // 50% milestone payment
    paymentDate: "2024-01-15",
    paymentMethod: "Bank Transfer",
    status: "completed",
    bankAccount: "UBA - 0987654321",
    reference: "TRF/2024/001567",
    plantId: "plant-abuja-1",
    approvedBy: "CFO",
    processedBy: "Finance Officer"
  },
  {
    id: "PAY-2024-003",
    vendorName: "Dangote Cement",
    poNumber: "PO-2024-004",
    amount: 25500000, // 30% advance payment
    paymentDate: "2024-01-10",
    paymentMethod: "Bank Transfer",
    status: "completed",
    bankAccount: "Access Bank - 1122334455",
    reference: "TRF/2024/001890",
    plantId: "plant-lagos-1",
    approvedBy: "CEO",
    processedBy: "Senior Finance Officer"
  },
  {
    id: "PAY-2024-004",
    vendorName: "Mobil Oil Nigeria",
    poNumber: "PO-2024-002",
    amount: 8750000,
    paymentDate: null,
    paymentMethod: "Bank Transfer",
    status: "pending_approval",
    bankAccount: "First Bank - 2233445566",
    reference: null,
    plantId: "plant-kano-1",
    approvedBy: null,
    processedBy: null
  }
];

export default function PurchaseProcessPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!user) return null;

  // Filter data based on user's plant access
  const filteredPurchaseOrders = filterByPlantAccess(purchaseOrders, user);
  const filteredVendorPayments = filterByPlantAccess(vendorPayments, user);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending_approval': return 'secondary';
      case 'pending_delivery': return 'outline';
      case 'delivered': return 'default';
      case 'in_progress': return 'default';
      case 'completed': return 'default';
      case 'pending_payment': return 'destructive';
      case 'paid': return 'default';
      case 'partial_payment': return 'secondary';
      case 'milestone_payment': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'delivered': return CheckCircle;
      case 'pending_approval':
      case 'pending_delivery':
      case 'pending_payment': return Clock;
      case 'in_progress': return AlertCircle;
      default: return Clock;
    }
  };

  const filteredPOs = filteredPurchaseOrders.filter(po => {
    const matchesSearch = po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = filteredVendorPayments.filter(payment => {
    const matchesSearch = payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate statistics
  const stats = {
    totalOrders: filteredPurchaseOrders.length,
    pendingApproval: filteredPurchaseOrders.filter(po => po.status === 'pending_approval').length,
    pendingPayment: filteredPurchaseOrders.filter(po => po.paymentStatus === 'pending_payment').length,
    totalValue: filteredPurchaseOrders.reduce((sum, po) => sum + po.amount, 0),
    paidAmount: filteredVendorPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pendingPaymentAmount: filteredPurchaseOrders.filter(po => po.paymentStatus === 'pending_payment').reduce((sum, po) => sum + po.amount, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Purchase Process</h1>
        <p className="text-muted-foreground mt-2">
          Manage purchase orders, vendor payments, and procurement financials
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.totalValue)} total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting management approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.paidAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.pendingPaymentAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingPayment} orders awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders, vendors, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Statuses</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="in_progress">In Progress</option>
          <option value="pending_delivery">Pending Delivery</option>
          <option value="delivered">Delivered</option>
        </select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="purchase-orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="vendor-payments">Vendor Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchase-orders" className="space-y-4">
          <div className="grid gap-4">
            {filteredPOs.map((po) => {
              const StatusIcon = getStatusIcon(po.status);
              return (
                <Card key={po.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{po.id}</CardTitle>
                        <CardDescription>{po.vendorName}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(po.priority)}>
                          {po.priority.replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        <Badge variant={getStatusColor(po.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {po.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">{po.description}</p>

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-bold text-lg text-green-600">{formatCurrency(po.amount)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Order Date</p>
                          <p className="text-sm font-medium">{po.orderDate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Expected Delivery</p>
                          <p className="text-sm font-medium">{po.expectedDelivery}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Payment Status</p>
                          <Badge variant={getStatusColor(po.paymentStatus)}>
                            {po.paymentStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid gap-2 md:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>Plant: {po.plantId.split('-')[1].toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Receipt className="h-4 w-4" />
                          <span>Category: {po.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Requested by: {po.requestedBy}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          {po.invoiceNumber && (
                            <span>Invoice: {po.invoiceNumber}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {po.status === 'pending_approval' && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          )}
                          {po.paymentStatus === 'pending_payment' && (
                            <Button size="sm">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Process Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Vendor Payments Tab */}
        <TabsContent value="vendor-payments" className="space-y-4">
          <div className="grid gap-4">
            {filteredPayments.map((payment) => {
              const StatusIcon = getStatusIcon(payment.status);
              return (
                <Card key={payment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{payment.id}</CardTitle>
                        <CardDescription>{payment.vendorName}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(payment.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {payment.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Payment Amount</p>
                          <p className="font-bold text-lg text-green-600">{formatCurrency(payment.amount)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">PO Number</p>
                          <p className="text-sm font-medium">{payment.poNumber}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Payment Date</p>
                          <p className="text-sm font-medium">{payment.paymentDate || 'Not processed'}</p>
                        </div>
                      </div>

                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Payment Method</p>
                          <p className="text-sm font-medium">{payment.paymentMethod}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Bank Account</p>
                          <p className="text-sm font-medium">{payment.bankAccount}</p>
                        </div>
                      </div>

                      {payment.reference && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Transaction Reference</p>
                          <p className="text-sm font-medium">{payment.reference}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          {payment.processedBy && (
                            <span>Processed by: {payment.processedBy}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Receipt
                          </Button>
                          {payment.status === 'pending_approval' && (
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Spending Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Purchase Spending</CardTitle>
                <CardDescription>Purchase order values by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "January 2024", amount: 154500000, orders: 12 },
                    { month: "December 2023", amount: 142300000, orders: 15 },
                    { month: "November 2023", amount: 138900000, orders: 11 },
                  ].map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{month.month}</p>
                        <p className="text-xs text-muted-foreground">{month.orders} orders</p>
                      </div>
                      <p className="font-bold text-green-600">{formatCurrency(month.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Vendors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Vendors</CardTitle>
                <CardDescription>Highest spending by vendor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { vendor: "Dangote Cement", amount: 85000000, orders: 1 },
                    { vendor: "Shell Nigeria Gas", amount: 45500000, orders: 1 },
                    { vendor: "Total Nigeria PLC", amount: 12300000, orders: 1 },
                  ].map((vendor) => (
                    <div key={vendor.vendor} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{vendor.vendor}</p>
                        <p className="text-xs text-muted-foreground">{vendor.orders} order{vendor.orders > 1 ? 's' : ''}</p>
                      </div>
                      <p className="font-bold text-blue-600">{formatCurrency(vendor.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}