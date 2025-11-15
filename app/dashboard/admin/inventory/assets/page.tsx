'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Filter,
  Download,
  HardDrive,
  Laptop,
  Truck,
  Wrench,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
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

// Mock asset data
const mockAssets = [
  {
    id: 'AST-001',
    assetCode: 'LAP-001-2024',
    name: 'Dell Inspiron 15 Laptop',
    assetType: 'IT Equipment',
    category: 'Computer',
    location: 'Lagos Main Office',
    department: 'IT Department',
    assignedTo: 'John Doe',
    purchaseDate: '2024-01-15',
    purchasePrice: 750000,
    currentValue: 600000,
    depreciation: 150000,
    condition: 'Excellent',
    warrantyExpiry: '2027-01-15',
    nextMaintenance: '2024-12-15',
    status: 'Active',
    lastUpdated: '2024-11-14'
  },
  {
    id: 'AST-002',
    assetCode: 'VEH-002-2023',
    name: 'Toyota Hilux - Company Vehicle',
    assetType: 'Vehicle',
    category: 'Pickup Truck',
    location: 'Lagos Main Office',
    department: 'Operations',
    assignedTo: 'Adaobi Okechukwu',
    purchaseDate: '2023-08-10',
    purchasePrice: 18500000,
    currentValue: 15500000,
    depreciation: 3000000,
    condition: 'Good',
    warrantyExpiry: '2025-08-10',
    nextMaintenance: '2024-12-01',
    status: 'Active',
    lastUpdated: '2024-11-13'
  },
  {
    id: 'AST-003',
    assetCode: 'EQP-003-2024',
    name: 'Industrial Generator - 50KVA',
    assetType: 'Equipment',
    category: 'Power Equipment',
    location: 'Port Harcourt Plant',
    department: 'Operations',
    assignedTo: 'Plant Manager',
    purchaseDate: '2024-03-20',
    purchasePrice: 2500000,
    currentValue: 2200000,
    depreciation: 300000,
    condition: 'Excellent',
    warrantyExpiry: '2026-03-20',
    nextMaintenance: '2024-11-30',
    status: 'Active',
    lastUpdated: '2024-11-12'
  },
  {
    id: 'AST-004',
    assetCode: 'FUR-004-2023',
    name: 'Executive Conference Table',
    assetType: 'Furniture',
    category: 'Office Furniture',
    location: 'Abuja Branch Office',
    department: 'Administration',
    assignedTo: 'Conference Room A',
    purchaseDate: '2023-12-05',
    purchasePrice: 450000,
    currentValue: 380000,
    depreciation: 70000,
    condition: 'Good',
    warrantyExpiry: '2025-12-05',
    nextMaintenance: 'N/A',
    status: 'Active',
    lastUpdated: '2024-11-10'
  },
  {
    id: 'AST-005',
    assetCode: 'NET-005-2024',
    name: 'Cisco Network Switch - 24 Port',
    assetType: 'IT Equipment',
    category: 'Network Equipment',
    location: 'Lagos Main Office',
    department: 'IT Department',
    assignedTo: 'Server Room',
    purchaseDate: '2024-02-28',
    purchasePrice: 350000,
    currentValue: 300000,
    depreciation: 50000,
    condition: 'Excellent',
    warrantyExpiry: '2026-02-28',
    nextMaintenance: '2025-02-28',
    status: 'Active',
    lastUpdated: '2024-11-14'
  },
  {
    id: 'AST-006',
    assetCode: 'VEH-006-2022',
    name: 'Mercedes Sprinter - Delivery Van',
    assetType: 'Vehicle',
    category: 'Delivery Vehicle',
    location: 'Lagos Main Office',
    department: 'Logistics',
    assignedTo: 'Emeka Nwosu',
    purchaseDate: '2022-11-15',
    purchasePrice: 25000000,
    currentValue: 18000000,
    depreciation: 7000000,
    condition: 'Good',
    warrantyExpiry: '2024-11-15',
    nextMaintenance: '2024-12-10',
    status: 'Under Maintenance',
    lastUpdated: '2024-11-08'
  },
  {
    id: 'AST-007',
    assetCode: 'SAF-007-2024',
    name: 'Safety Equipment Set - Industrial',
    assetType: 'Safety Equipment',
    category: 'PPE Kit',
    location: 'Port Harcourt Plant',
    department: 'Safety',
    assignedTo: 'Safety Officer',
    purchaseDate: '2024-06-10',
    purchasePrice: 125000,
    currentValue: 110000,
    depreciation: 15000,
    condition: 'Excellent',
    warrantyExpiry: '2025-06-10',
    nextMaintenance: '2025-01-10',
    status: 'Active',
    lastUpdated: '2024-11-14'
  }
];

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || asset.assetType === filterType;
    const matchesLocation = filterLocation === 'all' || asset.location === filterLocation;
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;

    return matchesSearch && matchesType && matchesLocation && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Maintenance': return 'bg-orange-100 text-orange-800';
      case 'Retired': return 'bg-gray-100 text-gray-800';
      case 'Disposed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-orange-100 text-orange-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'IT Equipment': return <Laptop className="h-4 w-4" />;
      case 'Vehicle': return <Truck className="h-4 w-4" />;
      case 'Equipment': return <Wrench className="h-4 w-4" />;
      default: return <HardDrive className="h-4 w-4" />;
    }
  };

  // Calculate summary statistics
  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalDepreciation = mockAssets.reduce((sum, asset) => sum + asset.depreciation, 0);
  const activeAssets = mockAssets.filter(asset => asset.status === 'Active').length;
  const maintenanceAssets = mockAssets.filter(asset => asset.status === 'Under Maintenance').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Asset Management</h1>
            <p className="text-muted-foreground">
              Track and manage company assets including equipment, machinery, and technology
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Asset
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Total Assets</h3>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">{mockAssets.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <h3 className="text-sm font-medium">Active Assets</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{activeAssets}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-medium">Under Maintenance</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-2">{maintenanceAssets}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">Total Value</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">₦{(totalValue / 1000000).toFixed(1)}M</p>
            </CardContent>
          </Card>
        </div>

        {/* Asset Type Distribution */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {['IT Equipment', 'Vehicle', 'Equipment', 'Furniture'].map((type) => {
            const typeAssets = mockAssets.filter(asset => asset.assetType === type);
            const typeValue = typeAssets.reduce((sum, asset) => sum + asset.currentValue, 0);

            return (
              <Card key={type}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAssetTypeIcon(type)}
                      <h3 className="font-medium text-sm">{type}</h3>
                    </div>
                    <Badge variant="outline">{typeAssets.length} assets</Badge>
                  </div>
                  <p className="text-lg font-bold mt-2">₦{(typeValue / 1000000).toFixed(1)}M</p>
                </CardContent>
              </Card>
            );
          })}
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
                    placeholder="Search assets, codes, or assignees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Lagos Main Office">Lagos Main Office</SelectItem>
                  <SelectItem value="Abuja Branch Office">Abuja Branch Office</SelectItem>
                  <SelectItem value="Port Harcourt Plant">Port Harcourt Plant</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="Disposed">Disposed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Register ({filteredAssets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Code</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Next Maintenance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{asset.assetCode}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getAssetTypeIcon(asset.assetType)}
                          {asset.name}
                        </div>
                      </TableCell>
                      <TableCell>{asset.assetType}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {asset.location}
                      </TableCell>
                      <TableCell>{asset.department}</TableCell>
                      <TableCell>{asset.assignedTo}</TableCell>
                      <TableCell className="text-sm">{asset.purchaseDate}</TableCell>
                      <TableCell className="font-medium">₦{asset.currentValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getConditionColor(asset.condition)}>
                          {asset.condition}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {asset.nextMaintenance !== 'N/A' && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {asset.nextMaintenance}
                          </div>
                        )}
                        {asset.nextMaintenance === 'N/A' && (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${getStatusColor(asset.status)}`}>
                          {asset.status === 'Active' && <CheckCircle className="h-3 w-3" />}
                          {asset.status === 'Under Maintenance' && <Wrench className="h-3 w-3" />}
                          {asset.status === 'Retired' && <AlertTriangle className="h-3 w-3" />}
                          {asset.status}
                        </Badge>
                      </TableCell>
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