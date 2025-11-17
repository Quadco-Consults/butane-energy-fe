'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Truck,
  Target,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Clock,
  Star,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Mock data for various reports
const performanceOverTime = [
  { period: 'Q1 2024', revenue: 2800, orders: 156, customers: 42, satisfaction: 4.2 },
  { period: 'Q2 2024', revenue: 3200, orders: 178, customers: 45, satisfaction: 4.4 },
  { period: 'Q3 2024', revenue: 3800, orders: 195, customers: 48, satisfaction: 4.6 },
  { period: 'Q4 2024', revenue: 4100, orders: 218, customers: 51, satisfaction: 4.8 }
];

const monthlyTrends = [
  { month: 'Jan', revenue: 850, orders: 45, deliverySuccess: 94, customerGrowth: 8 },
  { month: 'Feb', revenue: 920, orders: 48, deliverySuccess: 96, customerGrowth: 12 },
  { month: 'Mar', revenue: 1050, orders: 52, deliverySuccess: 95, customerGrowth: 6 },
  { month: 'Apr', revenue: 980, orders: 49, deliverySuccess: 97, customerGrowth: 4 },
  { month: 'May', revenue: 1150, orders: 56, deliverySuccess: 98, customerGrowth: 15 },
  { month: 'Jun', revenue: 1080, orders: 54, deliverySuccess: 96, customerGrowth: 8 },
  { month: 'Jul', revenue: 1280, orders: 62, deliverySuccess: 97, customerGrowth: 18 },
  { month: 'Aug', revenue: 1350, orders: 65, deliverySuccess: 95, customerGrowth: 12 },
  { month: 'Sep', revenue: 1420, orders: 68, deliverySuccess: 98, customerGrowth: 22 },
  { month: 'Oct', revenue: 1180, orders: 58, deliverySuccess: 94, customerGrowth: 5 },
  { month: 'Nov', revenue: 1520, orders: 72, deliverySuccess: 97, customerGrowth: 28 }
];

const customerSegmentAnalysis = [
  { segment: 'Industrial', value: 45, revenue: 1890, growth: 22 },
  { segment: 'Commercial', value: 35, revenue: 1470, growth: 15 },
  { segment: 'Government', value: 15, revenue: 630, growth: 8 },
  { segment: 'Residential', value: 5, revenue: 210, growth: 35 }
];

const productPerformance = [
  { product: '20kg Cylinders', orders: 245, revenue: 1200, margin: 28, trend: 'up' },
  { product: '12.5kg Cylinders', orders: 189, revenue: 890, margin: 25, trend: 'up' },
  { product: 'Bulk Supply', orders: 67, revenue: 1580, margin: 35, trend: 'stable' },
  { product: 'Storage Services', orders: 45, revenue: 430, margin: 42, trend: 'down' }
];

const regionalPerformance = [
  { region: 'Lagos', orders: 156, revenue: 1890, customers: 18, growth: 22 },
  { region: 'Abuja', orders: 89, revenue: 1120, customers: 12, growth: 15 },
  { region: 'Port Harcourt', orders: 78, revenue: 980, customers: 9, growth: 18 },
  { region: 'Kano', orders: 67, revenue: 750, customers: 8, growth: 12 },
  { region: 'Ibadan', orders: 54, revenue: 560, customers: 6, growth: 8 }
];

