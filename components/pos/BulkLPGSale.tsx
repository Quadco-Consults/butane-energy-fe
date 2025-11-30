'use client';

import { useState, useEffect } from 'react';
import { BulkLPGDetails, POSProduct, BulkPricingTier } from '@/lib/types';
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
  Truck,
  Calculator,
  AlertTriangle,
  Info,
  TrendingDown,
  DollarSign
} from 'lucide-react';

interface BulkLPGSaleProps {
  open: boolean;
  onClose: () => void;
  onSale: (details: BulkLPGDetails, product: POSProduct, actualQuantity: number) => void;
}

export function BulkLPGSale({ open, onClose, onSale }: BulkLPGSaleProps) {
  const [containerType, setContainerType] = useState<'customer_tank' | 'truck' | 'cylinder_bulk' | ''>('');
  const [tareWeight, setTareWeight] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [customQuantity, setCustomQuantity] = useState('');
  const [useWeighing, setUseWeighing] = useState(true);

  // Mock Bulk LPG product with tiered pricing
  const bulkLPGProduct: POSProduct = {
    id: 'bulk-lpg',
    name: 'Bulk LPG',
    category: 'lpg',
    posCategory: 'bulk_lpg',
    sku: 'BULK-LPG',
    description: 'LPG sold by weight',
    unit: 'kg',
    price: 950, // Base price per kg
    stockLevel: 5000,
    reorderLevel: 500,
    plantId: 'kano-plant',
    touchOrderPosition: 3,
    quickSaleQuantity: 50,
    ageRestricted: false,
    requiresWeighing: true,
    allowsExchange: false,
    bulkPricing: [
      { minQuantity: 1, maxQuantity: 49, pricePerUnit: 950 },
      { minQuantity: 50, maxQuantity: 99, pricePerUnit: 920, discountPercentage: 3 },
      { minQuantity: 100, maxQuantity: 199, pricePerUnit: 900, discountPercentage: 5 },
      { minQuantity: 200, maxQuantity: 499, pricePerUnit: 880, discountPercentage: 7 },
      { minQuantity: 500, pricePerUnit: 850, discountPercentage: 10 }
    ]
  };

  const containerLimits = {
    'customer_tank': { min: 5, max: 100, typical: 25 },
    'truck': { min: 100, max: 2000, typical: 500 },
    'cylinder_bulk': { min: 50, max: 500, typical: 100 }
  };

  const minimumCharges = {
    'customer_tank': 5000,  // ₦5,000 minimum
    'truck': 50000,         // ₦50,000 minimum
    'cylinder_bulk': 25000  // ₦25,000 minimum
  };

  // Calculate net weight
  const netWeight = useWeighing && tareWeight && grossWeight
    ? Math.max(0, parseFloat(grossWeight) - parseFloat(tareWeight))
    : parseFloat(customQuantity) || 0;

  // Get applicable pricing tier
  const getPricingTier = (quantity: number): BulkPricingTier => {
    const tiers = bulkLPGProduct.bulkPricing || [];
    return tiers
      .reverse()
      .find(tier => quantity >= tier.minQuantity) || tiers[0];
  };

  const pricingTier = getPricingTier(netWeight);
  const unitPrice = pricingTier?.pricePerUnit || bulkLPGProduct.price;
  const subtotal = netWeight * unitPrice;
  const minimumCharge = containerType ? minimumCharges[containerType] : 0;
  const finalTotal = Math.max(subtotal, minimumCharge);
  const isMinimumApplied = finalTotal === minimumCharge && minimumCharge > subtotal;

  const handleSale = () => {
    if (!containerType || netWeight <= 0) return;

    const bulkDetails: BulkLPGDetails = {
      containerType,
      tareWeight: useWeighing ? parseFloat(tareWeight) : undefined,
      grossWeight: useWeighing ? parseFloat(grossWeight) : undefined,
      netWeight,
      pricePerKg: unitPrice,
      minimumCharge: isMinimumApplied ? minimumCharge : undefined
    };

    // Create a modified product with the calculated unit price
    const productForSale: POSProduct = {
      ...bulkLPGProduct,
      price: unitPrice
    };

    onSale(bulkDetails, productForSale, netWeight);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setContainerType('');
    setTareWeight('');
    setGrossWeight('');
    setCustomQuantity('');
    setUseWeighing(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Bulk LPG Sale
          </DialogTitle>
          <DialogDescription>
            Process bulk LPG sale with precise weight measurement and tiered pricing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Container Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Container Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={containerType} onValueChange={(value: any) => setContainerType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select container type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_tank">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="font-medium">Customer Tank</p>
                        <p className="text-sm text-muted-foreground">5-100kg, Min: ₦5,000</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="truck">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="font-medium">Truck Loading</p>
                        <p className="text-sm text-muted-foreground">100-2000kg, Min: ₦50,000</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="cylinder_bulk">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="font-medium">Bulk Cylinder Fill</p>
                        <p className="text-sm text-muted-foreground">50-500kg, Min: ₦25,000</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Weight Measurement */}
          {containerType && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Weight Measurement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={useWeighing ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseWeighing(true)}
                  >
                    Use Scale Weighing
                  </Button>
                  <Button
                    variant={!useWeighing ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseWeighing(false)}
                  >
                    Enter Quantity
                  </Button>
                </div>

                {useWeighing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tare Weight (kg)</Label>
                      <Input
                        type="number"
                        placeholder="Empty container weight"
                        value={tareWeight}
                        onChange={(e) => setTareWeight(e.target.value)}
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label>Gross Weight (kg)</Label>
                      <Input
                        type="number"
                        placeholder="Container + LPG weight"
                        value={grossWeight}
                        onChange={(e) => setGrossWeight(e.target.value)}
                        step="0.1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label>LPG Quantity (kg)</Label>
                    <Input
                      type="number"
                      placeholder="Enter LPG quantity in kg"
                      value={customQuantity}
                      onChange={(e) => setCustomQuantity(e.target.value)}
                      step="0.1"
                    />
                  </div>
                )}

                {netWeight > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Scale className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">Net LPG Weight:</span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{netWeight.toFixed(2)} kg</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pricing Information */}
          {netWeight > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing & Total
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pricing Tier Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">Current Tier</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Quantity Range:</span>
                          <span>
                            {pricingTier.minQuantity}kg - {pricingTier.maxQuantity ? `${pricingTier.maxQuantity}kg` : '∞'}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Price per kg:</span>
                          <span>₦{pricingTier.pricePerUnit}</span>
                        </div>
                        {pricingTier.discountPercentage && (
                          <div className="flex justify-between text-green-600">
                            <span>Bulk Discount:</span>
                            <span>{pricingTier.discountPercentage}% off</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-800">Available Tiers</span>
                      </div>
                      <div className="text-xs space-y-1">
                        {bulkLPGProduct.bulkPricing?.map((tier, index) => (
                          <div
                            key={index}
                            className={`flex justify-between ${
                              tier === pricingTier ? 'font-semibold text-green-600' : ''
                            }`}
                          >
                            <span>
                              {tier.minQuantity}kg{tier.maxQuantity ? `-${tier.maxQuantity}kg` : '+'}:
                            </span>
                            <span>₦{tier.pricePerUnit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Total Calculation */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{netWeight.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span>₦{unitPrice.toLocaleString()}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₦{subtotal.toLocaleString()}</span>
                      </div>
                      {minimumCharge > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Minimum Charge:</span>
                          <span>₦{minimumCharge.toLocaleString()}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>₦{finalTotal.toLocaleString()}</span>
                      </div>
                      {isMinimumApplied && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs">Minimum charge applied</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSale}
            disabled={!containerType || netWeight <= 0}
          >
            <Scale className="h-4 w-4 mr-2" />
            Add to Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}