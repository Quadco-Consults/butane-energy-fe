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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Link from 'next/link';
import {
  Fuel,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Calendar,
  Truck,
  Activity,
  Plus,
  Download,
  Target,
  MapPin,
  Gauge
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Mock fuel data
const monthlyFuelData = [
  { month: 'Jan', consumption: 1420, cost: 1065000, efficiency: 8.5, budget: 1200000 },
  { month: 'Feb', consumption: 1380, cost: 1035000, efficiency: 8.3, budget: 1200000 },
  { month: 'Mar', consumption: 1550, cost: 1162500, efficiency: 8.1, budget: 1200000 },
  { month: 'Apr', consumption: 1480, cost: 1110000, efficiency: 8.4, budget: 1300000 },
  { month: 'May', consumption: 1620, cost: 1215000, efficiency: 8.0, budget: 1300000 },
  { month: 'Jun', consumption: 1590, cost: 1192500, efficiency: 8.2, budget: 1300000 },
  { month: 'Jul', consumption: 1670, cost: 1252500, efficiency: 7.9, budget: 1400000 },
  { month: 'Aug', consumption: 1580, cost: 1185000, efficiency: 8.1, budget: 1400000 },
  { month: 'Sep', consumption: 1520, cost: 1140000, efficiency: 8.3, budget: 1400000 },
  { month: 'Oct', consumption: 1450, cost: 1087500, efficiency: 8.4, budget: 1350000 },
  { month: 'Nov', consumption: 1480, cost: 1110000, efficiency: 8.2, budget: 1350000 }
];

const vehicleFuelData = [
  {
    vehicleId: 'BTE-001',
    type: 'LPG Truck',
    driver: 'Adebayo Ogun',
    currentFuel: 85,
    monthlyConsumption: 245,
    efficiency: 8.5,
    cost: 183750,
    lastRefuel: '2024-11-16',
    nextRefuel: '2024-11-18',
    status: 'optimal'
  },
  {
    vehicleId: 'BTE-003',
    type: 'Delivery Van',
    driver: 'Chioma Nwankwo',
    currentFuel: 45,
    monthlyConsumption: 180,
    efficiency: 9.2,
    cost: 135000,
    lastRefuel: '2024-11-15',
    nextRefuel: '2024-11-17',
    status: 'low'
  },
  {
    vehicleId: 'BTE-005',
    type: 'LPG Truck',
    driver: 'Ibrahim Yakubu',
    currentFuel: 92,
    monthlyConsumption: 260,
    efficiency: 8.1,
    cost: 195000,
    lastRefuel: '2024-11-17',
    nextRefuel: '2024-11-19',
    status: 'optimal'
  },
  {
    vehicleId: 'BTE-007',
    type: 'Service Vehicle',
    driver: 'Emeka Okoro',
    currentFuel: 78,
    monthlyConsumption: 120,
    efficiency: 10.5,
    cost: 90000,
    lastRefuel: '2024-11-16',
    nextRefuel: '2024-11-18',
    status: 'good'
  },
  {
    vehicleId: 'BTE-009',
    type: 'LPG Truck',
    driver: 'Fatima Aliyu',
    currentFuel: 25,
    monthlyConsumption: 275,
    efficiency: 7.8,
    cost: 206250,
    lastRefuel: '2024-11-14',
    nextRefuel: '2024-11-17',
    status: 'critical'
  }
];

const fuelStations = [
  {
    name: 'Total Energies - Victoria Island',
    location: 'Lagos',
    distance: 5.2,
    pricePerLiter: 750,
    availability: 'available',
    lastUpdated: '2024-11-17 10:30'
  },
  {
    name: 'NNPC Mega Station - Ikeja',
    location: 'Lagos',
    distance: 12.1,
    pricePerLiter: 720,
    availability: 'available',
    lastUpdated: '2024-11-17 09:45'
  },
  {
    name: 'Conoil - Garki',
    location: 'Abuja',
    distance: 3.8,
    pricePerLiter: 765,
    availability: 'limited',
    lastUpdated: '2024-11-17 08:20'
  },
  {
    name: 'Mobil - Port Harcourt',
    location: 'Port Harcourt',
    distance: 8.5,
    pricePerLiter: 745,
    availability: 'available',
    lastUpdated: '2024-11-17 11:15'
  }
];

const currentMonthStats = {
  totalConsumption: 1480,
  totalCost: 1110000,
  averageEfficiency: 8.2,
  monthlyBudget: 1350000,
  budgetUsed: 82.2,
  savings: 240000,
  criticalVehicles: 2,
  scheduledRefuels: 5
};

const getFuelStatusColor = (status: string) => {
  switch (status) {
    case 'optimal': return 'bg-green-100 text-green-800';
    case 'good': return 'bg-blue-100 text-blue-800';
    case 'low': return 'bg-yellow-100 text-yellow-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'available': return 'bg-green-100 text-green-800';
    case 'limited': return 'bg-orange-100 text-orange-800';
    case 'unavailable': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function FuelManagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('consumption');

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Fuel className="h-8 w-8 text-red-500" />
            Fuel Management System
          </h1>
          <p className="text-muted-foreground">
            Monitor fuel consumption, costs, and optimize fleet efficiency
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule Refuel
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Consumption
            </CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthStats.totalConsumption}L</div>
            <p className="text-xs text-blue-600">Avg: {currentMonthStats.averageEfficiency}L/100km</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Cost
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(currentMonthStats.totalCost / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              ₦{(currentMonthStats.savings / 1000).toFixed(0)}K saved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Budget Usage
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthStats.budgetUsed}%</div>
            <Progress value={currentMonthStats.budgetUsed} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Vehicles
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{currentMonthStats.criticalVehicles}</div>
            <p className="text-xs text-red-600">Require immediate refueling</p>
          </CardContent>
        </Card>
      </div>

      {/* Fuel Consumption Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Consumption Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Monthly Fuel Consumption
            </CardTitle>
            <CardDescription>
              Fuel consumption and cost trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyFuelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'consumption' ? `${value}L` :
                    name === 'cost' ? `₦${(value / 1000).toFixed(0)}K` :
                    name === 'efficiency' ? `${value}L/100km` :
                    `₦${(value / 1000).toFixed(0)}K`,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
                <Legend />
                <Bar dataKey="consumption" fill="#3b82f6" name="Consumption (L)" />
                <Bar dataKey="cost" fill="#ef4444" name="Cost (₦)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Fleet Efficiency Trend
            </CardTitle>
            <CardDescription>
              Average fuel efficiency over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyFuelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}L/100km`, 'Efficiency']} />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Fuel Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-purple-500" />
            Vehicle Fuel Status
          </CardTitle>
          <CardDescription>
            Individual vehicle fuel levels and consumption data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Current Fuel</TableHead>
                  <TableHead>Monthly Usage</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                  <TableHead>Last Refuel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleFuelData.map((vehicle) => (
                  <TableRow key={vehicle.vehicleId} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{vehicle.vehicleId}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{vehicle.driver}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              vehicle.currentFuel > 50 ? 'bg-green-500' :
                              vehicle.currentFuel > 25 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${vehicle.currentFuel}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{vehicle.currentFuel}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{vehicle.monthlyConsumption}L</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{vehicle.efficiency}L/100km</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        ₦{(vehicle.cost / 1000).toFixed(0)}K
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(vehicle.lastRefuel).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Next: {new Date(vehicle.nextRefuel).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getFuelStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {vehicle.status === 'critical' || vehicle.status === 'low' ? (
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Refuel Now
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            Schedule
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Fuel Stations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            Nearby Fuel Stations
          </CardTitle>
          <CardDescription>
            Available fuel stations with pricing and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {fuelStations.map((station, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{station.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {station.location} • {station.distance}km
                    </p>
                  </div>
                  <Badge className={getAvailabilityColor(station.availability)}>
                    {station.availability}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price per Liter:</span>
                    <span className="font-semibold">₦{station.pricePerLiter}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated: {new Date(station.lastUpdated).toLocaleString()}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="w-full mt-3"
                  variant={station.availability === 'available' ? 'default' : 'outline'}
                  disabled={station.availability === 'unavailable'}
                >
                  {station.availability === 'available' ? 'Navigate' : 'Limited Supply'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fuel Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Monthly Budget Analysis
          </CardTitle>
          <CardDescription>
            Fuel budget tracking and cost optimization insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                ₦{(currentMonthStats.monthlyBudget / 1000000).toFixed(1)}M
              </div>
              <p className="text-sm text-muted-foreground">Monthly Budget</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">
                Allocated Budget
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                ₦{(currentMonthStats.totalCost / 1000000).toFixed(1)}M
              </div>
              <p className="text-sm text-muted-foreground">Amount Spent</p>
              <Badge className="mt-2 bg-orange-100 text-orange-800">
                {currentMonthStats.budgetUsed}% Used
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                ₦{(currentMonthStats.savings / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground">Cost Savings</p>
              <Badge className="mt-2 bg-green-100 text-green-800">
                Efficiency Gains
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}