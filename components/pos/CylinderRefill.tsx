'use client';

import { useState } from 'react';
import { POSProduct, CustomerAccount } from '@/lib/types';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Scale,
  Package,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calculator,
  Timer,
  ThermometerSun
} from 'lucide-react';

interface CylinderRefillDetails {
  cylinderType: string;
  cylinderCapacity: number;
  cylinderCondition: 'good' | 'fair' | 'needs_inspection';
  emptyWeight: number;
  filledWeight: number;
  gasWeight: number;
  pricePerKg: number;
  totalPrice: number;
  safetyCheck: boolean;
  valveCheck: boolean;
  leakTest: boolean;
  operatorId: string;
}

interface CylinderRefillProps {
  open: boolean;
  onClose: () => void;
  onRefill: (details: CylinderRefillDetails, product: POSProduct, gasWeight: number) => void;
  customer?: CustomerAccount | null;
}

export function CylinderRefill({ open, onClose, onRefill, customer }: CylinderRefillProps) {
  const [cylinderType, setCylinderType] = useState('');
  const [cylinderCapacity, setCylinderCapacity] = useState<number>(0);
  const [emptyWeight, setEmptyWeight] = useState('');
  const [filledWeight, setFilledWeight] = useState('');
  const [cylinderCondition, setCylinderCondition] = useState<'good' | 'fair' | 'needs_inspection'>('good');
  const [safetyCheck, setSafetyCheck] = useState(false);
  const [valveCheck, setValveCheck] = useState(false);
  const [leakTest, setLeakTest] = useState(false);

  // Standard LPG pricing per kg
  const pricePerKg = 800; // ₦800 per kg

  // Common cylinder types with their typical empty weights
  const cylinderTypes = [
    { type: '3kg Cylinder', capacity: 3, emptyWeight: 3.5 },
    { type: '6kg Cylinder', capacity: 6, emptyWeight: 5.2 },
    { type: '12.5kg Cylinder', capacity: 12.5, emptyWeight: 13.8 },
    { type: '15kg Cylinder', capacity: 15, emptyWeight: 16.5 },
    { type: '25kg Cylinder', capacity: 25, emptyWeight: 27.0 },
    { type: '45kg Cylinder', capacity: 45, emptyWeight: 48.5 },
    { type: '50kg Cylinder', capacity: 50, emptyWeight: 54.0 }
  ];

  const handleCylinderTypeChange = (selectedType: string) => {
    setCylinderType(selectedType);
    const cylinder = cylinderTypes.find(c => c.type === selectedType);
    if (cylinder) {
      setCylinderCapacity(cylinder.capacity);
      setEmptyWeight(cylinder.emptyWeight.toString());
    }
  };

  const calculateGasWeight = () => {
    const empty = parseFloat(emptyWeight) || 0;
    const filled = parseFloat(filledWeight) || 0;
    return Math.max(filled - empty, 0);
  };

  const gasWeight = calculateGasWeight();
  const totalPrice = gasWeight * pricePerKg;
  const fillPercentage = cylinderCapacity > 0 ? (gasWeight / cylinderCapacity) * 100 : 0;

  const canProceed = () => {
    return (
      cylinderType &&
      parseFloat(emptyWeight) > 0 &&
      parseFloat(filledWeight) > 0 &&
      gasWeight > 0 &&
      gasWeight <= cylinderCapacity &&
      safetyCheck &&
      valveCheck &&
      leakTest &&
      cylinderCondition !== 'needs_inspection'
    );
  };

  const handleRefill = () => {
    if (!canProceed()) return;

    const refillDetails: CylinderRefillDetails = {
      cylinderType,
      cylinderCapacity,
      cylinderCondition,
      emptyWeight: parseFloat(emptyWeight),
      filledWeight: parseFloat(filledWeight),
      gasWeight,
      pricePerKg,
      totalPrice,
      safetyCheck,
      valveCheck,
      leakTest,
      operatorId: 'current-operator'
    };

    const product: POSProduct = {
      id: 'lpg-refill',
      name: `LPG Refill - ${cylinderType}`,
      price: totalPrice,
      category: 'refill',
      unit: 'kg',
      inStock: true,
      quantity: 1000, // Available LPG in tank
      image: '/images/lpg-refill.png'
    };

    onRefill(refillDetails, product, gasWeight);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setCylinderType('');
    setCylinderCapacity(0);
    setEmptyWeight('');
    setFilledWeight('');
    setCylinderCondition('good');
    setSafetyCheck(false);
    setValveCheck(false);
    setLeakTest(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            LPG Cylinder Refill Service
          </DialogTitle>
          <DialogDescription>
            Fill customer-owned cylinders by weight measurement
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Customer & Cylinder Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                {customer ? (
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {customer.name}</div>
                    <div><strong>Phone:</strong> {customer.phone}</div>
                    <div><strong>Type:</strong> {customer.type}</div>
                    <Badge className="mt-2">{customer.accountStatus}</Badge>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Walk-in customer</p>
                )}
              </CardContent>
            </Card>

            {/* Cylinder Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cylinder Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Cylinder Type</Label>
                  <Select value={cylinderType} onValueChange={handleCylinderTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cylinder type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cylinderTypes.map((cylinder) => (
                        <SelectItem key={cylinder.type} value={cylinder.type}>
                          <div className="flex items-center justify-between w-full">
                            <span>{cylinder.type}</span>
                            <span className="text-muted-foreground ml-2">
                              (Empty: {cylinder.emptyWeight}kg)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Capacity (kg)</Label>
                    <Input
                      type="number"
                      value={cylinderCapacity}
                      onChange={(e) => setCylinderCapacity(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label>Cylinder Condition</Label>
                    <Select value={cylinderCondition} onValueChange={(value: any) => setCylinderCondition(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good Condition</SelectItem>
                        <SelectItem value="fair">Fair Condition</SelectItem>
                        <SelectItem value="needs_inspection">Needs Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Checks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Safety Inspection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={safetyCheck}
                    onChange={(e) => setSafetyCheck(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Visual safety inspection completed</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={valveCheck}
                    onChange={(e) => setValveCheck(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Valve and fitting check passed</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={leakTest}
                    onChange={(e) => setLeakTest(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Leak test performed</span>
                </label>

                {cylinderCondition === 'needs_inspection' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Cylinder requires inspection before filling
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Weight Measurement & Pricing */}
          <div className="space-y-6">
            {/* Weight Measurement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Weight Measurement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Empty Weight (kg)</Label>
                    <Input
                      type="number"
                      value={emptyWeight}
                      onChange={(e) => setEmptyWeight(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Weight before filling
                    </p>
                  </div>
                  <div>
                    <Label>Filled Weight (kg)</Label>
                    <Input
                      type="number"
                      value={filledWeight}
                      onChange={(e) => setFilledWeight(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Weight after filling
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Gas Weight:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {gasWeight.toFixed(2)} kg
                    </span>
                  </div>

                  {cylinderCapacity > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fill Percentage:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              fillPercentage > 100 ? 'bg-red-500' :
                              fillPercentage > 90 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${
                          fillPercentage > 100 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {fillPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {fillPercentage > 100 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Warning: Overfilled! Check measurements.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Calculation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Pricing Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Price per kg:</span>
                    <span>₦{pricePerKg.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas weight:</span>
                    <span>{gasWeight.toFixed(2)} kg</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600">
                      ₦{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {gasWeight > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Cost per kg:</span>
                      <span>₦{pricePerKg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cylinder type:</span>
                      <span>{cylinderType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span>Customer Cylinder Refill</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Operation Summary */}
            {gasWeight > 0 && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-base text-green-700 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Refill Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div>Customer brings their {cylinderType}</div>
                    <div>Filled with {gasWeight.toFixed(2)} kg LPG</div>
                    <div>Total charge: ₦{totalPrice.toLocaleString()}</div>
                    <div className="text-green-600 font-medium">
                      Ready to process transaction
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button
            onClick={handleRefill}
            disabled={!canProceed()}
            className="gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Process Refill - ₦{totalPrice.toLocaleString()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}