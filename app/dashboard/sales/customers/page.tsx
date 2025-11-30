'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  DollarSign,
  UserPlus,
  Filter,
  Download,
  Edit,
  Eye
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  customerType: 'individual' | 'corporate' | 'distributor';
  accountStatus: 'active' | 'inactive' | 'suspended';
  creditLimit: number;
  currentBalance: number;
  totalPurchases: number;
  lastTransaction: string;
  joinDate: string;
  paymentMethod: 'cash' | 'credit' | 'prepaid';
}

export default function CustomersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Mock customer data
  const [customers] = useState<Customer[]>([
    {
      id: 'cust-001',
      name: 'Lagos Gas Station Network',
      email: 'admin@lagosgas.com',
      phone: '+234 803 123 4567',
      address: 'Plot 45, Ikeja Industrial Estate, Lagos',
      customerType: 'corporate',
      accountStatus: 'active',
      creditLimit: 5000000,
      currentBalance: 250000,
      totalPurchases: 12500000,
      lastTransaction: '2024-11-29T14:30:00Z',
      joinDate: '2024-01-15T00:00:00Z',
      paymentMethod: 'credit'
    },
    {
      id: 'cust-002',
      name: 'Ahmed Musa',
      email: 'ahmed.musa@email.com',
      phone: '+234 807 234 5678',
      address: 'No 12, Ahmadu Bello Way, Kano',
      customerType: 'individual',
      accountStatus: 'active',
      creditLimit: 50000,
      currentBalance: 0,
      totalPurchases: 450000,
      lastTransaction: '2024-11-28T09:15:00Z',
      joinDate: '2024-03-10T00:00:00Z',
      paymentMethod: 'cash'
    },
    {
      id: 'cust-003',
      name: 'Kano Distribution Hub',
      email: 'operations@kanodist.ng',
      phone: '+234 809 345 6789',
      address: 'KM 8, Zaria Road, Kano',
      customerType: 'distributor',
      accountStatus: 'active',
      creditLimit: 10000000,
      currentBalance: 1250000,
      totalPurchases: 35000000,
      lastTransaction: '2024-11-29T16:45:00Z',
      joinDate: '2024-02-01T00:00:00Z',
      paymentMethod: 'credit'
    },
    {
      id: 'cust-004',
      name: 'Fatima Aliyu',
      email: 'fatima.a@gmail.com',
      phone: '+234 805 456 7890',
      address: 'Wuse 2, Abuja',
      customerType: 'individual',
      accountStatus: 'active',
      creditLimit: 75000,
      currentBalance: 15000,
      totalPurchases: 280000,
      lastTransaction: '2024-11-27T11:20:00Z',
      joinDate: '2024-04-20T00:00:00Z',
      paymentMethod: 'prepaid'
    }
  ]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesFilter = filterType === 'all' || customer.customerType === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      individual: 'bg-blue-100 text-blue-800',
      corporate: 'bg-purple-100 text-purple-800',
      distributor: 'bg-orange-100 text-orange-800'
    };
    return <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Customer Management
            </h1>
            <p className="text-muted-foreground">
              Manage customer accounts, credit limits, and relationships
            </p>
          </div>
          <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <UserPlus className="h-5 w-5" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Create a new customer account with basic information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input id="customerEmail" type="email" placeholder="customer@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input id="customerPhone" placeholder="+234 XXX XXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerType">Customer Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input id="creditLimit" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Enter customer address" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddCustomer(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddCustomer(false)}>
                  Add Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-blue-600">
                +2 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Accounts
              </CardTitle>
              <CreditCard className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => c.accountStatus === 'active').length}
              </div>
              <p className="text-xs text-green-600">
                {((customers.filter(c => c.accountStatus === 'active').length / customers.length) * 100).toFixed(0)}% active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Credit Outstanding
              </CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(customers.reduce((sum, c) => sum + c.currentBalance, 0))}
              </div>
              <p className="text-xs text-orange-600">
                Across all customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(customers.reduce((sum, c) => sum + c.totalPurchases, 0))}
              </div>
              <p className="text-xs text-purple-600">
                All-time revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
            <CardDescription>Search and manage all customer accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Customers Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Total Purchases</TableHead>
                  <TableHead>Last Transaction</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(customer.customerType)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(customer.accountStatus)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(customer.creditLimit)}
                    </TableCell>
                    <TableCell className={customer.currentBalance > 0 ? 'text-orange-600 font-medium' : ''}>
                      {formatCurrency(customer.currentBalance)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(customer.totalPurchases)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(customer.lastTransaction).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}