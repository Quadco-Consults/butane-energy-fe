'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  Droplets,
  Activity,
  Eye,
  MapPin,
  Building2
} from 'lucide-react';

interface Tank {
  id: string;
  name: string;
  product: 'LPG';
  capacity: number; // in kg
  currentLevel: number;
  lastReading: number;
  lowThreshold: number;
  criticalThreshold: number;
  unit: 'kg';
  temperature: number;
  pressure: number; // in PSI
  lastUpdated: string;
  dailySales: number; // Amount sold today in kg
  weeklyTrend: number; // Percentage change from last week
  purity: number; // Gas purity percentage
  location: string; // Plant/location ID
  usage: 'bulk' | 'cylinder' | 'mixed'; // Primary usage type
  cylindersSold: number; // Number of cylinders filled today
  bulkSales: number; // Bulk sales in kg today
}

interface TankVisualizationProps {
  onSale?: (tankId: string, amount: number) => void;
  showControls?: boolean;
  locationName?: string; // Optional location name for display
  userRole?: string; // User role for determining access level
  userDepartment?: string; // User department
  currentLocation?: string; // Current user's location
}

export function TankVisualization({ onSale, showControls = false, locationName, userRole, userDepartment, currentLocation }: TankVisualizationProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>(currentLocation || 'lagos-plant');

  // Check if user has multi-location access (Super Admin, Management, HQ staff)
  const hasMultiLocationAccess =
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    userRole === 'executive' ||
    userRole === 'manager' ||
    userDepartment === 'management' ||
    currentLocation === 'head-office';

  // All tanks across all locations
  const [allTanks, setAllTanks] = useState<Tank[]>([
    // LAGOS DISTRIBUTION CENTER
    {
      id: 'lagos-tank-001',
      name: 'Lagos Bulk Tank A',
      product: 'LPG',
      capacity: 30000, // 30 metric tons - largest facility
      currentLevel: 24500,
      lastReading: 25200,
      lowThreshold: 6000,
      criticalThreshold: 3000,
      unit: 'kg',
      temperature: 26,
      pressure: 148,
      lastUpdated: new Date().toISOString(),
      dailySales: 2850,
      weeklyTrend: -9.2,
      purity: 99.6,
      location: 'lagos-plant',
      usage: 'bulk',
      cylindersSold: 0,
      bulkSales: 2850
    },
    {
      id: 'lagos-tank-002',
      name: 'Lagos Cylinder Tank B',
      product: 'LPG',
      capacity: 20000,
      currentLevel: 15200,
      lastReading: 16100,
      lowThreshold: 4000,
      criticalThreshold: 2000,
      unit: 'kg',
      temperature: 28,
      pressure: 145,
      lastUpdated: new Date().toISOString(),
      dailySales: 1820,
      weeklyTrend: -7.5,
      purity: 99.7,
      location: 'lagos-plant',
      usage: 'cylinder',
      cylindersSold: 142, // High volume cylinder operations
      bulkSales: 0
    },
    {
      id: 'lagos-tank-003',
      name: 'Lagos Mixed Tank C',
      product: 'LPG',
      capacity: 25000,
      currentLevel: 18900,
      lastReading: 19500,
      lowThreshold: 5000,
      criticalThreshold: 2500,
      unit: 'kg',
      temperature: 25,
      pressure: 142,
      lastUpdated: new Date().toISOString(),
      dailySales: 1450,
      weeklyTrend: -5.8,
      purity: 99.4,
      location: 'lagos-plant',
      usage: 'mixed',
      cylindersSold: 68,
      bulkSales: 950
    },

    // KANO DISTRIBUTION HUB
    {
      id: 'kano-tank-001',
      name: 'Kano Bulk Tank A',
      product: 'LPG',
      capacity: 25000,
      currentLevel: 19800,
      lastReading: 20500,
      lowThreshold: 5000,
      criticalThreshold: 2500,
      unit: 'kg',
      temperature: 32, // Higher temperature in northern region
      pressure: 150,
      lastUpdated: new Date().toISOString(),
      dailySales: 1950,
      weeklyTrend: -6.8,
      purity: 99.5,
      location: 'kano-plant',
      usage: 'bulk',
      cylindersSold: 0,
      bulkSales: 1950
    },
    {
      id: 'kano-tank-002',
      name: 'Kano Cylinder Tank B',
      product: 'LPG',
      capacity: 15000,
      currentLevel: 8900,
      lastReading: 10200,
      lowThreshold: 3000,
      criticalThreshold: 1500,
      unit: 'kg',
      temperature: 31,
      pressure: 146,
      lastUpdated: new Date().toISOString(),
      dailySales: 980,
      weeklyTrend: -8.9,
      purity: 99.6,
      location: 'kano-plant',
      usage: 'cylinder',
      cylindersSold: 78,
      bulkSales: 0
    },
    {
      id: 'kano-tank-003',
      name: 'Kano Reserve Tank C',
      product: 'LPG',
      capacity: 18000,
      currentLevel: 12400,
      lastReading: 13100,
      lowThreshold: 3600,
      criticalThreshold: 1800,
      unit: 'kg',
      temperature: 30,
      pressure: 143,
      lastUpdated: new Date().toISOString(),
      dailySales: 650,
      weeklyTrend: -4.2,
      purity: 99.3,
      location: 'kano-plant',
      usage: 'mixed',
      cylindersSold: 35,
      bulkSales: 420
    },

    // ABUJA OPERATIONS CENTER
    {
      id: 'abuja-tank-001',
      name: 'Abuja Premium Tank A',
      product: 'LPG',
      capacity: 22000,
      currentLevel: 16800,
      lastReading: 17500,
      lowThreshold: 4400,
      criticalThreshold: 2200,
      unit: 'kg',
      temperature: 27,
      pressure: 147,
      lastUpdated: new Date().toISOString(),
      dailySales: 1240,
      weeklyTrend: -5.5,
      purity: 99.8, // Premium quality for FCT
      location: 'abuja-plant',
      usage: 'bulk',
      cylindersSold: 0,
      bulkSales: 1240
    },
    {
      id: 'abuja-tank-002',
      name: 'Abuja Retail Tank B',
      product: 'LPG',
      capacity: 18000,
      currentLevel: 13200,
      lastReading: 14000,
      lowThreshold: 3600,
      criticalThreshold: 1800,
      unit: 'kg',
      temperature: 26,
      pressure: 144,
      lastUpdated: new Date().toISOString(),
      dailySales: 1180,
      weeklyTrend: -6.2,
      purity: 99.7,
      location: 'abuja-plant',
      usage: 'cylinder',
      cylindersSold: 89,
      bulkSales: 0
    },

    // PORT HARCOURT DEPOT
    {
      id: 'portharcourt-tank-001',
      name: 'Port Harcourt Main Tank A',
      product: 'LPG',
      capacity: 28000,
      currentLevel: 21500,
      lastReading: 22800,
      lowThreshold: 5600,
      criticalThreshold: 2800,
      unit: 'kg',
      temperature: 29, // Humid coastal region
      pressure: 149,
      lastUpdated: new Date().toISOString(),
      dailySales: 2100,
      weeklyTrend: -7.8,
      purity: 99.5,
      location: 'portharcourt-plant',
      usage: 'bulk',
      cylindersSold: 0,
      bulkSales: 2100
    },
    {
      id: 'portharcourt-tank-002',
      name: 'Port Harcourt Distribution Tank B',
      product: 'LPG',
      capacity: 16000,
      currentLevel: 11900,
      lastReading: 12800,
      lowThreshold: 3200,
      criticalThreshold: 1600,
      unit: 'kg',
      temperature: 28,
      pressure: 145,
      lastUpdated: new Date().toISOString(),
      dailySales: 890,
      weeklyTrend: -5.1,
      purity: 99.6,
      location: 'portharcourt-plant',
      usage: 'mixed',
      cylindersSold: 52,
      bulkSales: 580
    }
  ]);

  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);

  // Location definitions
  const locations = [
    { id: 'lagos-plant', name: 'Lagos Distribution Center', state: 'Lagos' },
    { id: 'kano-plant', name: 'Kano Distribution Hub', state: 'Kano' },
    { id: 'abuja-plant', name: 'Abuja Operations Center', state: 'FCT Abuja' },
    { id: 'portharcourt-plant', name: 'Port Harcourt Depot', state: 'Rivers' }
  ];

  // Filter tanks based on user access and selected location
  const tanks = hasMultiLocationAccess
    ? allTanks.filter(tank => tank.location === selectedLocation)
    : allTanks.filter(tank => tank.location === (currentLocation || 'lagos-plant'));

  // Get current location details
  const getCurrentLocationName = () => {
    const location = locations.find(loc => loc.id === selectedLocation);
    return location ? `${location.name} (${location.state})` : 'Unknown Location';
  };

  // Simulate real-time tank level depletion based on sales
  useEffect(() => {
    const interval = setInterval(() => {
      setAllTanks(prevTanks =>
        prevTanks.map(tank => {
          // Simulate random sales (1-50 units every 5 seconds based on tank size and usage)
          const baseAmount = tank.usage === 'bulk' ? 25 : tank.usage === 'cylinder' ? 15 : 20;
          const saleAmount = Math.random() * baseAmount;
          const newLevel = Math.max(tank.currentLevel - saleAmount, 0);

          if (newLevel !== tank.currentLevel) {
            const newDailySales = tank.dailySales + saleAmount;

            // Update cylinder or bulk sales based on usage type
            let newCylindersSold = tank.cylindersSold;
            let newBulkSales = tank.bulkSales;

            if (tank.usage === 'cylinder') {
              newCylindersSold += Math.floor(saleAmount / 12.5); // Assume 12.5kg cylinders
            } else if (tank.usage === 'bulk') {
              newBulkSales += saleAmount;
            } else { // mixed
              const bulkPortion = saleAmount * 0.6;
              const cylinderPortion = saleAmount * 0.4;
              newBulkSales += bulkPortion;
              newCylindersSold += Math.floor(cylinderPortion / 12.5);
            }

            // Call onSale callback if provided
            if (onSale && saleAmount > 0) {
              onSale(tank.id, saleAmount);
            }

            return {
              ...tank,
              currentLevel: newLevel,
              dailySales: newDailySales,
              cylindersSold: newCylindersSold,
              bulkSales: newBulkSales,
              lastUpdated: new Date().toISOString()
            };
          }

          return tank;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [onSale]);

  const getPercentage = (tank: Tank) => (tank.currentLevel / tank.capacity) * 100;

  const getStatusColor = (tank: Tank) => {
    const percentage = getPercentage(tank);
    if (percentage <= (tank.criticalThreshold / tank.capacity) * 100) return 'text-red-600 bg-red-50';
    if (percentage <= (tank.lowThreshold / tank.capacity) * 100) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getProductColor = () => {
    return 'bg-purple-500'; // LPG color
  };

  const getProductGradient = () => {
    return 'bg-gradient-to-t from-purple-600 via-purple-500 to-purple-400'; // LPG gradient
  };

  const formatAmount = (amount: number, unit: string) => {
    return `${amount.toLocaleString()} ${unit}`;
  };

  const lowStockTanks = tanks.filter(tank => getPercentage(tank) <= (tank.lowThreshold / tank.capacity) * 100);
  const totalCapacity = tanks.reduce((sum, tank) => sum + tank.capacity, 0);
  const totalCurrent = tanks.reduce((sum, tank) => sum + tank.currentLevel, 0);
  const totalDailySales = tanks.reduce((sum, tank) => sum + tank.dailySales, 0);
  const totalCylinders = tanks.reduce((sum, tank) => sum + tank.cylindersSold, 0);
  const totalBulkSales = tanks.reduce((sum, tank) => sum + tank.bulkSales, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Capacity
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalCapacity / 1000).toFixed(0)}T
            </div>
            <p className="text-xs text-blue-600">
              {totalCapacity.toLocaleString()} kg capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Inventory
            </CardTitle>
            <Droplets className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalCurrent / 1000).toFixed(1)}T
            </div>
            <p className="text-xs text-green-600">
              {((totalCurrent / totalCapacity) * 100).toFixed(1)}% full
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cylinders Filled
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCylinders}</div>
            <p className="text-xs text-blue-600">
              Units filled today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bulk Sales
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalBulkSales / 1000).toFixed(1)}T
            </div>
            <p className="text-xs text-green-600">
              {totalBulkSales.toLocaleString()} kg today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockTanks.length}</div>
            <p className="text-xs text-red-600">
              {lowStockTanks.length > 0 ? 'Require attention' : 'All tanks normal'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Location Selector for Multi-Location Users */}
      {hasMultiLocationAccess && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Location Selection</CardTitle>
                  <CardDescription>
                    Select a location to view its tank inventory and operations
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <p className="font-medium">Viewing:</p>
                  <p className="text-muted-foreground">{getCurrentLocationName()}</p>
                </div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-64">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <SelectValue placeholder="Select location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{location.name} ({location.state})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Current Location Info for Single-Location Users */}
      {!hasMultiLocationAccess && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Current Location</p>
              <p className="text-sm text-muted-foreground">{getCurrentLocationName()}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-green-700 border-green-200">
            Location Access: Local Only
          </Badge>
        </div>
      )}

      {/* Tank Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tanks.map((tank) => {
          const percentage = getPercentage(tank);
          const statusClass = getStatusColor(tank);
          const isLowStock = percentage <= (tank.lowThreshold / tank.capacity) * 100;
          const isCritical = percentage <= (tank.criticalThreshold / tank.capacity) * 100;

          return (
            <Card
              key={tank.id}
              className={`hover:shadow-lg transition-all duration-300 ${isCritical ? 'border-red-200 shadow-red-100' : isLowStock ? 'border-orange-200 shadow-orange-100' : 'hover:shadow-md'}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{tank.name}</CardTitle>
                  <div className="flex gap-1">
                    <Badge className={getProductColor()}>
                      LPG
                    </Badge>
                    <Badge variant="outline" className={
                      tank.usage === 'bulk' ? 'border-green-200 text-green-700' :
                      tank.usage === 'cylinder' ? 'border-blue-200 text-blue-700' :
                      'border-orange-200 text-orange-700'
                    }>
                      {tank.usage}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-xs">
                  Last updated: {new Date(tank.lastUpdated).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 3D Tank Visual */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    {/* Tank Container */}
                    <div className="relative w-20 h-32 perspective-1000">
                      {/* Back face */}
                      <div className="absolute inset-0 border-2 border-gray-300 rounded-b-lg bg-gray-50 transform -translate-x-1 -translate-y-1 opacity-50"></div>

                      {/* Main tank */}
                      <div className="relative w-full h-full border-2 border-gray-300 rounded-b-lg bg-white overflow-hidden shadow-lg">
                        {/* Fuel level with animated gradient */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out ${getProductGradient()} opacity-90`}
                          style={{
                            height: `${percentage}%`,
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          {/* Liquid animation effect */}
                          <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 animate-pulse"></div>
                        </div>

                        {/* Level indicator lines */}
                        <div className="absolute left-0 right-0 top-1/4 h-px bg-gray-200"></div>
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300"></div>
                        <div className="absolute left-0 right-0 top-3/4 h-px bg-gray-200"></div>

                        {/* Tank cap */}
                        <div className="absolute -top-1 left-1 right-1 h-2 bg-gray-300 rounded-t border border-gray-400"></div>
                      </div>
                    </div>

                    {/* Percentage and Volume Display */}
                    <div className="text-center mt-3">
                      <div className="font-bold text-lg">{percentage.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">
                        {formatAmount(tank.currentLevel, tank.unit)} / {formatAmount(tank.capacity, tank.unit)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`text-center p-2 rounded-lg ${statusClass} transition-colors`}>
                  <div className="flex items-center justify-center gap-2">
                    {isCritical && <AlertTriangle className="h-4 w-4" />}
                    <span className="font-medium text-sm">
                      {isCritical ? 'CRITICAL' : isLowStock ? 'LOW STOCK' : 'NORMAL'}
                    </span>
                  </div>
                </div>

                {/* Sales and Operations Info */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Total Sales Today:</span>
                    <span className="font-medium">{formatAmount(tank.dailySales, tank.unit)}</span>
                  </div>
                  {tank.usage === 'cylinder' || tank.usage === 'mixed' ? (
                    <div className="flex justify-between">
                      <span>Cylinders Filled:</span>
                      <span className="font-medium text-blue-600">{tank.cylindersSold} units</span>
                    </div>
                  ) : null}
                  {tank.usage === 'bulk' || tank.usage === 'mixed' ? (
                    <div className="flex justify-between">
                      <span>Bulk Sales:</span>
                      <span className="font-medium text-green-600">{formatAmount(tank.bulkSales, tank.unit)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <span>Weekly Trend:</span>
                    <div className="flex items-center gap-1">
                      {tank.weeklyTrend >= 0 ? (
                        <>
                          <TrendingDown className="h-3 w-3 text-red-500" />
                          <span className="text-red-600">{Math.abs(tank.weeklyTrend)}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3 text-red-500" />
                          <span className="text-red-600">{Math.abs(tank.weeklyTrend)}%</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span>{tank.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pressure:</span>
                      <span>{tank.pressure} PSI</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Purity:</span>
                      <span>{tank.purity}%</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setSelectedTank(tank)}
                      >
                        <Eye className="h-3 w-3" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{selectedTank?.name} - Detailed View</DialogTitle>
                        <DialogDescription>
                          Complete tank information and historical data
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTank && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <label className="font-medium">Product Type</label>
                              <p>{selectedTank.product}</p>
                            </div>
                            <div>
                              <label className="font-medium">Current Level</label>
                              <p>{formatAmount(selectedTank.currentLevel, selectedTank.unit)}</p>
                            </div>
                            <div>
                              <label className="font-medium">Capacity</label>
                              <p>{formatAmount(selectedTank.capacity, selectedTank.unit)}</p>
                            </div>
                            <div>
                              <label className="font-medium">Fill Percentage</label>
                              <p>{getPercentage(selectedTank).toFixed(2)}%</p>
                            </div>
                            <div>
                              <label className="font-medium">Low Threshold</label>
                              <p>{formatAmount(selectedTank.lowThreshold, selectedTank.unit)}</p>
                            </div>
                            <div>
                              <label className="font-medium">Critical Threshold</label>
                              <p>{formatAmount(selectedTank.criticalThreshold, selectedTank.unit)}</p>
                            </div>
                            <div>
                              <label className="font-medium">Daily Sales</label>
                              <p>{formatAmount(selectedTank.dailySales, selectedTank.unit)}</p>
                            </div>
                            <div>
                              <label className="font-medium">Usage Type</label>
                              <p className="capitalize">{selectedTank.usage} Operations</p>
                            </div>
                            {(selectedTank.usage === 'cylinder' || selectedTank.usage === 'mixed') && (
                              <div>
                                <label className="font-medium">Cylinders Filled</label>
                                <p>{selectedTank.cylindersSold} units</p>
                              </div>
                            )}
                            {(selectedTank.usage === 'bulk' || selectedTank.usage === 'mixed') && (
                              <div>
                                <label className="font-medium">Bulk Sales</label>
                                <p>{formatAmount(selectedTank.bulkSales, selectedTank.unit)}</p>
                              </div>
                            )}
                            <div>
                              <label className="font-medium">Temperature</label>
                              <p>{selectedTank.temperature}°C</p>
                            </div>
                            <div>
                              <label className="font-medium">Pressure</label>
                              <p>{selectedTank.pressure} PSI</p>
                            </div>
                            <div>
                              <label className="font-medium">Purity</label>
                              <p>{selectedTank.purity}%</p>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <label className="font-medium text-sm">Status</label>
                            <div className={`mt-1 p-2 rounded ${getStatusColor(selectedTank)}`}>
                              <span className="text-sm font-medium">
                                {getPercentage(selectedTank) <= (selectedTank.criticalThreshold / selectedTank.capacity) * 100
                                  ? 'CRITICAL - Immediate refill required'
                                  : getPercentage(selectedTank) <= (selectedTank.lowThreshold / selectedTank.capacity) * 100
                                  ? 'LOW STOCK - Refill recommended'
                                  : 'NORMAL - No action required'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {isLowStock && (
                    <Button size="sm" variant="destructive" className="w-full gap-2">
                      <AlertTriangle className="h-3 w-3" />
                      {isCritical ? 'Urgent Refill' : 'Schedule Refill'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Controls for simulation */}
      {showControls && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Tank Management Controls
            </CardTitle>
            <CardDescription>
              Simulation and management controls for development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Simulate a large sale across filtered tanks
                  setAllTanks(prevTanks =>
                    prevTanks.map(tank => {
                      if (tank.location === selectedLocation) {
                        const saleAmount = 50 + Math.random() * 100;
                        return {
                          ...tank,
                          currentLevel: Math.max(tank.currentLevel - saleAmount, 0),
                          dailySales: tank.dailySales + saleAmount,
                          lastUpdated: new Date().toISOString()
                        };
                      }
                      return tank;
                    })
                  );
                }}
              >
                Simulate Large Sale
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Refill all tanks in current location to 90%
                  setAllTanks(prevTanks =>
                    prevTanks.map(tank => {
                      if (tank.location === selectedLocation) {
                        return {
                          ...tank,
                          currentLevel: tank.capacity * 0.9,
                          lastUpdated: new Date().toISOString()
                        };
                      }
                      return tank;
                    })
                  );
                }}
              >
                Refill All Tanks
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Reset daily sales for current location
                  setAllTanks(prevTanks =>
                    prevTanks.map(tank => {
                      if (tank.location === selectedLocation) {
                        return {
                          ...tank,
                          dailySales: 0,
                          cylindersSold: 0,
                          bulkSales: 0,
                          lastUpdated: new Date().toISOString()
                        };
                      }
                      return tank;
                    })
                  );
                }}
              >
                Reset Sales Counter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}