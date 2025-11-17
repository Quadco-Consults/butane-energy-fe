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
  Search,
  Filter,
  GitCompare,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Edit,
  Eye,
  FileText,
  Calculator,
  User,
  Clock
} from 'lucide-react';

// Mock data for three-way matching
const matchingRecords = [
  {
    id: 'TWM-2024-001',
    poNumber: 'PO-2024-001',
    grNumber: 'GR-2024-001',
    invoiceNumber: 'UOS-2024-0315',
    vendor: 'Universal Office Supplies Ltd',
    description: 'Office Supplies Q4',
    poAmount: 125000,
    grAmount: 125000,
    invoiceAmount: 125000,
    status: 'matched',
    variance: 0,
    matchDate: '2024-03-23',
    verifiedBy: 'Finance Team',
    department: 'General',
    paymentStatus: 'approved'
  },
  {
    id: 'TWM-2024-002',
    poNumber: 'PO-2024-002',
    grNumber: 'GR-2024-002',
    invoiceNumber: 'APN-2024-0318',
    vendor: 'AutoParts Nigeria Ltd',
    description: 'Vehicle Maintenance Parts',
    poAmount: 850000,
    grAmount: 680000,
    invoiceAmount: 850000,
    status: 'gr-variance',
    variance: 170000,
    matchDate: '2024-03-20',
    verifiedBy: 'Mike Chen',
    department: 'Logistics',
    paymentStatus: 'on-hold'
  },
  {
    id: 'TWM-2024-003',
    poNumber: 'PO-2024-003',
    grNumber: 'GR-2024-003',
    invoiceNumber: 'TWS-2024-0320',
    vendor: 'TechWorld Solutions',
    description: 'IT Equipment Upgrade',
    poAmount: 2500000,
    grAmount: 2500000,
    invoiceAmount: 2650000,
    status: 'invoice-variance',
    variance: -150000,
    matchDate: '2024-03-24',
    verifiedBy: 'Sarah Wilson',
    department: 'IT',
    paymentStatus: 'disputed'
  },
  {
    id: 'TWM-2024-004',
    poNumber: 'PO-2024-004',
    grNumber: 'GR-2024-004',
    invoiceNumber: 'SEC-2024-0317',
    vendor: 'Scientific Equipment Co',
    description: 'Laboratory Supplies',
    poAmount: 320000,
    grAmount: 256000,
    invoiceAmount: 256000,
    status: 'partial-match',
    variance: 64000,
    matchDate: '2024-03-22',
    verifiedBy: 'Dr. Ahmed',
    department: 'Quality Control',
    paymentStatus: 'approved'
  },
  {
    id: 'TWM-2024-005',
    poNumber: 'PO-2024-005',
    grNumber: 'GR-2024-005',
    invoiceNumber: 'BPM-2024-0322',
    vendor: 'BuildPro Materials',
    description: 'Construction Services',
    poAmount: 1800000,
    grAmount: 0,
    invoiceAmount: 1800000,
    status: 'gr-rejected',
    variance: 1800000,
    matchDate: '2024-03-23',
    verifiedBy: 'Quality Control',
    department: 'Projects',
    paymentStatus: 'rejected'
  },
  {
    id: 'TWM-2024-006',
    poNumber: 'PO-2024-006',
    grNumber: 'Pending',
    invoiceNumber: 'Pending',
    vendor: 'PowerGen Equipment',
    description: 'Generator Maintenance',
    poAmount: 450000,
    grAmount: 0,
    invoiceAmount: 0,
    status: 'pending',
    variance: 0,
    matchDate: null,
    verifiedBy: null,
    department: 'TDU',
    paymentStatus: 'pending'
  }
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'matched': 'bg-green-100 text-green-800 border-green-200',
    'partial-match': 'bg-blue-100 text-blue-800 border-blue-200',
    'gr-variance': 'bg-orange-100 text-orange-800 border-orange-200',
    'invoice-variance': 'bg-red-100 text-red-800 border-red-200',
    'gr-rejected': 'bg-red-100 text-red-800 border-red-200',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const icons: { [key: string]: React.ReactNode } = {
    'matched': <CheckCircle className="w-3 h-3" />,
    'partial-match': <AlertCircle className="w-3 h-3" />,
    'gr-variance': <AlertCircle className="w-3 h-3" />,
    'invoice-variance': <XCircle className="w-3 h-3" />,
    'gr-rejected': <XCircle className="w-3 h-3" />,
    'pending': <Clock className="w-3 h-3" />
  };

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      {icons[status]}
      {status.replace('-', ' ')}
    </Badge>
  );
};

const getPaymentStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'approved': 'bg-green-100 text-green-800 border-green-200',
    'on-hold': 'bg-orange-100 text-orange-800 border-orange-200',
    'disputed': 'bg-red-100 text-red-800 border-red-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  return <Badge className={variants[status]}>{status.replace('-', ' ')}</Badge>;
};

export default function ThreeWayMatchingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredRecords = matchingRecords.filter(record => {
    const matchesSearch = record.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRecords = matchingRecords.length;
  const matchedRecords = matchingRecords.filter(r => r.status === 'matched').length;
  const varianceRecords = matchingRecords.filter(r => r.status.includes('variance')).length;
  const pendingRecords = matchingRecords.filter(r => r.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Three-Way Matching</h1>
            <p className="text-gray-600 mt-2">Match purchase orders, goods receipts, and invoices for payment approval</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
                </div>
                <GitCompare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Perfect Matches</p>
                  <p className="text-2xl font-bold text-green-600">{matchedRecords}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Variances</p>
                  <p className="text-2xl font-bold text-red-600">{varianceRecords}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingRecords}</p>
                </div>
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle>Three-Way Matching Records</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search records..."
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
              <TabsList className="grid grid-cols-7 w-full lg:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="matched">Matched</TabsTrigger>
                <TabsTrigger value="partial-match">Partial</TabsTrigger>
                <TabsTrigger value="gr-variance">GR Variance</TabsTrigger>
                <TabsTrigger value="invoice-variance">Inv Variance</TabsTrigger>
                <TabsTrigger value="gr-rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedStatus} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Record ID</TableHead>
                        <TableHead>PO / GR / Invoice</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount Comparison</TableHead>
                        <TableHead>Variance</TableHead>
                        <TableHead>Match Status</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Verified By</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="w-3 h-3 text-gray-400" />
                                <span className="font-medium">{record.poNumber}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-3 h-3 text-gray-400" />
                                <span>{record.grNumber}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-3 h-3 text-gray-400" />
                                <span>{record.invoiceNumber}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{record.vendor}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.description}</p>
                              <p className="text-sm text-gray-500">{record.department}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div>PO: <span className="font-medium">₦{record.poAmount.toLocaleString()}</span></div>
                              <div>GR: <span className="font-medium">₦{record.grAmount.toLocaleString()}</span></div>
                              <div>Inv: <span className="font-medium">₦{record.invoiceAmount.toLocaleString()}</span></div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.variance !== 0 && (
                              <div className={`flex items-center gap-1 text-sm ${record.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                <Calculator className="w-3 h-3" />
                                {record.variance > 0 ? '+' : ''}₦{record.variance.toLocaleString()}
                              </div>
                            )}
                            {record.variance === 0 && (
                              <div className="flex items-center gap-1 text-sm text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                No variance
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>{getPaymentStatusBadge(record.paymentStatus)}</TableCell>
                          <TableCell>
                            {record.verifiedBy && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="text-sm">{record.verifiedBy}</p>
                                  {record.matchDate && (
                                    <p className="text-xs text-gray-500">
                                      {new Date(record.matchDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            {!record.verifiedBy && (
                              <span className="text-sm text-gray-500">Pending verification</span>
                            )}
                          </TableCell>
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