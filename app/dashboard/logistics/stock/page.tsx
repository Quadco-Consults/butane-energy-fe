"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Package, DollarSign, AlertTriangle, Home, TrendingUp, TrendingDown, Edit, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import DashboardLayout from '@/components/DashboardLayout';

// Mock data
const inventoryItems = [
  {
    id: "INV-001",
    name: "LPG Cylinders (12.5kg)",
    category: "Gas Products",
    currentStock: 1250,
    minLevel: 500,
    maxLevel: 2000,
    lastRestocked: "2025-11-15",
    supplier: "Nigerian Gas Company",
    unitCost: 8500,
    location: "Warehouse A-1",
    expiryDate: null
  },
  {
    id: "INV-002",
    name: "Butane Gas (20kg)",
    category: "Gas Products",
    currentStock: 380,
    minLevel: 200,
    maxLevel: 800,
    lastRestocked: "2025-11-10",
    supplier: "West African Gas Ltd",
    unitCost: 15000,
    location: "Warehouse A-2",
    expiryDate: null
  },
  {
    id: "INV-003",
    name: "Safety Valves",
    category: "Equipment",
    currentStock: 45,
    minLevel: 50,
    maxLevel: 150,
    lastRestocked: "2025-11-08",
    supplier: "Safety Equipment Pro",
    unitCost: 12500,
    location: "Warehouse B-1",
    expiryDate: null
  },
  {
    id: "INV-004",
    name: "Pressure Regulators",
    category: "Equipment",
    currentStock: 28,
    minLevel: 40,
    maxLevel: 120,
    lastRestocked: "2025-11-05",
    supplier: "Industrial Parts Ltd",
    unitCost: 25000,
    location: "Warehouse B-2",
    expiryDate: null
  },
  {
    id: "INV-005",
    name: "Gas Hoses (2m)",
    category: "Accessories",
    currentStock: 185,
    minLevel: 100,
    maxLevel: 300,
    lastRestocked: "2025-11-12",
    supplier: "FlexiTube Industries",
    unitCost: 3500,
    location: "Warehouse C-1",
    expiryDate: null
  },
  {
    id: "INV-006",
    name: "Engine Oil (5L)",
    category: "Maintenance",
    currentStock: 75,
    minLevel: 30,
    maxLevel: 150,
    lastRestocked: "2025-11-14",
    supplier: "Shell Nigeria",
    unitCost: 8500,
    location: "Maintenance Bay",
    expiryDate: "2026-11-14"
  }
];

const recentTransactions = [
  {
    id: "TXN-045",
    type: "in",
    item: "LPG Cylinders (12.5kg)",
    quantity: 200,
    date: "2025-11-15",
    reference: "PO-2025-089",
    user: "Samuel Okafor",
    value: 1700000
  },
  {
    id: "TXN-044",
    type: "out",
    item: "Butane Gas (20kg)",
    quantity: 50,
    date: "2025-11-15",
    reference: "DO-2025-156",
    user: "Grace Nneka",
    value: 750000
  },
  {
    id: "TXN-043",
    type: "in",
    item: "Gas Hoses (2m)",
    quantity: 100,
    date: "2025-11-12",
    reference: "PO-2025-087",
    user: "Ahmed Hassan",
    value: 350000
  },
  {
    id: "TXN-042",
    type: "out",
    item: "Safety Valves",
    quantity: 15,
    date: "2025-11-11",
    reference: "WO-2025-203",
    user: "John Adeyemi",
    value: 187500
  }
];

const warehouseLocations = [
  {
    id: "WH-A",
    name: "Warehouse A",
    capacity: "5000 units",
    currentOccupancy: 3250,
    items: 45,
    manager: "Emeka Okafor",
    temperature: "25°C",
    humidity: "45%"
  },
  {
    id: "WH-B",
    name: "Warehouse B",
    capacity: "3000 units",
    currentOccupancy: 1850,
    items: 28,
    manager: "Fatima Sule",
    temperature: "23°C",
    humidity: "42%"
  },
  {
    id: "WH-C",
    name: "Warehouse C",
    capacity: "2500 units",
    currentOccupancy: 980,
    items: 35,
    manager: "David Eze",
    temperature: "24°C",
    humidity: "38%"
  }
];

const monthlyMovement = [
  { month: "Jan", inbound: 2500, outbound: 2200, net: 300 },
  { month: "Feb", inbound: 2200, outbound: 2350, net: -150 },
  { month: "Mar", inbound: 2800, outbound: 2450, net: 350 },
  { month: "Apr", inbound: 2350, outbound: 2180, net: 170 },
  { month: "May", inbound: 2650, outbound: 2520, net: 130 },
  { month: "Jun", inbound: 2450, outbound: 2280, net: 170 }
];

