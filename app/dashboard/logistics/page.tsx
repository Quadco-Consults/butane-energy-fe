'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  Truck,
  Fuel,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Navigation,
  Settings,
  Activity,
  TrendingUp,
  Calendar,
  Wrench,
  ShoppingCart,
  Route
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Mock logistics data
const mockLogisticsData = {
  fleet: {
    totalVehicles: 18,
    activeVehicles: 15,
    inMaintenance: 2,
    available: 1,
    utilizationRate: 83.3,
    avgTripDistance: 156.7,
    fuelEfficiency: 8.2
  },
  operations: {
    todayTrips: 24,
    completedTrips: 18,
    inProgress: 6,
    pendingTrips: 12,
    onTimeDeliveryRate: 92.5,
    avgTripTime: 4.2,
    totalDistance: 3760
  },
  maintenance: {
    scheduledToday: 3,
    overdue: 1,
    nextWeek: 5,
    totalCost: 2850000,
    preventiveMaintenance: 85
  },
  fuel: {
    totalConsumption: 1580,
    costPerLiter: 750,
    monthlyBudget: 1500000,
    efficiency: 8.2,
    savings: 125000
  },
  purchasing: {
    activeOrders: 8,
    pendingApproval: 3,
    deliveredThisMonth: 15,
    totalValue: 12500000
  }
};

const fleetStatusData = [
  { id: 'BTE-001', type: 'LPG Truck', status: 'active', location: 'Lagos Route', driver: 'Adebayo Ogun', fuel: 85, maintenance: 'due_soon' },
  { id: 'BTE-003', type: 'Delivery Van', status: 'maintenance', location: 'Workshop', driver: '-', fuel: 45, maintenance: 'in_progress' },
  { id: 'BTE-005', type: 'LPG Truck', status: 'active', location: 'Abuja Route', driver: 'Chioma Nwankwo', fuel: 92, maintenance: 'good' },
  { id: 'BTE-007', type: 'Service Vehicle', status: 'available', location: 'Depot', driver: '-', fuel: 78, maintenance: 'good' },
  { id: 'BTE-009', type: 'LPG Truck', status: 'active', location: 'Kano Route', driver: 'Ibrahim Yakubu', fuel: 67, maintenance: 'due_soon' }
];

const recentActivities = [
  { time: '10:30', activity: 'Vehicle BTE-001 completed delivery to Lagos Gas Station', type: 'delivery' },
  { time: '09:45', activity: 'Maintenance scheduled for BTE-003 - Engine service', type: 'maintenance' },
  { time: '09:15', activity: 'Fuel order approved - 5000L Diesel delivery', type: 'fuel' },
  { time: '08:30', activity: 'New trip assigned to BTE-005 - Abuja Industrial Zone', type: 'trip' },
  { time: '08:00', activity: 'Parts procurement order submitted for approval', type: 'procurement' }
];

