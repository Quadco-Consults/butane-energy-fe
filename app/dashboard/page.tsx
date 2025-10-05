'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useERP } from '@/contexts/ERPContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { dashboardStats, products, orders, plants } = useERP();

  const stats = [
    {
      title: 'Total Revenue',
      value: `₦${dashboardStats.totalRevenue.toLocaleString()}`,
      change: `+${dashboardStats.revenueGrowth}%`,
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Total Orders',
      value: dashboardStats.totalOrders,
      change: `+${dashboardStats.ordersGrowth}%`,
      icon: ShoppingCart,
      trend: 'up',
    },
    {
      title: 'Total Customers',
      value: dashboardStats.totalCustomers,
      icon: Users,
    },
    {
      title: 'Inventory Value',
      value: `₦${dashboardStats.inventoryValue.toLocaleString()}`,
      icon: Package,
    },
  ];

  const lowStockProducts = products.filter(p => p.stockLevel <= p.reorderLevel);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const operationalPlants = plants.filter(p => p.status === 'operational');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Butane Energy ERP System
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change} from last month
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>
                Products below reorder level
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">All products are well stocked</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                      </div>
                      <Badge variant="destructive">
                        {product.stockLevel} {product.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
                Pending Orders
              </CardTitle>
              <CardDescription>
                Orders awaiting processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending orders</p>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{order.customerName}</p>
                      </div>
                      <Badge variant="secondary">
                        ₦{order.totalAmount.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Plant Status */}
        <Card>
          <CardHeader>
            <CardTitle>Plant Status</CardTitle>
            <CardDescription>Overview of all plant locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {plants.map((plant) => (
                <div key={plant.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{plant.name}</h3>
                      <p className="text-sm text-muted-foreground">{plant.location}</p>
                    </div>
                    <Badge
                      variant={plant.status === 'operational' ? 'default' : 'secondary'}
                    >
                      {plant.status}
                    </Badge>
                  </div>
                  {plant.status === 'operational' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Stock Level</span>
                        <span className="font-medium">
                          {plant.currentStock} / {plant.capacity} MT
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(plant.currentStock / plant.capacity) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
