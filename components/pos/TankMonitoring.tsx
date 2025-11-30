'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Package,
  Gauge,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Settings,
  Activity,
  Droplets
} from 'lucide-react';

interface TankData {
  id: string;
  name: string;
  product: 'LPG';
  capacity: number; // in kg
  currentLevel: number; // in kg
  lastReading: number;
  currentReading: number;
  variance: number;
  lowThreshold: number;
  criticalThreshold: number;
  lastUpdated: string;
  meterReading: {
    opening: number;
    current: number;
    sold: number;
  };
  temperature: number;
  pressure: number; // in PSI
  purity: number; // Gas purity percentage
}

interface TankMonitoringProps {
  open: boolean;
  onClose: () => void;
}

export function TankMonitoring({ open, onClose }: TankMonitoringProps) {
  const [selectedTank, setSelectedTank] = useState<string | null>(null);
  const [showMeterReading, setShowMeterReading] = useState(false);
  const [newReading, setNewReading] = useState('');

  // Mock LPG tank data based on the PetroSoft interface
  const [tanks, setTanks] = useState<TankData[]>([
    {
      id: 'tank-001',
      name: 'LPG Tank A',
      product: 'LPG',
      capacity: 15000, // 15 metric tons
      currentLevel: 12400,
      lastReading: 12650,
      currentReading: 12400,
      variance: -250,
      lowThreshold: 3000, // 20%
      criticalThreshold: 1500, // 10%
      lastUpdated: new Date().toISOString(),
      meterReading: {
        opening: 125430,
        current: 126750,
        sold: 850
      },
      temperature: 25, // Celsius
      pressure: 145, // PSI
      purity: 99.5
    },
    {
      id: 'tank-002',
      name: 'LPG Tank B',
      product: 'LPG',
      capacity: 15000,
      currentLevel: 11200,
      lastReading: 11500,
      currentReading: 11200,
      variance: -300,
      lowThreshold: 3000,
      criticalThreshold: 1500,
      lastUpdated: new Date().toISOString(),
      meterReading: {
        opening: 98760,
        current: 99980,
        sold: 720
      },
      temperature: 27,
      pressure: 142,
      purity: 99.7
    },
    {
      id: 'tank-003',
      name: 'LPG Tank C',
      product: 'LPG',
      capacity: 20000, // 20 metric tons
      currentLevel: 4800,
      lastReading: 5200,
      currentReading: 4800,
      variance: -400,
      lowThreshold: 4000,
      criticalThreshold: 2000,
      lastUpdated: new Date().toISOString(),
      meterReading: {
        opening: 87250,
        current: 87690,
        sold: 950
      },
      temperature: 24,
      pressure: 138,
      purity: 99.3
    },
    {
      id: 'tank-004',
      name: 'LPG Tank D',
      product: 'LPG',
      capacity: 10000, // 10 metric tons
      currentLevel: 2100,
      lastReading: 2800,
      currentReading: 2100,
      variance: -700,
      lowThreshold: 2000,
      criticalThreshold: 1000,
      lastUpdated: new Date().toISOString(),
      meterReading: {
        opening: 45230,
        current: 45880,
        sold: 420
      },
      temperature: 26,
      pressure: 135,
      purity: 99.6
    }
  ]);

  const getPercentage = (tank: TankData) => (tank.currentLevel / tank.capacity) * 100;

  const getStatusColor = (tank: TankData) => {
    const percentage = getPercentage(tank);
    if (percentage <= (tank.criticalThreshold / tank.capacity) * 100) return 'text-red-600 bg-red-100';
    if (percentage <= (tank.lowThreshold / tank.capacity) * 100) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getProductColor = () => {
    return 'bg-purple-500'; // LPG color
  };

  const updateMeterReading = (tankId: string, reading: number) => {
    setTanks(prevTanks =>
      prevTanks.map(tank =>
        tank.id === tankId
          ? {
              ...tank,
              lastReading: tank.currentReading,
              currentReading: reading,
              variance: reading - tank.currentReading,
              currentLevel: reading,
              lastUpdated: new Date().toISOString()
            }
          : tank
      )
    );
    setShowMeterReading(false);
    setNewReading('');
    setSelectedTank(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            LPG Tank Monitoring & Inventory
          </DialogTitle>
          <DialogDescription>
            Real-time LPG tank levels, meter readings, and inventory management
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tank Overview Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tanks.map((tank) => {
              const percentage = getPercentage(tank);
              const statusClass = getStatusColor(tank);

              return (
                <Card key={tank.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tank.name}</CardTitle>
                      <Badge className={getProductColor()}>
                        LPG
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tank Visual */}
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className="w-16 h-24 border-2 border-gray-300 rounded-b-lg bg-gray-100 relative overflow-hidden">
                          <div
                            className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${getProductColor()} opacity-80`}
                            style={{ height: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-center mt-2">
                          <p className="font-bold text-lg">{percentage.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">
                            {tank.currentLevel.toLocaleString()} / {tank.capacity.toLocaleString()} kg
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`text-center p-2 rounded-lg ${statusClass}`}>
                      <p className="font-medium">
                        {percentage <= (tank.criticalThreshold / tank.capacity) * 100 ? 'CRITICAL' :
                         percentage <= (tank.lowThreshold / tank.capacity) * 100 ? 'LOW' : 'NORMAL'}
                      </p>
                    </div>

                    {/* Meter Reading */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Opening:</span>
                        <span>{tank.meterReading.opening.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current:</span>
                        <span>{tank.meterReading.current.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Sold Today:</span>
                        <span>{tank.meterReading.sold.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Variance:</span>
                        <span className={tank.variance < 0 ? 'text-red-600' : 'text-green-600'}>
                          {tank.variance > 0 ? '+' : ''}{tank.variance}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => {
                          setSelectedTank(tank.id);
                          setShowMeterReading(true);
                        }}
                      >
                        <Gauge className="h-4 w-4" />
                        Update Reading
                      </Button>

                      {percentage <= (tank.lowThreshold / tank.capacity) * 100 && (
                        <Button size="sm" variant="destructive" className="w-full gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Reorder Alert
                        </Button>
                      )}
                    </div>

                    {/* Additional Info */}
                    <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
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
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>{new Date(tank.lastUpdated).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Capacity</p>
                    <p className="text-2xl font-bold">
                      {tanks.reduce((sum, tank) => sum + tank.capacity, 0).toLocaleString()} kg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Inventory</p>
                    <p className="text-2xl font-bold">
                      {tanks.reduce((sum, tank) => sum + tank.currentLevel, 0).toLocaleString()} kg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Sales</p>
                    <p className="text-2xl font-bold">
                      {tanks.reduce((sum, tank) => sum + tank.meterReading.sold, 0).toLocaleString()} kg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Low/Critical Tanks</p>
                    <p className="text-2xl font-bold">
                      {tanks.filter(tank =>
                        getPercentage(tank) <= (tank.lowThreshold / tank.capacity) * 100
                      ).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh All Readings
          </Button>
        </DialogFooter>

        {/* Meter Reading Update Dialog */}
        {showMeterReading && selectedTank && (
          <Dialog open={showMeterReading} onOpenChange={setShowMeterReading}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Meter Reading</DialogTitle>
                <DialogDescription>
                  Enter the new meter reading for {tanks.find(t => t.id === selectedTank)?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Current Reading: {tanks.find(t => t.id === selectedTank)?.currentReading.toLocaleString()}</Label>
                </div>
                <div>
                  <Label htmlFor="newReading">New Reading</Label>
                  <Input
                    id="newReading"
                    type="number"
                    value={newReading}
                    onChange={(e) => setNewReading(e.target.value)}
                    placeholder="Enter new meter reading"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowMeterReading(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => updateMeterReading(selectedTank, parseFloat(newReading))}
                  disabled={!newReading}
                >
                  Update Reading
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}