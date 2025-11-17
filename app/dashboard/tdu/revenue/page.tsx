'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  ResponsiveContainer
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  Package
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Mock revenue data
const monthlyRevenueData = [
  { month: 'Jan', revenue: 850, target: 1000, growth: 12 },
  { month: 'Feb', revenue: 920, target: 1000, growth: 15 },
  { month: 'Mar', revenue: 1050, target: 1000, growth: 8 },
  { month: 'Apr', revenue: 980, target: 1100, growth: -2 },
  { month: 'May', revenue: 1150, target: 1100, growth: 18 },
  { month: 'Jun', revenue: 1080, target: 1200, growth: 5 },
  { month: 'Jul', revenue: 1280, target: 1200, growth: 22 },
  { month: 'Aug', revenue: 1350, target: 1300, growth: 15 },
  { month: 'Sep', revenue: 1420, target: 1300, growth: 12 },
  { month: 'Oct', revenue: 1180, target: 1400, growth: -8 },
  { month: 'Nov', revenue: 1520, target: 1500, growth: 25 },
  { month: 'Dec', revenue: 0, target: 1600, growth: 0 }
];

const revenueByCustomerType = [
  { name: 'Industrial', value: 45, revenue: 675000000, color: '#8884d8' },
  { name: 'Commercial', value: 30, revenue: 450000000, color: '#82ca9d' },
  { name: 'Residential', value: 15, revenue: 225000000, color: '#ffc658' },
  { name: 'Government', value: 10, revenue: 150000000, color: '#ff7300' }
];

const revenueByProduct = [
  { product: '20kg Cylinders', jan: 280, feb: 320, mar: 350, apr: 300, may: 380 },
  { product: '12.5kg Cylinders', jan: 220, feb: 250, mar: 280, apr: 240, may: 290 },
  { product: 'Bulk Supply', jan: 350, feb: 350, mar: 420, apr: 440, may: 480 },
  { product: 'Storage Services', jan: 150, feb: 180, mar: 200, apr: 190, mar: 220 }
];

const topCustomers = [
  { name: 'Lagos Gas Station Network', revenue: 156000000, percentage: 12.5, growth: 15 },
  { name: 'Port Harcourt Terminals', revenue: 134000000, percentage: 10.8, growth: 8 },
  { name: 'Abuja Industrial Zone', revenue: 128000000, percentage: 10.3, growth: 22 },
  { name: 'Kano Distribution Hub', revenue: 98000000, percentage: 7.9, growth: -2 },
  { name: 'Ibadan Commercial District', revenue: 87000000, percentage: 7.0, growth: 18 }
];

const currentMonthStats = {
  revenue: 1520000000,
  target: 1500000000,
  lastMonth: 1180000000,
  growth: 28.8,
  avgDealSize: 12850000,
  totalDeals: 118,
  conversionRate: 67.5
};

export default function TDURevenuePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');

  const achievementPercentage = (currentMonthStats.revenue / currentMonthStats.target) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-green-500" />
            TDU Revenue Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive revenue analysis and performance tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Month
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(currentMonthStats.revenue / 1000000000).toFixed(1)}B</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +{currentMonthStats.growth}% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Target Achievement
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievementPercentage.toFixed(1)}%</div>
            <Progress value={achievementPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Deal Size
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(currentMonthStats.avgDealSize / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">{currentMonthStats.totalDeals} deals closed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthStats.conversionRate}%</div>
            <p className="text-xs text-blue-600 mt-1">Sales pipeline efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Monthly Revenue vs Target
            </CardTitle>
            <CardDescription>
              Revenue performance against monthly targets (₦ Millions)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [`₦${value}M`, name === 'revenue' ? 'Actual Revenue' : 'Target']}
                />
                <Legend />
                <Bar dataKey="target" fill="#e5e7eb" name="Target" />
                <Bar dataKey="revenue" fill="#3b82f6" name="Actual Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Customer Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-green-500" />
              Revenue by Customer Type
            </CardTitle>
            <CardDescription>
              Revenue distribution across customer segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByCustomerType}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {revenueByCustomerType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Growth Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Revenue Growth Trend
          </CardTitle>
          <CardDescription>
            Month-over-month growth percentage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Customers & Customer Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Revenue Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Top Revenue Customers
            </CardTitle>
            <CardDescription>
              Highest contributing customers by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.percentage}% of total revenue
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₦{(customer.revenue / 1000000).toFixed(1)}M</p>
                    <div className="flex items-center gap-1">
                      {customer.growth >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${customer.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(customer.growth)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Product Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Revenue by Product Category
            </CardTitle>
            <CardDescription>
              Product performance over recent months (₦ Millions)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByProduct}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jan" fill="#ef4444" name="Jan" />
                <Bar dataKey="feb" fill="#f97316" name="Feb" />
                <Bar dataKey="mar" fill="#eab308" name="Mar" />
                <Bar dataKey="apr" fill="#22c55e" name="Apr" />
                <Bar dataKey="may" fill="#3b82f6" name="May" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Revenue Performance Summary
          </CardTitle>
          <CardDescription>
            Key insights and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                ₦{(monthlyRevenueData.reduce((sum, month) => sum + month.revenue, 0) / 1000).toFixed(1)}B
              </div>
              <p className="text-sm text-muted-foreground">Year-to-Date Revenue</p>
              <Badge className="mt-2 bg-green-100 text-green-800">
                +18.5% vs Last Year
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                87.3%
              </div>
              <p className="text-sm text-muted-foreground">Average Target Achievement</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">
                Above Industry Average
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                ₦{((monthlyRevenueData.reduce((sum, month) => sum + month.revenue, 0) / 11) / 1000000000).toFixed(1)}B
              </div>
              <p className="text-sm text-muted-foreground">Monthly Average Revenue</p>
              <Badge className="mt-2 bg-purple-100 text-purple-800">
                Consistent Growth
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}