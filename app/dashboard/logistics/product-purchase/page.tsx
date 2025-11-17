'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Truck,
  Calendar,
  DollarSign,
  User,
  FileText,
  Wrench
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Mock product purchase orders data
const mockPurchaseOrders = [
  {
    id: 'PO-LOG-2024-001',
    supplier: 'AutoParts Nigeria Ltd',
    category: 'Vehicle Parts',
    items: [
      { name: 'Brake Pads Set', quantity: 8, unitPrice: 25000, total: 200000 },
      { name: 'Oil Filter', quantity: 12, unitPrice: 8500, total: 102000 }
    ],
    totalValue: 302000,
    status: 'pending_approval',
    priority: 'high',
    requestedBy: 'Ibrahim Yakubu',
    orderDate: '2024-11-15',
    expectedDelivery: '2024-11-22',
    department: 'Maintenance',
    purpose: 'Scheduled maintenance for BTE-001 and BTE-003',
    approvedBy: null,
    deliveryAddress: 'Butane Energy Workshop, Lagos'
  },
  {
    id: 'PO-LOG-2024-002',
    supplier: 'Diesel Solutions Ltd',
    category: 'Fuel & Lubricants',
    items: [
      { name: 'Engine Oil 15W40', quantity: 20, unitPrice: 12000, total: 240000 },
      { name: 'Hydraulic Fluid', quantity: 5, unitPrice: 18000, total: 90000 }
    ],
    totalValue: 330000,
    status: 'approved',
    priority: 'medium',
    requestedBy: 'Chioma Nwankwo',
    orderDate: '2024-11-10',
    expectedDelivery: '2024-11-18',
    department: 'Fleet Operations',
    purpose: 'Monthly lubricant stock replenishment',
    approvedBy: 'Grace Adebayo',
    deliveryAddress: 'Butane Energy Depot, Abuja'
  },
  {
    id: 'PO-LOG-2024-003',
    supplier: 'Safety Equipment Co',
    category: 'Safety Equipment',
    items: [
      { name: 'Safety Helmets', quantity: 15, unitPrice: 8500, total: 127500 },
      { name: 'High-Vis Vests', quantity: 20, unitPrice: 5500, total: 110000 },
      { name: 'Safety Boots', quantity: 10, unitPrice: 15000, total: 150000 }
    ],
    totalValue: 387500,
    status: 'delivered',
    priority: 'low',
    requestedBy: 'Adebayo Ogundimu',
    orderDate: '2024-11-05',
    expectedDelivery: '2024-11-12',
    department: 'Safety & Compliance',
    purpose: 'PPE replacement and new staff equipment',
    approvedBy: 'Ahmed Mohammed',
    deliveryAddress: 'Butane Energy HQ, Lagos'
  },
  {
    id: 'PO-LOG-2024-004',
    supplier: 'Industrial Tools Inc',
    category: 'Tools & Equipment',
    items: [
      { name: 'Tire Pressure Gauge', quantity: 5, unitPrice: 12000, total: 60000 },
      { name: 'Socket Wrench Set', quantity: 3, unitPrice: 45000, total: 135000 },
      { name: 'Diagnostic Scanner', quantity: 1, unitPrice: 150000, total: 150000 }
    ],
    totalValue: 345000,
    status: 'in_transit',
    priority: 'medium',
    requestedBy: 'Emeka Okoro',
    orderDate: '2024-11-12',
    expectedDelivery: '2024-11-20',
    department: 'Maintenance',
    purpose: 'Workshop equipment upgrade',
    approvedBy: 'Ibrahim Usman',
    deliveryAddress: 'Butane Energy Workshop, Port Harcourt'
  },
  {
    id: 'PO-LOG-2024-005',
    supplier: 'Fleet Accessories Ltd',
    category: 'Vehicle Accessories',
    items: [
      { name: 'GPS Tracking Devices', quantity: 6, unitPrice: 85000, total: 510000 },
      { name: 'Dash Cameras', quantity: 8, unitPrice: 35000, total: 280000 }
    ],
    totalValue: 790000,
    status: 'pending_approval',
    priority: 'high',
    requestedBy: 'Fatima Aliyu',
    orderDate: '2024-11-16',
    expectedDelivery: '2024-11-25',
    department: 'Fleet Operations',
    purpose: 'Fleet modernization - Phase 2',
    approvedBy: null,
    deliveryAddress: 'Butane Energy Depot, Kano'
  }
];

const categoryStats = [
  { category: 'Vehicle Parts', orders: 12, value: 3450000, percentage: 35 },
  { category: 'Fuel & Lubricants', orders: 8, value: 2680000, percentage: 27 },
  { category: 'Safety Equipment', orders: 6, value: 1890000, percentage: 19 },
  { category: 'Tools & Equipment', orders: 5, value: 1240000, percentage: 12 },
  { category: 'Vehicle Accessories', orders: 4, value: 680000, percentage: 7 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'in_transit': return 'bg-purple-100 text-purple-800';
    case 'pending_approval': return 'bg-orange-100 text-orange-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ProductPurchasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredOrders = mockPurchaseOrders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || order.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalOrders = mockPurchaseOrders.length;
  const totalValue = mockPurchaseOrders.reduce((sum, order) => sum + order.totalValue, 0);
  const pendingOrders = mockPurchaseOrders.filter(order => order.status === 'pending_approval').length;
  const deliveredOrders = mockPurchaseOrders.filter(order => order.status === 'delivered').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-blue-500" />
            Product Purchase Management
          </h1>
          <p className="text-muted-foreground">
            Manage procurement of parts, supplies, and equipment for logistics operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-green-600">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-orange-600">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
            <p className="text-xs text-green-600">Successfully completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Purchase Categories Overview
          </CardTitle>
          <CardDescription>
            Breakdown of procurement by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {categoryStats.map((category, index) => (
              <div key={index} className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-lg font-bold text-blue-600 mb-1">{category.orders}</div>
                <p className="text-sm font-medium mb-2">{category.category}</p>
                <p className="text-xs text-muted-foreground mb-2">₦{(category.value / 1000000).toFixed(1)}M</p>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{category.percentage}% of total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Purchase Order Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search" className="text-sm font-medium">Search Orders</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by ID, supplier, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="min-w-40">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-40">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Vehicle Parts">Vehicle Parts</SelectItem>
                  <SelectItem value="Fuel & Lubricants">Fuel & Lubricants</SelectItem>
                  <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                  <SelectItem value="Tools & Equipment">Tools & Equipment</SelectItem>
                  <SelectItem value="Vehicle Accessories">Vehicle Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>
            Complete list of product purchase orders with status and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.supplier}</p>
                        <p className="text-xs text-muted-foreground">{order.department}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {order.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.items.length} item(s)</p>
                        <p className="text-xs text-muted-foreground">
                          {order.items[0].name}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        ₦{(order.totalValue / 1000).toFixed(0)}K
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{order.requestedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(order.expectedDelivery).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.ceil((new Date(order.expectedDelivery).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        {order.status === 'pending_approval' && (
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No purchase orders found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}