'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useERP } from '@/contexts/ERPContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Package, Users, ShoppingCart, DollarSign } from 'lucide-react';

export default function ReportsPage() {
  const { dashboardStats, products, orders, customers, plants } = useERP();

  // Sales by plant
  const salesByPlant = plants.map(plant => {
    const plantOrders = orders.filter(o => o.plantId === plant.id);
    const revenue = plantOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      plantId: plant.id,
      plantName: plant.name,
      orderCount: plantOrders.length,
      revenue,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Top products by revenue
  const productSales = products.map(product => {
    let totalQuantity = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId === product.id) {
          totalQuantity += item.quantity;
          totalRevenue += item.total;
        }
      });
    });

    return {
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity: totalQuantity,
      revenue: totalRevenue,
    };
  }).filter(p => p.quantity > 0).sort((a, b) => b.revenue - a.revenue);

  // Top customers by spending
  const customerSpending = customers.map(customer => {
    const customerOrders = orders.filter(o => o.customerId === customer.id);
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      customerId: customer.id,
      customerName: customer.name,
      customerType: customer.customerType,
      orderCount: customerOrders.length,
      totalSpent,
    };
  }).filter(c => c.orderCount > 0).sort((a, b) => b.totalSpent - a.totalSpent);

  // Low stock products
  const lowStockProducts = products
    .filter(p => p.stockLevel <= p.reorderLevel)
    .sort((a, b) => (a.stockLevel / a.reorderLevel) - (b.stockLevel / b.reorderLevel));

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Business insights and performance metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(dashboardStats?.totalRevenue || 0).toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{dashboardStats?.revenueGrowth || 0}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats?.totalOrders || 0}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{dashboardStats?.ordersGrowth || 0}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats?.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {customerSpending.length} with orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inventory Value
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(dashboardStats?.inventoryValue || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {products.length} products
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Sales by Plant */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Plant</CardTitle>
              <CardDescription>Revenue and order distribution across plants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByPlant.map((plant) => (
                  <div key={plant.plantId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{plant.plantName}</span>
                      <span className="font-semibold">₦{plant.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{plant.orderCount} orders</span>
                      <span>
                        {(dashboardStats?.totalRevenue || 0) > 0
                          ? Math.round((plant.revenue / (dashboardStats?.totalRevenue || 1)) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(dashboardStats?.totalRevenue || 0) > 0
                            ? (plant.revenue / (dashboardStats?.totalRevenue || 1)) * 100
                            : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productSales.slice(0, 5).map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₦{product.revenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Highest spending customers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerSpending.slice(0, 5).map((customer) => (
                    <TableRow key={customer.customerId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.customerName}</p>
                          <Badge variant="secondary" className="text-xs capitalize mt-1">
                            {customer.customerType}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{customer.orderCount}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₦{customer.totalSpent.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Products requiring reorder</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All products are well stocked
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Reorder</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="destructive">
                            {product.stockLevel} {product.unit}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {product.reorderLevel} {product.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest sales transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₦{order.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'completed' ? 'default' :
                          order.status === 'cancelled' ? 'destructive' : 'secondary'
                        }
                      >
                        {order.status}
                      </Badge>
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
