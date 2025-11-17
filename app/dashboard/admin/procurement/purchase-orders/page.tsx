'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Filter,
  ShoppingCart,
  Calendar,
  User,
  DollarSign,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Edit,
  Eye,
  Package
} from 'lucide-react';

// Mock data for purchase orders
const purchaseOrders = [
  {
    id: 'PO-2024-001',
    title: 'Office Supplies Q4',
    vendor: 'Universal Office Supplies Ltd',
    orderDate: '2024-03-16',
    expectedDelivery: '2024-03-25',
    totalAmount: 125000,
    status: 'confirmed',
    paymentStatus: 'paid',
    deliveryStatus: 'delivered',
    items: 12,
    requisitionId: 'PR-2024-001',
    contact: 'John Smith (+234 808 123 4567)'
  },
  {
    id: 'PO-2024-002',
    title: 'Vehicle Maintenance Parts',
    vendor: 'AutoParts Nigeria Ltd',
    orderDate: '2024-03-15',
    expectedDelivery: '2024-03-22',
    totalAmount: 850000,
    status: 'pending',
    paymentStatus: 'pending',
    deliveryStatus: 'processing',
    items: 8,
    requisitionId: 'PR-2024-002',
    contact: 'Mike Johnson (+234 801 987 6543)'
  },
  {
    id: 'PO-2024-003',
    title: 'IT Equipment Upgrade',
    vendor: 'TechWorld Solutions',
    orderDate: '2024-03-14',
    expectedDelivery: '2024-03-28',
    totalAmount: 2500000,
    status: 'confirmed',
    paymentStatus: 'partial',
    deliveryStatus: 'shipped',
    items: 15,
    requisitionId: 'PR-2024-003',
    contact: 'Sarah Wilson (+234 809 456 7890)'
  },
  {
    id: 'PO-2024-004',
    title: 'Laboratory Supplies',
    vendor: 'Scientific Equipment Co',
    orderDate: '2024-03-12',
    expectedDelivery: '2024-03-20',
    totalAmount: 320000,
    status: 'completed',
    paymentStatus: 'paid',
    deliveryStatus: 'delivered',
    items: 10,
    requisitionId: 'PR-2024-005',
    contact: 'Dr. Ahmed (+234 807 234 5678)'
  },
  {
    id: 'PO-2024-005',
    title: 'Construction Materials',
    vendor: 'BuildPro Materials',
    orderDate: '2024-03-11',
    expectedDelivery: '2024-03-30',
    totalAmount: 1800000,
    status: 'cancelled',
    paymentStatus: 'cancelled',
    deliveryStatus: 'cancelled',
    items: 25,
    requisitionId: 'PR-2024-006',
    contact: 'Grace Okafor (+234 803 345 6789)'
  }
];

const getStatusBadge = (status: string, type: 'order' | 'payment' | 'delivery') => {
  const orderVariants: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
    'completed': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200'
  };

  const paymentVariants: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'partial': 'bg-orange-100 text-orange-800 border-orange-200',
    'paid': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200'
  };

  const deliveryVariants: { [key: string]: string } = {
    'processing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'shipped': 'bg-blue-100 text-blue-800 border-blue-200',
    'delivered': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200'
  };

  const icons: { [key: string]: React.ReactNode } = {
    'pending': <AlertCircle className="w-3 h-3" />,
    'confirmed': <CheckCircle className="w-3 h-3" />,
    'completed': <CheckCircle className="w-3 h-3" />,
    'cancelled': <XCircle className="w-3 h-3" />,
    'partial': <AlertCircle className="w-3 h-3" />,
    'paid': <CheckCircle className="w-3 h-3" />,
    'processing': <Package className="w-3 h-3" />,
    'shipped': <Truck className="w-3 h-3" />,
    'delivered': <CheckCircle className="w-3 h-3" />
  };

  const variants = type === 'order' ? orderVariants : type === 'payment' ? paymentVariants : deliveryVariants;

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      {icons[status]}
      {status}
    </Badge>
  );
};

export default function PurchaseOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || po.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = purchaseOrders.length;
  const pendingOrders = purchaseOrders.filter(po => po.status === 'pending').length;
  const confirmedOrders = purchaseOrders.filter(po => po.status === 'confirmed').length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
            <p className="text-gray-600 mt-2">Manage purchase orders and vendor relationships</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Purchase Order
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{confirmedOrders}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">₦{totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle>Purchase Orders List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
              <TabsList className="grid grid-cols-5 w-full lg:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedStatus} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Expected Delivery</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.title}</p>
                              <p className="text-sm text-gray-500">Req: {order.requisitionId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.vendor}</p>
                              <p className="text-sm text-gray-500">{order.contact}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(order.orderDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-gray-400" />
                              {new Date(order.expectedDelivery).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>{order.items} items</TableCell>
                          <TableCell>₦{order.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(order.status, 'order')}</TableCell>
                          <TableCell>{getStatusBadge(order.paymentStatus, 'payment')}</TableCell>
                          <TableCell>{getStatusBadge(order.deliveryStatus, 'delivery')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}