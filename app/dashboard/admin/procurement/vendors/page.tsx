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
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Edit,
  Eye,
  Calendar,
  Package
} from 'lucide-react';

// Mock data for vendors
const vendors = [
  {
    id: 'VEN-001',
    name: 'Universal Office Supplies Ltd',
    category: 'Office Supplies',
    contactPerson: 'John Smith',
    email: 'john@universaloffice.ng',
    phone: '+234 808 123 4567',
    address: '12 Admiralty Way, Lekki Phase 1, Lagos',
    status: 'active',
    rating: 4.8,
    totalOrders: 15,
    totalValue: 2850000,
    lastOrderDate: '2024-03-16',
    registrationDate: '2023-01-15',
    paymentTerms: '30 days',
    taxId: 'TIN-12345678',
    bankDetails: 'GTBank - 0123456789'
  },
  {
    id: 'VEN-002',
    name: 'AutoParts Nigeria Ltd',
    category: 'Vehicle Parts',
    contactPerson: 'Mike Johnson',
    email: 'mike@autoparts.ng',
    phone: '+234 801 987 6543',
    address: '45 Aba Road, Port Harcourt, Rivers State',
    status: 'active',
    rating: 4.5,
    totalOrders: 8,
    totalValue: 5200000,
    lastOrderDate: '2024-03-15',
    registrationDate: '2023-03-20',
    paymentTerms: '21 days',
    taxId: 'TIN-87654321',
    bankDetails: 'First Bank - 9876543210'
  },
  {
    id: 'VEN-003',
    name: 'TechWorld Solutions',
    category: 'IT Equipment',
    contactPerson: 'Sarah Wilson',
    email: 'sarah@techworld.ng',
    phone: '+234 809 456 7890',
    address: '78 Allen Avenue, Ikeja, Lagos',
    status: 'active',
    rating: 4.9,
    totalOrders: 12,
    totalValue: 8750000,
    lastOrderDate: '2024-03-14',
    registrationDate: '2022-11-10',
    paymentTerms: '45 days',
    taxId: 'TIN-11223344',
    bankDetails: 'Access Bank - 1122334455'
  },
  {
    id: 'VEN-004',
    name: 'Scientific Equipment Co',
    category: 'Laboratory',
    contactPerson: 'Dr. Ahmed Ibrahim',
    email: 'ahmed@sciequip.ng',
    phone: '+234 807 234 5678',
    address: '23 University Road, Nsukka, Enugu State',
    status: 'active',
    rating: 4.7,
    totalOrders: 6,
    totalValue: 1950000,
    lastOrderDate: '2024-03-12',
    registrationDate: '2023-06-05',
    paymentTerms: '14 days',
    taxId: 'TIN-55667788',
    bankDetails: 'UBA - 5566778899'
  },
  {
    id: 'VEN-005',
    name: 'BuildPro Materials',
    category: 'Construction',
    contactPerson: 'Grace Okafor',
    email: 'grace@buildpro.ng',
    phone: '+234 803 345 6789',
    address: '156 Zaria Road, Kaduna, Kaduna State',
    status: 'suspended',
    rating: 2.1,
    totalOrders: 3,
    totalValue: 1200000,
    lastOrderDate: '2024-02-28',
    registrationDate: '2023-08-12',
    paymentTerms: '30 days',
    taxId: 'TIN-99887766',
    bankDetails: 'Zenith Bank - 9988776655'
  },
  {
    id: 'VEN-006',
    name: 'PowerGen Equipment',
    category: 'Generators',
    contactPerson: 'Emeka Okonkwo',
    email: 'emeka@powergen.ng',
    phone: '+234 806 789 0123',
    address: '34 Industrial Layout, Aba, Abia State',
    status: 'under-review',
    rating: 4.2,
    totalOrders: 4,
    totalValue: 3400000,
    lastOrderDate: '2024-03-10',
    registrationDate: '2024-01-20',
    paymentTerms: '30 days',
    taxId: 'TIN-44332211',
    bankDetails: 'Fidelity Bank - 4433221100'
  }
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    'active': 'bg-green-100 text-green-800 border-green-200',
    'suspended': 'bg-red-100 text-red-800 border-red-200',
    'under-review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'inactive': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const icons: { [key: string]: React.ReactNode } = {
    'active': <CheckCircle className="w-3 h-3" />,
    'suspended': <XCircle className="w-3 h-3" />,
    'under-review': <AlertCircle className="w-3 h-3" />,
    'inactive': <XCircle className="w-3 h-3" />
  };

  return (
    <Badge className={`${variants[status]} flex items-center gap-1`}>
      {icons[status]}
      {status.replace('-', ' ')}
    </Badge>
  );
};

const getRatingStars = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">({rating})</span>
    </div>
  );
};

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = Array.from(new Set(vendors.map(v => v.category)));

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || vendor.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const suspendedVendors = vendors.filter(v => v.status === 'suspended').length;
  const totalValue = vendors.reduce((sum, v) => sum + v.totalValue, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-600 mt-2">Manage vendor relationships and supplier information</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Vendor
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                  <p className="text-2xl font-bold text-green-600">{activeVendors}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspended</p>
                  <p className="text-2xl font-bold text-red-600">{suspendedVendors}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
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
              <CardTitle>Vendors List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search vendors..."
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
              <TabsList className="grid grid-cols-5 w-full lg:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="under-review">Under Review</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedStatus} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Last Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{vendor.name}</p>
                              <p className="text-sm text-gray-500">{vendor.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{vendor.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {vendor.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {vendor.phone}
                              </div>
                              <div className="text-sm text-gray-600">
                                Contact: {vendor.contactPerson}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                              <p className="text-sm">{vendor.address}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRatingStars(vendor.rating)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-400" />
                              {vendor.totalOrders} orders
                            </div>
                          </TableCell>
                          <TableCell>₦{vendor.totalValue.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(vendor.lastOrderDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(vendor.status)}</TableCell>
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