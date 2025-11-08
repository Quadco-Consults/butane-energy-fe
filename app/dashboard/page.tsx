'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useERP } from '@/contexts/ERPContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, DollarSign, Building2, Truck, ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { dashboardStats, products, orders, plants, canPerformAction } = useERP();
  const { user, hasPermission } = useAuth();

  // Generate stats based on user permissions and department
  const stats = [];

  // Financial stats - for finance, management, and executives
  if (hasPermission('view_financial_reports') || hasPermission('view_dashboard')) {
    stats.push({
      title: 'Total Revenue',
      value: `₦${dashboardStats.totalOrders * 500000}`, // Calculated from filtered orders
      change: `+12.5%`,
      icon: DollarSign,
      trend: 'up',
    });
  }

  // Orders - for sales, management, and executives
  if (hasPermission('view_orders') || hasPermission('view_dashboard')) {
    stats.push({
      title: 'Total Orders',
      value: dashboardStats.totalOrders,
      change: `+8.3%`,
      icon: ShoppingCart,
      trend: 'up',
    });
  }

  // Customers - for sales, management, and executives
  if (hasPermission('manage_customers') || hasPermission('view_dashboard')) {
    stats.push({
      title: 'Total Customers',
      value: dashboardStats.totalCustomers,
      icon: Users,
    });
  }

  // Inventory - for operations, procurement, management, and executives
  if (hasPermission('manage_inbound_operations') || hasPermission('view_dashboard')) {
    stats.push({
      title: 'Total Products',
      value: dashboardStats.totalProducts,
      icon: Package,
    });
  }

  const lowStockProducts = products.filter(p => p.stockLevel <= p.reorderLevel);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const operationalPlants = plants.filter(p => p.status === 'operational');

  // Department-specific quick actions
  const getQuickActions = () => {
    if (!user) return [];

    const actions = [];

    if (hasPermission('create_orders')) {
      actions.push({ label: 'Create Order', href: '/dashboard/orders/new', icon: ShoppingCart, color: 'bg-blue-500' });
    }

    if (hasPermission('manage_customers')) {
      actions.push({ label: 'Add Customer', href: '/dashboard/customers/new', icon: Users, color: 'bg-green-500' });
    }

    if (hasPermission('manage_inbound_operations')) {
      actions.push({ label: 'Manage Inventory', href: '/dashboard/inventory', icon: Package, color: 'bg-orange-500' });
    }

    if (hasPermission('create_projects')) {
      actions.push({ label: 'New Project', href: '/dashboard/projects/new', icon: ClipboardCheck, color: 'bg-purple-500' });
    }

    return actions;
  };

  const quickActions = getQuickActions();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}! Department: {user?.department?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            {user?.currentPlant && (
              <Badge variant="outline" className="mt-1">
                Current Plant: {plants.find(p => p.id === user?.plantAccess?.[0])?.name || 'Unknown'}
              </Badge>
            )}
          </div>
          {quickActions.length > 0 && (
            <div className="flex gap-2">
              {quickActions.slice(0, 3).map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button size="sm" className="gap-2">
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
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
          {/* Low Stock Alert - Only for operations, procurement, and management */}
          {(hasPermission('manage_inbound_operations') || hasPermission('create_purchase_requests')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>
                  Products below reorder level in your plants
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
                          <p className="text-xs text-muted-foreground">SKU: {product.sku} • Plant: {plants.find(p => p.id === product.plantId)?.name}</p>
                        </div>
                        <Badge variant="destructive">
                          {product.stockLevel} {product.unit}
                        </Badge>
                      </div>
                    ))}
                    {canPerformAction('create_purchase_requests') && lowStockProducts.length > 0 && (
                      <div className="mt-4">
                        <Link href="/dashboard/procurement">
                          <Button size="sm" variant="outline" className="w-full">
                            Create Purchase Request
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pending Orders - Only for sales and management */}
          {(hasPermission('view_orders') || hasPermission('approve_orders')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                  Pending Orders
                </CardTitle>
                <CardDescription>
                  Orders awaiting processing from your plants
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
                          <p className="text-xs text-muted-foreground">{order.customerName} • {plants.find(p => p.id === order.plantId)?.name}</p>
                        </div>
                        <Badge variant="secondary">
                          ₦{order.totalAmount.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                    {canPerformAction('approve_order') && pendingOrders.length > 0 && (
                      <div className="mt-4">
                        <Link href="/dashboard/orders">
                          <Button size="sm" variant="outline" className="w-full">
                            Review Orders
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Plant Status - Only show if user has plant access */}
        {plants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Your Plant Access
              </CardTitle>
              <CardDescription>
                Plants you have access to ({plants.length} of {user?.plantAccess?.length || 0} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {plants.map((plant) => (
                  <div key={plant.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{plant.name}</h3>
                        <p className="text-sm text-muted-foreground">{plant.location}</p>
                        {plant.manager && (
                          <p className="text-xs text-muted-foreground mt-1">Manager: {plant.manager}</p>
                        )}
                      </div>
                      <Badge
                        variant={plant.status === 'operational' ? 'default' : 'secondary'}
                      >
                        {plant.status.replace('-', ' ')}
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
                              width: `${Math.min((plant.currentStock / plant.capacity) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Utilization: {Math.round((plant.currentStock / plant.capacity) * 100)}%
                        </div>
                      </div>
                    )}
                    {hasPermission('manage_inbound_operations') && (
                      <div className="mt-3">
                        <Link href={`/dashboard/plants/${plant.id}`}>
                          <Button size="sm" variant="outline" className="w-full">
                            Manage Plant
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
