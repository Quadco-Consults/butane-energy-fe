'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileCheck,
  Plus,
  Search,
  Calendar,
  Truck,
  Package,
  Eye,
  Edit,
  Check,
  X,
  Download,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function GRNPage() {
  const { user } = useAuth();

  // Mock GRN data
  const grns = [
    {
      id: 'GRN-2025-045',
      title: 'Office Supplies Delivery',
      description: 'Monthly office supplies delivery from Office Plus Nigeria',
      poNumber: 'PO-2025-034',
      supplier: 'Office Plus Nigeria',
      deliveryDate: '2025-11-08',
      receivedBy: 'Ibrahim Usman',
      createdDate: '2025-11-08',
      status: 'received',
      items: [
        { name: 'Office Paper A4 (Ream)', orderedQty: 50, receivedQty: 50, unitPrice: 2500, condition: 'good' },
        { name: 'Pens (Box)', orderedQty: 20, receivedQty: 18, unitPrice: 3000, condition: 'good' },
        { name: 'Folders', orderedQty: 30, receivedQty: 30, unitPrice: 800, condition: 'good' }
      ],
      totalValue: 179400,
      discrepancies: 1,
      plant: 'Head Office',
      deliveryNote: 'DN-2025-078'
    },
    {
      id: 'GRN-2025-046',
      title: 'IT Equipment Delivery',
      description: 'Computer hardware delivery from TechSolutions Ltd',
      poNumber: 'PO-2025-037',
      supplier: 'TechSolutions Ltd',
      deliveryDate: '2025-11-07',
      receivedBy: 'Ahmed Mohammed',
      createdDate: '2025-11-07',
      status: 'pending_verification',
      items: [
        { name: 'Desktop Computer', orderedQty: 2, receivedQty: 2, unitPrice: 180000, condition: 'good' },
        { name: 'Monitor 24-inch', orderedQty: 2, receivedQty: 2, unitPrice: 65000, condition: 'good' },
        { name: 'Keyboard & Mouse Set', orderedQty: 2, receivedQty: 1, unitPrice: 15000, condition: 'damaged' }
      ],
      totalValue: 505000,
      discrepancies: 2,
      plant: 'Head Office',
      deliveryNote: 'DN-2025-079'
    },
    {
      id: 'GRN-2025-047',
      title: 'Safety Equipment Delivery',
      description: 'Personal protective equipment from SafeTech Nigeria',
      poNumber: 'PO-2025-034',
      supplier: 'SafeTech Nigeria Ltd',
      deliveryDate: '2025-11-06',
      receivedBy: 'Grace Adebayo',
      createdDate: '2025-11-06',
      status: 'verified',
      items: [
        { name: 'Safety Helmets', orderedQty: 25, receivedQty: 25, unitPrice: 5000, condition: 'good' },
        { name: 'Safety Boots', orderedQty: 25, receivedQty: 25, unitPrice: 12000, condition: 'good' },
        { name: 'Safety Goggles', orderedQty: 25, receivedQty: 25, unitPrice: 3500, condition: 'good' }
      ],
      totalValue: 512500,
      discrepancies: 0,
      plant: 'All Plants',
      deliveryNote: 'DN-2025-077'
    },
    {
      id: 'GRN-2025-048',
      title: 'Cleaning Supplies Delivery',
      description: 'Facility cleaning supplies from CleanCorp Services',
      poNumber: 'PO-2025-035',
      supplier: 'CleanCorp Services',
      deliveryDate: '2025-11-05',
      receivedBy: 'Ibrahim Usman',
      createdDate: '2025-11-05',
      status: 'completed',
      items: [
        { name: 'Cleaning Supplies Kit', orderedQty: 15, receivedQty: 15, unitPrice: 3500, condition: 'good' },
        { name: 'Toilet Paper (Pack)', orderedQty: 50, receivedQty: 50, unitPrice: 1200, condition: 'good' },
        { name: 'Hand Sanitizer', orderedQty: 30, retrievedQty: 30, unitPrice: 2500, condition: 'good' }
      ],
      totalValue: 187500,
      discrepancies: 0,
      plant: 'All Plants',
      deliveryNote: 'DN-2025-076'
    },
    {
      id: 'GRN-2025-049',
      title: 'Furniture Delivery',
      description: 'Executive furniture delivery from Office Furniture Co',
      poNumber: 'PO-2025-038',
      supplier: 'Office Furniture Co',
      deliveryDate: '2025-11-09',
      receivedBy: 'Emeka Okafor',
      createdDate: '2025-11-09',
      status: 'rejected',
      items: [
        { name: 'Executive Desk', orderedQty: 3, receivedQty: 3, unitPrice: 120000, condition: 'damaged' },
        { name: 'Executive Chair', orderedQty: 3, receivedQty: 2, unitPrice: 85000, condition: 'good' },
        { name: 'Filing Cabinet', orderedQty: 3, receivedQty: 3, unitPrice: 45000, condition: 'damaged' }
      ],
      totalValue: 705000,
      discrepancies: 5,
      plant: 'Abuja Office',
      deliveryNote: 'DN-2025-080',
      rejectionReason: 'Multiple damaged items, quality below standard'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-500';
      case 'pending_verification': return 'bg-yellow-500';
      case 'verified': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'damaged': return 'text-red-600 bg-red-50';
      case 'partial': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const grnStats = {
    totalGRNs: grns.length,
    pendingVerification: grns.filter(grn => grn.status === 'pending_verification').length,
    withDiscrepancies: grns.filter(grn => grn.discrepancies > 0).length,
    totalValue: grns.reduce((sum, grn) => sum + grn.totalValue, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Goods Receipt Notes (GRN)</h1>
            <p className="text-muted-foreground">
              Process incoming deliveries and issue goods receipt notes
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/grn/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create GRN
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* GRN Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total GRNs</p>
                  <p className="text-xl font-bold">{grnStats.totalGRNs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Verification</p>
                  <p className="text-xl font-bold">{grnStats.pendingVerification}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">With Discrepancies</p>
                  <p className="text-xl font-bold">{grnStats.withDiscrepancies}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">₦{grnStats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Goods Receipt Notes</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search GRNs..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grns.map((grn) => {
                return (
                  <div key={grn.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{grn.title}</h3>
                          <Badge className={`${getStatusColor(grn.status)} text-white`}>
                            {grn.status.replace('_', ' ')}
                          </Badge>
                          {grn.discrepancies > 0 && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              {grn.discrepancies} Discrepancy(ies)
                            </Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-3">{grn.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">GRN Number</p>
                            <p className="text-muted-foreground">{grn.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">PO Number</p>
                            <p className="text-muted-foreground">{grn.poNumber}</p>
                          </div>
                          <div>
                            <p className="font-medium">Supplier</p>
                            <p className="text-muted-foreground">{grn.supplier}</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Value</p>
                            <p className="text-muted-foreground font-semibold">₦{grn.totalValue.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Items Summary */}
                        <div className="mb-3">
                          <p className="font-medium text-sm mb-2">Delivered Items ({grn.items.length}):</p>
                          <div className="bg-gray-50 rounded p-3 space-y-2">
                            {grn.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span>{item.name}</span>
                                  <Badge
                                    variant="secondary"
                                    className={getConditionColor(item.condition)}
                                  >
                                    {item.condition}
                                  </Badge>
                                </div>
                                <div className="text-muted-foreground">
                                  {item.receivedQty}/{item.orderedQty} × ₦{item.unitPrice.toLocaleString()}
                                </div>
                              </div>
                            ))}
                            {grn.items.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{grn.items.length - 3} more items...
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Delivered: {new Date(grn.deliveryDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Delivery Note: {grn.deliveryNote}
                          </div>
                          <div>
                            Received by: {grn.receivedBy}
                          </div>
                          <div>
                            Plant: {grn.plant}
                          </div>
                        </div>

                        {/* Status-specific alerts */}
                        {grn.status === 'pending_verification' && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Pending verification - Please review delivered items
                            </div>
                          </div>
                        )}

                        {grn.status === 'rejected' && grn.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <X className="h-3 w-3" />
                              Rejected: {grn.rejectionReason}
                            </div>
                          </div>
                        )}

                        {grn.discrepancies > 0 && grn.status !== 'rejected' && (
                          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                            <div className="flex items-center gap-1">
                              <X className="h-3 w-3" />
                              {grn.discrepancies} discrepancy(ies) found - Review required
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {grn.status === 'pending_verification' && (
                          <>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-green-600">
                              <Check className="h-3 w-3" />
                              Verify
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-red-600">
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        )}
                        {grn.status === 'verified' && (
                          <Button variant="outline" size="sm" className="gap-2 text-purple-600">
                            <CheckCircle className="h-3 w-3" />
                            Complete
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-3 w-3" />
                          PDF
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