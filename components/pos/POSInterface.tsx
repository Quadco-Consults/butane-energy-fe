'use client';

import { useState, useEffect } from 'react';
import { POSShift, POSProduct, POSTransaction, OrderItem, CustomerAccount } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  FileText,
  Package,
  Shield,
  Wrench,
  ArrowRightLeft,
  Scale,
  Receipt,
  Calculator
} from 'lucide-react';
import { CylinderExchange } from './CylinderExchange';
import { CylinderRefill } from './CylinderRefill';
import { BulkLPGSale } from './BulkLPGSale';
import { CustomWeightSale } from './CustomWeightSale';
import { CustomerServices } from './CustomerServices';
import { TankMonitoring } from './TankMonitoring';

interface POSInterfaceProps {
  currentShift: POSShift;
  onShiftUpdate: (shift: POSShift) => void;
}

export function POSInterface({ currentShift, onShiftUpdate }: POSInterfaceProps) {
  const [currentTransaction, setCurrentTransaction] = useState<Partial<POSTransaction>>({
    items: [],
    subTotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    transactionType: 'sale'
  });
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('cylinder');
  const [showCylinderExchange, setShowCylinderExchange] = useState(false);
  const [showCylinderRefill, setShowCylinderRefill] = useState(false);
  const [showBulkSale, setShowBulkSale] = useState(false);
  const [showCustomWeightSale, setShowCustomWeightSale] = useState(false);
  const [showCustomerServices, setShowCustomerServices] = useState(false);
  const [showTankMonitoring, setShowTankMonitoring] = useState(false);

  // Mock POS Products data
  const mockPOSProducts: POSProduct[] = [
    // LPG Cylinders
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
      allowsExchange: true,
      barcode: '123456789012'
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
    },
    // Bulk LPG
    {
      id: 'bulk-lpg',
      name: 'Bulk LPG',
      category: 'lpg',
      posCategory: 'bulk_lpg',
      sku: 'BULK-LPG',
      description: 'LPG sold by weight',
      unit: 'kg',
      price: 950,
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
        { minQuantity: 100, pricePerUnit: 900, discountPercentage: 5 }
      ]
    },
    // Accessories
    {
      id: 'reg-001',
      name: 'Gas Regulator',
      category: 'accessory',
      posCategory: 'accessory',
      sku: 'REG-001',
      description: 'Standard LPG regulator',
      unit: 'piece',
      price: 3500,
      stockLevel: 30,
      reorderLevel: 5,
      plantId: 'kano-plant',
      touchOrderPosition: 4,
      quickSaleQuantity: 1,
      ageRestricted: false,
      requiresWeighing: false,
      allowsExchange: false
    },
    {
      id: 'hose-001',
      name: 'Gas Hose (2m)',
      category: 'accessory',
      posCategory: 'accessory',
      sku: 'HSE-001',
      description: '2-meter flexible gas hose',
      unit: 'piece',
      price: 2800,
      stockLevel: 25,
      reorderLevel: 5,
      plantId: 'kano-plant',
      touchOrderPosition: 5,
      quickSaleQuantity: 1,
      ageRestricted: false,
      requiresWeighing: false,
      allowsExchange: false
    },
    // Safety Items
    {
      id: 'det-001',
      name: 'Gas Leak Detector',
      category: 'accessory',
      posCategory: 'safety',
      sku: 'DET-001',
      description: 'Digital gas leak detector',
      unit: 'piece',
      price: 15000,
      stockLevel: 8,
      reorderLevel: 2,
      plantId: 'kano-plant',
      touchOrderPosition: 6,
      quickSaleQuantity: 1,
      ageRestricted: false,
      requiresWeighing: false,
      allowsExchange: false
    }
  ];

  const categoryIcons = {
    cylinder: Package,
    bulk_lpg: Scale,
    accessory: Wrench,
    safety: Shield,
  };

  const categoryColors = {
    cylinder: 'bg-blue-100 text-blue-800 border-blue-200',
    bulk_lpg: 'bg-green-100 text-green-800 border-green-200',
    accessory: 'bg-orange-100 text-orange-800 border-orange-200',
    safety: 'bg-red-100 text-red-800 border-red-200',
  };

  const filteredProducts = mockPOSProducts.filter(product =>
    selectedCategory === 'all' || product.posCategory === selectedCategory
  );

  const addToTransaction = (product: POSProduct, quantity: number = 1) => {
    const existingItemIndex = currentTransaction.items?.findIndex(
      item => item.productId === product.id
    );

    let updatedItems: OrderItem[];

    if (existingItemIndex !== -1 && existingItemIndex !== undefined && currentTransaction.items) {
      // Update existing item
      updatedItems = [...currentTransaction.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        total: updatedItems[existingItemIndex].unitPrice * (updatedItems[existingItemIndex].quantity + quantity)
      };
    } else {
      // Add new item
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        total: product.price * quantity
      };
      updatedItems = [...(currentTransaction.items || []), newItem];
    }

    const subTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = 0; // No tax for now
    const discountAmount = currentTransaction.discountAmount || 0;
    const totalAmount = subTotal + taxAmount - discountAmount;

    setCurrentTransaction({
      ...currentTransaction,
      items: updatedItems,
      subTotal,
      taxAmount,
      totalAmount
    });
  };

  const removeFromTransaction = (productId: string) => {
    const updatedItems = currentTransaction.items?.filter(item => item.productId !== productId) || [];
    const subTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = 0;
    const discountAmount = currentTransaction.discountAmount || 0;
    const totalAmount = subTotal + taxAmount - discountAmount;

    setCurrentTransaction({
      ...currentTransaction,
      items: updatedItems,
      subTotal,
      taxAmount,
      totalAmount
    });
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromTransaction(productId);
      return;
    }

    const updatedItems = currentTransaction.items?.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: item.unitPrice * newQuantity }
        : item
    ) || [];

    const subTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = 0;
    const discountAmount = currentTransaction.discountAmount || 0;
    const totalAmount = subTotal + taxAmount - discountAmount;

    setCurrentTransaction({
      ...currentTransaction,
      items: updatedItems,
      subTotal,
      taxAmount,
      totalAmount
    });
  };

  const clearTransaction = () => {
    setCurrentTransaction({
      items: [],
      subTotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
      transactionType: 'sale'
    });
    setSelectedCustomer(null);
  };

  const handleCylinderExchange = (exchangeDetails: any, newProduct: POSProduct, quantity: number) => {
    // Add the new cylinder(s) to the transaction with exchange pricing
    addToTransaction(newProduct, quantity);

    // Mark transaction as exchange type
    setCurrentTransaction(prev => ({
      ...prev,
      transactionType: 'exchange',
      exchangeDetails
    }));

    alert(`Cylinder exchange processed! ${quantity}x ${newProduct.name} added to transaction.`);
  };

  const handleCylinderRefill = (refillDetails: any, product: POSProduct, gasWeight: number) => {
    // Add the refill service to the transaction
    addToTransaction(product, 1);

    // Mark transaction as refill type with weight-based pricing
    setCurrentTransaction(prev => ({
      ...prev,
      transactionType: 'refill',
      refillDetails: {
        ...refillDetails,
        gasWeight,
        totalPrice: product.price
      }
    }));

    alert(`Cylinder refilled! ${gasWeight.toFixed(2)} kg LPG dispensed. ₦${product.price.toLocaleString()} charged.`);
  };

  const handleBulkSale = (bulkDetails: any, product: POSProduct, actualQuantity: number) => {
    // Create a special bulk item with actual quantity and pricing
    const bulkItem: OrderItem = {
      productId: product.id,
      productName: `${product.name} (${actualQuantity.toFixed(2)}kg)`,
      quantity: actualQuantity,
      unitPrice: product.price, // Already calculated price per kg
      total: product.price * actualQuantity
    };

    const updatedItems = [...(currentTransaction.items || []), bulkItem];
    const subTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = 0;
    const discountAmount = currentTransaction.discountAmount || 0;
    const totalAmount = subTotal + taxAmount - discountAmount;

    setCurrentTransaction({
      ...currentTransaction,
      items: updatedItems,
      subTotal,
      taxAmount,
      totalAmount,
      transactionType: 'bulk',
      bulkSaleDetails: bulkDetails
    });

    alert(`Bulk LPG sale added! ${actualQuantity.toFixed(2)}kg at ₦${product.price}/kg`);
  };

  const handleCustomWeightSale = (product: POSProduct, weight: number, totalPrice: number) => {
    // Add the custom weight LPG to the transaction
    addToTransaction(product, 1);

    // Mark transaction as custom weight type
    setCurrentTransaction(prev => ({
      ...prev,
      transactionType: 'custom_weight',
      customWeightDetails: {
        weight,
        pricePerKg: product.price / weight,
        totalPrice,
        containerType: product.name.includes('Customer Container') ? 'customer_container' : 'provided_container'
      }
    }));

    alert(`Custom weight LPG sale added! ${weight.toFixed(1)}kg for ₦${totalPrice.toLocaleString()}`);
  };

  const processPayment = (paymentMethod: string, paymentAmount?: number) => {
    // In a real app, this would process the payment
    const transactionId = `TXN-${Date.now()}`;
    const receiptNumber = `RCT-${Date.now()}`;

    // Update shift with new transaction
    const updatedShift: POSShift = {
      ...currentShift,
      totalSales: currentShift.totalSales + (currentTransaction.totalAmount || 0),
      totalTransactions: currentShift.totalTransactions + 1,
      cashSales: paymentMethod === 'cash'
        ? currentShift.cashSales + (currentTransaction.totalAmount || 0)
        : currentShift.cashSales,
      cardSales: paymentMethod === 'card'
        ? currentShift.cardSales + (currentTransaction.totalAmount || 0)
        : currentShift.cardSales,
      transferSales: paymentMethod === 'transfer'
        ? currentShift.transferSales + (currentTransaction.totalAmount || 0)
        : currentShift.transferSales,
      creditSales: paymentMethod === 'credit'
        ? currentShift.creditSales + (currentTransaction.totalAmount || 0)
        : currentShift.creditSales
    };

    onShiftUpdate(updatedShift);

    // Clear transaction
    clearTransaction();
    setShowPayment(false);

    // Show success message (in a real app)
    alert(`Transaction completed! Receipt: ${receiptNumber}`);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Product Grid - Left Side */}
      <div className="col-span-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Selection
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === 'cylinder' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('cylinder')}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  Cylinders
                </Button>
                <Button
                  variant={selectedCategory === 'bulk_lpg' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('bulk_lpg')}
                  className="gap-2"
                >
                  <Scale className="h-4 w-4" />
                  Bulk LPG
                </Button>
                <Button
                  variant={selectedCategory === 'accessory' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('accessory')}
                  className="gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  Accessories
                </Button>
                <Button
                  variant={selectedCategory === 'safety' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('safety')}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Safety
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const IconComponent = categoryIcons[product.posCategory];
                const isLowStock = product.stockLevel <= product.reorderLevel;

                return (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => addToTransaction(product)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <IconComponent className="h-8 w-8 text-primary" />
                        {isLowStock && (
                          <Badge variant="destructive" className="text-xs">
                            Low Stock
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg text-primary">
                            ₦{product.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Stock: {product.stockLevel} {product.unit}
                          </p>
                        </div>
                        <Button size="sm" className="h-8 w-8 p-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {product.allowsExchange && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          <ArrowRightLeft className="h-3 w-3 mr-1" />
                          Exchange
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Panel - Right Side */}
      <div className="col-span-4">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Current Sale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Selection */}
            <div>
              <Label className="text-sm font-medium">Customer</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => setShowCustomerServices(true)}
                >
                  <User className="h-4 w-4" />
                  {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomerServices(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {selectedCustomer && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>Balance: {selectedCustomer.currentBalance < 0 ? '-' : ''}₦{Math.abs(selectedCustomer.currentBalance).toLocaleString()}</p>
                  <p>Credit Available: ₦{(selectedCustomer.creditLimit + selectedCustomer.currentBalance).toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Transaction Items */}
            <div>
              <Label className="text-sm font-medium">Items</Label>
              <div className="border rounded-md mt-1">
                <ScrollArea className="h-64">
                  {currentTransaction.items && currentTransaction.items.length > 0 ? (
                    <div className="p-2 space-y-2">
                      {currentTransaction.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              ₦{item.unitPrice.toLocaleString()} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">₦{item.total.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-xs w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={() => removeFromTransaction(item.productId)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No items added</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>

            {/* Transaction Totals */}
            {currentTransaction.items && currentTransaction.items.length > 0 && (
              <div className="space-y-2">
                <Separator />
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₦{currentTransaction.subTotal?.toLocaleString()}</span>
                  </div>
                  {currentTransaction.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-₦{currentTransaction.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>₦{currentTransaction.taxAmount?.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₦{currentTransaction.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowPayment(true)}
                disabled={!currentTransaction.items || currentTransaction.items.length === 0}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCylinderExchange(true)}
                  className="gap-2"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Exchange
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCylinderRefill(true)}
                  className="gap-2"
                >
                  <Scale className="h-4 w-4" />
                  Refill
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBulkSale(true)}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  Bulk LPG
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomWeightSale(true)}
                  className="gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Custom Weight
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTankMonitoring(true)}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  Tank Monitoring
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={clearTransaction}
                  disabled={!currentTransaction.items || currentTransaction.items.length === 0}
                >
                  Clear Sale
                </Button>
                <Button variant="outline">
                  Hold Sale
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Dialog */}
      {showPayment && (
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Process Payment</DialogTitle>
              <DialogDescription>
                Total amount: ₦{currentTransaction.totalAmount?.toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 py-4">
              <Button
                className="h-20 flex-col gap-2"
                onClick={() => processPayment('cash')}
              >
                <Banknote className="h-6 w-6" />
                Cash
              </Button>
              <Button
                className="h-20 flex-col gap-2"
                onClick={() => processPayment('card')}
              >
                <CreditCard className="h-6 w-6" />
                Card
              </Button>
              <Button
                className="h-20 flex-col gap-2"
                onClick={() => processPayment('transfer')}
              >
                <Smartphone className="h-6 w-6" />
                Transfer
              </Button>
              <Button
                className="h-20 flex-col gap-2"
                onClick={() => processPayment('credit')}
                disabled={!selectedCustomer}
              >
                <FileText className="h-6 w-6" />
                Credit
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPayment(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cylinder Exchange Dialog */}
      <CylinderExchange
        open={showCylinderExchange}
        onClose={() => setShowCylinderExchange(false)}
        onExchange={handleCylinderExchange}
        customer={selectedCustomer}
      />

      {/* Cylinder Refill Dialog */}
      <CylinderRefill
        open={showCylinderRefill}
        onClose={() => setShowCylinderRefill(false)}
        onRefill={handleCylinderRefill}
        customer={selectedCustomer}
      />

      {/* Custom Weight Sale Dialog */}
      <CustomWeightSale
        open={showCustomWeightSale}
        onClose={() => setShowCustomWeightSale(false)}
        onSale={handleCustomWeightSale}
      />

      {/* Bulk LPG Sale Dialog */}
      <BulkLPGSale
        open={showBulkSale}
        onClose={() => setShowBulkSale(false)}
        onSale={handleBulkSale}
      />

      {/* Customer Services Dialog */}
      <CustomerServices
        open={showCustomerServices}
        onClose={() => setShowCustomerServices(false)}
        onCustomerSelect={setSelectedCustomer}
      />

      {/* Tank Monitoring Dialog */}
      <TankMonitoring
        open={showTankMonitoring}
        onClose={() => setShowTankMonitoring(false)}
      />
    </div>
  );
}