'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  ArrowRightLeft,
  Plus,
  Search,
  Filter,
  Download,
  Warehouse,
  Package,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  DollarSign,
  ArrowLeft
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock store data
const mockStores = [
  {
    id: 'STR-001',
    code: 'LGS-MAIN',
    name: 'Lagos Main Store',
    location: 'Victoria Island, Lagos',
    manager: 'Adaobi Okechukwu',
    phone: '+234-1-234-5678',
    email: 'adaobi.okechukwu@butane.ng',
    totalItems: 456,
    categories: 12,
    lowStockItems: 8,
    totalValue: 45670000,
    lastUpdated: '2024-11-14',
    status: 'Active'
  },
  {
    id: 'STR-002',
    code: 'ABJ-BRANCH',
    name: 'Abuja Branch Store',
    location: 'Central Business District, Abuja',
    manager: 'Emeka Nwosu',
    phone: '+234-9-876-5432',
    email: 'emeka.nwosu@butane.ng',
    totalItems: 324,
    categories: 10,
    lowStockItems: 5,
    totalValue: 32450000,
    lastUpdated: '2024-11-13',
    status: 'Active'
  },
  {
    id: 'STR-003',
    code: 'PH-STORE',
    name: 'Port Harcourt Store',
    location: 'Trans Amadi, Port Harcourt',
    manager: 'Fatima Abubakar',
    phone: '+234-84-123-456',
    email: 'fatima.abubakar@butane.ng',
    totalItems: 467,
    categories: 15,
    lowStockItems: 2,
    totalValue: 52340000,
    lastUpdated: '2024-11-14',
    status: 'Active'
  }
];

// Mock store items data with more detailed information
const mockStoreItems = [
  {
    id: 'ITM-001',
    itemCode: 'OFF-CHR-001',
    name: 'Office Chair - Executive',
    description: 'High-back executive office chair with leather upholstery and ergonomic design',
    category: 'Furniture',
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    unitPrice: 85000,
    totalValue: 2125000,
    supplier: 'ABC Office Supplies Ltd',
    lastMovement: '2024-11-12',
    movementType: 'Stock In',
    lastReorderDate: '2024-10-15',
    nextReorderDate: '2024-12-15',
    stockTurnover: 4.2,
    averageMonthlyUsage: 6,
    status: 'In Stock',
    location: 'A-1-001',
    stockHistory: [
      { date: '2024-11-12', type: 'Stock In', quantity: 10, balance: 25 },
      { date: '2024-11-08', type: 'Issue', quantity: -5, balance: 15 },
      { date: '2024-11-01', type: 'Stock In', quantity: 20, balance: 20 },
    ]
  },
  {
    id: 'ITM-002',
    itemCode: 'IT-LAP-001',
    name: 'Laptop - Dell Inspiron 15',
    description: 'Dell Inspiron 15 3000 Series, Intel Core i5, 8GB RAM, 256GB SSD',
    category: 'IT Equipment',
    currentStock: 8,
    minStock: 5,
    maxStock: 20,
    unitPrice: 750000,
    totalValue: 6000000,
    supplier: 'TechWorld Nigeria',
    lastMovement: '2024-11-13',
    movementType: 'Issue',
    lastReorderDate: '2024-09-20',
    nextReorderDate: '2024-12-20',
    stockTurnover: 2.8,
    averageMonthlyUsage: 3,
    status: 'In Stock',
    location: 'B-2-015',
    stockHistory: [
      { date: '2024-11-13', type: 'Issue', quantity: -2, balance: 8 },
      { date: '2024-10-25', type: 'Stock In', quantity: 5, balance: 10 },
      { date: '2024-10-20', type: 'Issue', quantity: -3, balance: 5 },
    ]
  },
  {
    id: 'ITM-003',
    itemCode: 'OFF-PAP-001',
    name: 'A4 Paper - 80gsm (Ream)',
    description: 'Premium A4 paper, 80gsm weight, 500 sheets per ream',
    category: 'Stationery',
    currentStock: 150,
    minStock: 50,
    maxStock: 200,
    unitPrice: 3500,
    totalValue: 525000,
    supplier: 'ABC Office Supplies Ltd',
    lastMovement: '2024-11-14',
    movementType: 'Stock In',
    lastReorderDate: '2024-11-01',
    nextReorderDate: '2024-11-30',
    stockTurnover: 8.5,
    averageMonthlyUsage: 45,
    status: 'In Stock',
    location: 'C-1-025',
    stockHistory: [
      { date: '2024-11-14', type: 'Stock In', quantity: 100, balance: 150 },
      { date: '2024-11-10', type: 'Issue', quantity: -30, balance: 50 },
      { date: '2024-11-05', type: 'Issue', quantity: -20, balance: 80 },
    ]
  },
  {
    id: 'ITM-004',
    itemCode: 'EQP-GEN-001',
    name: 'Portable Generator - 5KVA',
    description: 'Portable petrol generator, 5KVA capacity, electric and recoil start',
    category: 'Equipment',
    currentStock: 2,
    minStock: 2,
    maxStock: 8,
    unitPrice: 350000,
    totalValue: 700000,
    supplier: 'Lagos Equipment Co.',
    lastMovement: '2024-11-10',
    movementType: 'Issue',
    lastReorderDate: '2024-08-15',
    nextReorderDate: '2024-12-01',
    stockTurnover: 1.5,
    averageMonthlyUsage: 1,
    status: 'Low Stock',
    location: 'D-1-005',
    stockHistory: [
      { date: '2024-11-10', type: 'Issue', quantity: -1, balance: 2 },
      { date: '2024-09-15', type: 'Stock In', quantity: 3, balance: 3 },
      { date: '2024-08-20', type: 'Issue', quantity: -2, balance: 0 },
    ]
  }
];

