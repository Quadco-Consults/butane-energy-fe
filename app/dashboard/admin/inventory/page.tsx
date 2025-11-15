'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Download, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock inventory data
const mockInventoryItems = [
  {
    id: 'INV-001',
    itemCode: 'OFF-CHR-001',
    name: 'Office Chair - Executive',
    category: 'Furniture',
    location: 'Lagos Main Store',
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    unitPrice: 85000,
    supplier: 'ABC Office Supplies Ltd',
    lastUpdated: '2024-11-14',
    status: 'In Stock'
  },
  {
    id: 'INV-002',
    itemCode: 'IT-LAP-001',
    name: 'Laptop - Dell Inspiron 15',
    category: 'IT Equipment',
    location: 'Lagos Main Store',
    currentStock: 8,
    minStock: 5,
    maxStock: 20,
    unitPrice: 750000,
    supplier: 'TechWorld Nigeria',
    lastUpdated: '2024-11-13',
    status: 'In Stock'
  },
  {
    id: 'INV-003',
    itemCode: 'SAF-HLM-001',
    name: 'Safety Helmet - Industrial',
    category: 'Safety Equipment',
    location: 'Port Harcourt Store',
    currentStock: 3,
    minStock: 10,
    maxStock: 30,
    unitPrice: 12500,
    supplier: 'SafeTech Solutions',
    lastUpdated: '2024-11-12',
    status: 'Low Stock'
  },
  {
    id: 'INV-004',
    itemCode: 'OFF-PAP-001',
    name: 'A4 Paper - 80gsm (Ream)',
    category: 'Stationery',
    location: 'Abuja Branch Store',
    currentStock: 150,
    minStock: 50,
    maxStock: 200,
    unitPrice: 3500,
    supplier: 'ABC Office Supplies Ltd',
    lastUpdated: '2024-11-14',
    status: 'In Stock'
  },
  {
    id: 'INV-005',
    itemCode: 'EQP-GEN-001',
    name: 'Portable Generator - 5KVA',
    category: 'Equipment',
    location: 'Lagos Main Store',
    currentStock: 0,
    minStock: 2,
    maxStock: 5,
    unitPrice: 350000,
    supplier: 'Lagos Equipment Co.',
    lastUpdated: '2024-11-10',
    status: 'Out of Stock'
  },
  {
    id: 'INV-006',
    itemCode: 'OFF-DSK-001',
    name: 'Office Desk - Executive',
    category: 'Furniture',
    location: 'Abuja Branch Store',
    currentStock: 12,
    minStock: 5,
    maxStock: 15,
    unitPrice: 125000,
    supplier: 'ABC Office Supplies Ltd',
    lastUpdated: '2024-11-13',
    status: 'In Stock'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Stock': return 'bg-green-100 text-green-800';
    case 'Low Stock': return 'bg-orange-100 text-orange-800';
    case 'Out of Stock': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'In Stock': return <CheckCircle className="h-4 w-4" />;
    case 'Low Stock': return <AlertTriangle className="h-4 w-4" />;
    case 'Out of Stock': return <AlertTriangle className="h-4 w-4" />;
    default: return <Package className="h-4 w-4" />;
  }
};

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === 'all' || item.location === filterLocation;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  const totalValue = mockInventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  const lowStockItems = mockInventoryItems.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock').length;
  const totalItems = mockInventoryItems.reduce((sum, item) => sum + item.currentStock, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">
              Comprehensive inventory tracking across all store locations
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Item
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Total Items</h3>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">{totalItems.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-medium">Low Stock Alert</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-2">{lowStockItems}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <h3 className="text-sm font-medium">Unique SKUs</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{mockInventoryItems.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">Total Value</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">₦{(totalValue / 1000000).toFixed(1)}M</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search items, codes, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Lagos Main Store">Lagos Main Store</SelectItem>
                  <SelectItem value="Abuja Branch Store">Abuja Branch Store</SelectItem>
                  <SelectItem value="Port Harcourt Store">Port Harcourt Store</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items ({filteredItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min/Max Stock</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.itemCode}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell className="font-medium">{item.currentStock.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.minStock} / {item.maxStock}
                      </TableCell>
                      <TableCell>₦{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">
                        ₦{(item.currentStock * item.unitPrice).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}