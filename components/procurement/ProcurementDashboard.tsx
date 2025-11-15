'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp, TrendingDown, DollarSign, Package, FileText,
  Clock, Target, AlertTriangle, CheckCircle, BarChart3,
  PieChart, Users, Building, Calendar, Zap, Shield,
  Handshake, Calculator, RefreshCw, Download, Filter,
  ArrowUpRight, ArrowDownRight, Activity, Gauge
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface ProcurementMetrics {
  purchaseRequisitions: {
    total: number
    pending: number
    approved: number
    rejected: number
    avgProcessingTime: number
  }
  purchaseOrders: {
    total: number
    value: number
    open: number
    completed: number
    avgOrderValue: number
  }
  goodsReceipts: {
    total: number
    value: number
    pending: number
    completed: number
    qualityIssues: number
  }
  invoiceVerification: {
    total: number
    value: number
    matched: number
    exceptions: number
    avgMatchingTime: number
  }
  contracts: {
    total: number
    value: number
    active: number
    utilization: number
    savings: number
  }
  vendors: {
    total: number
    active: number
    performance: number
    onTimeDelivery: number
    qualityRating: number
  }
}

interface ProcurementDashboardProps {
  dateRange?: string
  metrics?: ProcurementMetrics
  onExportReport?: (type: string) => void
  onDrillDown?: (metric: string, period: string) => void
}

