'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  paymentMethod: 'cash' | 'credit' | 'transfer' | 'card';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  deliveryAddress: string;
  notes?: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  // Mock orders data
  const [orders] = useState<SalesOrder[]>([
    {
      id: 'ord-001',
      orderNumber: 'SO-2024-001',
      customerId: 'cust-001',
      customerName: 'Lagos Gas Station Network',
      orderDate: '2024-11-29T08:00:00Z',
      deliveryDate: '2024-11-30T12:00:00Z',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'credit',
      items: [
        {
          productId: 'prod-001',
          productName: 'LPG 12.5kg Cylinder',
          quantity: 50,
          unit: 'cylinders',
          unitPrice: 15000,
          totalPrice: 750000
        },
        {
          productId: 'prod-002',
          productName: 'LPG 6kg Cylinder',
          quantity: 30,
          unit: 'cylinders',
          unitPrice: 9000,
          totalPrice: 270000
        }
      ],
      subtotal: 1020000,
      tax: 76500,
      discount: 51000,
      totalAmount: 1045500,
      deliveryAddress: 'Plot 45, Ikeja Industrial Estate, Lagos',
      notes: 'Urgent delivery required for weekend operations'
    },
    {
      id: 'ord-002',
      orderNumber: 'SO-2024-002',
      customerId: 'cust-002',
      customerName: 'Ahmed Musa',
      orderDate: '2024-11-28T14:30:00Z',
      deliveryDate: '2024-11-29T16:00:00Z',
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'cash',
      items: [
        {
          productId: 'prod-001',
          productName: 'LPG 12.5kg Cylinder',
          quantity: 2,
          unit: 'cylinders',
          unitPrice: 15000,
          totalPrice: 30000
        }
      ],
      subtotal: 30000,
      tax: 2250,
      discount: 0,
      totalAmount: 32250,
      deliveryAddress: 'No 12, Ahmadu Bello Way, Kano'
    },
    {
      id: 'ord-003',
      orderNumber: 'SO-2024-003',
      customerId: 'cust-003',
      customerName: 'Kano Distribution Hub',
      orderDate: '2024-11-29T16:45:00Z',
      deliveryDate: '2024-12-01T10:00:00Z',
      status: 'processing',
      paymentStatus: 'partial',
      paymentMethod: 'credit',
      items: [
        {
          productId: 'prod-003',
          productName: 'Bulk LPG',
          quantity: 5000,
          unit: 'kg',
          unitPrice: 800,
          totalPrice: 4000000
        }
      ],
      subtotal: 4000000,
      tax: 300000,
      discount: 200000,
      totalAmount: 4100000,
      deliveryAddress: 'KM 8, Zaria Road, Kano',
      notes: 'Bulk delivery - requires special transport'
    },
    {
      id: 'ord-004',
      orderNumber: 'SO-2024-004',
      customerId: 'cust-004',
      customerName: 'Fatima Aliyu',
      orderDate: '2024-11-27T11:20:00Z',
      deliveryDate: '2024-11-28T15:00:00Z',
      status: 'cancelled',
      paymentStatus: 'pending',
      paymentMethod: 'transfer',
      items: [
        {
          productId: 'prod-002',
          productName: 'LPG 6kg Cylinder',
          quantity: 3,
          unit: 'cylinders',
          unitPrice: 9000,
          totalPrice: 27000
        }
      ],
      subtotal: 27000,
      tax: 2025,
      discount: 0,
      totalAmount: 29025,
      deliveryAddress: 'Wuse 2, Abuja',
      notes: 'Customer cancelled due to change in requirements'
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      processing: { color: 'bg-orange-100 text-orange-800', icon: Package },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      partial: 'bg-orange-100 text-orange-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalOrderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = totalOrderValue / orders.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              Sales Orders
            </h1>
            <p className="text-muted-foreground">
              View and manage all sales orders and transactions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Orders
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-blue-600">
                +3 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Order Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalOrderValue)}
              </div>
              <p className="text-xs text-green-600">
                Total value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Order
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(avgOrderValue)}
              </div>
              <p className="text-xs text-orange-600">
                Per order
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
              </div>
              <p className="text-xs text-red-600">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>Track and manage all customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.paymentMethod}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        <div className="text-xs text-muted-foreground">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
                              <DialogDescription>
                                Complete order information and line items
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Customer</label>
                                    <p>{selectedOrder.customerName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Delivery Address</label>
                                    <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Order Items</label>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrder.items.map((item, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell>{item.productName}</TableCell>
                                          <TableCell>{item.quantity} {item.unit}</TableCell>
                                          <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                                          <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                <div className="border-t pt-4">
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Tax:</span>
                                      <span>{formatCurrency(selectedOrder.tax)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Discount:</span>
                                      <span>-{formatCurrency(selectedOrder.discount)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                      <span>Total:</span>
                                      <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                                    </div>
                                  </div>
                                </div>

                                {selectedOrder.notes && (
                                  <div>
                                    <label className="text-sm font-medium">Notes</label>
                                    <p className="text-sm">{selectedOrder.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Printer className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}