const stockValueTrend = [
  { month: "Jan", value: 45000000 },
  { month: "Feb", value: 42000000 },
  { month: "Mar", value: 48000000 },
  { month: "Apr", value: 46500000 },
  { month: "May", value: 49200000 },
  { month: "Jun", value: 52000000 }
];

const categoryDistribution = [
  { name: "Gas Products", value: 65, color: "#10B981" },
  { name: "Equipment", value: 20, color: "#3B82F6" },
  { name: "Accessories", value: 10, color: "#F59E0B" },
  { name: "Maintenance", value: 5, color: "#8B5CF6" }
];

const lowStockAlerts = [
  { item: "Pressure Regulators", current: 28, minimum: 40, priority: "high" },
  { item: "Safety Valves", current: 45, minimum: 50, priority: "medium" },
  { item: "Butane Gas (20kg)", current: 380, minimum: 200, priority: "low" }
];

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [warehouseFilter, setWarehouseFilter] = useState("all");

  const getStockStatus = (item: any) => {
    const ratio = item.currentStock / item.minLevel;
    if (ratio <= 0.5) return "critical";
    if (ratio <= 1) return "low";
    if (ratio >= 1.8) return "overstocked";
    return "normal";
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      case "overstocked": return "bg-blue-100 text-blue-800";
      case "normal": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === "in" ? <TrendingUp className="h-4 w-4 text-green-600" /> :
                          <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesWarehouse = warehouseFilter === "all" || item.location.includes(warehouseFilter);
    return matchesSearch && matchesCategory && matchesWarehouse;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-muted-foreground">Inventory tracking and warehouse management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Inventory
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,963</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦52.0M</div>
            <p className="text-xs text-muted-foreground">+8.1% this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouse Capacity</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58.8%</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {lowStockAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">{alert.item}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {alert.current} | Minimum: {alert.minimum}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                    <Button size="sm">Reorder</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search items by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Gas Products">Gas Products</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                <SelectItem value="Warehouse C">Warehouse C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Items */}
          <div className="grid gap-4">
            {filteredInventory.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.category} • {item.location}</CardDescription>
                    </div>
                    <Badge className={getStockColor(getStockStatus(item))}>
                      {getStockStatus(item).toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Stock</p>
                      <p className="text-2xl font-bold">{item.currentStock.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Min / Max Levels</p>
                      <p className="font-medium">{item.minLevel} / {item.maxLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unit Cost</p>
                      <p className="font-medium">₦{item.unitCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="font-medium">₦{(item.currentStock * item.unitCost).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Restocked</p>
                      <p className="font-medium">{item.lastRestocked}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Stock Level</p>
                      <span className="text-sm">{Math.round((item.currentStock / item.maxLevel) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          getStockStatus(item) === "critical" ? "bg-red-500" :
                          getStockStatus(item) === "low" ? "bg-yellow-500" :
                          getStockStatus(item) === "overstocked" ? "bg-blue-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min((item.currentStock / item.maxLevel) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Add Stock
                    </Button>
                    <Button variant="outline" size="sm">
                      <TrendingDown className="mr-2 h-4 w-4" />
                      Remove Stock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
              <CardDescription>Latest inbound and outbound transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.item}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.reference} • {transaction.user}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">
                        {transaction.type === "in" ? "+" : "-"}{transaction.quantity} units
                      </p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{transaction.value.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.type === "in" ? "Received" : "Issued"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warehouseLocations.map((warehouse) => (
              <Card key={warehouse.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {warehouse.name}
                    <Home className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>Managed by {warehouse.manager}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Capacity Usage</p>
                      <span className="text-sm font-medium">
                        {Math.round((warehouse.currentOccupancy / parseInt(warehouse.capacity)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.round((warehouse.currentOccupancy / parseInt(warehouse.capacity)) * 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {warehouse.currentOccupancy.toLocaleString()} / {warehouse.capacity}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Items Stored</p>
                      <p className="font-medium">{warehouse.items}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Temperature</p>
                      <p className="font-medium">{warehouse.temperature}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Humidity</p>
                      <p className="font-medium">{warehouse.humidity}</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement Trends</CardTitle>
                <CardDescription>Monthly inbound vs outbound movements</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyMovement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="inbound" fill="#10B981" name="Inbound" />
                    <Bar dataKey="outbound" fill="#EF4444" name="Outbound" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Value Trend</CardTitle>
                <CardDescription>Total inventory value over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stockValueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₦${(value as number / 1000000).toFixed(1)}M`, 'Value']} />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
                <CardDescription>Stock distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Stock Movement</CardTitle>
                <CardDescription>Monthly net changes in inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyMovement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="net" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  );
}