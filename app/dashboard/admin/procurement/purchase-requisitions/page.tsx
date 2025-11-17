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
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Edit,
  Eye
} from 'lucide-react';

// Mock data for purchase requisitions
const purchaseRequisitions = [
  {
    id: 'PR-2024-001',
    title: 'Office Supplies Q4',
    department: 'HR',
    requestedBy: 'Sarah Johnson',
    dateCreated: '2024-03-15',
    totalAmount: 125000,
    status: 'pending',
    priority: 'medium',
    items: 12,
    description: 'Various office supplies for Q4 operations'
  },
  {
    id: 'PR-2024-002',
    title: 'Vehicle Maintenance Parts',
    department: 'Logistics',
    requestedBy: 'Mike Chen',
    dateCreated: '2024-03-14',
    totalAmount: 850000,
    status: 'approved',
    priority: 'high',
    items: 8,
    description: 'Replacement parts for fleet maintenance'
  },
  {
    id: 'PR-2024-003',
    title: 'IT Equipment Upgrade',
    department: 'IT',
    requestedBy: 'David Wilson',
    dateCreated: '2024-03-13',
    totalAmount: 2500000,
    status: 'under-review',
    priority: 'high',
    items: 15,
    description: 'Laptops, servers, and network equipment'
  },
  {
    id: 'PR-2024-004',
    title: 'Safety Equipment',
    department: 'TDU',
    requestedBy: 'Grace Okafor',
    dateCreated: '2024-03-12',
    totalAmount: 450000,
    status: 'rejected',
    priority: 'medium',
    items: 20,
    description: 'Personal protective equipment for plant workers'
  },
  {
    id: 'PR-2024-005',
    title: 'Laboratory Supplies',
    department: 'Quality Control',
    requestedBy: 'Dr. Ahmed Ibrahim',
    dateCreated: '2024-03-11',
    totalAmount: 320000,
    status: 'completed',
    priority: 'medium',
    items: 10,
    description: 'Chemical reagents and testing equipment'
  }
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'approved': 'bg-green-100 text-green-800 border-green-200',
    'under-review': 'bg-blue-100 text-blue-800 border-blue-200',
    'rejected': 'bg-red-100 text-red-800 border-red-200',
    'completed': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const icons: { [key: string]: React.ReactNode } = {
    'pending': <Clock className="w-3 h-3" />,
    'approved': <CheckCircle className="w-3 h-3" />,
    'under-review': <AlertCircle className="w-3 h-3" />,
    'rejected': <XCircle className="w-3 h-3" />,
    'completed': <CheckCircle className="w-3 h-3" />
  };

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      {icons[status]}
      {status.replace('-', ' ')}
    </Badge>
  );
};

const getPriorityBadge = (priority: string) => {
  const variants: { [key: string]: string } = {
    'high': 'bg-red-100 text-red-800 border-red-200',
    'medium': 'bg-orange-100 text-orange-800 border-orange-200',
    'low': 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <Badge className={variants[priority]}>
      {priority}
    </Badge>
  );
};

export default function PurchaseRequisitionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredRequisitions = purchaseRequisitions.filter(pr => {
    const matchesSearch = pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pr.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pr.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || pr.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRequisitions = purchaseRequisitions.length;
  const pendingRequisitions = purchaseRequisitions.filter(pr => pr.status === 'pending').length;
  const approvedRequisitions = purchaseRequisitions.filter(pr => pr.status === 'approved').length;
  const totalValue = purchaseRequisitions.reduce((sum, pr) => sum + pr.totalAmount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Requisitions</h1>
            <p className="text-gray-600 mt-2">Manage and track purchase requisition requests</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Requisition
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requisitions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRequisitions}</p>
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
                  <p className="text-2xl font-bold text-orange-600">{pendingRequisitions}</p>
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
                  <p className="text-2xl font-bold text-green-600">{approvedRequisitions}</p>
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
              <CardTitle>Purchase Requisitions List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search requisitions..."
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
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedStatus} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requisition ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequisitions.map((requisition) => (
                        <TableRow key={requisition.id}>
                          <TableCell className="font-medium">{requisition.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{requisition.title}</p>
                              <p className="text-sm text-gray-500">{requisition.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>{requisition.department}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              {requisition.requestedBy}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(requisition.dateCreated).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>{requisition.items} items</TableCell>
                          <TableCell>₦{requisition.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>{getPriorityBadge(requisition.priority)}</TableCell>
                          <TableCell>{getStatusBadge(requisition.status)}</TableCell>
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