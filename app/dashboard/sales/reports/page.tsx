'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Printer
} from 'lucide-react';

interface ReportData {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'customer' | 'inventory' | 'financial';
  lastGenerated: string;
  icon: any;
  color: string;
}

interface SalesMetric {
  period: string;
  sales: number;
  orders: number;
  customers: number;
  averageOrder: number;
  growth: number;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [reportType, setReportType] = useState('all');

  // Mock report templates
  const reportTemplates: ReportData[] = [
    {
      id: 'sales-summary',
      name: 'Sales Summary Report',
      description: 'Overall sales performance with key metrics and trends',
      type: 'sales',
      lastGenerated: '2024-11-29T10:30:00Z',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      id: 'customer-analysis',
      name: 'Customer Analysis Report',
      description: 'Customer segmentation, loyalty, and purchasing patterns',
      type: 'customer',
      lastGenerated: '2024-11-28T14:20:00Z',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'product-performance',
      name: 'Product Performance Report',
      description: 'Best selling products, inventory turnover, and profitability',
      type: 'inventory',
      lastGenerated: '2024-11-29T09:15:00Z',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      id: 'financial-summary',
      name: 'Financial Summary Report',
      description: 'Revenue, profit margins, payment methods, and financial KPIs',
      type: 'financial',
      lastGenerated: '2024-11-29T16:45:00Z',
      icon: BarChart3,
      color: 'bg-orange-500'
    },
    {
      id: 'daily-operations',
      name: 'Daily Operations Report',
      description: 'Daily sales transactions, shift summaries, and operational metrics',
      type: 'sales',
      lastGenerated: '2024-11-29T18:00:00Z',
      icon: ShoppingCart,
      color: 'bg-red-500'
    },
    {
      id: 'tank-inventory',
      name: 'Tank Inventory Report',
      description: 'Tank levels, consumption rates, and refill schedules',
      type: 'inventory',
      lastGenerated: '2024-11-29T12:30:00Z',
      icon: Package,
      color: 'bg-teal-500'
    }
  ];

  // Mock sales metrics data
  const salesMetrics: SalesMetric[] = [
    {
      period: 'Today',
      sales: 245000,
      orders: 18,
      customers: 12,
      averageOrder: 13611,
      growth: 8.5
    },
    {
      period: 'Yesterday',
      sales: 320000,
      orders: 24,
      customers: 16,
      averageOrder: 13333,
      growth: 12.3
    },
    {
      period: 'This Week',
      sales: 1850000,
      orders: 142,
      customers: 89,
      averageOrder: 13028,
      growth: 15.2
    },
    {
      period: 'Last Week',
      sales: 1680000,
      orders: 128,
      customers: 82,
      averageOrder: 13125,
      growth: 9.8
    },
    {
      period: 'This Month',
      sales: 7200000,
      orders: 580,
      customers: 245,
      averageOrder: 12414,
      growth: 18.7
    },
    {
      period: 'Last Month',
      sales: 6100000,
      orders: 495,
      customers: 212,
      averageOrder: 12323,
      growth: 11.4
    }
  ];

  const filteredReports = reportTemplates.filter(report =>
    reportType === 'all' || report.type === reportType
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
    // In a real app, this would trigger report generation
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              Sales Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Generate detailed sales analytics and performance reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Report
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Sales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦245K</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-600">+8.5% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Weekly Growth
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+15.2%</div>
              <p className="text-xs text-blue-600">
                Sales growth this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-purple-600">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦13.6K</div>
              <p className="text-xs text-orange-600">
                Per transaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key sales metrics across different time periods</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Avg. Order</TableHead>
                  <TableHead>Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesMetrics.map((metric, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{metric.period}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(metric.sales)}
                    </TableCell>
                    <TableCell>{metric.orders.toLocaleString()}</TableCell>
                    <TableCell>{metric.customers.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(metric.averageOrder)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {metric.growth >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={metric.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Generate comprehensive business reports</CardDescription>
              </div>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="sales">Sales Reports</SelectItem>
                  <SelectItem value="customer">Customer Reports</SelectItem>
                  <SelectItem value="inventory">Inventory Reports</SelectItem>
                  <SelectItem value="financial">Financial Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => {
                const IconComponent = report.icon;
                return (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${report.color} flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{report.name}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {report.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">
                        {report.description}
                      </p>
                      <div className="text-xs text-muted-foreground mb-3">
                        Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => generateReport(report.id)}
                          className="flex-1"
                        >
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Generate
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Custom Report Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
            <CardDescription>Create customized reports with specific parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select defaultValue="sales">
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Analysis</SelectItem>
                      <SelectItem value="customer">Customer Insights</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="financial">Financial Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select defaultValue="30days">
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Include Sections</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Executive Summary</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Sales Metrics</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Customer Analysis</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Product Performance</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Charts & Graphs</span>
                    </label>
                  </div>
                </div>

                <Button className="w-full gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Custom Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}