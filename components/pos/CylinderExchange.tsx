'use client';

import { useState } from 'react';
import { CylinderExchangeDetails, POSProduct, CustomerAccount } from '@/lib/types';
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
  ArrowRightLeft,
  Fuel,
  AlertTriangle,
  CheckCircle,
  Scale,
  DollarSign,
  RefreshCw
} from 'lucide-react';

interface CylinderExchangeProps {
  open: boolean;
  onClose: () => void;
  onExchange: (details: CylinderExchangeDetails, newProduct: POSProduct, quantity: number) => void;
  customer?: CustomerAccount | null;
}

export function CylinderExchange({ open, onClose, onExchange, customer }: CylinderExchangeProps) {
  const [returnedSize, setReturnedSize] = useState<'12.5kg' | '6.25kg' | ''>('');
  const [returnedCondition, setReturnedCondition] = useState<'empty' | 'partial' | 'damaged' | ''>('');
  const [newSize, setNewSize] = useState<'12.5kg' | '6.25kg' | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [weighedGas, setWeighedGas] = useState('');

  // Mock cylinder inventory
  const mockCylinders: POSProduct[] = [
    {
      id: 'cyl-125',
      name: '12.5kg LPG Cylinder',
      category: 'cylinder',
      posCategory: 'cylinder',
      sku: 'CYL-125',
      description: 'Standard 12.5kg LPG cylinder',
      unit: 'cylinder',
      price: 12500,
      stockLevel: 50,
      reorderLevel: 10,
      plantId: 'kano-plant',
      touchOrderPosition: 1,
      quickSaleQuantity: 1,
      ageRestricted: false,
      requiresWeighing: false,
      allowsExchange: true
    },
    {
      id: 'cyl-625',
      name: '6.25kg LPG Cylinder',
      category: 'cylinder',
      posCategory: 'cylinder',
      sku: 'CYL-625',
      description: 'Compact 6.25kg LPG cylinder',
      unit: 'cylinder',
      price: 6800,
      stockLevel: 75,
      reorderLevel: 15,
      plantId: 'kano-plant',
      touchOrderPosition: 2,
      quickSaleQuantity: 1,
      ageRestricted: false,
      requiresWeighing: false,
      allowsExchange: true
    }
  ];

  const cylinderPrices = {
    '12.5kg': 12500,
    '6.25kg': 6800
  };

  const exchangeRates = {
    'empty': 1.0,      // Full credit
    'partial': 0.8,    // 80% credit for partial gas
    'damaged': 0.6     // 60% credit for damaged cylinder
  };

  const getReturnedProduct = () => mockCylinders.find(c => c.name.includes(returnedSize));
  const getNewProduct = () => mockCylinders.find(c => c.name.includes(newSize));

  // Calculate exchange economics
  const calculateExchange = () => {
    if (!returnedSize || !returnedCondition || !newSize) return null;

    const returnedPrice = cylinderPrices[returnedSize];
    const newPrice = cylinderPrices[newSize];
    const conditionMultiplier = exchangeRates[returnedCondition];

    // Credit for returned cylinder
    const exchangeCredit = returnedPrice * conditionMultiplier;

    // Cost of new cylinder(s)
    const newCylindersCost = newPrice * quantity;

    // Exchange fee (₦500 processing fee)
    const exchangeFee = 500;

    // Additional payment required
    const additionalPayment = Math.max(0, newCylindersCost - exchangeCredit + exchangeFee);

    // Refund if applicable (rare case)
    const refund = Math.max(0, exchangeCredit - newCylindersCost - exchangeFee);

    return {
      returnedPrice,
      exchangeCredit,
      newCylindersCost,
      exchangeFee,
      additionalPayment,
      refund,
      netAmount: additionalPayment - refund
    };
  };

  const exchange = calculateExchange();
  const newProduct = getNewProduct();

  const handleExchange = () => {
    if (!returnedSize || !returnedCondition || !newSize || !newProduct || !exchange) return;

    const exchangeDetails: CylinderExchangeDetails = {
      returnedCylinderId: `ret-${Date.now()}`,
      returnedCylinderSize: returnedSize,
      returnedCylinderCondition: returnedCondition,
      newCylinderId: `new-${Date.now()}`,
      exchangeCredit: exchange.exchangeCredit,
      exchangeFee: exchange.exchangeFee
    };

    onExchange(exchangeDetails, newProduct, quantity);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setReturnedSize('');
    setReturnedCondition('');
    setNewSize('');
    setQuantity(1);
    setWeighedGas('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            LPG Cylinder Exchange
          </DialogTitle>
          <DialogDescription>
            Process cylinder exchange by selecting returned and new cylinders.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Customer Info */}
          {customer && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {customer.accountType.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Returned Cylinder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-orange-500" />
                  Returned Cylinder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Cylinder Size</Label>
                  <Select value={returnedSize} onValueChange={(value: '12.5kg' | '6.25kg') => setReturnedSize(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12.5kg">12.5kg Cylinder</SelectItem>
                      <SelectItem value="6.25kg">6.25kg Cylinder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Condition</Label>
                  <Select value={returnedCondition} onValueChange={(value: 'empty' | 'partial' | 'damaged') => setReturnedCondition(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Empty (100% credit)
                        </div>
                      </SelectItem>
                      <SelectItem value="partial">
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-orange-500" />
                          Partially Full (80% credit)
                        </div>
                      </SelectItem>
                      <SelectItem value="damaged">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Damaged (60% credit)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {returnedCondition === 'partial' && (
                  <div>
                    <Label>Remaining Gas Weight (Optional)</Label>
                    <Input
                      placeholder="e.g., 3.5kg"
                      value={weighedGas}
                      onChange={(e) => setWeighedGas(e.target.value)}
                    />
                  </div>
                )}

                {returnedSize && returnedCondition && (
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="pt-4">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Original Value:</span>
                          <span>₦{cylinderPrices[returnedSize].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Condition Multiplier:</span>
                          <span>{(exchangeRates[returnedCondition] * 100).toFixed(0)}%</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Exchange Credit:</span>
                          <span>₦{exchange?.exchangeCredit.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* New Cylinder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-green-500" />
                  New Cylinder(s)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Cylinder Size</Label>
                  <Select value={newSize} onValueChange={(value: '12.5kg' | '6.25kg') => setNewSize(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12.5kg">
                        <div className="flex items-center justify-between w-full">
                          <span>12.5kg Cylinder</span>
                          <Badge variant="outline">₦12,500</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="6.25kg">
                        <div className="flex items-center justify-between w-full">
                          <span>6.25kg Cylinder</span>
                          <Badge variant="outline">₦6,800</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {newSize && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Unit Price:</span>
                          <span>₦{cylinderPrices[newSize].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span>{quantity}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total Cost:</span>
                          <span>₦{(cylinderPrices[newSize] * quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Exchange Summary */}
          {exchange && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Exchange Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Exchange Credit:</span>
                      <span className="text-green-600">+₦{exchange.exchangeCredit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Cylinder(s) Cost:</span>
                      <span className="text-red-600">-₦{exchange.newCylindersCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exchange Fee:</span>
                      <span className="text-red-600">-₦{exchange.exchangeFee.toLocaleString()}</span>
                    </div>
                  </div>

                  <Card className={exchange.netAmount > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          {exchange.netAmount > 0 ? 'Additional Payment Required' : 'Customer Refund'}
                        </p>
                        <p className="text-2xl font-bold">
                          ₦{Math.abs(exchange.netAmount).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleExchange}
            disabled={!returnedSize || !returnedCondition || !newSize || !exchange}
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Process Exchange
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}