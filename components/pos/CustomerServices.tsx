'use client';

import { useState } from 'react';
import { CustomerAccount, CylinderLoan } from '@/lib/types';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Search,
  Plus,
  CreditCard,
  Package,
  History,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Award
} from 'lucide-react';

interface CustomerServicesProps {
  open: boolean;
  onClose: () => void;
  onCustomerSelect?: (customer: CustomerAccount) => void;
}

export function CustomerServices({ open, onClose, onCustomerSelect }: CustomerServicesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount | null>(null);
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  // Mock customer data
  const mockCustomers: CustomerAccount[] = [
    {
      id: 'cust-001',
      name: 'Lagos Gas Station Network',
      email: 'ops@lagasgas.com',
      phone: '+234 803 123 4567',
      address: '123 Victoria Island, Lagos',
      accountType: 'corporate',
      creditLimit: 500000,
      currentBalance: -125000,
      paymentTerms: 'Net 30',
      lastPurchaseDate: '2024-11-25',
      totalPurchases: 2500000,
      loyaltyPoints: 2500,
      loyaltyTier: 'gold',
      preferredPaymentMethod: 'credit',
      cylindersOnLoan: [
        {
          cylinderId: 'cyl-001',
          cylinderSize: '12.5kg',
          loanDate: '2024-10-15',
          depositAmount: 15000,
          status: 'active'
        },
        {
          cylinderId: 'cyl-002',
          cylinderSize: '6.25kg',
          loanDate: '2024-11-01',
          depositAmount: 8000,
          status: 'active'
        }
      ],
      createdAt: '2023-05-10'
    },
    {
      id: 'cust-002',
      name: 'Kano Distribution Hub',
      email: 'manager@kanohub.com',
      phone: '+234 805 987 6543',
      address: '456 Bompai Road, Kano',
      accountType: 'regular',
      creditLimit: 100000,
      currentBalance: -35000,
      paymentTerms: 'Net 15',
      lastPurchaseDate: '2024-11-28',
      totalPurchases: 850000,
      loyaltyPoints: 850,
      loyaltyTier: 'silver',
      preferredPaymentMethod: 'transfer',
      cylindersOnLoan: [],
      createdAt: '2024-02-20'
    },
    {
      id: 'cust-003',
      name: 'Ahmed Musa',
      email: 'ahmed.musa@email.com',
      phone: '+234 706 555 1234',
      address: '789 Wuse II, Abuja',
      accountType: 'walk_in',
      creditLimit: 0,
      currentBalance: 0,
      paymentTerms: 'Cash on delivery',
      lastPurchaseDate: '2024-11-29',
      totalPurchases: 125000,
      loyaltyPoints: 125,
      loyaltyTier: 'bronze',
      preferredPaymentMethod: 'cash',
      cylindersOnLoan: [
        {
          cylinderId: 'cyl-003',
          cylinderSize: '12.5kg',
          loanDate: '2024-11-15',
          depositAmount: 15000,
          status: 'active'
        }
      ],
      createdAt: '2024-08-12'
    }
  ];

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLoyaltyColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'corporate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'regular': return 'bg-green-100 text-green-800 border-green-200';
      case 'walk_in': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'prepaid': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectCustomer = (customer: CustomerAccount) => {
    setSelectedCustomer(customer);
    onCustomerSelect?.(customer);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Services
          </DialogTitle>
          <DialogDescription>
            Search and manage customer accounts, credit limits, and cylinder loans.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setShowNewCustomer(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Customer
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Customer List */}
            <div className="col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {filteredCustomers.map((customer) => (
                        <Card
                          key={customer.id}
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedCustomer?.id === customer.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{customer.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {customer.phone}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {customer.email}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1">
                                <Badge className={getAccountTypeColor(customer.accountType)}>
                                  {customer.accountType.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <Badge className={getLoyaltyColor(customer.loyaltyTier)}>
                                  <Award className="h-3 w-3 mr-1" />
                                  {customer.loyaltyTier.toUpperCase()}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-2 border-t">
                              <div className="text-xs text-muted-foreground">
                                Balance: {customer.currentBalance < 0 ? '-' : ''}₦{Math.abs(customer.currentBalance).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {customer.cylindersOnLoan.length} cylinders on loan
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {filteredCustomers.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <User className="h-8 w-8 mx-auto mb-2" />
                          <p>No customers found</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Customer Details */}
            <div className="col-span-7">
              {selectedCustomer ? (
                <div className="space-y-4">
                  {/* Customer Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{selectedCustomer.name}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {selectedCustomer.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {selectedCustomer.email}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getAccountTypeColor(selectedCustomer.accountType)}>
                            {selectedCustomer.accountType.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getLoyaltyColor(selectedCustomer.loyaltyTier)}>
                            <Award className="h-3 w-3 mr-1" />
                            {selectedCustomer.loyaltyTier.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Address</p>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {selectedCustomer.address}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Member Since</p>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Account Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Credit Limit:</span>
                          <span>₦{selectedCustomer.creditLimit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Balance:</span>
                          <span className={selectedCustomer.currentBalance < 0 ? 'text-red-600' : 'text-green-600'}>
                            {selectedCustomer.currentBalance < 0 ? '-' : ''}₦{Math.abs(selectedCustomer.currentBalance).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available Credit:</span>
                          <span>₦{(selectedCustomer.creditLimit + selectedCustomer.currentBalance).toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span>Total Purchases:</span>
                          <span>₦{selectedCustomer.totalPurchases.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Loyalty Points:</span>
                          <span>{selectedCustomer.loyaltyPoints.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Cylinders on Loan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedCustomer.cylindersOnLoan.map((loan, index) => (
                            <div key={index} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{loan.cylinderSize} Cylinder</p>
                                  <p className="text-sm text-muted-foreground">
                                    ID: {loan.cylinderId}
                                  </p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800">
                                  {loan.status.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="mt-2 text-xs text-muted-foreground">
                                <p>Loaned: {new Date(loan.loanDate).toLocaleDateString()}</p>
                                <p>Deposit: ₦{loan.depositAmount.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}

                          {selectedCustomer.cylindersOnLoan.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground">
                              <Package className="h-6 w-6 mx-auto mb-2" />
                              <p className="text-sm">No cylinders on loan</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a customer to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {selectedCustomer && onCustomerSelect && (
            <Button onClick={() => {
              onCustomerSelect(selectedCustomer);
              onClose();
            }}>
              Select Customer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}