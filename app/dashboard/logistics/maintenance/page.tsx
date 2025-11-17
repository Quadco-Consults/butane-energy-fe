"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Calendar, Wrench, Activity, DollarSign, CheckCircle, Eye, ExternalLink, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import DashboardLayout from '@/components/DashboardLayout';

// Mock data
const maintenanceSchedule = [
  {
    id: "MNT-001",
    vehicle: "BT-001",
    type: "Routine Service",
    priority: "medium",
    dueDate: "2025-11-20",
    lastService: "2025-08-15",
    mileage: "45,230 km",
    estimatedCost: "₦180,000",
    assignedTech: "Emeka Okafor"
  },
  {
    id: "MNT-002",
    vehicle: "BT-003",
    type: "Engine Overhaul",
    priority: "high",
    dueDate: "2025-11-18",
    lastService: "2025-06-10",
    mileage: "89,450 km",
    estimatedCost: "₦750,000",
    assignedTech: "Ahmed Sule"
  },
  {
    id: "MNT-003",
    vehicle: "BT-007",
    type: "Brake Inspection",
    priority: "urgent",
    dueDate: "2025-11-17",
    lastService: "2025-10-01",
    mileage: "52,180 km",
    estimatedCost: "₦95,000",
    assignedTech: "Grace Nneka"
  },
  {
    id: "MNT-004",
    vehicle: "BT-005",
    type: "Tire Replacement",
    priority: "low",
    dueDate: "2025-11-25",
    lastService: "2025-09-12",
    mileage: "38,670 km",
    estimatedCost: "₦320,000",
    assignedTech: "John Adeyemi"
  }
];

const activeRepairs = [
  {
    id: "RPR-015",
    vehicle: "BT-002",
    issue: "Hydraulic System Leak",
    status: "in_progress",
    startDate: "2025-11-15",
    estimatedCompletion: "2025-11-18",
    technician: "Emeka Okafor",
    cost: "₦450,000",
    progress: 65
  },
  {
    id: "RPR-016",
    vehicle: "BT-009",
    issue: "Electrical Fault",
    status: "pending_parts",
    startDate: "2025-11-14",
    estimatedCompletion: "2025-11-20",
    technician: "Ahmed Sule",
    cost: "₦220,000",
    progress: 30
  },
  {
    id: "RPR-017",
    vehicle: "BT-011",
    issue: "Transmission Service",
    status: "inspection",
    startDate: "2025-11-16",
    estimatedCompletion: "2025-11-19",
    technician: "Grace Nneka",
    cost: "₦380,000",
    progress: 15
  }
];

const vehicleHealth = [
  { vehicle: "BT-001", health: 92, nextService: "2025-11-20", issues: 0, mileage: "45,230" },
  { vehicle: "BT-002", health: 75, nextService: "2025-12-01", issues: 1, mileage: "67,890" },
  { vehicle: "BT-003", health: 68, nextService: "2025-11-18", issues: 2, mileage: "89,450" },
  { vehicle: "BT-005", health: 88, nextService: "2025-11-25", issues: 0, mileage: "38,670" },
  { vehicle: "BT-007", health: 82, nextService: "2025-11-17", issues: 1, mileage: "52,180" },
  { vehicle: "BT-009", health: 71, nextService: "2025-11-22", issues: 2, mileage: "73,220" },
  { vehicle: "BT-011", health: 79, nextService: "2025-11-19", issues: 1, mileage: "61,340" },
  { vehicle: "BT-012", health: 94, nextService: "2025-12-05", issues: 0, mileage: "31,450" }
];

const monthlyMaintenanceCosts = [
  { month: "Jan", planned: 2100000, emergency: 450000, total: 2550000 },
  { month: "Feb", planned: 1850000, emergency: 680000, total: 2530000 },
  { month: "Mar", planned: 2350000, emergency: 320000, total: 2670000 },
  { month: "Apr", planned: 1950000, emergency: 580000, total: 2530000 },
  { month: "May", planned: 2200000, emergency: 390000, total: 2590000 },
  { month: "Jun", planned: 2450000, emergency: 720000, total: 3170000 }
];

const maintenanceTypes = [
  { name: "Routine Service", value: 45, color: "#10B981" },
  { name: "Repairs", value: 25, color: "#F59E0B" },
  { name: "Emergency", value: 15, color: "#EF4444" },
  { name: "Upgrades", value: 15, color: "#8B5CF6" }
];

