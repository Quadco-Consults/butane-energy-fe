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
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Edit,
  Eye,
  Send,
  Users
} from 'lucide-react';

// Mock data for RFQs
const rfqs = [
  {
    id: 'RFQ-2024-001',
    title: 'Office Equipment Supply',
    description: 'Annual supply of office furniture and equipment',
    category: 'Office Supplies',
    department: 'General',
    createdBy: 'Sarah Johnson',
    createdDate: '2024-03-01',
    submissionDeadline: '2024-03-20',
    status: 'evaluation',
    totalQuotes: 5,
    selectedVendor: null,
    estimatedValue: 2500000,
    urgency: 'medium'
  },
  {
    id: 'RFQ-2024-002',
    title: 'Vehicle Fleet Maintenance Contract',
    description: 'Annual maintenance contract for company vehicles',
    category: 'Vehicle Services',
    department: 'Logistics',
    createdBy: 'Mike Chen',
    createdDate: '2024-02-28',
    submissionDeadline: '2024-03-15',
    status: 'awarded',
    totalQuotes: 8,
    selectedVendor: 'AutoParts Nigeria Ltd',
    estimatedValue: 12000000,
    urgency: 'high'
  },
  {
    id: 'RFQ-2024-003',
    title: 'IT Infrastructure Upgrade',
    description: 'Network equipment and server infrastructure',
    category: 'IT Equipment',
    department: 'IT',
    createdBy: 'David Wilson',
    createdDate: '2024-03-05',
    submissionDeadline: '2024-03-25',
    status: 'open',
    totalQuotes: 3,
    selectedVendor: null,
    estimatedValue: 45000000,
    urgency: 'high'
  },
  {
    id: 'RFQ-2024-004',
    title: 'Laboratory Testing Equipment',
    description: 'Specialized equipment for quality control testing',
    category: 'Laboratory Equipment',
    department: 'Quality Control',
    createdBy: 'Dr. Ahmed Ibrahim',
    createdDate: '2024-02-20',
    submissionDeadline: '2024-03-10',
    status: 'closed',
    totalQuotes: 4,
    selectedVendor: 'Scientific Equipment Co',
    estimatedValue: 8500000,
    urgency: 'medium'
  },
  {
    id: 'RFQ-2024-005',
    title: 'Construction Services Framework',
    description: 'Framework agreement for construction projects',
    category: 'Construction',
    department: 'Projects',
    createdBy: 'Grace Okafor',
    createdDate: '2024-03-10',
    submissionDeadline: '2024-04-05',
    status: 'draft',
    totalQuotes: 0,
    selectedVendor: null,
    estimatedValue: 75000000,
    urgency: 'low'
  },
  {
    id: 'RFQ-2024-006',
    title: 'Power Generation Equipment',
    description: 'Generator supply and installation',
    category: 'Generators',
    department: 'TDU',
    createdBy: 'Emeka Okonkwo',
    createdDate: '2024-03-12',
    submissionDeadline: '2024-03-30',
    status: 'cancelled',
    totalQuotes: 2,
    selectedVendor: null,
    estimatedValue: 25000000,
    urgency: 'medium'
  }
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'draft': 'bg-gray-100 text-gray-800 border-gray-200',
    'open': 'bg-blue-100 text-blue-800 border-blue-200',
    'evaluation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'awarded': 'bg-green-100 text-green-800 border-green-200',
    'closed': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200'
  };

  const icons: { [key: string]: React.ReactNode } = {
    'draft': <FileText className="w-3 h-3" />,
    'open': <Send className="w-3 h-3" />,
    'evaluation': <AlertCircle className="w-3 h-3" />,
    'awarded': <CheckCircle className="w-3 h-3" />,
    'closed': <CheckCircle className="w-3 h-3" />,
    'cancelled': <XCircle className="w-3 h-3" />
  };

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      {icons[status]}
      {status}
    </Badge>
  );
};

const getUrgencyBadge = (urgency: string) => {
  const variants: { [key: string]: string } = {
    'high': 'bg-red-100 text-red-800 border-red-200',
    'medium': 'bg-orange-100 text-orange-800 border-orange-200',
    'low': 'bg-green-100 text-green-800 border-green-200'
  };

  return <Badge className={variants[urgency]}>{urgency}</Badge>;
};

export default function RFQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || rfq.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRFQs = rfqs.length;
  const openRFQs = rfqs.filter(r => r.status === 'open' || r.status === 'evaluation').length;
  const awardedRFQs = rfqs.filter(r => r.status === 'awarded' || r.status === 'closed').length;
  const totalValue = rfqs.reduce((sum, r) => sum + r.estimatedValue, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Request for Quotation (RFQ)</h1>
            <p className="text-gray-600 mt-2">Manage quotation requests and vendor selection process</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create RFQ
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total RFQs</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRFQs}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active RFQs</p>
                  <p className="text-2xl font-bold text-orange-600">{openRFQs}</p>
                </div>
                <Send className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Awarded</p>
                  <p className="text-2xl font-bold text-green-600">{awardedRFQs}</p>
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
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle>RFQ List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search RFQs..."
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
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                <TabsTrigger value="awarded">Awarded</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedStatus} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>RFQ ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Submission Deadline</TableHead>
                        <TableHead>Quotes</TableHead>
                        <TableHead>Estimated Value</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRFQs.map((rfq) => (
                        <TableRow key={rfq.id}>
                          <TableCell className="font-medium">{rfq.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{rfq.title}</p>
                              <p className="text-sm text-gray-500">{rfq.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{rfq.category}</Badge>
                          </TableCell>
                          <TableCell>{rfq.department}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              {rfq.createdBy}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(rfq.createdDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <div>
                                <p>{new Date(rfq.submissionDeadline).toLocaleDateString()}</p>
                                {new Date(rfq.submissionDeadline) < new Date() && rfq.status === 'open' && (
                                  <p className="text-xs text-red-600">Overdue</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{rfq.totalQuotes} quotes</span>
                            </div>
                          </TableCell>
                          <TableCell>₦{rfq.estimatedValue.toLocaleString()}</TableCell>
                          <TableCell>{getUrgencyBadge(rfq.urgency)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {getStatusBadge(rfq.status)}
                              {rfq.selectedVendor && (
                                <p className="text-xs text-gray-500">
                                  Awarded to: {rfq.selectedVendor}
                                </p>
                              )}
                            </div>
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