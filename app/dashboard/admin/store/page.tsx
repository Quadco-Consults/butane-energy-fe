'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Edit,
  Eye,
  Download,
  Calendar,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function StorePage() {
  const { user } = useAuth();

  // Mock store inventory data
  const storeItems = [
    {
      id: 'SI-001',
      name: 'Office Paper A4 (Ream)',
      category: 'Office Supplies',
      currentStock: 45,
      minStockLevel: 20,
      maxStockLevel: 100,
      unitPrice: 2500,
      location: 'Store Room A',
      lastRestocked: '2025-11-01',
      supplier: 'Office Plus Nigeria',
      status: 'in_stock'
    },
    {
      id: 'SI-002',
      name: 'HP Printer Ink Cartridge (Black)',
      category: 'IT Supplies',
      currentStock: 8,
      minStockLevel: 15,
      maxStockLevel: 50,
      unitPrice: 12000,
      location: 'IT Store',
      lastRestocked: '2025-10-28',
      supplier: 'TechWorld Ltd',
      status: 'low_stock'
    },
    {
      id: 'SI-003',
      name: 'Cleaning Supplies Kit',
      category: 'Facilities',
      currentStock: 25,
      minStockLevel: 10,
      maxStockLevel: 40,
      unitPrice: 3500,
      location: 'Janitor Room',
      lastRestocked: '2025-11-05',
      supplier: 'CleanCorp Services',
      status: 'in_stock'
    },
    {
      id: 'SI-004',
      name: 'Executive Office Chair',
      category: 'Furniture',
      currentStock: 3,
      minStockLevel: 5,
      maxStockLevel: 20,
      unitPrice: 85000,
      location: 'Furniture Store',
      lastRestocked: '2025-10-15',
      supplier: 'Office Furniture Co',
      status: 'low_stock'
    },
    {
      id: 'SI-005',
      name: 'First Aid Kit (Complete)',
      category: 'Safety',
      currentStock: 12,
      minStockLevel: 8,
      maxStockLevel: 25,
      unitPrice: 15000,
      location: 'Safety Store',
      lastRestocked: '2025-10-30',
      supplier: 'SafeCare Medical',
      status: 'in_stock'
    },
    {
      id: 'SI-006',
      name: 'Pantry Supplies (Tea/Coffee)',
      category: 'Pantry',
      currentStock: 0,
      minStockLevel: 10,
      maxStockLevel: 30,
      unitPrice: 4500,
      location: 'Pantry Store',
      lastRestocked: '2025-10-20',
      supplier: 'Refreshments Ltd',
      status: 'out_of_stock'
    }
  ];

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-500';
      case 'low_stock': return 'bg-yellow-500';
      case 'out_of_stock': return 'bg-red-500';
      case 'overstocked': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStockStatus = (item: typeof storeItems[0]) => {
    if (item.currentStock === 0) return 'out_of_stock';
    if (item.currentStock <= item.minStockLevel) return 'low_stock';
    if (item.currentStock >= item.maxStockLevel) return 'overstocked';
    return 'in_stock';
  };

  const getStockLevel = (item: typeof storeItems[0]) => {
    const percentage = (item.currentStock / item.maxStockLevel) * 100;
    return Math.min(percentage, 100);
  };

  const storeStats = {
    totalItems: storeItems.length,
    lowStockItems: storeItems.filter(item => getStockStatus(item) === 'low_stock').length,
    outOfStockItems: storeItems.filter(item => getStockStatus(item) === 'out_of_stock').length,
    totalValue: storeItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">In-house Store Management</h1>
            <p className="text-muted-foreground">
              Manage internal inventory and office supplies
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/store/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Store Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-xl font-bold">{storeStats.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-xl font-bold">{storeStats.lowStockItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-xl font-bold">{storeStats.outOfStockItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">₦{storeStats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Store Inventory</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storeItems.map((item) => {
                const status = getStockStatus(item);
                const stockLevel = getStockLevel(item);
                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <Badge className={`${getStockStatusColor(status)} text-white`}>
                            {status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Item Code</p>
                            <p className="text-muted-foreground">{item.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Current Stock</p>
                            <p className="text-muted-foreground font-semibold">{item.currentStock}</p>
                          </div>
                          <div>
                            <p className="font-medium">Min Level</p>
                            <p className="text-muted-foreground">{item.minStockLevel}</p>
                          </div>
                          <div>
                            <p className="font-medium">Unit Price</p>
                            <p className="text-muted-foreground">₦{item.unitPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">{item.location}</p>
                          </div>
                        </div>

                        {/* Stock Level Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Stock Level</span>
                            <span>{item.currentStock}/{item.maxStockLevel}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                stockLevel <= 25 ? 'bg-red-500' :
                                stockLevel <= 50 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${stockLevel}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Last Restocked: {new Date(item.lastRestocked).toLocaleDateString()}
                          </div>
                          <div>
                            Supplier: {item.supplier}
                          </div>
                          <div>
                            Total Value: ₦{(item.currentStock * item.unitPrice).toLocaleString()}
                          </div>
                        </div>

                        {/* Stock Alerts */}
                        {status === 'low_stock' && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Low stock alert: Only {item.currentStock} units remaining
                            </div>
                          </div>
                        )}

                        {status === 'out_of_stock' && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Out of stock: Immediate reorder required
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        {status === 'low_stock' || status === 'out_of_stock' ? (
                          <Button variant="outline" size="sm" className="gap-2 text-orange-600">
                            <TrendingUp className="h-3 w-3" />
                            Reorder
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}