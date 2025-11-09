'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { FormModal, FormField, useFormValidation, validationRules } from '@/components/ui/form-components';
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
  MapPin,
  Clock,
  Upload,
  Plus,
  X,
  Save,
  Send
} from 'lucide-react';
import Link from 'next/link';

// Tender categories
const tenderCategories = [
  'Equipment',
  'Services',
  'Construction',
  'Technology',
  'Safety',
  'Transportation',
  'Maintenance',
  'Professional Services',
  'Supplies & Materials',
  'Consulting'
];

// Plant/Location options
const plantOptions = [
  'All Plants',
  'Lagos Plant',
  'Abuja Plant',
  'Kano Plant',
  'Port Harcourt Plant',
  'Head Office',
  'Regional Offices'
];

// Tender types
const tenderTypes = [
  'Open Tender',
  'Selective Tender',
  'Restricted Tender',
  'Emergency Procurement',
  'Framework Agreement'
];

// Evaluation criteria
const evaluationCriteria = [
  'Lowest Price',
  'Best Value for Money',
  'Technical Competence',
  'Quality & Price',
  'Experience & Track Record'
];

export default function NewTenderPage() {
  const { user } = useAuth();
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form validation for new tender
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      title: '',
      description: '',
      category: '',
      tenderType: 'Open Tender',
      plant: '',
      estimatedValue: '',
      currency: 'NGN',
      publishDate: '',
      closingDate: '',
      evaluationCriteria: 'Best Value for Money',
      technicalRequirements: '',
      qualificationRequirements: '',
      submissionInstructions: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      termsAndConditions: '',
      notes: ''
    },
    {
      title: validationRules.required,
      description: validationRules.required,
      category: validationRules.required,
      plant: validationRules.required,
      estimatedValue: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      publishDate: validationRules.required,
      closingDate: validationRules.required,
      contactPerson: validationRules.required,
      contactEmail: (value) => validationRules.required(value) || validationRules.email(value),
      contactPhone: validationRules.required
    }
  );

  const handleSubmit = (action: 'draft' | 'publish') => {
    if (validate()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        if (action === 'draft') {
          alert('Tender saved as draft successfully!');
        } else {
          alert('Tender published successfully!');
        }
        setIsSubmitting(false);
        // Navigate back to tenders list
        window.location.href = '/dashboard/procurement/tenders';
      }, 1500);
    } else {
      alert('Please fill all required fields correctly');
    }
  };

  const addAttachment = () => {
    const fileName = prompt('Enter document name (simulation):');
    if (fileName) {
      setAttachments([...attachments, fileName]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/procurement/tenders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tenders
              </Button>
            </Link>
            <div>
              <h1 className={designSystem.getHeading("h1")}>Create New Tender</h1>
              <p className={designSystem.getBody("small")}>
                Set up a new tender process for procurement
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
              onClick={() => handleSubmit('publish')}
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Publishing...' : 'Publish Tender'}
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
                  <FileText className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the main details for this tender
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Tender Title" required error={errors.title}>
                  <Input
                    value={values.title}
                    onChange={(e) => setValue('title', e.target.value)}
                    placeholder="Enter descriptive tender title"
                  />
                </FormField>

                <FormField label="Description" required error={errors.description}>
                  <Textarea
                    value={values.description}
                    onChange={(e) => setValue('description', e.target.value)}
                    placeholder="Detailed description of what is being procured"
                    rows={4}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Category" required error={errors.category}>
                    <Select value={values.category} onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenderCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Tender Type" required>
                    <Select value={values.tenderType} onValueChange={(value) => setValue('tenderType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tenderTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Plant/Location" required error={errors.plant}>
                  <Select value={values.plant} onValueChange={(value) => setValue('plant', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plant or location" />
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
              </CardContent>
            </Card>

            {/* Financial & Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial & Timeline
                </CardTitle>
                <CardDescription>
                  Set budget estimates and important dates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Estimated Value" required error={errors.estimatedValue}>
                    <Input
                      type="number"
                      value={values.estimatedValue}
                      onChange={(e) => setValue('estimatedValue', e.target.value)}
                      placeholder="0"
                    />
                  </FormField>

                  <FormField label="Currency" required>
                    <Select value={values.currency} onValueChange={(value) => setValue('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN (₦)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Publish Date" required error={errors.publishDate}>
                    <Input
                      type="date"
                      value={values.publishDate}
                      onChange={(e) => setValue('publishDate', e.target.value)}
                    />
                  </FormField>

                  <FormField label="Closing Date" required error={errors.closingDate}>
                    <Input
                      type="date"
                      value={values.closingDate}
                      onChange={(e) => setValue('closingDate', e.target.value)}
                    />
                  </FormField>
                </div>

                <FormField label="Evaluation Criteria" required>
                  <Select value={values.evaluationCriteria} onValueChange={(value) => setValue('evaluationCriteria', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {evaluationCriteria.map((criteria) => (
                        <SelectItem key={criteria} value={criteria}>
                          {criteria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </CardContent>
            </Card>

            {/* Technical Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Requirements</CardTitle>
                <CardDescription>
                  Specify technical and qualification requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Technical Requirements">
                  <Textarea
                    value={values.technicalRequirements}
                    onChange={(e) => setValue('technicalRequirements', e.target.value)}
                    placeholder="List technical specifications, standards, and requirements"
                    rows={4}
                  />
                </FormField>

                <FormField label="Qualification Requirements">
                  <Textarea
                    value={values.qualificationRequirements}
                    onChange={(e) => setValue('qualificationRequirements', e.target.value)}
                    placeholder="Specify bidder qualifications, certifications, experience requirements"
                    rows={4}
                  />
                </FormField>

                <FormField label="Submission Instructions">
                  <Textarea
                    value={values.submissionInstructions}
                    onChange={(e) => setValue('submissionInstructions', e.target.value)}
                    placeholder="Instructions for how bids should be submitted"
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
                  Procurement contact details for inquiries
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
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Terms, conditions, and additional notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Terms and Conditions">
                  <Textarea
                    value={values.termsAndConditions}
                    onChange={(e) => setValue('termsAndConditions', e.target.value)}
                    placeholder="Special terms, payment conditions, delivery requirements"
                    rows={4}
                  />
                </FormField>

                <FormField label="Internal Notes">
                  <Textarea
                    value={values.notes}
                    onChange={(e) => setValue('notes', e.target.value)}
                    placeholder="Internal notes for this tender (not visible to bidders)"
                    rows={3}
                  />
                </FormField>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents & Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Documents
                </CardTitle>
                <CardDescription>
                  Attach tender documents and specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" onClick={addAttachment} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>

                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm truncate">{attachment}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Tender Information</CardTitle>
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
                  <span className="text-muted-foreground">Tender ID:</span>
                  <span className="font-medium">TND-2025-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</span>
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
                    For assistance with tender creation, contact the procurement team or refer to the tender guidelines.
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