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
  FileQuestion,
  Calendar,
  DollarSign,
  Building,
  Plus,
  X,
  Save,
  Send,
  Users,
  Package
} from 'lucide-react';
import Link from 'next/link';

// RFQ categories
const rfqCategories = [
  'Equipment',
  'Services',
  'Supplies',
  'Technology',
  'Safety Equipment',
  'Transportation',
  'Maintenance',
  'Professional Services',
  'Construction Materials',
  'Office Supplies'
];

// Plant/Location options
const plantOptions = [
  'All Plants',
  'Lagos Plant',
  'Abuja Plant',
  'Kano Plant',
  'Port Harcourt Plant',
  'Head Office'
];

// Delivery terms
const deliveryTerms = [
  'Ex-Works (EXW)',
  'Free on Board (FOB)',
  'Cost, Insurance and Freight (CIF)',
  'Delivered Duty Paid (DDP)',
  'Free Carrier (FCA)'
];

export default function NewRFQPage() {
  const { user } = useAuth();
  const [items, setItems] = React.useState<any[]>([]);
  const [vendors, setVendors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form validation for new RFQ
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      title: '',
      description: '',
      category: '',
      plant: '',
      responseDeadline: '',
      deliveryLocation: '',
      deliveryTerms: 'Ex-Works (EXW)',
      paymentTerms: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      specialInstructions: '',
      notes: ''
    },
    {
      title: validationRules.required,
      description: validationRules.required,
      category: validationRules.required,
      plant: validationRules.required,
      responseDeadline: validationRules.required,
      deliveryLocation: validationRules.required,
      contactPerson: validationRules.required,
      contactEmail: (value) => validationRules.required(value) || validationRules.email(value),
      contactPhone: validationRules.required
    }
  );

  // Item form validation
  const { values: itemValues, errors: itemErrors, setValue: setItemValue, validate: validateItem, reset: resetItem } = useFormValidation(
    {
      itemName: '',
      description: '',
      quantity: '',
      unit: '',
      specifications: ''
    },
    {
      itemName: validationRules.required,
      description: validationRules.required,
      quantity: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      unit: validationRules.required
    }
  );

  const handleSubmit = (action: 'draft' | 'send') => {
    if (validate() && items.length > 0 && vendors.length > 0) {
      setIsSubmitting(true);

      setTimeout(() => {
        if (action === 'draft') {
          alert('RFQ saved as draft successfully!');
        } else {
          alert(`RFQ sent to ${vendors.length} vendor(s) successfully!`);
        }
        setIsSubmitting(false);
        window.location.href = '/dashboard/procurement/rfq';
      }, 1500);
    } else {
      let message = 'Please complete all required fields';
      if (items.length === 0) message += ' and add at least one item';
      if (vendors.length === 0) message += ' and select vendors';
      alert(message);
    }
  };

  const addItem = () => {
    if (validateItem()) {
      setItems([...items, {
        id: Date.now(),
        ...itemValues
      }]);
      resetItem();
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addVendor = () => {
    const vendor = prompt('Enter vendor name or select from list:');
    if (vendor && !vendors.includes(vendor)) {
      setVendors([...vendors, vendor]);
    }
  };

  const removeVendor = (vendor: string) => {
    setVendors(vendors.filter(v => v !== vendor));
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/procurement/rfq">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to RFQ
              </Button>
            </Link>
            <div>
              <h1 className={designSystem.getHeading("h1")}>Create New RFQ</h1>
              <p className={designSystem.getBody("small")}>
                Request quotations from vendors for procurement items
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
              {isSubmitting ? 'Sending...' : 'Send RFQ'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileQuestion className="h-5 w-5 mr-2" />
                  RFQ Information
                </CardTitle>
                <CardDescription>
                  Enter the main details for this request for quotation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="RFQ Title" required error={errors.title}>
                  <Input
                    value={values.title}
                    onChange={(e) => setValue('title', e.target.value)}
                    placeholder="Enter descriptive RFQ title"
                  />
                </FormField>

                <FormField label="Description" required error={errors.description}>
                  <Textarea
                    value={values.description}
                    onChange={(e) => setValue('description', e.target.value)}
                    placeholder="Detailed description of items/services needed"
                    rows={3}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Category" required error={errors.category}>
                    <Select value={values.category} onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {rfqCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

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
                </div>
              </CardContent>
            </Card>

            {/* Items List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Items Required
                </CardTitle>
                <CardDescription>
                  Add items you need quotations for
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
                        placeholder="Item name"
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
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField label="Quantity" required error={itemErrors.quantity}>
                      <Input
                        type="number"
                        value={itemValues.quantity}
                        onChange={(e) => setItemValue('quantity', e.target.value)}
                        placeholder="0"
                      />
                    </FormField>

                    <div className="flex items-end">
                      <Button onClick={addItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  <FormField label="Description" required error={itemErrors.description}>
                    <Textarea
                      value={itemValues.description}
                      onChange={(e) => setItemValue('description', e.target.value)}
                      placeholder="Item description"
                      rows={2}
                    />
                  </FormField>

                  <FormField label="Specifications (Optional)">
                    <Textarea
                      value={itemValues.specifications}
                      onChange={(e) => setItemValue('specifications', e.target.value)}
                      placeholder="Technical specifications, brand preferences, etc."
                      rows={2}
                    />
                  </FormField>
                </div>

                {/* Items List */}
                {items.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Items Added ({items.length})</h4>
                    {items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3 flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{item.itemName}</span>
                            <span className="text-sm text-gray-500">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          {item.specifications && (
                            <p className="text-xs text-gray-500 mt-1">{item.specifications}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery & Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery & Terms</CardTitle>
                <CardDescription>
                  Specify delivery and payment requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Response Deadline" required error={errors.responseDeadline}>
                  <Input
                    type="date"
                    value={values.responseDeadline}
                    onChange={(e) => setValue('responseDeadline', e.target.value)}
                  />
                </FormField>

                <FormField label="Delivery Location" required error={errors.deliveryLocation}>
                  <Input
                    value={values.deliveryLocation}
                    onChange={(e) => setValue('deliveryLocation', e.target.value)}
                    placeholder="Enter delivery address"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Delivery Terms" required>
                    <Select value={values.deliveryTerms} onValueChange={(value) => setValue('deliveryTerms', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryTerms.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Payment Terms">
                    <Input
                      value={values.paymentTerms}
                      onChange={(e) => setValue('paymentTerms', e.target.value)}
                      placeholder="e.g., Net 30 days"
                    />
                  </FormField>
                </div>

                <FormField label="Special Instructions">
                  <Textarea
                    value={values.specialInstructions}
                    onChange={(e) => setValue('specialInstructions', e.target.value)}
                    placeholder="Any special requirements, quality standards, or instructions"
                    rows={3}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Contact details for vendor inquiries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Contact Person" required error={errors.contactPerson}>
                    <Input
                      value={values.contactPerson}
                      onChange={(e) => setValue('contactPerson', e.target.value)}
                      placeholder="Full name"
                    />
                  </FormField>

                  <FormField label="Phone Number" required error={errors.contactPhone}>
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
                    placeholder="procurement@butane-energy.com"
                  />
                </FormField>

                <FormField label="Internal Notes">
                  <Textarea
                    value={values.notes}
                    onChange={(e) => setValue('notes', e.target.value)}
                    placeholder="Internal notes (not visible to vendors)"
                    rows={2}
                  />
                </FormField>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vendors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Selected Vendors
                </CardTitle>
                <CardDescription>
                  Choose vendors to send this RFQ to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" onClick={addVendor} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>

                  {vendors.length > 0 && (
                    <div className="space-y-2">
                      {vendors.map((vendor, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{vendor}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVendor(vendor)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground">
                        RFQ will be sent to {vendors.length} vendor(s)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* RFQ Info */}
            <Card>
              <CardHeader>
                <CardTitle>RFQ Information</CardTitle>
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
                  <span className="text-muted-foreground">RFQ ID:</span>
                  <span className="font-medium">RFQ-2025-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vendors:</span>
                  <span className="font-medium">{vendors.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Qty:</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}