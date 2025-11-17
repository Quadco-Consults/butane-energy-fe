'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Filter,
  Star,
  TrendingUp,
  TrendingDown,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Building2,
  UserPlus,
  Eye,
  Edit
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Mock customers data
const mockCustomers = [
  {
    id: 'CUST-001',
    name: 'Lagos Gas Station Network',
    type: 'Commercial',
    location: 'Lagos, Nigeria',
    contactPerson: 'Mr. Adebayo Ogundimu',
    email: 'adebayo@lagosgas.com',
    phone: '+234 803 123 4567',
    totalOrders: 45,
    totalRevenue: 156000000,
    lastOrderDate: '2024-11-15',
    status: 'active',
    rating: 4.8,
    paymentTerms: '30 days',
    creditLimit: 50000000,
    outstandingBalance: 12000000,
    riskLevel: 'low',
    acquisitionDate: '2023-03-15',
    preferredProducts: ['LPG 20kg Cylinders', 'LPG 12.5kg Cylinders']
  },
  {
    id: 'CUST-002',
    name: 'Port Harcourt Terminals',
    type: 'Industrial',
    location: 'Port Harcourt, Nigeria',
    contactPerson: 'Mrs. Ngozi Okafor',
    email: 'ngozi@phterminals.com',
    phone: '+234 803 987 6543',
    totalOrders: 28,
    totalRevenue: 134000000,
    lastOrderDate: '2024-11-17',
    status: 'active',
    rating: 4.6,
    paymentTerms: '15 days',
    creditLimit: 75000000,
    outstandingBalance: 8500000,
    riskLevel: 'low',
    acquisitionDate: '2022-08-20',
    preferredProducts: ['LPG Storage & Transfer', 'Bulk Supply']
  },
  {
    id: 'CUST-003',
    name: 'Abuja Industrial Zone',
    type: 'Industrial',
    location: 'Abuja, Nigeria',
    contactPerson: 'Dr. Ahmed Musa',
    email: 'ahmed@abujaind.com',
    phone: '+234 806 456 7890',
    totalOrders: 32,
    totalRevenue: 128000000,
    lastOrderDate: '2024-11-10',
    status: 'active',
    rating: 4.9,
    paymentTerms: '45 days',
    creditLimit: 60000000,
    outstandingBalance: 15000000,
    riskLevel: 'medium',
    acquisitionDate: '2023-01-10',
    preferredProducts: ['LPG Bulk Tank Refill', 'Storage Services']
  },
  {
    id: 'CUST-004',
    name: 'Kano Distribution Hub',
    type: 'Commercial',
    location: 'Kano, Nigeria',
    contactPerson: 'Malam Sani Abdullahi',
    email: 'sani@kanodist.com',
    phone: '+234 807 234 5678',
    totalOrders: 38,
    totalRevenue: 98000000,
    lastOrderDate: '2024-11-12',
    status: 'active',
    rating: 4.4,
    paymentTerms: '30 days',
    creditLimit: 40000000,
    outstandingBalance: 6500000,
    riskLevel: 'low',
    acquisitionDate: '2022-11-05',
    preferredProducts: ['LPG 12.5kg Cylinders', 'LPG 6kg Cylinders']
  },
  {
    id: 'CUST-005',
    name: 'Ibadan Commercial District',
    type: 'Commercial',
    location: 'Ibadan, Nigeria',
    contactPerson: 'Mrs. Funmi Adeyemi',
    email: 'funmi@ibadancom.com',
    phone: '+234 805 345 6789',
    totalOrders: 22,
    totalRevenue: 87000000,
    lastOrderDate: '2024-11-16',
    status: 'active',
    rating: 4.7,
    paymentTerms: '30 days',
    creditLimit: 35000000,
    outstandingBalance: 4200000,
    riskLevel: 'low',
    acquisitionDate: '2023-07-12',
    preferredProducts: ['LPG 6kg Cylinders', 'LPG 20kg Cylinders']
  },
  {
    id: 'CUST-006',
    name: 'Kaduna Energy Solutions',
    type: 'Government',
    location: 'Kaduna, Nigeria',
    contactPerson: 'Eng. Ibrahim Yakubu',
    email: 'ibrahim@kadunaenergy.gov.ng',
    phone: '+234 802 567 8901',
    totalOrders: 15,
    totalRevenue: 65000000,
    lastOrderDate: '2024-10-28',
    status: 'inactive',
    rating: 4.2,
    paymentTerms: '60 days',
    creditLimit: 80000000,
    outstandingBalance: 18000000,
    riskLevel: 'high',
    acquisitionDate: '2023-12-01',
    preferredProducts: ['Bulk Supply', 'Storage Services']
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    case 'pending': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Industrial': return 'bg-blue-100 text-blue-800';
    case 'Commercial': return 'bg-purple-100 text-purple-800';
    case 'Government': return 'bg-indigo-100 text-indigo-800';
    case 'Residential': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function TDUCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
  const totalRevenue = mockCustomers.reduce((sum, customer) => sum + customer.totalRevenue, 0);
  const totalOutstanding = mockCustomers.reduce((sum, customer) => sum + customer.outstandingBalance, 0);
  const avgRating = mockCustomers.reduce((sum, customer) => sum + customer.rating, 0) / mockCustomers.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-500" />
            TDU Customer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive customer management and relationship insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-green-600">+3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <Progress value={(activeCustomers / totalCustomers) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalRevenue / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(totalOutstanding / 1000000).toFixed(0)}M</div>
            <p className="text-xs text-orange-600">
              {((totalOutstanding / totalRevenue) * 100).toFixed(1)}% of revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Customer Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search" className="text-sm font-medium">Search Customers</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, contact person, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="min-w-40">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-40">
              <Label className="text-sm font-medium">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>
            Complete customer database with relationship insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {customer.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Since: {new Date(customer.acquisitionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(customer.type)}>
                        {customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{customer.contactPerson}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-semibold">{customer.totalOrders}</span>
                        <p className="text-xs text-muted-foreground">
                          Last: {new Date(customer.lastOrderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        ₦{(customer.totalRevenue / 1000000).toFixed(1)}M
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-semibold text-orange-600">
                          ₦{(customer.outstandingBalance / 1000000).toFixed(1)}M
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {customer.paymentTerms} terms
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{customer.rating}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(customer.riskLevel)}>
                        {customer.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <ShoppingCart className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No customers found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}