export default function StorePage() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewItemsDialog, setViewItemsDialog] = useState(false);
  const [viewItemDetailsDialog, setViewItemDetailsDialog] = useState(false);
  const [transferDialog, setTransferDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [transferData, setTransferData] = useState({
    fromStore: '',
    toStore: '',
    item: '',
    quantity: 0
  });

  const filteredStores = mockStores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-orange-100 text-orange-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewItems = (store: any) => {
    setSelectedStore(store);
    setViewItemsDialog(true);
  };

  const handleViewItemDetails = (item: any) => {
    setSelectedItem(item);
    setViewItemDetailsDialog(true);
  };

  const handleTransfer = () => {
    console.log('Transfer:', transferData);
    setTransferDialog(false);
    setTransferData({ fromStore: '', toStore: '', item: '', quantity: 0 });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Store Management</h1>
            <p className="text-muted-foreground">
              Manage inventory across different store locations with real-time tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={transferDialog} onOpenChange={setTransferDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Transfer Items
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Transfer Items Between Stores</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Store</label>
                    <Select value={transferData.fromStore} onValueChange={(value) =>
                      setTransferData(prev => ({ ...prev, fromStore: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source store" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStores.map((store) => (
                          <SelectItem key={store.id} value={store.name}>{store.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">To Store</label>
                    <Select value={transferData.toStore} onValueChange={(value) =>
                      setTransferData(prev => ({ ...prev, toStore: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination store" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStores.map((store) => (
                          <SelectItem key={store.id} value={store.name}>{store.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item</label>
                    <Select value={transferData.item} onValueChange={(value) =>
                      setTransferData(prev => ({ ...prev, item: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item to transfer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStoreItems.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.itemCode} - {item.name} (Stock: {item.currentStock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={transferData.quantity}
                      onChange={(e) => setTransferData(prev => ({
                        ...prev,
                        quantity: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setTransferDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleTransfer}>
                      Transfer Items
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Store
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search stores by name, code, location, or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stores Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Store Directory ({filteredStores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Code</TableHead>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Low Stock</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStores.map((store) => (
                    <TableRow key={store.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{store.code}</TableCell>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {store.location}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {store.manager}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{store.phone}</div>
                        <div className="text-muted-foreground">{store.email}</div>
                      </TableCell>
                      <TableCell className="font-medium">{store.totalItems.toLocaleString()}</TableCell>
                      <TableCell>{store.categories}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          {store.lowStockItems}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">₦{(store.totalValue / 1000000).toFixed(1)}M</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(store.status)}>
                          {store.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{store.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => handleViewItems(store)}
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Package className="h-3 w-3" />
                            Manage
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Store Items Dialog */}
        <Dialog open={viewItemsDialog} onOpenChange={setViewItemsDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Items in {selectedStore?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-6 text-sm bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Store Code:</span>
                  <span>{selectedStore?.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedStore?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedStore?.manager}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Min/Max Stock</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Movement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStoreItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{item.itemCode}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-medium">{item.currentStock}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.minStock} / {item.maxStock}
                        </TableCell>
                        <TableCell>₦{item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">
                          ₦{item.totalValue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStockStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{item.location}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.lastMovement}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => handleViewItemDetails(item)}
                          >
                            <Eye className="h-3 w-3" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Item Details Dialog */}
        <Dialog open={viewItemDetailsDialog} onOpenChange={setViewItemDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {selectedItem?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Item Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Item Code:</span>
                        <span className="font-medium">{selectedItem.itemCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{selectedItem.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedItem.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Supplier:</span>
                        <span className="font-medium">{selectedItem.supplier}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Stock Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Current Stock:</span>
                        <span className="text-2xl font-bold text-primary">{selectedItem.currentStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min Stock:</span>
                        <span className="font-medium text-orange-600">{selectedItem.minStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Stock:</span>
                        <span className="font-medium text-green-600">{selectedItem.maxStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStockStatusColor(selectedItem.status)}>
                          {selectedItem.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <h3 className="text-sm font-medium">Unit Price</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-600 mt-2">₦{selectedItem.unitPrice.toLocaleString()}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <h3 className="text-sm font-medium">Total Value</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mt-2">₦{selectedItem.totalValue.toLocaleString()}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <h3 className="text-sm font-medium">Turnover Rate</h3>
                      </div>
                      <p className="text-2xl font-bold text-purple-600 mt-2">{selectedItem.stockTurnover}x</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Inventory Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Monthly Usage:</span>
                        <span className="font-medium">{selectedItem.averageMonthlyUsage} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Reorder:</span>
                        <span className="font-medium">{selectedItem.lastReorderDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Reorder:</span>
                        <span className="font-medium">{selectedItem.nextReorderDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Movement:</span>
                        <div className="text-right">
                          <div className="font-medium">{selectedItem.lastMovement}</div>
                          <div className="text-sm text-muted-foreground">{selectedItem.movementType}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Recent Stock Movements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedItem.stockHistory.map((movement, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{movement.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{movement.type}</span>
                              <span className={`text-sm font-bold ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Bal: {movement.balance}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}