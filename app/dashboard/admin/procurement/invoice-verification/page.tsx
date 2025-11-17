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
  FileText,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Edit,
  Eye,
  Clock,
  Calculator
} from 'lucide-react';

// Mock data for invoice verification
const invoices = [
  {
    id: 'INV-2024-001',
    invoiceNumber: 'UOS-2024-0315',
    vendor: 'Universal Office Supplies Ltd',
    poNumber: 'PO-2024-001',
    grNumber: 'GR-2024-001',
    invoiceDate: '2024-03-21',
    dueDate: '2024-04-05',
    receivedDate: '2024-03-22',
    invoiceAmount: 125000,
    poAmount: 125000,
    variance: 0,
    status: 'approved',
    verifiedBy: 'Finance Team',
    verificationDate: '2024-03-23',
    notes: 'Invoice matches PO and GR perfectly',
    paymentStatus: 'pending'
  },
  {
    id: 'INV-2024-002',
    invoiceNumber: 'APN-2024-0318',
    vendor: 'AutoParts Nigeria Ltd',
    poNumber: 'PO-2024-002',
    grNumber: 'GR-2024-002',
    invoiceDate: '2024-03-19',
    dueDate: '2024-04-03',
    receivedDate: '2024-03-20',
    invoiceAmount: 850000,
    poAmount: 850000,
    variance: 0,
    status: 'under-review',
    verifiedBy: 'John Smith',
    verificationDate: null,
    notes: 'Awaiting final approval from department head',
    paymentStatus: 'on-hold'
  },
  {
    id: 'INV-2024-003',
    invoiceNumber: 'TWS-2024-0320',
    vendor: 'TechWorld Solutions',
    poNumber: 'PO-2024-003',
    grNumber: 'GR-2024-003',
    invoiceDate: '2024-03-23',
    dueDate: '2024-04-07',
    receivedDate: '2024-03-24',
    invoiceAmount: 2650000,
    poAmount: 2500000,
    variance: 150000,
    status: 'discrepancy',
    verifiedBy: 'Sarah Wilson',
    verificationDate: '2024-03-24',
    notes: 'Invoice amount higher than PO - additional charges for expedited shipping',
    paymentStatus: 'disputed'
  },
  {
    id: 'INV-2024-004',
    invoiceNumber: 'SEC-2024-0317',
    vendor: 'Scientific Equipment Co',
    poNumber: 'PO-2024-004',
    grNumber: 'GR-2024-004',
    invoiceDate: '2024-03-20',
    dueDate: '2024-04-04',
    receivedDate: '2024-03-21',
    invoiceAmount: 320000,
    poAmount: 320000,
    variance: 0,
    status: 'approved',
    verifiedBy: 'Dr. Ahmed',
    verificationDate: '2024-03-22',
    notes: 'All items verified, invoice approved for payment',
    paymentStatus: 'approved'
  },
  {
    id: 'INV-2024-005',
    invoiceNumber: 'BPM-2024-0322',
    vendor: 'BuildPro Materials',
    poNumber: 'PO-2024-005',
    grNumber: 'GR-2024-005',
    invoiceDate: '2024-03-22',
    dueDate: '2024-04-06',
    receivedDate: '2024-03-23',
    invoiceAmount: 1800000,
    poAmount: 1800000,
    variance: 0,
    status: 'rejected',
    verifiedBy: 'Quality Control',
    verificationDate: '2024-03-23',
    notes: 'Invoice rejected due to goods rejection - poor quality materials',
    paymentStatus: 'rejected'
  }
];

const getStatusBadge = (status: string, type: 'verification' | 'payment') => {
  const verificationVariants: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'under-review': 'bg-blue-100 text-blue-800 border-blue-200',
    'approved': 'bg-green-100 text-green-800 border-green-200',
    'discrepancy': 'bg-orange-100 text-orange-800 border-orange-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200'
  };

  const paymentVariants: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'on-hold': 'bg-orange-100 text-orange-800 border-orange-200',
    'approved': 'bg-green-100 text-green-800 border-green-200',
    'disputed': 'bg-red-100 text-red-800 border-red-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200'
  };

  const icons: { [key: string]: React.ReactNode } = {
    'pending': <Clock className="w-3 h-3" />,
    'under-review': <AlertCircle className="w-3 h-3" />,
    'approved': <CheckCircle className="w-3 h-3" />,
    'discrepancy': <AlertCircle className="w-3 h-3" />,
    'rejected': <XCircle className="w-3 h-3" />,
    'on-hold': <AlertCircle className="w-3 h-3" />,
    'disputed': <XCircle className="w-3 h-3" />
  };

  const variants = type === 'verification' ? verificationVariants : paymentVariants;

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      {icons[status]}
      {status.replace('-', ' ')}
    </Badge>
  );
};

export default function InvoiceVerificationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.grNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending' || inv.status === 'under-review').length;
  const approvedInvoices = invoices.filter(inv => inv.status === 'approved').length;
  const discrepancyInvoices = invoices.filter(inv => inv.status === 'discrepancy' || inv.status === 'rejected').length;
  const totalValue = invoices.reduce((sum, inv) => sum + inv.invoiceAmount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Verification</h1>
            <p className="text-gray-600 mt-2">Verify and approve vendor invoices for payment processing</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Invoice
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingInvoices}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedInvoices}</p>
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
                  <p className="text-2xl font-bold text-red-600">{discrepancyInvoices}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
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
              <CardTitle>Invoice Verification List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search invoices..."
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
                <TabsTrigger value="under-review">Under Review</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="discrepancy">Discrepancy</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedStatus} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>PO/GR Numbers</TableHead>
                        <TableHead>Invoice Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount Comparison</TableHead>
                        <TableHead>Verified By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{invoice.vendor}</p>
                              <p className="text-sm text-gray-500">{invoice.notes}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{invoice.poNumber}</div>
                              <div className="text-sm text-gray-500">{invoice.grNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(invoice.invoiceDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">₦{invoice.invoiceAmount.toLocaleString()}</span>
                                <span className="text-gray-500"> / ₦{invoice.poAmount.toLocaleString()}</span>
                              </div>
                              {invoice.variance !== 0 && (
                                <div className={`text-xs ${invoice.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  <Calculator className="w-3 h-3 inline mr-1" />
                                  {invoice.variance > 0 ? '+' : ''}₦{invoice.variance.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm">{invoice.verifiedBy}</p>
                                {invoice.verificationDate && (
                                  <p className="text-xs text-gray-500">
                                    {new Date(invoice.verificationDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(invoice.status, 'verification')}</TableCell>
                          <TableCell>{getStatusBadge(invoice.paymentStatus, 'payment')}</TableCell>
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