const kpiSummary = {
  revenue: {
    current: 4100000000,
    previous: 3800000000,
    target: 4500000000,
    growth: 7.9
  },
  orders: {
    current: 218,
    previous: 195,
    target: 250,
    growth: 11.8
  },
  customers: {
    current: 51,
    previous: 48,
    target: 55,
    growth: 6.25
  },
  satisfaction: {
    current: 4.8,
    previous: 4.6,
    target: 5.0,
    growth: 4.35
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function TDUReportsPage() {
  const [reportPeriod, setReportPeriod] = useState('quarterly');
  const [reportType, setReportType] = useState('performance');

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-green-500" />
            TDU Analytics & Reports
          </h1>
          <p className="text-muted-foreground">
            Comprehensive reporting and business intelligence dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(kpiSummary.revenue.current / 1000000000).toFixed(1)}B</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+{kpiSummary.revenue.growth}%</span>
              </div>
              <span className="text-xs text-muted-foreground">vs previous period</span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Target Progress</span>
                <span>{((kpiSummary.revenue.current / kpiSummary.revenue.target) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1">
                <div
                  className="bg-green-500 h-1 rounded-full"
                  style={{ width: `${(kpiSummary.revenue.current / kpiSummary.revenue.target) * 100}%` }}
                ></div>
              </div>
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
            <div className="text-2xl font-bold">{kpiSummary.orders.current}</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+{kpiSummary.orders.growth}%</span>
              </div>
              <span className="text-xs text-muted-foreground">vs previous period</span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Target Progress</span>
                <span>{((kpiSummary.orders.current / kpiSummary.orders.target) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full"
                  style={{ width: `${(kpiSummary.orders.current / kpiSummary.orders.target) * 100}%` }}
                ></div>
              </div>
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
            <div className="text-2xl font-bold">{kpiSummary.customers.current}</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+{kpiSummary.customers.growth}%</span>
              </div>
              <span className="text-xs text-muted-foreground">vs previous period</span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Target Progress</span>
                <span>{((kpiSummary.customers.current / kpiSummary.customers.target) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1">
                <div
                  className="bg-purple-500 h-1 rounded-full"
                  style={{ width: `${(kpiSummary.customers.current / kpiSummary.customers.target) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Satisfaction Score
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiSummary.satisfaction.current}</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+{kpiSummary.satisfaction.growth}%</span>
              </div>
              <span className="text-xs text-muted-foreground">vs previous period</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(kpiSummary.satisfaction.current) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Performance Trends
            </CardTitle>
            <CardDescription>
              Quarterly performance metrics overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? `₦${value}M` :
                    name === 'satisfaction' ? `${value} stars` :
                    value,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Segment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-green-500" />
              Customer Segment Analysis
            </CardTitle>
            <CardDescription>
              Revenue distribution by customer type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegmentAnalysis}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {customerSegmentAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Monthly Business Trends
          </CardTitle>
          <CardDescription>
            Key business metrics tracked over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  name === 'revenue' ? `₦${value}M` :
                  name === 'deliverySuccess' ? `${value}%` :
                  name === 'customerGrowth' ? `+${value}%` :
                  value,
                  name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')
                ]}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="deliverySuccess" stroke="#ffc658" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="customerGrowth" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Product Performance & Regional Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Product Performance
            </CardTitle>
            <CardDescription>
              Revenue and margin analysis by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productPerformance.map((product, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{product.product}</span>
                      <Badge className={
                        product.trend === 'up' ? 'bg-green-100 text-green-800' :
                        product.trend === 'stable' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {product.trend === 'up' ? '↗' : product.trend === 'stable' ? '→' : '↘'} {product.trend}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{product.margin}% margin</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Orders</p>
                      <p className="font-semibold">{product.orders}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold">₦{product.revenue}M</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              Regional Performance
            </CardTitle>
            <CardDescription>
              Business metrics breakdown by geographical region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? `₦${value}M` : value,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                <Bar dataKey="customers" fill="#82ca9d" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            Executive Summary
          </CardTitle>
          <CardDescription>
            Key insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-green-600">Strong Growth</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Revenue increased by 7.9% quarter-over-quarter, driven by industrial segment expansion and improved customer satisfaction.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-blue-600">Target Achievement</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Currently at 91% of quarterly revenue target. Focus on commercial segment to close the gap.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-orange-600">Areas for Improvement</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Storage services showing declining trend. Recommend market analysis and product refresh strategy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}