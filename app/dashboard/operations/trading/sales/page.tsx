'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  Plus,
  Search,
  Calendar,
  Clock,
  DollarSign,
  User,
  Package,
  Eye,
  Edit,
  Check,
  X,
  FileText,
  Truck
} from 'lucide-react';
import Link from 'next/link';

export default function TradingLPGSalesPage() {
  const { user } = useAuth();

  // Mock LPG sales data
  const lpgSales = [
    {
      id: 'LPG-SALE-2025-056',
      customerName: 'Manufacturing Corp Ltd',
      customerType: 'Bulk Industrial',
      productType: 'LPG 50kg Cylinders',
      quantity: 100,
      unitPrice: 25000,
      totalAmount: 2500000,
      salesRep: 'Ahmed Mohammed',
      saleDate: '2025-11-08',
      deliveryDate: '2025-11-10',
      paymentTerms: 'Net 30',
      paymentStatus: 'pending',
      deliveryStatus: 'confirmed',
      status: 'processing',
      plant: 'Kano Plant',
      customerLocation: 'Kano Industrial Estate',
      discount: 50000,
      netAmount: 2450000,
      approval: 'approved',
      approvedBy: 'Grace Adebayo'
    },
    {
      id: 'LPG-SALE-2025-057',
      customerName: 'HomeGas Distributors',
      customerType: 'Retail Distributor',
      productType: 'LPG 12.5kg Cylinders',
      quantity: 500,
      unitPrice: 8500,
      totalAmount: 4250000,
      salesRep: 'Fatima Bello',
      saleDate: '2025-11-07',
      deliveryDate: '2025-11-09',
      paymentTerms: 'Cash on Delivery',
      paymentStatus: 'paid',
      deliveryStatus: 'in_transit',
      status: 'dispatched',
      plant: 'Kaduna Plant',
      customerLocation: 'Kaduna Central Market',
      discount: 125000,
      netAmount: 4125000,
      approval: 'approved',
      approvedBy: 'Emeka Okafor'
    },
    {
      id: 'LPG-SALE-2025-058',
      customerName: 'Restaurant Chain Nigeria',
      customerType: 'Commercial',
      productType: 'LPG 25kg Cylinders',
      quantity: 200,
      unitPrice: 15000,
      totalAmount: 3000000,
      salesRep: 'Ibrahim Usman',
      saleDate: '2025-11-08',
      deliveryDate: '2025-11-12',
      paymentTerms: 'Net 15',
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      status: 'pending_approval',
      plant: 'Abuja Plant',
      customerLocation: 'FCT Abuja',
      discount: 0,
      netAmount: 3000000,
      approval: 'pending',
      approvedBy: null
    },
    {
      id: 'LPG-SALE-2025-059',
      customerName: 'Industrial Steel Works',
      customerType: 'Bulk Industrial',
      productType: 'LPG Bulk Supply (MT)',
      quantity: 50,
      unitPrice: 500000,
      totalAmount: 25000000,
      salesRep: 'Ahmed Mohammed',
      saleDate: '2025-11-06',
      deliveryDate: '2025-11-08',
      paymentTerms: 'Advance Payment',
      paymentStatus: 'paid',
      deliveryStatus: 'delivered',
      status: 'completed',
      plant: 'Kano Plant',
      customerLocation: 'Kano Industrial Zone',
      discount: 1000000,
      netAmount: 24000000,
      approval: 'approved',
      approvedBy: 'Grace Adebayo'
    },
    {
      id: 'LPG-SALE-2025-060',
      customerName: 'City Gas Retail',
      customerType: 'Retail',
      productType: 'LPG 6kg Cylinders',
      quantity: 300,
      unitPrice: 4500,
      totalAmount: 1350000,
      salesRep: 'Fatima Bello',
      saleDate: '2025-11-05',
      deliveryDate: '2025-11-07',
      paymentTerms: 'Cash',
      paymentStatus: 'paid',
      deliveryStatus: 'delivered',
      status: 'completed',
      plant: 'Lagos Plant',
      customerLocation: 'Lagos Mainland',
      discount: 27000,
      netAmount: 1323000,
      approval: 'approved',
      approvedBy: 'Emeka Okafor'
    },
    {
      id: 'LPG-SALE-2025-061',
      customerName: 'Hotel Grand Palace',
      customerType: 'Commercial',
      productType: 'LPG 45kg Cylinders',
      quantity: 80,
      unitPrice: 22000,
      totalAmount: 1760000,
      salesRep: 'Ibrahim Usman',
      saleDate: '2025-11-08',
      deliveryDate: '2025-11-11',
      paymentTerms: 'Net 30',
      paymentStatus: 'pending',
      deliveryStatus: 'confirmed',
      status: 'cancelled',
      plant: 'Abuja Plant',
      customerLocation: 'FCT Abuja',
      discount: 0,
      netAmount: 1760000,
      approval: 'rejected',
      approvedBy: null,
      cancellationReason: 'Customer requested cancellation due to budget constraints'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'dispatched': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-600 bg-gray-50';
      case 'confirmed': return 'text-blue-600 bg-blue-50';
      case 'in_transit': return 'text-purple-600 bg-purple-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'Bulk Industrial': return '🏭';
      case 'Commercial': return '🏢';
      case 'Retail': return '🏪';
      case 'Retail Distributor': return '🚛';
      default: return '👥';
    }
  };

  const salesStats = {
    totalSales: lpgSales.length,
    activeSales: lpgSales.filter(sale => sale.status === 'processing' || sale.status === 'dispatched').length,
    pendingApproval: lpgSales.filter(sale => sale.status === 'pending_approval').length,
    totalRevenue: lpgSales.reduce((sum, sale) => sale.status !== 'cancelled' ? sum + sale.netAmount : sum, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trading LPG Sales Process</h1>
            <p className="text-muted-foreground">
              Manage LPG sales for bulk, commercial, and retail customers
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/operations/trading/sales/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New LPG Sale
              </Button>
            </Link>
          </div>
        </div>

        {/* Sales Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-xl font-bold">{salesStats.totalSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Sales</p>
                  <p className="text-xl font-bold">{salesStats.activeSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-xl font-bold">{salesStats.pendingApproval}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-xl font-bold">₦{salesStats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All LPG Sales</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sales..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lpgSales.map((sale) => {
                return (
                  <div key={sale.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCustomerTypeIcon(sale.customerType)}</span>
                            <h3 className="font-semibold text-lg">{sale.customerName}</h3>
                          </div>
                          <Badge className={`${getStatusColor(sale.status)} text-white`}>
                            {sale.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">{sale.customerType}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Sale ID</p>
                            <p className="text-muted-foreground">{sale.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Product</p>
                            <p className="text-muted-foreground">{sale.productType}</p>
                          </div>
                          <div>
                            <p className="font-medium">Quantity</p>
                            <p className="text-muted-foreground">{sale.quantity} units</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Amount</p>
                            <p className="text-muted-foreground font-semibold">₦{sale.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Unit Price</p>
                            <p className="text-muted-foreground">₦{sale.unitPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Discount</p>
                            <p className="text-muted-foreground">₦{sale.discount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Net Amount</p>
                            <p className="text-muted-foreground font-semibold">₦{sale.netAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Sales Rep</p>
                            <p className="text-muted-foreground">{sale.salesRep}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Sale Date: {new Date(sale.saleDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Delivery: {new Date(sale.deliveryDate).toLocaleDateString()}
                          </div>
                          <div>
                            Plant: {sale.plant}
                          </div>
                          <div>
                            Location: {sale.customerLocation}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Payment:</span>
                            <Badge variant="secondary" className={getPaymentStatusColor(sale.paymentStatus)}>
                              {sale.paymentStatus}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Delivery:</span>
                            <Badge variant="secondary" className={getDeliveryStatusColor(sale.deliveryStatus)}>
                              {sale.deliveryStatus}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Terms:</span>
                            <span className="text-muted-foreground ml-1">{sale.paymentTerms}</span>
                          </div>
                          {sale.approvedBy && (
                            <div>
                              <span className="font-medium">Approved by:</span>
                              <span className="text-muted-foreground ml-1">{sale.approvedBy}</span>
                            </div>
                          )}
                        </div>

                        {/* Status-specific messages */}
                        {sale.status === 'cancelled' && sale.cancellationReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <span className="font-medium">Cancelled:</span> {sale.cancellationReason}
                          </div>
                        )}

                        {sale.status === 'pending_approval' && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                            This sale is pending management approval before processing
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {sale.status === 'pending_approval' && (
                          <>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-green-600">
                              <Check className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-red-600">
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        )}
                        {(sale.status === 'processing' || sale.status === 'dispatched') && (
                          <Button variant="outline" size="sm" className="gap-2 text-blue-600">
                            <Truck className="h-3 w-3" />
                            Track
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-3 w-3" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}