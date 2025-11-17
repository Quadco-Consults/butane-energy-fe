"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Truck, CheckCircle, Clock, XCircle, Circle, Navigation, Eye, ExternalLink, Calendar, Edit } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import DashboardLayout from '@/components/DashboardLayout';

// Mock data
const activeTrips = [
  {
    id: "TRP-001",
    vehicle: "BT-001",
    driver: "John Adeyemi",
    route: "Lagos → Abuja",
    startTime: "06:00",
    estimatedArrival: "14:30",
    progress: 65,
    status: "in_transit",
    cargo: "LPG Cylinders - 500 units",
    distance: "652 km"
  },
  {
    id: "TRP-002",
    vehicle: "BT-003",
    driver: "Sarah Okafor",
    route: "Abuja → Port Harcourt",
    startTime: "08:15",
    estimatedArrival: "16:45",
    progress: 45,
    status: "in_transit",
    cargo: "Butane Gas - 2000L",
    distance: "485 km"
  },
  {
    id: "TRP-003",
    vehicle: "BT-007",
    driver: "Ahmed Hassan",
    route: "Kano → Kaduna",
    startTime: "09:30",
    estimatedArrival: "12:00",
    progress: 80,
    status: "delayed",
    cargo: "Equipment Parts",
    distance: "180 km"
  }
];

const tripHistory = [
  {
    id: "TRP-045",
    vehicle: "BT-002",
    driver: "Michael Obi",
    route: "Lagos → Ibadan",
    completedAt: "2025-11-16",
    duration: "3h 45m",
    status: "completed",
    fuelUsed: "45L",
    distance: "128 km"
  },
  {
    id: "TRP-044",
    vehicle: "BT-005",
    driver: "Grace Eze",
    route: "Abuja → Lokoja",
    completedAt: "2025-11-15",
    duration: "2h 30m",
    status: "completed",
    fuelUsed: "32L",
    distance: "95 km"
  },
  {
    id: "TRP-043",
    vehicle: "BT-001",
    driver: "John Adeyemi",
    route: "Port Harcourt → Aba",
    completedAt: "2025-11-15",
    duration: "1h 15m",
    status: "completed",
    fuelUsed: "18L",
    distance: "55 km"
  }
];

const monthlyTripData = [
  { month: "Jan", trips: 145, distance: 18500, fuel: 2100 },
  { month: "Feb", trips: 132, distance: 16800, fuel: 1950 },
  { month: "Mar", trips: 168, distance: 21200, fuel: 2400 },
  { month: "Apr", trips: 159, distance: 19800, fuel: 2250 },
  { month: "May", trips: 174, distance: 22100, fuel: 2500 },
  { month: "Jun", trips: 161, distance: 20400, fuel: 2300 }
];

const routePerformance = [
  { route: "Lagos-Abuja", trips: 45, avgTime: "8h 30m", efficiency: 92 },
  { route: "Abuja-Kano", trips: 38, avgTime: "6h 15m", efficiency: 88 },
  { route: "Lagos-Port Harcourt", trips: 52, avgTime: "7h 45m", efficiency: 85 },
  { route: "Abuja-Lokoja", trips: 29, avgTime: "2h 30m", efficiency: 94 }
];

const tripStatusData = [
  { name: "Completed", value: 245, color: "#10B981" },
  { name: "In Transit", value: 18, color: "#F59E0B" },
  { name: "Delayed", value: 5, color: "#EF4444" },
  { name: "Cancelled", value: 3, color: "#6B7280" }
];

export default function TripsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_transit": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "delayed": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_transit": return <Truck className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "delayed": return <Clock className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const filteredTrips = activeTrips.filter(trip => {
    const matchesSearch = trip.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trip Management</h1>
          <p className="text-muted-foreground">Monitor and manage vehicle trips and routes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Trip
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+15% from avg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847 km</div>
            <p className="text-xs text-muted-foreground">Today's coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+1.2% this week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Trips</TabsTrigger>
          <TabsTrigger value="history">Trip History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="routes">Route Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search trips by vehicle, driver, or route..."
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
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Trips */}
          <div className="grid gap-4">
            {filteredTrips.map((trip) => (
              <Card key={trip.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg">{trip.id}</CardTitle>
                        <CardDescription>{trip.route}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(trip.status)}>
                        {getStatusIcon(trip.status)}
                        <span className="ml-1 capitalize">{trip.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Track
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle & Driver</p>
                      <p className="font-medium">{trip.vehicle}</p>
                      <p className="text-sm">{trip.driver}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timing</p>
                      <p className="font-medium">Started: {trip.startTime}</p>
                      <p className="text-sm">ETA: {trip.estimatedArrival}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cargo & Distance</p>
                      <p className="font-medium">{trip.cargo}</p>
                      <p className="text-sm">{trip.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${trip.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{trip.progress}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Completed Trips</CardTitle>
              <CardDescription>Trip history and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tripHistory.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(trip.status)}>
                        {getStatusIcon(trip.status)}
                        <span className="ml-1 capitalize">{trip.status}</span>
                      </Badge>
                      <div>
                        <p className="font-medium">{trip.id}</p>
                        <p className="text-sm text-muted-foreground">{trip.route}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{trip.vehicle} • {trip.driver}</p>
                      <p className="text-sm text-muted-foreground">{trip.completedAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{trip.duration}</p>
                      <p className="text-sm text-muted-foreground">{trip.distance} • {trip.fuelUsed}</p>
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trip Trends</CardTitle>
                <CardDescription>Trips completed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTripData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="trips" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trip Status Distribution</CardTitle>
                <CardDescription>Current month breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tripStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {tripStatusData.map((entry, index) => (
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
                <CardTitle>Distance & Fuel Trends</CardTitle>
                <CardDescription>Operational efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTripData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="distance" stroke="#10B981" name="Distance (km)" />
                    <Line type="monotone" dataKey="fuel" stroke="#F59E0B" name="Fuel (L)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Performance Analysis</CardTitle>
              <CardDescription>Efficiency metrics by route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routePerformance.map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{route.route}</p>
                      <p className="text-sm text-muted-foreground">{route.trips} trips completed</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{route.avgTime}</p>
                      <p className="text-sm text-muted-foreground">Average time</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${route.efficiency}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{route.efficiency}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  );
}