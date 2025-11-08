'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Clock,
  Eye,
  Edit,
  Check,
  Truck,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function PurchaseOrdersPage() {
  const { user } = useAuth();

  // Mock Purchase Order data
  const purchaseOrders = [
    {
      id: 'PO-2025-034',
      title: 'Safety Equipment and PPE',
      description: 'Personal protective equipment and safety gear for all plants',
      category: 'Safety',
      orderDate: '2025-10-28',
      expectedDelivery: '2025-11-12',
      totalAmount: 1200000,
      status: 'approved',
      supplier: 'SafeTech Nigeria Ltd',
      plant: 'All Plants',
      approvedBy: 'Grace Adebayo',
      paymentStatus: 'paid'
    },
    {
      id: 'PO-2025-035',
      title: 'Raw Materials for Production',
      description: 'Chemical additives and processing materials',
      category: 'Raw Materials',
      orderDate: '2025-11-01',
      expectedDelivery: '2025-11-15',
      totalAmount: 2850000,
      status: 'processing',
      supplier: 'ChemCorp Industries',
      plant: 'Kano Plant',
      approvedBy: 'Ahmed Mohammed',
      paymentStatus: 'pending'
    },
    {
      id: 'PO-2025-036',
      title: 'Vehicle Spare Parts',
      description: 'Maintenance parts for company fleet vehicles',
      category: 'Automotive',
      orderDate: '2025-11-03',
      expectedDelivery: '2025-11-18',
      totalAmount: 680000,
      status: 'delivered',
      supplier: 'AutoParts Nigeria',
      plant: 'Logistics',
      approvedBy: 'Ibrahim Usman',
      paymentStatus: 'paid'
    },
    {
      id: 'PO-2025-037',
      title: 'IT Equipment Upgrade',
      description: 'Computers, printers, and networking equipment',
      category: 'Technology',
      orderDate: '2025-10-25',
      expectedDelivery: '2025-11-20',
      totalAmount: 3200000,
      status: 'pending',
      supplier: 'TechSolutions Ltd',
      plant: 'Head Office',
      approvedBy: 'Pending',
      paymentStatus: 'not_applicable'
    },
    {
      id: 'PO-2025-038',
      title: 'Office Furniture and Equipment',
      description: 'Desks, chairs, and office accessories',
      category: 'Office Supplies',
      orderDate: '2025-11-05',
      expectedDelivery: '2025-11-25',
      totalAmount: 950000,
      status: 'draft',
      supplier: 'Office Plus Nigeria',
      plant: 'Abuja Office',
      approvedBy: 'Draft',
      paymentStatus: 'not_applicable'
    },
    {
      id: 'PO-2025-039',
      title: 'Plant Maintenance Tools',
      description: 'Specialized tools and equipment for plant maintenance',
      category: 'Tools',
      orderDate: '2025-11-02',
      expectedDelivery: '2025-11-16',
      totalAmount: 1450000,
      status: 'shipped',
      supplier: 'Industrial Tools Co.',
      plant: 'Kaduna Plant',
      approvedBy: 'Grace Adebayo',
      paymentStatus: 'paid'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'processing': return 'bg-purple-500';
      case 'shipped': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      case 'not_applicable': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysLeft = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'draft': return 'Being prepared';
      case 'pending': return 'Awaiting approval';
      case 'approved': return 'Approved, ready to process';
      case 'processing': return 'Being processed by supplier';
      case 'shipped': return 'In transit';
      case 'delivered': return 'Successfully delivered';
      case 'cancelled': return 'Order cancelled';
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Purchase Orders (PO)</h1>
            <p className="text-muted-foreground">
              Create, track, and manage purchase orders
            </p>
          </div>
          <Link href="/dashboard/procurement/po/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New PO
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active POs</p>
                  <p className="text-xl font-bold">4</p>
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
                  <p className="text-xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">₦10.3M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Purchase Orders</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search POs..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseOrders.map((po) => {
                const daysLeft = getDaysLeft(po.expectedDelivery);
                return (
                  <div key={po.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{po.title}</h3>
                          <Badge className={`${getStatusColor(po.status)} text-white`}>
                            {po.status}
                          </Badge>
                          <Badge variant="outline">{po.category}</Badge>
                          {po.paymentStatus !== 'not_applicable' && (
                            <Badge className={`${getPaymentStatusColor(po.paymentStatus)} text-white`}>
                              {po.paymentStatus}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{po.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">PO Number</p>
                            <p className="text-muted-foreground">{po.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Amount</p>
                            <p className="text-muted-foreground font-semibold">₦{po.totalAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Supplier</p>
                            <p className="text-muted-foreground">{po.supplier}</p>
                          </div>
                          <div>
                            <p className="font-medium">Plant/Location</p>
                            <p className="text-muted-foreground">{po.plant}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Ordered: {new Date(po.orderDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {po.status !== 'delivered' && po.status !== 'cancelled' && daysLeft >= 0 ? (
                              <span className={`${daysLeft <= 3 ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                                Expected in {daysLeft} days ({new Date(po.expectedDelivery).toLocaleDateString()})
                              </span>
                            ) : po.status === 'delivered' ? (
                              <span className="text-green-600 font-medium">Delivered: {new Date(po.expectedDelivery).toLocaleDateString()}</span>
                            ) : (
                              <span className="text-muted-foreground">Expected: {new Date(po.expectedDelivery).toLocaleDateString()}</span>
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            Status: {getStatusDescription(po.status)}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {po.approvedBy !== 'Pending' && po.approvedBy !== 'Draft' ? (
                            <span>Approved by: {po.approvedBy}</span>
                          ) : (
                            <span className="text-yellow-600">Approval: {po.approvedBy}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {po.status !== 'delivered' && po.status !== 'cancelled' && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                        {po.status === 'pending' && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Check className="h-3 w-3" />
                            Approve
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-3 w-3" />
                          PDF
                        </Button>
                        {(po.status === 'shipped' || po.status === 'processing') && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Truck className="h-3 w-3" />
                            Track
                          </Button>
                        )}
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