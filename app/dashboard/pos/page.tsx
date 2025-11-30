'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { POSInterface } from '@/components/pos/POSInterface';
import { ShiftManagement } from '@/components/pos/ShiftManagement';
import { POSShift } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Store,
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Fuel
} from 'lucide-react';

export default function POSPage() {
  const { user } = useAuth();
  const [currentShift, setCurrentShift] = useState<POSShift | null>(null);
  const [showShiftManager, setShowShiftManager] = useState(false);

  // Mock current shift data
  useEffect(() => {
    // In a real app, this would load from API
    const mockShift: POSShift = {
      id: 'shift-001',
      shiftNumber: 'SH-2024-001',
      cashierId: user?.id || 'cashier-001',
      cashierName: user?.name || 'Current Cashier',
      plantId: user?.plantAccess?.[0] || 'kano-plant',
      tillNumber: 'TILL-01',
      startTime: new Date().toISOString(),
      status: 'open',
      startingCash: 50000,
      totalSales: 245000,
      totalTransactions: 18,
      cashSales: 120000,
      cardSales: 85000,
      transferSales: 40000,
      creditSales: 0,
      refunds: 0,
      voids: 0,
      overShort: 0
    };
    setCurrentShift(mockShift);
  }, [user]);

  if (!currentShift) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="w-96">
            <CardHeader className="text-center">
              <Store className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>No Active Shift</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You need to start a shift before using the POS system.
              </p>
              <Button onClick={() => setShowShiftManager(true)} className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Start Shift
              </Button>
            </CardContent>
          </Card>
          {showShiftManager && (
            <ShiftManagement
              onShiftStart={setCurrentShift}
              onClose={() => setShowShiftManager(false)}
            />
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Shift Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Store className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Butane Energy POS</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Shift {currentShift.shiftNumber}
                </Badge>
                <span>•</span>
                <span>Till: {currentShift.tillNumber}</span>
                <span>•</span>
                <span>Cashier: {currentShift.cashierName}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShiftManager(true)}
            >
              <Clock className="h-4 w-4 mr-2" />
              Manage Shift
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Shift Sales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(currentShift.totalSales / 1000).toFixed(0)}K</div>
              <p className="text-xs text-green-600">
                {currentShift.totalTransactions} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Sale
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{currentShift.totalTransactions > 0
                  ? (currentShift.totalSales / currentShift.totalTransactions / 1000).toFixed(1)
                  : '0'
                }K
              </div>
              <p className="text-xs text-blue-600">Per transaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cash on Hand
              </CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{((currentShift.startingCash + currentShift.cashSales) / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-orange-600">Including starting cash</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Shift Status
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  {currentShift.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Started {new Date(currentShift.startTime).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main POS Interface */}
        <POSInterface
          currentShift={currentShift}
          onShiftUpdate={setCurrentShift}
        />

        {/* Shift Management Modal */}
        {showShiftManager && (
          <ShiftManagement
            currentShift={currentShift}
            onShiftStart={setCurrentShift}
            onShiftEnd={() => setCurrentShift(null)}
            onClose={() => setShowShiftManager(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}