const inventoryItems = [
  { item: "Engine Oil (5L)", stock: 45, reorderLevel: 20, status: "good", cost: "₦12,500" },
  { item: "Brake Pads Set", stock: 8, reorderLevel: 15, status: "low", cost: "₦35,000" },
  { item: "Air Filters", stock: 25, reorderLevel: 10, status: "good", cost: "₦8,500" },
  { item: "Hydraulic Fluid (20L)", stock: 3, reorderLevel: 8, status: "critical", cost: "₦45,000" },
  { item: "Tire Set (6 wheels)", stock: 12, reorderLevel: 6, status: "good", cost: "₦320,000" }
];

export default function MaintenancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending_parts": return "bg-yellow-100 text-yellow-800";
      case "inspection": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-600";
    if (health >= 75) return "text-yellow-600";
    if (health >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getStockStatus = (item: any) => {
    if (item.stock <= item.reorderLevel / 2) return "critical";
    if (item.stock <= item.reorderLevel) return "low";
    return "good";
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      case "good": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSchedule = maintenanceSchedule.filter(item => {
    const matchesSearch = item.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const filteredRepairs = activeRepairs.filter(repair => {
    const matchesSearch = repair.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repair.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || repair.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance & Repairs</h1>
          <p className="text-muted-foreground">Vehicle maintenance scheduling and repair management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Service
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 urgent, 4 routine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">₦1.05M total cost</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.1%</div>
            <p className="text-xs text-muted-foreground">+2.3% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦2.85M</div>
            <p className="text-xs text-muted-foreground">-8.5% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="repairs">Active Repairs</TabsTrigger>
          <TabsTrigger value="health">Vehicle Health</TabsTrigger>
          <TabsTrigger value="inventory">Parts Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by vehicle or maintenance type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Maintenance Schedule */}
          <div className="grid gap-4">
            {filteredSchedule.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg">{item.vehicle}</CardTitle>
                        <CardDescription>{item.type}</CardDescription>
                      </div>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{item.dueDate}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned Technician</p>
                      <p className="font-medium">{item.assignedTech}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Service</p>
                      <p className="font-medium">{item.lastService}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-medium">{item.mileage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Cost</p>
                      <p className="font-medium">{item.estimatedCost}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Reschedule
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Start Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="repairs" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by vehicle or issue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending_parts">Pending Parts</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Repairs */}
          <div className="grid gap-4">
            {filteredRepairs.map((repair) => (
              <Card key={repair.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg">{repair.vehicle}</CardTitle>
                        <CardDescription>{repair.issue}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(repair.status)}>
                        {repair.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Est. Completion</p>
                      <p className="font-medium">{repair.estimatedCompletion}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Technician</p>
                      <p className="font-medium">{repair.technician}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{repair.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cost</p>
                      <p className="font-medium">{repair.cost}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <span className="text-sm font-medium">{repair.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${repair.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Updates
                    </Button>
                    <Button size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Health Overview</CardTitle>
              <CardDescription>Current health status and upcoming maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {vehicleHealth.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{vehicle.vehicle}</p>
                        <p className="text-sm text-muted-foreground">{vehicle.mileage} km</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              vehicle.health >= 90 ? 'bg-green-500' :
                              vehicle.health >= 75 ? 'bg-yellow-500' :
                              vehicle.health >= 60 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${vehicle.health}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getHealthColor(vehicle.health)}`}>
                          {vehicle.health}%
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Next Service</p>
                      <p className="font-medium">{vehicle.nextService}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Issues</p>
                      <p className="font-medium">{vehicle.issues}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parts Inventory</CardTitle>
              <CardDescription>Stock levels and reorder notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.item}</p>
                      <p className="text-sm text-muted-foreground">Unit cost: {item.cost}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{item.stock} units</p>
                      <p className="text-sm text-muted-foreground">Reorder at {item.reorderLevel}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStockColor(getStockStatus(item))}>
                        {getStockStatus(item).toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Maintenance Costs</CardTitle>
                <CardDescription>Planned vs emergency maintenance spending</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyMaintenanceCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₦${(value as number).toLocaleString()}`, '']} />
                    <Bar dataKey="planned" fill="#10B981" name="Planned" />
                    <Bar dataKey="emergency" fill="#EF4444" name="Emergency" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Type Distribution</CardTitle>
                <CardDescription>Breakdown by maintenance category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={maintenanceTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {maintenanceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
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