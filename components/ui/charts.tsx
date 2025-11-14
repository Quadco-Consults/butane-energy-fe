"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from "lucide-react"

// Color palette for charts
const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  muted: "hsl(var(--muted-foreground))",
  butane: "#FF6B35", // Butane Energy brand color
}

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.info,
  CHART_COLORS.danger,
  CHART_COLORS.butane,
]

interface ChartProps {
  title?: string
  description?: string
  data: any[]
  className?: string
  height?: number
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <div className="grid gap-2">
          <div className="font-medium">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

// Revenue Chart Component
export function RevenueChart({ title = "Revenue Overview", description, data, className, height = 300 }: ChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={CHART_COLORS.success}
              fillOpacity={1}
              fill="url(#revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Sales Performance Chart
export function SalesChart({ title = "Sales Performance", description, data, className, height = 300 }: ChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke={CHART_COLORS.warning}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Department Performance Chart
export function DepartmentChart({ title = "Department Performance", description, data, className, height = 300 }: ChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="performance" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Inventory Status Pie Chart
export function InventoryChart({ title = "Inventory Status", description, data, className, height = 300 }: ChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-500" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium">{entry.name}</span>
              <Badge variant="secondary" className="ml-auto">
                {entry.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Order Status Radial Chart
export function OrderStatusChart({ title = "Order Status", description, data, className, height = 300 }: ChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-indigo-500" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={data}>
            <RadialBar dataKey="value" cornerRadius={10} fill={CHART_COLORS.primary} />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// KPI Card Component
interface KPICardProps {
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "neutral"
  icon?: React.ElementType
  description?: string
  className?: string
}

export function KPICard({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  description,
  className
}: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${getTrendColor()} mt-1`}>
            {getTrendIcon()}
            <span>{change > 0 ? "+" : ""}{change}%</span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Combined Analytics Dashboard
interface AnalyticsDashboardProps {
  revenueData: any[]
  salesData: any[]
  departmentData: any[]
  inventoryData: any[]
  kpis: {
    revenue: { value: string; change: number }
    orders: { value: number; change: number }
    customers: { value: number; change: number }
    products: { value: number; change: number }
  }
}

export function AnalyticsDashboard({
  revenueData,
  salesData,
  departmentData,
  inventoryData,
  kpis
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={kpis.revenue.value}
          change={kpis.revenue.change}
          trend={kpis.revenue.change > 0 ? "up" : "down"}
          icon={DollarSign}
        />
        <KPICard
          title="Total Orders"
          value={kpis.orders.value}
          change={kpis.orders.change}
          trend={kpis.orders.change > 0 ? "up" : "down"}
          icon={ShoppingCart}
        />
        <KPICard
          title="Total Customers"
          value={kpis.customers.value}
          change={kpis.customers.change}
          trend={kpis.customers.change > 0 ? "up" : "down"}
          icon={Users}
        />
        <KPICard
          title="Total Products"
          value={kpis.products.value}
          change={kpis.products.change}
          trend={kpis.products.change > 0 ? "up" : "down"}
          icon={Package}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart
          data={revenueData}
          description="Monthly revenue breakdown"
        />
        <SalesChart
          data={salesData}
          description="Sales vs targets"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DepartmentChart
          data={departmentData}
          description="Performance by department"
        />
        <InventoryChart
          data={inventoryData}
          description="Current inventory status"
        />
      </div>
    </div>
  )
}