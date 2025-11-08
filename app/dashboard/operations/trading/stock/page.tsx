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
  Calendar,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Thermometer,
  Gauge,
  Eye,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function LPGStockManagementPage() {
  const { user } = useAuth();

  // Mock LPG stock data
  const lpgStock = [
    {
      id: 'LPG-STK-001',
      productType: 'LPG 6kg Cylinders',
      currentStock: 1250,
      minStockLevel: 500,
      maxStockLevel: 2000,
      reorderPoint: 750,
      unitCost: 4200,
      totalValue: 5250000,
      plant: 'Lagos Plant',
      location: 'Storage Tank A',
      lastUpdated: '2025-11-08 14:30',
      temperature: 25, // °C
      pressure: 8.5, // Bar
      status: 'optimal',
      lastMovement: {
        type: 'outbound',
        quantity: 150,
        date: '2025-11-08 12:00',
        reason: 'Retail sales dispatch'
      }
    },
    {
      id: 'LPG-STK-002',
      productType: 'LPG 12.5kg Cylinders',
      currentStock: 850,
      minStockLevel: 400,
      maxStockLevel: 1500,
      reorderPoint: 600,
      unitCost: 8200,
      totalValue: 6970000,
      plant: 'Kano Plant',
      location: 'Storage Tank B',
      lastUpdated: '2025-11-08 15:45',
      temperature: 28,
      pressure: 9.2,
      status: 'optimal',
      lastMovement: {
        type: 'inbound',
        quantity: 200,
        date: '2025-11-08 09:30',
        reason: 'Procurement delivery'
      }
    },
    {
      id: 'LPG-STK-003',
      productType: 'LPG 25kg Cylinders',
      currentStock: 320,
      minStockLevel: 300,
      maxStockLevel: 800,
      reorderPoint: 450,
      unitCost: 14500,
      totalValue: 4640000,
      plant: 'Kaduna Plant',
      location: 'Storage Tank C',
      lastUpdated: '2025-11-08 13:20',
      temperature: 26,
      pressure: 8.8,
      status: 'low_stock',
      lastMovement: {
        type: 'outbound',
        quantity: 80,
        date: '2025-11-08 10:15',
        reason: 'Commercial customer delivery'
      }
    },
    {
      id: 'LPG-STK-004',
      productType: 'LPG 45kg Cylinders',
      currentStock: 150,
      minStockLevel: 100,
      maxStockLevel: 400,
      reorderPoint: 200,
      unitCost: 21000,
      totalValue: 3150000,
      plant: 'Abuja Plant',
      location: 'Storage Tank D',
      lastUpdated: '2025-11-08 16:10',
      temperature: 24,
      pressure: 8.2,
      status: 'optimal',
      lastMovement: {
        type: 'outbound',
        quantity: 25,
        date: '2025-11-08 14:00',
        reason: 'Hotel delivery'
      }
    },
    {
      id: 'LPG-STK-005',
      productType: 'LPG 50kg Cylinders',
      currentStock: 95,
      minStockLevel: 150,
      maxStockLevel: 500,
      reorderPoint: 250,
      unitCost: 24500,
      totalValue: 2327500,
      plant: 'Kano Plant',
      location: 'Storage Tank E',
      lastUpdated: '2025-11-08 11:30',
      temperature: 29,
      pressure: 9.5,
      status: 'critical_low',
      lastMovement: {
        type: 'outbound',
        quantity: 45,
        date: '2025-11-08 08:45',
        reason: 'Industrial bulk sale'
      }
    },
    {
      id: 'LPG-STK-006',
      productType: 'LPG Bulk (MT)',
      currentStock: 45.5,
      minStockLevel: 20,
      maxStockLevel: 80,
      reorderPoint: 35,
      unitCost: 480000,
      totalValue: 21840000,
      plant: 'Lagos Plant',
      location: 'Main Storage Tank',
      lastUpdated: '2025-11-08 16:45',
      temperature: 22,
      pressure: 7.8,
      status: 'optimal',
      lastMovement: {
        type: 'inbound',
        quantity: 15.5,
        date: '2025-11-08 07:00',
        reason: 'Bulk procurement delivery'
      }
    }
  ];

  const getStockStatus = (stock: typeof lpgStock[0]) => {
    if (stock.currentStock <= stock.minStockLevel * 0.7) return 'critical_low';
    if (stock.currentStock <= stock.minStockLevel) return 'low_stock';
    if (stock.currentStock >= stock.maxStockLevel * 0.9) return 'high_stock';
    return 'optimal';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500';
      case 'low_stock': return 'bg-yellow-500';
      case 'critical_low': return 'bg-red-500';
      case 'high_stock': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStockLevel = (stock: typeof lpgStock[0]) => {
    const percentage = (stock.currentStock / stock.maxStockLevel) * 100;
    return Math.min(percentage, 100);
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 15) return 'low';
    if (temp > 35) return 'high';
    return 'normal';
  };

  const getPressureStatus = (pressure: number) => {
    if (pressure < 7) return 'low';
    if (pressure > 10) return 'high';
    return 'normal';
  };

  const stockStats = {
    totalProducts: lpgStock.length,
    lowStockItems: lpgStock.filter(stock => getStockStatus(stock) === 'low_stock' || getStockStatus(stock) === 'critical_low').length,
    totalValue: lpgStock.reduce((sum, stock) => sum + stock.totalValue, 0),
    averageStockLevel: Math.round(lpgStock.reduce((sum, stock) => sum + getStockLevel(stock), 0) / lpgStock.length)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">LPG Stock Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage LPG inventory levels across all plants
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Link href="/dashboard/operations/trading/stock/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Stock Entry
              </Button>
            </Link>
          </div>
        </div>

        {/* Stock Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-xl font-bold">{stockStats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                  <p className="text-xl font-bold">{stockStats.lowStockItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Stock Level</p>
                  <p className="text-xl font-bold">{stockStats.averageStockLevel}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">₦{stockStats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>LPG Stock Inventory</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lpgStock.map((stock) => {
                const status = getStockStatus(stock);
                const stockLevel = getStockLevel(stock);
                const tempStatus = getTemperatureStatus(stock.temperature);
                const pressureStatus = getPressureStatus(stock.pressure);

                return (
                  <div key={stock.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{stock.productType}</h3>
                          <Badge className={`${getStockStatusColor(status)} text-white`}>
                            {status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">{stock.plant}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Current Stock</p>
                            <p className="text-muted-foreground font-semibold">
                              {stock.currentStock} {stock.productType.includes('MT') ? 'MT' : 'units'}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Min Level</p>
                            <p className="text-muted-foreground">
                              {stock.minStockLevel} {stock.productType.includes('MT') ? 'MT' : 'units'}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Max Level</p>
                            <p className="text-muted-foreground">
                              {stock.maxStockLevel} {stock.productType.includes('MT') ? 'MT' : 'units'}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Total Value</p>
                            <p className="text-muted-foreground font-semibold">₦{stock.totalValue.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Stock Level Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Stock Level</span>
                            <span>{stockLevel.toFixed(1)}%</span>
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

                        {/* Environmental Conditions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-3 w-3" />
                            <span className="font-medium">Temperature:</span>
                            <span className={`${
                              tempStatus === 'normal' ? 'text-green-600' :
                              tempStatus === 'high' ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              {stock.temperature}°C
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gauge className="h-3 w-3" />
                            <span className="font-medium">Pressure:</span>
                            <span className={`${
                              pressureStatus === 'normal' ? 'text-green-600' :
                              pressureStatus === 'high' ? 'text-red-600' : 'text-orange-600'
                            }`}>
                              {stock.pressure} Bar
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>
                            <span className="text-muted-foreground ml-1">{stock.location}</span>
                          </div>
                          <div>
                            <span className="font-medium">Unit Cost:</span>
                            <span className="text-muted-foreground ml-1">₦{stock.unitCost.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Last Updated: {stock.lastUpdated}
                          </div>
                          <div>
                            Reorder Point: {stock.reorderPoint} {stock.productType.includes('MT') ? 'MT' : 'units'}
                          </div>
                        </div>

                        {/* Last Movement */}
                        <div className="text-sm">
                          <span className="font-medium">Last Movement:</span>
                          <span className="text-muted-foreground ml-1">
                            {stock.lastMovement.type} of {stock.lastMovement.quantity} {stock.productType.includes('MT') ? 'MT' : 'units'}
                            on {stock.lastMovement.date} ({stock.lastMovement.reason})
                          </span>
                        </div>

                        {/* Stock Alerts */}
                        {status === 'critical_low' && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Critical low stock! Immediate reorder required
                            </div>
                          </div>
                        )}

                        {status === 'low_stock' && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                            <div className="flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" />
                              Low stock alert: Reorder recommended
                            </div>
                          </div>
                        )}

                        {(tempStatus !== 'normal' || pressureStatus !== 'normal') && (
                          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Environmental conditions outside normal range - Check storage conditions
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                        {status === 'low_stock' || status === 'critical_low' ? (
                          <Button variant="outline" size="sm" className="gap-2 text-orange-600">
                            <TrendingUp className="h-3 w-3" />
                            Reorder
                          </Button>
                        ) : null}
                        <Button variant="outline" size="sm" className="gap-2">
                          <BarChart3 className="h-3 w-3" />
                          History
                        </Button>
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