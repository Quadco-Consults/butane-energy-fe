'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  DollarSign,
  User,
  Eye,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  Printer
} from 'lucide-react';
import Link from 'next/link';

export default function InvoiceGenerationPage() {
  const { user } = useAuth();

  // Mock invoice data
  const invoices = [
    {
      id: 'INV-2025-1456',
      invoiceNumber: 'BE/INV/2025/1456',
      customerName: 'Manufacturing Corp Ltd',
      customerEmail: 'accounts@manufacturingcorp.com',
      customerAddress: 'Plot 45, Industrial Estate, Kano',
      salesOrderId: 'SO-2025-789',
      salesRep: 'Ahmed Mohammed',
      issueDate: '2025-11-08',
      dueDate: '2025-12-08',
      paymentTerms: 'Net 30',
      items: [
        { description: 'LPG 50kg Cylinders', quantity: 100, unitPrice: 25000, totalPrice: 2500000 },
        { description: 'Delivery Charges', quantity: 1, unitPrice: 50000, totalPrice: 50000 }
      ],
      subtotal: 2550000,
      tax: 127500, // 5% VAT
      discount: 50000,
      totalAmount: 2627500,
      amountPaid: 2627500,
      balance: 0,
      paymentStatus: 'paid',
      status: 'completed',
      plant: 'Kano Plant',
      currency: 'NGN',
      generatedBy: 'Ibrahim Usman',
      approvedBy: 'Grace Adebayo',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-11-08',
      notes: 'Payment received on time. Customer satisfied with delivery.'
    },
    {
      id: 'INV-2025-1457',
      invoiceNumber: 'BE/INV/2025/1457',
      customerName: 'HomeGas Distributors',
      customerEmail: 'billing@homegas.ng',
      customerAddress: 'No. 12, Central Market Road, Kaduna',
      salesOrderId: 'SO-2025-790',
      salesRep: 'Fatima Bello',
      issueDate: '2025-11-08',
      dueDate: '2025-11-23',
      paymentTerms: 'Net 15',
      items: [
        { description: 'LPG 12.5kg Cylinders', quantity: 500, unitPrice: 8500, totalPrice: 4250000 },
        { description: 'Cylinder Maintenance', quantity: 1, unitPrice: 25000, totalPrice: 25000 }
      ],
      subtotal: 4275000,
      tax: 213750,
      discount: 125000,
      totalAmount: 4363750,
      amountPaid: 0,
      balance: 4363750,
      paymentStatus: 'pending',
      status: 'sent',
      plant: 'Kaduna Plant',
      currency: 'NGN',
      generatedBy: 'Ahmed Mohammed',
      approvedBy: 'Emeka Okafor',
      paymentMethod: null,
      paymentDate: null,
      notes: 'Invoice sent to customer. Follow up required in 7 days.'
    },
    {
      id: 'INV-2025-1458',
      invoiceNumber: 'BE/INV/2025/1458',
      customerName: 'Restaurant Chain Nigeria',
      customerEmail: 'procurement@restaurantchain.com',
      customerAddress: 'Suite 34, Business Complex, Abuja',
      salesOrderId: 'SO-2025-791',
      salesRep: 'Ibrahim Usman',
      issueDate: '2025-11-07',
      dueDate: '2025-11-22',
      paymentTerms: 'Net 15',
      items: [
        { description: 'LPG 25kg Cylinders', quantity: 200, unitPrice: 15000, totalPrice: 3000000 }
      ],
      subtotal: 3000000,
      tax: 150000,
      discount: 0,
      totalAmount: 3150000,
      amountPaid: 1575000,
      balance: 1575000,
      paymentStatus: 'partial',
      status: 'sent',
      plant: 'Abuja Plant',
      currency: 'NGN',
      generatedBy: 'Fatima Bello',
      approvedBy: 'Grace Adebayo',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-11-07',
      notes: 'Partial payment received. Customer requested installment payment.'
    },
    {
      id: 'INV-2025-1459',
      invoiceNumber: 'BE/INV/2025/1459',
      customerName: 'Industrial Steel Works',
      customerEmail: 'finance@steelworks.ng',
      customerAddress: 'Km 10, Industrial Zone, Kano',
      salesOrderId: 'SO-2025-792',
      salesRep: 'Ahmed Mohammed',
      issueDate: '2025-11-06',
      dueDate: '2025-11-21',
      paymentTerms: 'Net 15',
      items: [
        { description: 'LPG Bulk Supply (MT)', quantity: 50, unitPrice: 500000, totalPrice: 25000000 }
      ],
      subtotal: 25000000,
      tax: 1250000,
      discount: 1000000,
      totalAmount: 25250000,
      amountPaid: 25250000,
      balance: 0,
      paymentStatus: 'paid',
      status: 'completed',
      plant: 'Kano Plant',
      currency: 'NGN',
      generatedBy: 'Ibrahim Usman',
      approvedBy: 'Grace Adebayo',
      paymentMethod: 'Advance Payment',
      paymentDate: '2025-11-05',
      notes: 'Advance payment received before delivery. Bulk discount applied.'
    },
    {
      id: 'INV-2025-1460',
      invoiceNumber: 'BE/INV/2025/1460',
      customerName: 'City Gas Retail',
      customerEmail: 'accounts@citygas.com',
      customerAddress: 'Plot 89, Lagos Mainland',
      salesOrderId: 'SO-2025-793',
      salesRep: 'Fatima Bello',
      issueDate: '2025-11-05',
      dueDate: '2025-11-19',
      paymentTerms: 'Cash',
      items: [
        { description: 'LPG 6kg Cylinders', quantity: 300, unitPrice: 4500, totalPrice: 1350000 },
        { description: 'Transport Fee', quantity: 1, unitPrice: 15000, totalPrice: 15000 }
      ],
      subtotal: 1365000,
      tax: 68250,
      discount: 27000,
      totalAmount: 1406250,
      amountPaid: 1406250,
      balance: 0,
      paymentStatus: 'paid',
      status: 'completed',
      plant: 'Lagos Plant',
      currency: 'NGN',
      generatedBy: 'Ahmed Mohammed',
      approvedBy: 'Emeka Okafor',
      paymentMethod: 'Cash',
      paymentDate: '2025-11-05',
      notes: 'Cash payment on delivery. Regular customer with good payment history.'
    },
    {
      id: 'INV-2025-1461',
      invoiceNumber: 'BE/INV/2025/1461',
      customerName: 'Hotel Grand Palace',
      customerEmail: 'accounts@grandpalace.ng',
      customerAddress: 'Victoria Island, Lagos',
      salesOrderId: 'SO-2025-794',
      salesRep: 'Ibrahim Usman',
      issueDate: '2025-11-04',
      dueDate: '2025-11-19',
      paymentTerms: 'Net 15',
      items: [
        { description: 'LPG 45kg Cylinders', quantity: 80, unitPrice: 22000, totalPrice: 1760000 }
      ],
      subtotal: 1760000,
      tax: 88000,
      discount: 0,
      totalAmount: 1848000,
      amountPaid: 0,
      balance: 1848000,
      paymentStatus: 'overdue',
      status: 'sent',
      plant: 'Lagos Plant',
      currency: 'NGN',
      generatedBy: 'Fatima Bello',
      approvedBy: 'Grace Adebayo',
      paymentMethod: null,
      paymentDate: null,
      notes: 'Payment overdue by 3 days. Customer contacted for follow-up.',
      overdueBy: 3
    }
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'partial': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const invoiceStats = {
    totalInvoices: invoices.length,
    totalValue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    totalPaid: invoices.reduce((sum, inv) => sum + inv.amountPaid, 0),
    overdueInvoices: invoices.filter(inv => inv.paymentStatus === 'overdue').length,
    pendingPayments: invoices.filter(inv => inv.paymentStatus === 'pending' || inv.paymentStatus === 'partial').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invoice Generation</h1>
            <p className="text-muted-foreground">
              Generate and manage invoices for LPG sales and services
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/operations/trading/invoices/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate Invoice
              </Button>
            </Link>
          </div>
        </div>

        {/* Invoice Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                  <p className="text-xl font-bold">{invoiceStats.totalInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">₦{invoiceStats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Amount Collected</p>
                  <p className="text-xl font-bold">₦{invoiceStats.totalPaid.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-xl font-bold">{invoiceStats.overdueInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Invoices</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => {
                const daysOverdue = getDaysOverdue(invoice.dueDate);
                return (
                  <div key={invoice.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                          <Badge className={`${getStatusColor(invoice.status)} text-white`}>
                            {invoice.status}
                          </Badge>
                          <Badge className={`${getPaymentStatusColor(invoice.paymentStatus)} text-white`}>
                            {invoice.paymentStatus}
                          </Badge>
                          {invoice.paymentStatus === 'overdue' && daysOverdue > 0 && (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              {daysOverdue} days overdue
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Customer</p>
                            <p className="text-muted-foreground">{invoice.customerName}</p>
                          </div>
                          <div>
                            <p className="font-medium">Sales Order</p>
                            <p className="text-muted-foreground">{invoice.salesOrderId}</p>
                          </div>
                          <div>
                            <p className="font-medium">Sales Rep</p>
                            <p className="text-muted-foreground">{invoice.salesRep}</p>
                          </div>
                          <div>
                            <p className="font-medium">Plant</p>
                            <p className="text-muted-foreground">{invoice.plant}</p>
                          </div>
                        </div>

                        {/* Invoice Items Summary */}
                        <div className="mb-3">
                          <p className="font-medium text-sm mb-2">Items ({invoice.items.length}):</p>
                          <div className="bg-gray-50 rounded p-3 space-y-1">
                            {invoice.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{item.description}</span>
                                <span className="text-muted-foreground">
                                  {item.quantity} × ₦{item.unitPrice.toLocaleString()} = ₦{item.totalPrice.toLocaleString()}
                                </span>
                              </div>
                            ))}
                            {invoice.items.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{invoice.items.length - 2} more items...
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-2">
                          <div>
                            <p className="font-medium">Subtotal</p>
                            <p className="text-muted-foreground">₦{invoice.subtotal.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Tax (5%)</p>
                            <p className="text-muted-foreground">₦{invoice.tax.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Discount</p>
                            <p className="text-muted-foreground">₦{invoice.discount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Amount</p>
                            <p className="text-muted-foreground font-semibold">₦{invoice.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
                          </div>
                          <div>
                            Payment Terms: {invoice.paymentTerms}
                          </div>
                          {invoice.paymentMethod && (
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {invoice.paymentMethod}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="font-medium">Amount Paid:</span>
                            <span className="text-muted-foreground ml-1">₦{invoice.amountPaid.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="font-medium">Balance:</span>
                            <span className={`ml-1 font-semibold ${
                              invoice.balance === 0 ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              ₦{invoice.balance.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Generated by:</span>
                            <span className="text-muted-foreground ml-1">{invoice.generatedBy}</span>
                          </div>
                        </div>

                        {invoice.notes && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Notes:</span>
                            <span className="text-muted-foreground ml-2">{invoice.notes}</span>
                          </div>
                        )}

                        {/* Payment status alerts */}
                        {invoice.paymentStatus === 'overdue' && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Payment overdue by {daysOverdue} days - Follow up required
                            </div>
                          </div>
                        )}

                        {invoice.paymentStatus === 'partial' && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              Partial payment received - Balance: ₦{invoice.balance.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Printer className="h-3 w-3" />
                          Print
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button variant="outline" size="sm" className="gap-2 text-blue-600">
                            <Send className="h-3 w-3" />
                            Send
                          </Button>
                        )}
                        {invoice.balance > 0 && (
                          <Button variant="outline" size="sm" className="gap-2 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Record Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}