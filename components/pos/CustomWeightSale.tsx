'use client';

import { useState } from 'react';
import { POSProduct } from '@/lib/types';
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
  Calculator,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface CustomWeightSaleProps {
  open: boolean;
  onClose: () => void;
  onSale: (product: POSProduct, weight: number, totalPrice: number) => void;
}

export function CustomWeightSale({ open, onClose, onSale }: CustomWeightSaleProps) {
  const [weight, setWeight] = useState('');
  const [containerType, setContainerType] = useState('customer_container');
  const [pricePerKg, setPricePerKg] = useState(800);

  // Common weight presets for quick selection
  const weightPresets = [
    { label: '1kg', value: 1 },
    { label: '2kg', value: 2 },
    { label: '3kg', value: 3 },
    { label: '5kg', value: 5 },
    { label: '10kg', value: 10 },
    { label: '15kg', value: 15 },
    { label: '20kg', value: 20 },
    { label: '25kg', value: 25 }
  ];

  const containerOptions = [
    {
      value: 'customer_container',
      label: 'Customer Container',
      description: 'Customer brings their own container',
      additionalCost: 0
    },
    {
      value: 'small_cylinder',
      label: 'Small Cylinder (≤5kg)',
      description: 'Provide small cylinder for customer',
      additionalCost: 2000
    },
    {
      value: 'medium_cylinder',
      label: 'Medium Cylinder (6-15kg)',
      description: 'Provide medium cylinder for customer',
      additionalCost: 4000
    },
    {
      value: 'large_cylinder',
      label: 'Large Cylinder (>15kg)',
      description: 'Provide large cylinder for customer',
      additionalCost: 6000
    }
  ];

  const selectedContainer = containerOptions.find(c => c.value === containerType);
  const weightValue = parseFloat(weight) || 0;
  const lpgCost = weightValue * pricePerKg;
  const containerCost = selectedContainer?.additionalCost || 0;
  const totalPrice = lpgCost + containerCost;

  const canProceed = () => {
    return (
      weightValue > 0 &&
      weightValue <= 50 && // Maximum reasonable weight
      containerType &&
      pricePerKg > 0
    );
  };

  const handleWeightPresetClick = (presetWeight: number) => {
    setWeight(presetWeight.toString());
  };

  const handleSale = () => {
    if (!canProceed()) return;

    const product: POSProduct = {
      id: 'custom-lpg-weight',
      name: `LPG ${weightValue}kg ${selectedContainer?.label}`,
      price: totalPrice,
      category: 'lpg',
      unit: 'kg',
      inStock: true,
      quantity: 1000, // Available LPG in tank
      image: '/images/lpg-custom.png',
      posCategory: 'custom_weight'
    };

    onSale(product, weightValue, totalPrice);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setWeight('');
    setContainerType('customer_container');
    setPricePerKg(800);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Custom Weight LPG Sale
          </DialogTitle>
          <DialogDescription>
            Sell LPG by specific weight amount (1kg, 2kg, 5kg, etc.)
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Weight Selection */}
          <div className="space-y-6">
            {/* Weight Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Weight Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Enter Weight (kg)</Label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.00"
                    step="0.1"
                    min="0.1"
                    max="50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum 50kg per transaction
                  </p>
                </div>

                <Separator />

                <div>
                  <Label>Quick Select (Common Weights)</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {weightPresets.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={weight === preset.value.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleWeightPresetClick(preset.value)}
                        className="h-8"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Container Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Container Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Container Option</Label>
                  <Select value={containerType} onValueChange={setContainerType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {containerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {option.description}
                              {option.additionalCost > 0 && (
                                <span className="ml-2 font-medium">
                                  +₦{option.additionalCost.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {containerCost > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Container fee: ₦{containerCost.toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing & Summary */}
          <div className="space-y-6">
            {/* Pricing Calculation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Price Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Price per kg</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">₦{pricePerKg.toLocaleString()}</span>
                    <Badge variant="outline">Standard Rate</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span>{weightValue.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LPG Cost:</span>
                    <span>₦{lpgCost.toLocaleString()}</span>
                  </div>
                  {containerCost > 0 && (
                    <div className="flex justify-between">
                      <span>Container:</span>
                      <span>₦{containerCost.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600">
                      ₦{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {weightValue > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Cost per kg:</span>
                      <span>₦{pricePerKg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Container:</span>
                      <span>{selectedContainer?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span>Custom Weight LPG Sale</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sale Summary */}
            {weightValue > 0 && canProceed() && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-base text-green-700 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Sale Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div>Selling {weightValue.toFixed(1)} kg LPG</div>
                    <div>Container: {selectedContainer?.label}</div>
                    <div>Total charge: ₦{totalPrice.toLocaleString()}</div>
                    <div className="text-green-600 font-medium">
                      Ready to add to transaction
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Validation Warnings */}
            {weightValue > 50 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Maximum weight per transaction is 50kg
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancel
          </Button>
          <Button
            onClick={handleSale}
            disabled={!canProceed()}
            className="gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Add to Sale - ₦{totalPrice.toLocaleString()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}