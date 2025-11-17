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
  Package,
  Calendar,
  User,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Edit,
  Eye,
  ClipboardCheck,
  FileText
} from 'lucide-react';

// Mock data for goods receipts
const goodsReceipts = [
  {
    id: 'GR-2024-001',
    title: 'Office Supplies Q4',
    poNumber: 'PO-2024-001',
    vendor: 'Universal Office Supplies Ltd',
    receiptDate: '2024-03-20',
    receivedBy: 'John Doe',
    status: 'completed',
    totalItems: 12,
    receivedItems: 12,
    damagedItems: 0,
    shortageItems: 0,
    notes: 'All items received in good condition',
    inspector: 'Sarah Johnson'
  },
  {
    id: 'GR-2024-002',
    title: 'Vehicle Maintenance Parts',
    poNumber: 'PO-2024-002',
    vendor: 'AutoParts Nigeria Ltd',
    receiptDate: '2024-03-18',
    receivedBy: 'Mike Chen',
    status: 'partial',
    totalItems: 8,
    receivedItems: 6,
    damagedItems: 1,
    shortageItems: 1,
    notes: 'Missing brake pads, one damaged alternator',
    inspector: 'David Wilson'
  },
  {
    id: 'GR-2024-003',
    title: 'IT Equipment Upgrade',
    poNumber: 'PO-2024-003',
    vendor: 'TechWorld Solutions',
    receiptDate: '2024-03-22',
    receivedBy: 'Grace Okafor',
    status: 'pending',
    totalItems: 15,
    receivedItems: 10,
    damagedItems: 0,
    shortageItems: 5,
    notes: 'Partial delivery - remaining items expected tomorrow',
    inspector: 'Dr. Ahmed Ibrahim'
  },
  {
    id: 'GR-2024-004',
    title: 'Laboratory Supplies',
    poNumber: 'PO-2024-004',
    vendor: 'Scientific Equipment Co',
    receiptDate: '2024-03-19',
    receivedBy: 'Dr. Ahmed Ibrahim',
    status: 'discrepancy',
    totalItems: 10,
    receivedItems: 8,
    damagedItems: 2,
    shortageItems: 0,
    notes: 'Two chemical bottles arrived broken - vendor contacted',
    inspector: 'Lab Manager'
  },
  {
    id: 'GR-2024-005',
    title: 'Construction Materials',
    poNumber: 'PO-2024-005',
    vendor: 'BuildPro Materials',
    receiptDate: '2024-03-21',
    receivedBy: 'Construction Team',
    status: 'rejected',
    totalItems: 25,
    receivedItems: 0,
    damagedItems: 25,
    shortageItems: 0,
    notes: 'Entire shipment rejected - poor quality materials',
    inspector: 'Quality Control'
  }
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'completed': 'bg-green-100 text-green-800 border-green-200',
    'partial': 'bg-orange-100 text-orange-800 border-orange-200',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'discrepancy': 'bg-red-100 text-red-800 border-red-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200'
  };

  const icons: { [key: string]: React.ReactNode } = {
    'completed': <CheckCircle className="w-3 h-3" />,
    'partial': <AlertCircle className="w-3 h-3" />,
    'pending': <ClipboardCheck className="w-3 h-3" />,
    'discrepancy': <XCircle className="w-3 h-3" />,
    'rejected': <XCircle className="w-3 h-3" />
  };

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      {icons[status]}
      {status}
    </Badge>
  );
};

export default function GoodsReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredReceipts = goodsReceipts.filter(gr => {
    const matchesSearch = gr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gr.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gr.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gr.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || gr.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalReceipts = goodsReceipts.length;
  const pendingReceipts = goodsReceipts.filter(gr => gr.status === 'pending').length;
  const completedReceipts = goodsReceipts.filter(gr => gr.status === 'completed').length;
  const discrepancyReceipts = goodsReceipts.filter(gr => gr.status === 'discrepancy' || gr.status === 'rejected').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goods Receipts</h1>
            <p className="text-gray-600 mt-2">Track and verify incoming shipments and deliveries</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Receipt
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReceipts}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingReceipts}</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedReceipts}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Discrepancies</p>
                  <p className="text-2xl font-bold text-red-600">{discrepancyReceipts}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle>Goods Receipts List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search receipts..."
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
              <TabsList className="grid grid-cols-6 w-full lg:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="partial">Partial</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="discrepancy">Discrepancy</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedStatus} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>PO Number</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Receipt Date</TableHead>
                        <TableHead>Received By</TableHead>
                        <TableHead>Items Status</TableHead>
                        <TableHead>Inspector</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReceipts.map((receipt) => (
                        <TableRow key={receipt.id}>
                          <TableCell className="font-medium">{receipt.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{receipt.title}</p>
                              <p className="text-sm text-gray-500">{receipt.notes}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              {receipt.poNumber}
                            </div>
                          </TableCell>
                          <TableCell>{receipt.vendor}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(receipt.receiptDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              {receipt.receivedBy}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="text-green-600">{receipt.receivedItems}</span>
                                /{receipt.totalItems} received
                              </div>
                              {receipt.damagedItems > 0 && (
                                <div className="text-xs text-red-600">
                                  {receipt.damagedItems} damaged
                                </div>
                              )}
                              {receipt.shortageItems > 0 && (
                                <div className="text-xs text-orange-600">
                                  {receipt.shortageItems} missing
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{receipt.inspector}</TableCell>
                          <TableCell>{getStatusBadge(receipt.status)}</TableCell>
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