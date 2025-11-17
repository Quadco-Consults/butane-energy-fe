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
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Edit,
  Eye,
  Award,
  Users,
  Globe
} from 'lucide-react';

// Mock data for tenders
const tenders = [
  {
    id: 'TND-2024-001',
    title: 'Infrastructure Development Project',
    description: 'Road construction and drainage infrastructure',
    category: 'Construction',
    department: 'Projects',
    tenderType: 'Public',
    budget: 150000000,
    publishedDate: '2024-02-15',
    submissionDeadline: '2024-04-15',
    openingDate: '2024-04-16',
    status: 'published',
    bidders: 12,
    selectedBidder: null,
    eligibilityCriteria: 'CAC Registration, Tax Clearance, COREN Certification',
    createdBy: 'Projects Director',
    urgency: 'medium'
  },
  {
    id: 'TND-2024-002',
    title: 'IT Systems Integration',
    description: 'Enterprise resource planning system implementation',
    category: 'Technology',
    department: 'IT',
    tenderType: 'Selective',
    budget: 85000000,
    publishedDate: '2024-03-01',
    submissionDeadline: '2024-04-30',
    openingDate: '2024-05-01',
    status: 'evaluation',
    bidders: 8,
    selectedBidder: null,
    eligibilityCriteria: 'ISO 27001, Microsoft Partnership, Local Experience',
    createdBy: 'IT Director',
    urgency: 'high'
  },
  {
    id: 'TND-2024-003',
    title: 'Fleet Management Services',
    description: 'Comprehensive vehicle leasing and maintenance',
    category: 'Transportation',
    department: 'Logistics',
    tenderType: 'Public',
    budget: 45000000,
    publishedDate: '2024-01-20',
    submissionDeadline: '2024-03-20',
    openingDate: '2024-03-21',
    status: 'awarded',
    bidders: 15,
    selectedBidder: 'Fleet Solutions Nigeria Ltd',
    eligibilityCriteria: 'Fleet management experience, Insurance coverage',
    createdBy: 'Logistics Manager',
    urgency: 'medium'
  },
  {
    id: 'TND-2024-004',
    title: 'Security Services Contract',
    description: 'Facility security and access control systems',
    category: 'Security',
    department: 'Admin',
    tenderType: 'Restricted',
    budget: 25000000,
    publishedDate: '2024-03-10',
    submissionDeadline: '2024-04-10',
    openingDate: '2024-04-11',
    status: 'closed',
    bidders: 6,
    selectedBidder: 'SecurePro Services',
    eligibilityCriteria: 'Security license, Insurance, Previous experience',
    createdBy: 'Admin Manager',
    urgency: 'high'
  },
  {
    id: 'TND-2024-005',
    title: 'Environmental Impact Assessment',
    description: 'EIA for new facility expansion project',
    category: 'Environmental',
    department: 'Projects',
    tenderType: 'Selective',
    budget: 12000000,
    publishedDate: '2024-03-15',
    submissionDeadline: '2024-05-15',
    openingDate: '2024-05-16',
    status: 'draft',
    bidders: 0,
    selectedBidder: null,
    eligibilityCriteria: 'Environmental consultancy license, NESREA approval',
    createdBy: 'Environmental Officer',
    urgency: 'low'
  },
  {
    id: 'TND-2023-006',
    title: 'Power Supply Infrastructure',
    description: 'Backup power generation and distribution',
    category: 'Utilities',
    department: 'TDU',
    tenderType: 'Public',
    budget: 200000000,
    publishedDate: '2023-11-15',
    submissionDeadline: '2024-01-15',
    openingDate: '2024-01-16',
    status: 'cancelled',
    bidders: 10,
    selectedBidder: null,
    eligibilityCriteria: 'Electrical engineering certification, Previous projects',
    createdBy: 'TDU Manager',
    urgency: 'high'
  }
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'draft': 'bg-gray-100 text-gray-800 border-gray-200',
    'published': 'bg-blue-100 text-blue-800 border-blue-200',
    'evaluation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'awarded': 'bg-green-100 text-green-800 border-green-200',
    'closed': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200'
  };

  const icons: { [key: string]: React.ReactNode } = {
    'draft': <FileText className="w-3 h-3" />,
    'published': <Globe className="w-3 h-3" />,
    'evaluation': <AlertCircle className="w-3 h-3" />,
    'awarded': <Award className="w-3 h-3" />,
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

const getTenderTypeBadge = (type: string) => {
  const variants: { [key: string]: string } = {
    'Public': 'bg-green-100 text-green-800 border-green-200',
    'Selective': 'bg-orange-100 text-orange-800 border-orange-200',
    'Restricted': 'bg-red-100 text-red-800 border-red-200'
  };

  return <Badge className={variants[type]}>{type}</Badge>;
};

const getUrgencyBadge = (urgency: string) => {
  const variants: { [key: string]: string } = {
    'high': 'bg-red-100 text-red-800 border-red-200',
    'medium': 'bg-orange-100 text-orange-800 border-orange-200',
    'low': 'bg-green-100 text-green-800 border-green-200'
  };

  return <Badge className={variants[urgency]}>{urgency}</Badge>;
};

export default function TendersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tender.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tender.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || tender.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalTenders = tenders.length;
  const activeTenders = tenders.filter(t => t.status === 'published' || t.status === 'evaluation').length;
  const awardedTenders = tenders.filter(t => t.status === 'awarded' || t.status === 'closed').length;
  const totalValue = tenders.reduce((sum, t) => sum + t.budget, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tender Management</h1>
            <p className="text-gray-600 mt-2">Manage public and private tenders for major procurement</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Tender
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tenders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTenders}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tenders</p>
                  <p className="text-2xl font-bold text-orange-600">{activeTenders}</p>
                </div>
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Awarded</p>
                  <p className="text-2xl font-bold text-green-600">{awardedTenders}</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
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
              <CardTitle>Tender List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tenders..."
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
                <TabsTrigger value="published">Published</TabsTrigger>
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
                        <TableHead>Tender ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Bidders</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTenders.map((tender) => (
                        <TableRow key={tender.id}>
                          <TableCell className="font-medium">{tender.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{tender.title}</p>
                              <p className="text-sm text-gray-500">{tender.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{tender.category}</Badge>
                          </TableCell>
                          <TableCell>{getTenderTypeBadge(tender.tenderType)}</TableCell>
                          <TableCell>{tender.department}</TableCell>
                          <TableCell>₦{tender.budget.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                Published: {new Date(tender.publishedDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                Deadline: {new Date(tender.submissionDeadline).toLocaleDateString()}
                              </div>
                              {new Date(tender.submissionDeadline) < new Date() && tender.status === 'published' && (
                                <p className="text-xs text-red-600">Overdue</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{tender.bidders} bidders</span>
                            </div>
                          </TableCell>
                          <TableCell>{getUrgencyBadge(tender.urgency)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {getStatusBadge(tender.status)}
                              {tender.selectedBidder && (
                                <p className="text-xs text-gray-500">
                                  Awarded to: {tender.selectedBidder}
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