const upcomingMaintenance = [
  { vehicle: 'BTE-001', type: 'Oil Change', date: '2024-11-18', priority: 'medium' },
  { vehicle: 'BTE-007', type: 'Brake Inspection', date: '2024-11-19', priority: 'high' },
  { vehicle: 'BTE-009', type: 'Tire Replacement', date: '2024-11-20', priority: 'low' },
  { vehicle: 'BTE-011', type: 'Engine Service', date: '2024-11-21', priority: 'high' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'maintenance': return 'bg-orange-100 text-orange-800';
    case 'available': return 'bg-blue-100 text-blue-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getMaintenanceColor = (status: string) => {
  switch (status) {
    case 'good': return 'bg-green-100 text-green-800';
    case 'due_soon': return 'bg-yellow-100 text-yellow-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function LogisticsDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-500" />
            Logistics Operations Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive fleet management and logistics operations control center
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/logistics/trips">
            <Button size="sm" variant="outline" className="gap-2">
              <Route className="h-4 w-4" />
              Active Trips
            </Button>
          </Link>
          <Link href="/dashboard/logistics/maintenance">
            <Button size="sm" className="gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Link href="/dashboard/logistics/trips">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Trips
              </CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockLogisticsData.operations.inProgress}</div>
              <p className="text-xs text-green-600">
                {mockLogisticsData.operations.completedTrips} completed today
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fleet Utilization
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLogisticsData.fleet.utilizationRate}%</div>
            <Progress value={mockLogisticsData.fleet.utilizationRate} className="mt-2" />
          </CardContent>
        </Card>

        <Link href="/dashboard/logistics/fuel">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fuel Efficiency
              </CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockLogisticsData.fleet.fuelEfficiency}L</div>
              <p className="text-xs text-blue-600">per 100km average</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/logistics/maintenance">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Maintenance Due
              </CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockLogisticsData.maintenance.scheduledToday}</div>
              <p className="text-xs text-orange-600">
                {mockLogisticsData.maintenance.overdue} overdue
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/logistics/stock">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                On-Time Delivery
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockLogisticsData.operations.onTimeDeliveryRate}%</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +2.5% this month
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Fleet Status & Today's Operations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              Fleet Status Overview
            </CardTitle>
            <CardDescription>
              Real-time status of all vehicles in the fleet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fleetStatusData.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">{vehicle.id}</span>
                      <span className="text-xs text-muted-foreground">{vehicle.type}</span>
                    </div>
                    <div className="flex flex-col">
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {vehicle.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">Fuel: {vehicle.fuel}%</span>
                      <div className="w-12 bg-secondary rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${vehicle.fuel > 50 ? 'bg-green-500' : vehicle.fuel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${vehicle.fuel}%` }}
                        ></div>
                      </div>
                    </div>
                    <Badge className={getMaintenanceColor(vehicle.maintenance)}>
                      {vehicle.maintenance.replace('_', ' ')}
                    </Badge>
                    {vehicle.driver !== '-' && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3" />
                        {vehicle.driver}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{mockLogisticsData.fleet.activeVehicles}</div>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{mockLogisticsData.fleet.inMaintenance}</div>
                  <p className="text-xs text-muted-foreground">Maintenance</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{mockLogisticsData.fleet.available}</div>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Operations Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Today's Operations
            </CardTitle>
            <CardDescription>
              Summary of today's logistics activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mockLogisticsData.operations.todayTrips}</div>
                  <p className="text-sm text-muted-foreground">Total Trips</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mockLogisticsData.operations.completedTrips}</div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Trip Completion Rate</span>
                  <span className="text-sm font-bold">
                    {Math.round((mockLogisticsData.operations.completedTrips / mockLogisticsData.operations.todayTrips) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(mockLogisticsData.operations.completedTrips / mockLogisticsData.operations.todayTrips) * 100}
                  className="h-2"
                />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Trip Time</span>
                  <span className="text-sm font-bold">{mockLogisticsData.operations.avgTripTime}h</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Distance</span>
                  <span className="text-sm font-bold">{mockLogisticsData.operations.totalDistance}km</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">On-Time Delivery</span>
                  <span className="text-sm font-bold text-green-600">{mockLogisticsData.operations.onTimeDeliveryRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Upcoming Maintenance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest logistics operations and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                    {activity.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.activity}</p>
                    <Badge
                      variant="outline"
                      className={
                        activity.type === 'delivery' ? 'text-green-600' :
                        activity.type === 'maintenance' ? 'text-orange-600' :
                        activity.type === 'fuel' ? 'text-blue-600' :
                        activity.type === 'trip' ? 'text-purple-600' :
                        'text-gray-600'
                      }
                    >
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Upcoming Maintenance
            </CardTitle>
            <CardDescription>
              Scheduled maintenance activities this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMaintenance.map((maintenance, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">{maintenance.vehicle}</span>
                      <span className="text-sm text-muted-foreground">{maintenance.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{new Date(maintenance.date).toLocaleDateString()}</p>
                    <Badge className={getPriorityColor(maintenance.priority)}>
                      {maintenance.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-orange-600">{mockLogisticsData.maintenance.scheduledToday}</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <div>
                  <div className="font-bold text-red-600">{mockLogisticsData.maintenance.overdue}</div>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
                <div>
                  <div className="font-bold text-blue-600">{mockLogisticsData.maintenance.nextWeek}</div>
                  <p className="text-xs text-muted-foreground">Next Week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fuel & Procurement Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fuel Management Summary */}
        <Link href="/dashboard/logistics/fuel">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-red-500" />
                Fuel Management
              </CardTitle>
              <CardDescription>
                Fuel consumption and cost analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-red-600">{mockLogisticsData.fuel.totalConsumption}L</div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-green-600">₦{(mockLogisticsData.fuel.savings / 1000).toFixed(0)}K</div>
                    <p className="text-xs text-muted-foreground">Savings</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Budget Usage</span>
                    <span>{Math.round((mockLogisticsData.fuel.totalConsumption * mockLogisticsData.fuel.costPerLiter / mockLogisticsData.fuel.monthlyBudget) * 100)}%</span>
                  </div>
                  <Progress value={(mockLogisticsData.fuel.totalConsumption * mockLogisticsData.fuel.costPerLiter / mockLogisticsData.fuel.monthlyBudget) * 100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Product Procurement Summary */}
        <Link href="/dashboard/logistics/product-purchase">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-indigo-500" />
                Product Procurement
              </CardTitle>
              <CardDescription>
                Parts and supplies procurement status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{mockLogisticsData.purchasing.activeOrders}</div>
                    <p className="text-xs text-muted-foreground">Active Orders</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{mockLogisticsData.purchasing.pendingApproval}</div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Value This Month</span>
                    <span className="font-semibold">₦{(mockLogisticsData.purchasing.totalValue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivered Orders</span>
                    <span className="font-semibold text-green-600">{mockLogisticsData.purchasing.deliveredThisMonth}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
    </DashboardLayout>
  );
}