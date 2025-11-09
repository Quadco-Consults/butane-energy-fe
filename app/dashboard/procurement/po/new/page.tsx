'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { FormField, useFormValidation, validationRules } from '@/components/ui/form-components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { designSystem } from '@/lib/design-system';
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Building,
  Plus,
  X,
  Save,
  Send,
  Package,
  Calculator
} from 'lucide-react';
import Link from 'next/link';

// PO categories
const poCategories = [
  'Equipment',
  'Services',
  'Raw Materials',
  'Office Supplies',
  'Technology',
  'Safety Equipment',
  'Maintenance',
  'Transportation',
  'Professional Services',
  'Construction'
];

// Plant/Location options
const plantOptions = [
  'Lagos Plant',
  'Abuja Plant',
  'Kano Plant',
  'Port Harcourt Plant',
  'Head Office',
  'All Locations'
];

// Payment terms
const paymentTermsOptions = [
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Cash on Delivery',
  'Advance Payment',
  '50% Advance, 50% on Delivery'
];

// Currency options
const currencies = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

export default function NewPurchaseOrderPage() {
  const { user } = useAuth();
  const [items, setItems] = React.useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form validation for new PO
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      poNumber: `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      vendorName: '',
      vendorContact: '',
      vendorEmail: '',
      vendorAddress: '',
      category: '',
      plant: '',
      currency: 'NGN',
      deliveryDate: '',
      deliveryAddress: '',
      paymentTerms: 'Net 30',
      specialInstructions: '',
      internalNotes: '',
      contactPerson: user?.name || '',
      contactEmail: user?.email || '',
      contactPhone: ''
    },
    {
      vendorName: validationRules.required,
      vendorContact: validationRules.required,
      vendorEmail: (value) => validationRules.required(value) || validationRules.email(value),
      vendorAddress: validationRules.required,
      category: validationRules.required,
      plant: validationRules.required,
      deliveryDate: validationRules.required,
      deliveryAddress: validationRules.required,
      contactPerson: validationRules.required,
      contactEmail: (value) => validationRules.required(value) || validationRules.email(value)
    }
  );

  // Item form validation
  const { values: itemValues, errors: itemErrors, setValue: setItemValue, validate: validateItem, reset: resetItem } = useFormValidation(
    {
      itemName: '',
      description: '',
      quantity: '',
      unit: '',
      unitPrice: '',
      specifications: ''
    },
    {
      itemName: validationRules.required,
      description: validationRules.required,
      quantity: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      unit: validationRules.required,
      unitPrice: (value) => validationRules.required(value) || validationRules.positiveNumber(value)
    }
  );

  const handleSubmit = (action: 'draft' | 'send') => {
    if (validate() && items.length > 0) {
      setIsSubmitting(true);

      setTimeout(() => {
        if (action === 'draft') {
          alert('Purchase Order saved as draft successfully!');
        } else {
          alert('Purchase Order sent to vendor successfully!');
        }
        setIsSubmitting(false);
        window.location.href = '/dashboard/procurement/po';
      }, 1500);
    } else {
      let message = 'Please complete all required fields';
      if (items.length === 0) message += ' and add at least one item';
      alert(message);
    }
  };

  const addItem = () => {
    if (validateItem()) {
      const total = Number(itemValues.quantity) * Number(itemValues.unitPrice);
      setItems([...items, {
        id: Date.now(),
        ...itemValues,
        total
      }]);
      resetItem();
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.075; // 7.5% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const getSelectedCurrency = () => {
    return currencies.find(c => c.code === values.currency) || currencies[0];
  };

  if (!user) return null;

  const selectedCurrency = getSelectedCurrency();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/procurement/po">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Purchase Orders
              </Button>
            </Link>
            <div>
              <h1 className={designSystem.getHeading("h1")}>Create Purchase Order</h1>
              <p className={designSystem.getBody("small")}>
                Create a new purchase order for vendor
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit('send')}
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send to Vendor'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* PO Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Purchase Order Details
                </CardTitle>
                <CardDescription>
                  Enter the main purchase order information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="PO Number" required>
                    <Input
                      value={values.poNumber}
                      onChange={(e) => setValue('poNumber', e.target.value)}
                      placeholder="PO-YYYY-XXX"
                    />
                  </FormField>

                  <FormField label="Category" required error={errors.category}>
                    <Select value={values.category} onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {poCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Plant/Location" required error={errors.plant}>
                    <Select value={values.plant} onValueChange={(value) => setValue('plant', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plant" />
                      </SelectTrigger>
                      <SelectContent>
                        {plantOptions.map((plant) => (
                          <SelectItem key={plant} value={plant}>
                            {plant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Currency" required>
                    <Select value={values.currency} onValueChange={(value) => setValue('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} ({currency.symbol}) - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Vendor Information
                </CardTitle>
                <CardDescription>
                  Enter vendor contact and address details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Vendor/Company Name" required error={errors.vendorName}>
                  <Input
                    value={values.vendorName}
                    onChange={(e) => setValue('vendorName', e.target.value)}
                    placeholder="Enter vendor company name"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Contact Person" required error={errors.vendorContact}>
                    <Input
                      value={values.vendorContact}
                      onChange={(e) => setValue('vendorContact', e.target.value)}
                      placeholder="Contact person name"
                    />
                  </FormField>

                  <FormField label="Email Address" required error={errors.vendorEmail}>
                    <Input
                      type="email"
                      value={values.vendorEmail}
                      onChange={(e) => setValue('vendorEmail', e.target.value)}
                      placeholder="vendor@company.com"
                    />
                  </FormField>
                </div>

                <FormField label="Vendor Address" required error={errors.vendorAddress}>
                  <Textarea
                    value={values.vendorAddress}
                    onChange={(e) => setValue('vendorAddress', e.target.value)}
                    placeholder="Complete vendor business address"
                    rows={3}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items
                </CardTitle>
                <CardDescription>
                  Add items to this purchase order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Item Form */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Add New Item</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Item Name" required error={itemErrors.itemName}>
                      <Input
                        value={itemValues.itemName}
                        onChange={(e) => setItemValue('itemName', e.target.value)}
                        placeholder="Product/service name"
                      />
                    </FormField>

                    <FormField label="Unit" required error={itemErrors.unit}>
                      <Select value={itemValues.unit} onValueChange={(value) => setItemValue('unit', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="liters">Liters</SelectItem>
                          <SelectItem value="meters">Meters</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                          <SelectItem value="sets">Sets</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Description" required error={itemErrors.description}>
                    <Textarea
                      value={itemValues.description}
                      onChange={(e) => setItemValue('description', e.target.value)}
                      placeholder="Detailed item description"
                      rows={2}
                    />
                  </FormField>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Quantity" required error={itemErrors.quantity}>
                      <Input
                        type="number"
                        value={itemValues.quantity}
                        onChange={(e) => setItemValue('quantity', e.target.value)}
                        placeholder="0"
                      />
                    </FormField>

                    <FormField label={`Unit Price (${selectedCurrency.symbol})`} required error={itemErrors.unitPrice}>
                      <Input
                        type="number"
                        step="0.01"
                        value={itemValues.unitPrice}
                        onChange={(e) => setItemValue('unitPrice', e.target.value)}
                        placeholder="0.00"
                      />
                    </FormField>

                    <div className="flex items-end">
                      <Button onClick={addItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  <FormField label="Specifications (Optional)">
                    <Textarea
                      value={itemValues.specifications}
                      onChange={(e) => setItemValue('specifications', e.target.value)}
                      placeholder="Technical specifications, model numbers, etc."
                      rows={2}
                    />
                  </FormField>
                </div>

                {/* Items List */}
                {items.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Order Items ({items.length})</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 grid grid-cols-6 gap-4 text-sm font-medium border-b">
                        <div className="col-span-2">Item</div>
                        <div>Qty</div>
                        <div>Unit Price</div>
                        <div>Total</div>
                        <div></div>
                      </div>
                      {items.map((item) => (
                        <div key={item.id} className="p-3 grid grid-cols-6 gap-4 items-start border-b last:border-b-0">
                          <div className="col-span-2">
                            <div className="font-medium">{item.itemName}</div>
                            <div className="text-sm text-gray-600">{item.description}</div>
                            {item.specifications && (
                              <div className="text-xs text-gray-500 mt-1">{item.specifications}</div>
                            )}
                          </div>
                          <div className="text-sm">{item.quantity} {item.unit}</div>
                          <div className="text-sm">{selectedCurrency.symbol}{Number(item.unitPrice).toFixed(2)}</div>
                          <div className="text-sm font-medium">{selectedCurrency.symbol}{item.total.toFixed(2)}</div>
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery & Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery & Payment Terms</CardTitle>
                <CardDescription>
                  Specify delivery and payment requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Expected Delivery Date" required error={errors.deliveryDate}>
                    <Input
                      type="date"
                      value={values.deliveryDate}
                      onChange={(e) => setValue('deliveryDate', e.target.value)}
                    />
                  </FormField>

                  <FormField label="Payment Terms" required>
                    <Select value={values.paymentTerms} onValueChange={(value) => setValue('paymentTerms', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTermsOptions.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Delivery Address" required error={errors.deliveryAddress}>
                  <Textarea
                    value={values.deliveryAddress}
                    onChange={(e) => setValue('deliveryAddress', e.target.value)}
                    placeholder="Complete delivery address"
                    rows={3}
                  />
                </FormField>

                <FormField label="Special Instructions">
                  <Textarea
                    value={values.specialInstructions}
                    onChange={(e) => setValue('specialInstructions', e.target.value)}
                    placeholder="Delivery instructions, quality requirements, packaging, etc."
                    rows={3}
                  />
                </FormField>

                <FormField label="Internal Notes">
                  <Textarea
                    value={values.internalNotes}
                    onChange={(e) => setValue('internalNotes', e.target.value)}
                    placeholder="Internal notes (not visible to vendor)"
                    rows={2}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Our Contact Information</CardTitle>
                <CardDescription>
                  Contact details for vendor communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Contact Person" required error={errors.contactPerson}>
                    <Input
                      value={values.contactPerson}
                      onChange={(e) => setValue('contactPerson', e.target.value)}
                      placeholder="Your name"
                    />
                  </FormField>

                  <FormField label="Phone Number">
                    <Input
                      value={values.contactPhone}
                      onChange={(e) => setValue('contactPhone', e.target.value)}
                      placeholder="+234-XXX-XXX-XXXX"
                    />
                  </FormField>
                </div>

                <FormField label="Email Address" required error={errors.contactEmail}>
                  <Input
                    type="email"
                    value={values.contactEmail}
                    onChange={(e) => setValue('contactEmail', e.target.value)}
                    placeholder="your.email@butane-energy.com"
                  />
                </FormField>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{selectedCurrency.symbol}{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">VAT (7.5%):</span>
                  <span className="font-medium">{selectedCurrency.symbol}{calculateTax().toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">{selectedCurrency.symbol}{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PO Information */}
            <Card>
              <CardHeader>
                <CardTitle>PO Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">Draft</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created By:</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">Procurement</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">PO Number:</span>
                  <span className="font-medium">{values.poNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Currency:</span>
                  <span className="font-medium">{selectedCurrency.code}</span>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    For assistance with purchase orders, contact the procurement team or refer to the procurement guidelines.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Guidelines
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}