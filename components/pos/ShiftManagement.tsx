'use client';

import { useState, useEffect } from 'react';
import { POSShift } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  DollarSign,
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  LogOut,
  LogIn,
  Banknote,
  CreditCard,
  Smartphone
} from 'lucide-react';

interface ShiftManagementProps {
  currentShift?: POSShift | null;
  onShiftStart?: (shift: POSShift) => void;
  onShiftEnd?: () => void;
  onClose: () => void;
}

export function ShiftManagement({
  currentShift,
  onShiftStart,
  onShiftEnd,
  onClose
}: ShiftManagementProps) {
  const { user } = useAuth();
  const [startingCash, setStartingCash] = useState('50000');
  const [endingCash, setEndingCash] = useState('');
  const [tillNumber, setTillNumber] = useState('TILL-01');
  const [notes, setNotes] = useState('');
  const [showStartShift, setShowStartShift] = useState(!currentShift);
  const [showEndShift, setShowEndShift] = useState(false);

  // Calculate expected cash for shift end
  const expectedCash = currentShift
    ? currentShift.startingCash + currentShift.cashSales - (currentShift.deposits || 0) + (currentShift.withdrawals || 0)
    : 0;

  const overShort = currentShift && endingCash
    ? parseFloat(endingCash) - expectedCash
    : 0;

  const handleStartShift = () => {
    const newShift: POSShift = {
      id: `shift-${Date.now()}`,
      shiftNumber: `SH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      cashierId: user?.id || 'cashier-001',
      cashierName: user?.name || 'Current Cashier',
      plantId: user?.plantAccess?.[0] || 'kano-plant',
      tillNumber,
      startTime: new Date().toISOString(),
      status: 'open',
      startingCash: parseFloat(startingCash),
      totalSales: 0,
      totalTransactions: 0,
      cashSales: 0,
      cardSales: 0,
      transferSales: 0,
      creditSales: 0,
      refunds: 0,
      voids: 0,
      overShort: 0,
      notes
    };

    onShiftStart?.(newShift);
    onClose();
  };

  const handleEndShift = () => {
    if (currentShift && onShiftEnd) {
      // In a real app, this would save the shift data to the backend
      const endedShift: POSShift = {
        ...currentShift,
        endTime: new Date().toISOString(),
        status: 'closed',
        endingCash: parseFloat(endingCash),
        overShort,
        notes: notes || currentShift.notes
      };

      // Generate end-of-shift report
      generateShiftReport(endedShift);

      onShiftEnd();
      onClose();
    }
  };

  const generateShiftReport = (shift: POSShift) => {
    // In a real app, this would generate a proper report
    const report = `
SHIFT REPORT
Shift: ${shift.shiftNumber}
Cashier: ${shift.cashierName}
Date: ${new Date(shift.startTime).toLocaleDateString()}
Time: ${new Date(shift.startTime).toLocaleTimeString()} - ${shift.endTime ? new Date(shift.endTime).toLocaleTimeString() : 'N/A'}

SALES SUMMARY:
Total Sales: ₦${shift.totalSales.toLocaleString()}
Total Transactions: ${shift.totalTransactions}
Average Transaction: ₦${(shift.totalSales / Math.max(shift.totalTransactions, 1)).toFixed(2)}

PAYMENT BREAKDOWN:
Cash: ₦${shift.cashSales.toLocaleString()}
Card: ₦${shift.cardSales.toLocaleString()}
Transfer: ₦${shift.transferSales.toLocaleString()}
Credit: ₦${shift.creditSales.toLocaleString()}

CASH RECONCILIATION:
Starting Cash: ₦${shift.startingCash.toLocaleString()}
Cash Sales: ₦${shift.cashSales.toLocaleString()}
Expected Cash: ₦${(shift.startingCash + shift.cashSales).toLocaleString()}
Ending Cash: ₦${shift.endingCash?.toLocaleString() || 'N/A'}
Over/Short: ₦${shift.overShort.toLocaleString()}
`;

    console.log('Shift Report:', report);
    alert('Shift ended successfully! Report generated.');
  };

  if (showStartShift || !currentShift) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Start New Shift
            </DialogTitle>
            <DialogDescription>
              Enter the starting cash amount and till information to begin your shift.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="tillNumber">Till Number</Label>
              <Input
                id="tillNumber"
                value={tillNumber}
                onChange={(e) => setTillNumber(e.target.value)}
                placeholder="TILL-01"
              />
            </div>

            <div>
              <Label htmlFor="startingCash">Starting Cash Amount (₦)</Label>
              <Input
                id="startingCash"
                type="number"
                value={startingCash}
                onChange={(e) => setStartingCash(e.target.value)}
                placeholder="50000"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes for this shift..."
                rows={3}
              />
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="text-sm space-y-1">
                  <p><strong>Cashier:</strong> {user?.name || 'Current User'}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleStartShift}>
              <Clock className="h-4 w-4 mr-2" />
              Start Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Shift Management - {currentShift?.shiftNumber}
          </DialogTitle>
          <DialogDescription>
            View shift details and manage shift operations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Shift Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Sales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{currentShift.totalSales.toLocaleString()}</div>
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
                    ? (currentShift.totalSales / currentShift.totalTransactions).toFixed(0)
                    : '0'
                  }
                </div>
                <p className="text-xs text-blue-600">Per transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cash on Hand
                </CardTitle>
                <Banknote className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₦{(currentShift.startingCash + currentShift.cashSales).toLocaleString()}
                </div>
                <p className="text-xs text-orange-600">Expected total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Shift Duration
                </CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor((new Date().getTime() - new Date(currentShift.startTime).getTime()) / (1000 * 60 * 60))}h
                </div>
                <p className="text-xs text-purple-600">
                  Since {new Date(currentShift.startTime).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Payment Method Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    <Banknote className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cash</p>
                    <p className="font-semibold">₦{currentShift.cashSales.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Card</p>
                    <p className="font-semibold">₦{currentShift.cardSales.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transfer</p>
                    <p className="font-semibold">₦{currentShift.transferSales.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credit</p>
                    <p className="font-semibold">₦{currentShift.creditSales.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shift Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowEndShift(true)}
              className="flex-1"
            >
              <LogOut className="h-4 w-4 mr-2" />
              End Shift
            </Button>

            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Print Report
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>

        {/* End Shift Dialog */}
        {showEndShift && (
          <Dialog open={showEndShift} onOpenChange={setShowEndShift}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <LogOut className="h-5 w-5" />
                  End Shift
                </DialogTitle>
                <DialogDescription>
                  Count your till and enter the ending cash amount to complete the shift.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Starting Cash:</span>
                        <span>₦{currentShift.startingCash.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cash Sales:</span>
                        <span>₦{currentShift.cashSales.toLocaleString()}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Expected Cash:</span>
                        <span>₦{expectedCash.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <Label htmlFor="endingCash">Actual Cash Count (₦)</Label>
                  <Input
                    id="endingCash"
                    type="number"
                    value={endingCash}
                    onChange={(e) => setEndingCash(e.target.value)}
                    placeholder="Enter actual cash amount"
                  />
                </div>

                {endingCash && (
                  <Card className={overShort === 0 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        {overShort === 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        )}
                        <div>
                          <p className="font-semibold">
                            {overShort === 0 ? 'Perfect Balance' : overShort > 0 ? 'Overage' : 'Shortage'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {overShort === 0 ? 'Cash count matches expected amount' : `₦${Math.abs(overShort).toLocaleString()} ${overShort > 0 ? 'over' : 'short'}`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <Label htmlFor="endNotes">End of Shift Notes (Optional)</Label>
                  <Textarea
                    id="endNotes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any issues, observations, or notes for the next shift..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEndShift(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEndShift} disabled={!endingCash}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Shift
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}