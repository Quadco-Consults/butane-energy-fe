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
  Handshake,
  Calendar,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Edit,
  Eye,
  FileText,
  Building2
} from 'lucide-react';

// Mock data for contracts
const contracts = [
  {
    id: 'CON-2024-001',
    title: 'Office Supplies Annual Contract',
    vendor: 'Universal Office Supplies Ltd',
    contractType: 'Service Agreement',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    contractValue: 5000000,
    status: 'active',
    renewalDate: '2024-10-01',
    contractManager: 'Sarah Johnson',
    department: 'General',
    paymentTerms: '30 days',
    description: 'Annual contract for office supplies across all departments'
  },
  {
    id: 'CON-2024-002',
    title: 'Vehicle Maintenance Services',
    vendor: 'AutoParts Nigeria Ltd',
    contractType: 'Maintenance Agreement',
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    contractValue: 12000000,
    status: 'active',
    renewalDate: '2024-11-01',
    contractManager: 'Mike Chen',
    department: 'Logistics',
    paymentTerms: '21 days',
    description: 'Comprehensive vehicle maintenance and parts supply contract'
  },
  {
    id: 'CON-2024-003',
    title: 'IT Support and Equipment',
    vendor: 'TechWorld Solutions',
    contractType: 'Service Agreement',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    contractValue: 25000000,
    status: 'pending-renewal',
    renewalDate: '2024-12-01',
    contractManager: 'David Wilson',
    department: 'IT',
    paymentTerms: '45 days',
    description: 'IT equipment supply and technical support services'
  },
  {
    id: 'CON-2024-004',
    title: 'Laboratory Equipment Supply',
    vendor: 'Scientific Equipment Co',
    contractType: 'Supply Agreement',
    startDate: '2023-12-01',
    endDate: '2024-11-30',
    contractValue: 8500000,
    status: 'expiring-soon',
    renewalDate: '2024-09-01',
    contractManager: 'Dr. Ahmed Ibrahim',
    department: 'Quality Control',
    paymentTerms: '14 days',
    description: 'Laboratory equipment and reagents supply contract'
  },
  {
    id: 'CON-2024-005',
    title: 'Construction Services Framework',
    vendor: 'BuildPro Materials',
    contractType: 'Framework Agreement',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    contractValue: 50000000,
    status: 'suspended',
    renewalDate: '2024-10-15',
    contractManager: 'Grace Okafor',
    department: 'Projects',
    paymentTerms: '30 days',
    description: 'Framework agreement for construction and infrastructure projects'
  },
  {
    id: 'CON-2023-006',
    title: 'Power Generation Equipment',
    vendor: 'PowerGen Equipment',
    contractType: 'Supply Agreement',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    contractValue: 75000000,
    status: 'expired',
    renewalDate: '2024-03-01',
    contractManager: 'Emeka Okonkwo',
    department: 'TDU',
    paymentTerms: '30 days',
    description: 'Generator supply and maintenance contract'
  }
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'active': 'bg-green-100 text-green-800 border-green-200',
    'pending-renewal': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'expiring-soon': 'bg-orange-100 text-orange-800 border-orange-200',
    'suspended': 'bg-red-100 text-red-800 border-red-200',
    'expired': 'bg-gray-100 text-gray-800 border-gray-200',
    'draft': 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const icons: { [key: string]: React.ReactNode } = {
    'active': <CheckCircle className="w-3 h-3" />,
    'pending-renewal': <Clock className="w-3 h-3" />,
    'expiring-soon': <AlertCircle className="w-3 h-3" />,
    'suspended': <XCircle className="w-3 h-3" />,
    'expired': <XCircle className="w-3 h-3" />,
    'draft': <FileText className="w-3 h-3" />
  };

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      {icons[status]}
      {status.replace('-', ' ')}
    </Badge>
  );
};

const getContractTypeBadge = (type: string) => {
  const variants: { [key: string]: string } = {
    'Service Agreement': 'bg-blue-100 text-blue-800 border-blue-200',
    'Supply Agreement': 'bg-purple-100 text-purple-800 border-purple-200',
    'Maintenance Agreement': 'bg-green-100 text-green-800 border-green-200',
    'Framework Agreement': 'bg-orange-100 text-orange-800 border-orange-200'
  };

  return (
    <Badge className={variants[type] || 'bg-gray-100 text-gray-800 border-gray-200'}>
      {type}
    </Badge>
  );
};

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.contractManager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const expiringContracts = contracts.filter(c => c.status === 'expiring-soon' || c.status === 'pending-renewal').length;
  const totalValue = contracts.reduce((sum, c) => sum + c.contractValue, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
            <p className="text-gray-600 mt-2">Manage vendor contracts and agreements</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Contract
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">{totalContracts}</p>
                </div>
                <Handshake className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                  <p className="text-2xl font-bold text-green-600">{activeContracts}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-600">{expiringContracts}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
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
              <CardTitle>Contracts List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search contracts..."
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
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="pending-renewal">Pending</TabsTrigger>
                <TabsTrigger value="expiring-soon">Expiring</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedStatus} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contract ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Contract Period</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{contract.title}</p>
                              <p className="text-sm text-gray-500">{contract.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              {contract.vendor}
                            </div>
                          </TableCell>
                          <TableCell>{getContractTypeBadge(contract.contractType)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(contract.startDate).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                to {new Date(contract.endDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-orange-600">
                                Renewal: {new Date(contract.renewalDate).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">₦{contract.contractValue.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">{contract.paymentTerms}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              {contract.contractManager}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{contract.department}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(contract.status)}</TableCell>
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