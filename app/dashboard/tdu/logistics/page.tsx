'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Navigation,
  Fuel,
  Users,
  Calendar,
  Route,
  Timer,
  Activity,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Mock logistics data
const activeDeliveries = [
  {
    id: 'DEL-2024-001',
    orderNumber: 'TDU-2024-001',
    customer: 'Lagos Gas Station Network',
    driver: 'Adebayo Ogundimu',
    vehicle: 'BTE-001',
    route: 'Lagos → Ikeja → Victoria Island',
    status: 'in_transit',
    progress: 75,
    estimatedArrival: '2024-11-17 14:30',
    startTime: '2024-11-17 08:00',
    distance: 45.2,
    priority: 'high'
  },
  {
    id: 'DEL-2024-002',
    orderNumber: 'TDU-2024-003',
    customer: 'Abuja Industrial Zone',
    driver: 'Chioma Nwankwo',
    vehicle: 'BTE-003',
    route: 'Abuja → Garki → Wuse',
    status: 'loading',
    progress: 15,
    estimatedArrival: '2024-11-17 16:00',
    startTime: '2024-11-17 10:30',
    distance: 28.8,
    priority: 'medium'
  },
  {
    id: 'DEL-2024-003',
    orderNumber: 'TDU-2024-004',
    customer: 'Port Harcourt Terminals',
    driver: 'Emeka Okoro',
    vehicle: 'BTE-005',
    route: 'Port Harcourt → Eleme → Onne',
    status: 'delivered',
    progress: 100,
    estimatedArrival: '2024-11-17 12:00',
    startTime: '2024-11-17 06:00',
    distance: 52.1,
    priority: 'high'
  }
];

const fleetStatus = {
  totalVehicles: 15,
  activeVehicles: 12,
  inMaintenance: 2,
  available: 1,
  utilizationRate: 80,
  avgTripTime: 3.5,
  fuelEfficiency: 8.2,
  onTimeDeliveryRate: 89.5
};

const todayMetrics = {
  totalDeliveries: 8,
  completedDeliveries: 6,
  inProgress: 2,
  avgDeliveryTime: 4.2,
  totalDistance: 342.5,
  fuelConsumed: 125.8,
  customerSatisfaction: 94.2
};

const upcomingDeliveries = [
  { time: '15:00', customer: 'Kano Distribution Hub', destination: 'Kano Central', priority: 'medium' },
  { time: '16:30', customer: 'Ibadan Commercial District', destination: 'Ibadan Industrial', priority: 'low' },
  { time: '17:00', customer: 'Kaduna Energy Solutions', destination: 'Kaduna North', priority: 'high' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'in_transit': return 'bg-blue-100 text-blue-800';
    case 'loading': return 'bg-orange-100 text-orange-800';
    case 'delayed': return 'bg-red-100 text-red-800';
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

export default function TDULogisticsPage() {
  const [selectedTab, setSelectedTab] = useState('deliveries');

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-500" />
            TDU Logistics Operations
          </h1>
          <p className="text-muted-foreground">
            Real-time logistics tracking and fleet management
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Live Map
          </Button>
          <Link href="/dashboard/logistics">
            <Button size="sm" className="gap-2">
              <Route className="h-4 w-4" />
              Fleet Management
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Deliveries
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMetrics.inProgress}</div>
            <p className="text-xs text-blue-600">
              {todayMetrics.completedDeliveries} completed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fleet Utilization
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStatus.utilizationRate}%</div>
            <Progress value={fleetStatus.utilizationRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On-Time Delivery
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStatus.onTimeDeliveryRate}%</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +2.3% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customer Satisfaction
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMetrics.customerSatisfaction}%</div>
            <p className="text-xs text-green-600">Delivery satisfaction rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-500" />
            Fleet Status Overview
          </CardTitle>
          <CardDescription>
            Real-time fleet utilization and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">{fleetStatus.activeVehicles}</div>
              <p className="text-sm text-muted-foreground">Active Vehicles</p>
              <Badge className="mt-1 bg-blue-100 text-blue-800">
                {fleetStatus.totalVehicles} total
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">{fleetStatus.available}</div>
              <p className="text-sm text-muted-foreground">Available</p>
              <Badge className="mt-1 bg-green-100 text-green-800">
                Ready for dispatch
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">{fleetStatus.inMaintenance}</div>
              <p className="text-sm text-muted-foreground">In Maintenance</p>
              <Badge className="mt-1 bg-orange-100 text-orange-800">
                Scheduled service
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">{fleetStatus.fuelEfficiency}L</div>
              <p className="text-sm text-muted-foreground">Avg Fuel per 100km</p>
              <Badge className="mt-1 bg-purple-100 text-purple-800">
                Efficiency rating
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Deliveries & Upcoming Schedule */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Deliveries */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-green-500" />
                Active Deliveries
              </CardTitle>
              <CardDescription>
                Real-time tracking of ongoing deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{delivery.id}</span>
                          <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status}
                          </Badge>
                          <Badge className={getPriorityColor(delivery.priority)}>
                            {delivery.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Order: {delivery.orderNumber} • {delivery.customer}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{delivery.vehicle}</p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {delivery.driver}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {delivery.route}
                        </span>
                        <span className="text-muted-foreground">{delivery.distance}km</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>ETA: {new Date(delivery.estimatedArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <span className="text-muted-foreground">
                          Started: {new Date(delivery.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{delivery.progress}%</span>
                        </div>
                        <Progress value={delivery.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Upcoming Deliveries
            </CardTitle>
            <CardDescription>
              Scheduled deliveries for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeliveries.map((delivery, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                      {delivery.time}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{delivery.customer}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {delivery.destination}
                      </p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(delivery.priority)}>
                    {delivery.priority}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 pt-4 border-t">
              <div className="text-center text-sm text-muted-foreground">
                <p>Total scheduled: {upcomingDeliveries.length} deliveries</p>
                <p>Estimated completion: 18:30</p>
              </div>
              <Button size="sm" variant="outline" className="w-full gap-2">
                <Route className="h-4 w-4" />
                Optimize Routes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Today's Performance Summary
          </CardTitle>
          <CardDescription>
            Key logistics metrics for today's operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-blue-600 mb-2">{todayMetrics.totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">Total Deliveries</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-green-600 mb-2">{todayMetrics.completedDeliveries}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-orange-600 mb-2">{todayMetrics.avgDeliveryTime}h</div>
              <p className="text-xs text-muted-foreground">Avg Delivery Time</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-purple-600 mb-2">{todayMetrics.totalDistance}km</div>
              <p className="text-xs text-muted-foreground">Total Distance</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-red-600 mb-2">{todayMetrics.fuelConsumed}L</div>
              <p className="text-xs text-muted-foreground">Fuel Consumed</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-indigo-600 mb-2">{todayMetrics.customerSatisfaction}%</div>
              <p className="text-xs text-muted-foreground">Customer Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}