export default function ProcurementDashboard({
  dateRange = 'current_month',
  metrics,
  onExportReport = () => {},
  onDrillDown = () => {}
}: ProcurementDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('current_month')
  const [refreshing, setRefreshing] = useState(false)

  // Mock comprehensive metrics data
  const mockMetrics: ProcurementMetrics = {
    purchaseRequisitions: {
      total: 2847,
      pending: 156,
      approved: 2691,
      rejected: 42,
      avgProcessingTime: 2.3
    },
    purchaseOrders: {
      total: 1924,
      value: 12450000,
      open: 287,
      completed: 1637,
      avgOrderValue: 6472
    },
    goodsReceipts: {
      total: 1542,
      value: 11890000,
      pending: 98,
      completed: 1444,
      qualityIssues: 23
    },
    invoiceVerification: {
      total: 1456,
      value: 11650000,
      matched: 1389,
      exceptions: 67,
      avgMatchingTime: 1.8
    },
    contracts: {
      total: 87,
      value: 45600000,
      active: 72,
      utilization: 68.4,
      savings: 2850000
    },
    vendors: {
      total: 324,
      active: 198,
      performance: 87.6,
      onTimeDelivery: 94.2,
      qualityRating: 91.8
    }
  }

  const currentMetrics = metrics || mockMetrics

  // Sample data for charts
  const procurementTrendData = [
    { month: 'Jan', prValue: 950000, poValue: 890000, grValue: 835000, ivValue: 820000 },
    { month: 'Feb', prValue: 1020000, poValue: 965000, grValue: 920000, ivValue: 895000 },
    { month: 'Mar', prValue: 1150000, poValue: 1080000, grValue: 1025000, ivValue: 980000 },
    { month: 'Apr', prValue: 1280000, poValue: 1195000, grValue: 1140000, ivValue: 1095000 },
    { month: 'May', prValue: 1420000, poValue: 1345000, grValue: 1275000, ivValue: 1230000 },
    { month: 'Jun', prValue: 1380000, poValue: 1295000, grValue: 1225000, ivValue: 1180000 }
  ]

  const categorySpendData = [
    { name: 'Raw Materials', value: 4200000, color: '#3B82F6' },
    { name: 'Services', value: 2800000, color: '#10B981' },
    { name: 'Equipment', value: 2200000, color: '#F59E0B' },
    { name: 'Maintenance', value: 1800000, color: '#EF4444' },
    { name: 'IT/Software', value: 1450000, color: '#8B5CF6' }
  ]

  const vendorPerformanceData = [
    { vendor: 'Acme Engineering', performance: 95, onTime: 98, quality: 96, spend: 2450000 },
    { vendor: 'TechFlow Industries', performance: 92, onTime: 94, quality: 91, spend: 1980000 },
    { vendor: 'Global Suppliers', performance: 89, onTime: 91, quality: 88, spend: 1650000 },
    { vendor: 'Prime Materials', performance: 94, onTime: 96, quality: 93, spend: 1420000 },
    { vendor: 'Elite Services', performance: 88, onTime: 85, quality: 92, spend: 1180000 }
  ]

  const processEfficiencyData = [
    { process: 'PR to PO', target: 2.0, actual: 1.8, improvement: 10 },
    { process: 'PO to GR', target: 5.0, actual: 4.2, improvement: 16 },
    { process: 'GR to IV', target: 1.5, actual: 1.3, improvement: 13 },
    { process: 'IV to Payment', target: 3.0, actual: 2.7, improvement: 10 }
  ]

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100
  }

  const refreshDashboard = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setRefreshing(false)
  }

  const KPICard = ({
    title,
    value,
    change,
    icon: Icon,
    color = 'blue',
    suffix = '',
    onClick
  }: {
    title: string
    value: string | number
    change?: number
    icon: any
    color?: string
    suffix?: string
    onClick?: () => void
  }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      orange: 'text-orange-600 bg-orange-100',
      purple: 'text-purple-600 bg-purple-100',
      red: 'text-red-600 bg-red-100'
    }

    return (
      <Card className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} onClick={onClick}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</p>
              {change !== undefined && (
                <div className={`inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                  change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {change >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(change).toFixed(1)}%
                </div>
              )}
            </div>
            <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ProcessFlowCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Procurement Process Flow
        </CardTitle>
        <CardDescription>Real-time status across the procurement lifecycle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Purchase Requisitions</div>
                <div className="text-sm text-gray-600">{currentMetrics.purchaseRequisitions.pending} pending approval</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{currentMetrics.purchaseRequisitions.total}</div>
              <div className="text-sm text-gray-600">Total this month</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Purchase Orders</div>
                <div className="text-sm text-gray-600">{currentMetrics.purchaseOrders.open} open orders</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">${(currentMetrics.purchaseOrders.value / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600">Total value</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium">Goods Receipts</div>
                <div className="text-sm text-gray-600">{currentMetrics.goodsReceipts.pending} pending processing</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{currentMetrics.goodsReceipts.total}</div>
              <div className="text-sm text-gray-600">Receipts processed</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calculator className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Invoice Verification</div>
                <div className="text-sm text-gray-600">{currentMetrics.invoiceVerification.exceptions} exceptions</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {((currentMetrics.invoiceVerification.matched / currentMetrics.invoiceVerification.total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Match rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procurement Dashboard</h1>
          <p className="text-gray-600">Comprehensive SAP MM procurement analytics and insights</p>
        </div>

        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Current Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="current_quarter">Current Quarter</SelectItem>
              <SelectItem value="last_quarter">Last Quarter</SelectItem>
              <SelectItem value="current_year">Current Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={refreshDashboard} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline" onClick={() => onExportReport('comprehensive')}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Executive Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Executive Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6">
            {/* Executive KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Total Procurement Value"
                value={`$${(currentMetrics.purchaseOrders.value / 1000000).toFixed(1)}M`}
                change={15.8}
                icon={DollarSign}
                color="green"
                onClick={() => onDrillDown('procurement_value', selectedPeriod)}
              />

              <KPICard
                title="Active Purchase Orders"
                value={currentMetrics.purchaseOrders.open}
                change={-8.2}
                icon={Package}
                color="blue"
                onClick={() => onDrillDown('purchase_orders', selectedPeriod)}
              />

              <KPICard
                title="Contract Savings"
                value={`$${(currentMetrics.contracts.savings / 1000000).toFixed(1)}M`}
                change={22.4}
                icon={Handshake}
                color="purple"
                onClick={() => onDrillDown('contract_savings', selectedPeriod)}
              />

              <KPICard
                title="Process Efficiency"
                value={`${currentMetrics.invoiceVerification.avgMatchingTime}`}
                change={12.6}
                icon={Zap}
                color="orange"
                suffix=" days avg"
                onClick={() => onDrillDown('process_efficiency', selectedPeriod)}
              />
            </div>

            {/* Procurement Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gauge className="w-5 h-5 mr-2" />
                  Procurement Health Score
                </CardTitle>
                <CardDescription>Overall performance across all procurement processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">94.2</div>
                      <div className="text-gray-600">Overall Health Score</div>
                      <div className="text-sm text-green-600 font-medium">Excellent Performance</div>
                    </div>
                    <Progress value={94.2} className="w-full h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">97%</div>
                      <div className="text-sm text-gray-600">PR Approval Rate</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">95%</div>
                      <div className="text-sm text-gray-600">IV Match Rate</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">92%</div>
                      <div className="text-sm text-gray-600">Vendor Performance</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">89%</div>
                      <div className="text-sm text-gray-600">Contract Utilization</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Flow and Spend Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProcessFlowCard />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Spend by Category
                  </CardTitle>
                  <CardDescription>Procurement spend distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categorySpendData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categorySpendData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${(value / 1000000).toFixed(1)}M`} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Key Alerts & Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="font-medium text-red-800">67 Invoice Exceptions</div>
                        <div className="text-sm text-red-600">Require immediate attention - potential payment delays</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                      Review Now
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-800">15 Contracts Expiring</div>
                        <div className="text-sm text-yellow-600">Within next 30 days - renewal required</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                      Plan Renewals
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-800">Savings Target Achievement</div>
                        <div className="text-sm text-blue-600">85% of annual target achieved - on track for bonus</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations">
          <div className="grid gap-6">
            {/* Operational KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="PR Processing Time"
                value={currentMetrics.purchaseRequisitions.avgProcessingTime}
                change={-12.4}
                icon={Clock}
                color="blue"
                suffix=" days"
              />

              <KPICard
                title="PO Completion Rate"
                value={`${((currentMetrics.purchaseOrders.completed / currentMetrics.purchaseOrders.total) * 100).toFixed(1)}`}
                change={5.8}
                icon={CheckCircle}
                color="green"
                suffix="%"
              />

              <KPICard
                title="GR Quality Issues"
                value={currentMetrics.goodsReceipts.qualityIssues}
                change={-18.3}
                icon={Shield}
                color="orange"
              />

              <KPICard
                title="IV Match Time"
                value={currentMetrics.invoiceVerification.avgMatchingTime}
                change={-15.6}
                icon={Target}
                color="purple"
                suffix=" days"
              />
            </div>

            {/* Procurement Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Procurement Process Trends
                </CardTitle>
                <CardDescription>Monthly value flow through procurement processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={procurementTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: any) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Legend />
                      <Line type="monotone" dataKey="prValue" stroke="#3B82F6" name="PR Value" strokeWidth={2} />
                      <Line type="monotone" dataKey="poValue" stroke="#10B981" name="PO Value" strokeWidth={2} />
                      <Line type="monotone" dataKey="grValue" stroke="#F59E0B" name="GR Value" strokeWidth={2} />
                      <Line type="monotone" dataKey="ivValue" stroke="#8B5CF6" name="IV Value" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Process Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>Process Efficiency Metrics</CardTitle>
                <CardDescription>Target vs. actual processing times and improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {processEfficiencyData.map((process) => (
                    <div key={process.process}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{process.process}</div>
                        <div className="text-sm text-gray-600">
                          {process.actual} days (Target: {process.target} days)
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Progress
                          value={(process.actual / process.target) * 100}
                          className="flex-1"
                        />
                        <Badge className={process.improvement > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {process.improvement > 0 ? '+' : ''}{process.improvement}% improvement
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Workload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Workload</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pending PRs</span>
                      <span className="font-bold text-blue-600">{currentMetrics.purchaseRequisitions.pending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Open POs</span>
                      <span className="font-bold text-green-600">{currentMetrics.purchaseOrders.open}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pending GRs</span>
                      <span className="font-bold text-orange-600">{currentMetrics.goodsReceipts.pending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">IV Exceptions</span>
                      <span className="font-bold text-red-600">{currentMetrics.invoiceVerification.exceptions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">PR Approval Rate</span>
                      <span className="font-bold text-green-600">97.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">PO Accuracy Rate</span>
                      <span className="font-bold text-blue-600">94.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GR Error Rate</span>
                      <span className="font-bold text-orange-600">1.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">IV Match Rate</span>
                      <span className="font-bold text-purple-600">95.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="grid gap-6">
            {/* Performance KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Cost Savings"
                value={`$${(currentMetrics.contracts.savings / 1000000).toFixed(1)}M`}
                change={18.7}
                icon={DollarSign}
                color="green"
              />

              <KPICard
                title="Contract Utilization"
                value={currentMetrics.contracts.utilization}
                change={5.2}
                icon={Handshake}
                color="blue"
                suffix="%"
              />

              <KPICard
                title="Vendor Performance"
                value={currentMetrics.vendors.performance}
                change={3.4}
                icon={Users}
                color="purple"
                suffix="/100"
              />

              <KPICard
                title="Process Automation"
                value="94.2"
                change={8.9}
                icon={Zap}
                color="orange"
                suffix="%"
              />
            </div>

            {/* Savings Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Cost Savings Performance
                </CardTitle>
                <CardDescription>Monthly savings achievement vs. targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: 'Jan', target: 200000, achieved: 185000 },
                        { month: 'Feb', target: 220000, achieved: 240000 },
                        { month: 'Mar', target: 250000, achieved: 275000 },
                        { month: 'Apr', target: 280000, achieved: 295000 },
                        { month: 'May', target: 300000, achieved: 320000 },
                        { month: 'Jun', target: 320000, achieved: 350000 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="target"
                        stackId="1"
                        stroke="#EF4444"
                        fill="#FEF2F2"
                        name="Target Savings"
                      />
                      <Area
                        type="monotone"
                        dataKey="achieved"
                        stackId="2"
                        stroke="#10B981"
                        fill="#D1FAE5"
                        name="Achieved Savings"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Benchmarks */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Benchmarks</CardTitle>
                <CardDescription>How your procurement performance compares to industry standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">Top 10%</div>
                    <div className="text-sm text-gray-600">Industry Ranking</div>
                    <div className="text-xs text-green-600 mt-1">Procurement Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-gray-600">Automation Rate</div>
                    <div className="text-xs text-blue-600 mt-1">vs 65% industry avg</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">15.8%</div>
                    <div className="text-sm text-gray-600">Annual Savings</div>
                    <div className="text-xs text-purple-600 mt-1">vs 8% industry avg</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ROI Analysis</CardTitle>
                  <CardDescription>Return on procurement technology investment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technology Investment</span>
                      <span className="font-bold">$450,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Annual Savings</span>
                      <span className="font-bold text-green-600">$2,850,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payback Period</span>
                      <span className="font-bold text-blue-600">2.1 months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">3-Year ROI</span>
                      <span className="font-bold text-purple-600">1,800%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Gains</CardTitle>
                  <CardDescription>Process improvement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Processing Time Reduction</span>
                      <span className="font-bold text-green-600">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manual Work Reduction</span>
                      <span className="font-bold text-blue-600">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate Reduction</span>
                      <span className="font-bold text-orange-600">82%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compliance Improvement</span>
                      <span className="font-bold text-purple-600">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors">
          <div className="grid gap-6">
            {/* Vendor KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Active Vendors"
                value={currentMetrics.vendors.active}
                change={12.3}
                icon={Users}
                color="blue"
              />

              <KPICard
                title="On-Time Delivery"
                value={currentMetrics.vendors.onTimeDelivery}
                change={5.7}
                icon={Clock}
                color="green"
                suffix="%"
              />

              <KPICard
                title="Quality Rating"
                value={currentMetrics.vendors.qualityRating}
                change={3.2}
                icon={Shield}
                color="purple"
                suffix="/100"
              />

              <KPICard
                title="Vendor Performance"
                value={currentMetrics.vendors.performance}
                change={4.8}
                icon={Target}
                color="orange"
                suffix="/100"
              />
            </div>

            {/* Top Vendors Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Top Vendor Performance
                </CardTitle>
                <CardDescription>Performance metrics for top spending vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Vendor</th>
                        <th className="text-center py-2">Performance</th>
                        <th className="text-center py-2">On-Time %</th>
                        <th className="text-center py-2">Quality %</th>
                        <th className="text-right py-2">Annual Spend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorPerformanceData.map((vendor) => (
                        <tr key={vendor.vendor} className="border-b">
                          <td className="py-3 font-medium">{vendor.vendor}</td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Progress value={vendor.performance} className="w-16" />
                              <span className="text-sm font-medium">{vendor.performance}%</span>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <Badge className={vendor.onTime >= 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {vendor.onTime}%
                            </Badge>
                          </td>
                          <td className="py-3 text-center">
                            <Badge className={vendor.quality >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {vendor.quality}%
                            </Badge>
                          </td>
                          <td className="py-3 text-right font-medium">
                            ${(vendor.spend / 1000000).toFixed(1)}M
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Risk Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-600">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Vendor Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-red-800">Global Suppliers</div>
                          <div className="text-sm text-red-600">Performance declining - 89%</div>
                        </div>
                        <Badge className="bg-red-100 text-red-800">High Risk</Badge>
                      </div>
                    </div>

                    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-yellow-800">Elite Services</div>
                          <div className="text-sm text-yellow-600">Delivery delays increasing</div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                      </div>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-green-800">Acme Engineering</div>
                          <div className="text-sm text-green-600">Excellent performance - 95%</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vendor Diversity</CardTitle>
                  <CardDescription>Supplier diversity metrics and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Small Business</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={28} className="w-20" />
                        <span className="text-sm font-medium">28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Women-Owned</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={15} className="w-20" />
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Minority-Owned</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={22} className="w-20" />
                        <span className="text-sm font-medium">22%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Local Suppliers</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={35} className="w-20" />
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-6">
            {/* Predictive Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Predictive Analytics & Forecasts
                </CardTitle>
                <CardDescription>AI-powered insights and predictions for procurement planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$15.2M</div>
                    <div className="text-sm text-gray-600">Predicted Q4 Spend</div>
                    <div className="text-xs text-blue-600 mt-1">+12% vs Q3</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$1.8M</div>
                    <div className="text-sm text-gray-600">Potential Savings</div>
                    <div className="text-xs text-green-600 mt-1">Through optimization</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">8</div>
                    <div className="text-sm text-gray-600">Risk Vendors</div>
                    <div className="text-xs text-orange-600 mt-1">Require attention</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spend Analytics</CardTitle>
                  <CardDescription>Detailed spend analysis and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categorySpendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value: any) => `$${(value / 1000000).toFixed(1)}M`} />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Metrics</CardTitle>
                  <CardDescription>Procurement compliance and audit readiness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Policy Compliance</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={96} className="w-20" />
                        <span className="text-sm font-medium">96%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Approval Compliance</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={98} className="w-20" />
                        <span className="text-sm font-medium">98%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Contract Compliance</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={94} className="w-20" />
                        <span className="text-sm font-medium">94%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit Readiness</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={99} className="w-20" />
                        <span className="text-sm font-medium">99%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence</CardTitle>
                <CardDescription>Market trends and pricing intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-red-600">+8.5%</div>
                    <div className="text-sm text-gray-600">Steel Prices</div>
                    <div className="text-xs text-gray-500">vs last quarter</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingDown className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-green-600">-3.2%</div>
                    <div className="text-sm text-gray-600">Service Costs</div>
                    <div className="text-xs text-gray-500">vs last quarter</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-orange-600">+12.1%</div>
                    <div className="text-sm text-gray-600">Energy Costs</div>
                    <div className="text-xs text-gray-500">vs last quarter</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingDown className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-blue-600">-1.8%</div>
                    <div className="text-sm text-gray-600">IT Equipment</div>
                    <div className="text-xs text-gray-500">vs last quarter</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Intelligent recommendations for procurement optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-blue-800">Contract Consolidation Opportunity</div>
                        <div className="text-sm text-blue-600 mt-1">
                          Consolidate 3 maintenance contracts with Acme Engineering to save ~$180K annually
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-medium text-green-800">Volume Discount Opportunity</div>
                        <div className="text-sm text-green-600 mt-1">
                          Increase order quantity for steel pipes by 15% to qualify for tier 2 pricing
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-1" />
                      <div>
                        <div className="font-medium text-orange-800">Vendor Diversification Required</div>
                        <div className="text-sm text-orange-600 mt-1">
                          85% of raw materials from single supplier - consider adding backup vendors
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <div className="font-medium text-purple-800">Process Automation Opportunity</div>
                        <div className="text-sm text-purple-600 mt-1">
                          Automate recurring service orders to reduce processing time by 40%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}