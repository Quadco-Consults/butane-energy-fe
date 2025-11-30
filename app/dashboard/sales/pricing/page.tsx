'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  Percent,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  Save
} from 'lucide-react';

interface PriceRule {
  id: string;
  productId: string;
  productName: string;
  productType: 'cylinder' | 'bulk' | 'accessory';
  basePrice: number;
  currentPrice: number;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'scheduled';
  minPrice: number;
  maxPrice: number;
  priceHistory: {
    date: string;
    oldPrice: number;
    newPrice: number;
    reason: string;
    updatedBy: string;
  }[];
}

interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bulk';
  value: number;
  applicableProducts: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  conditions: {
    minQuantity?: number;
    customerType?: 'individual' | 'corporate' | 'distributor';
  };
  description: string;
}

export default function PricingPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showPriceEdit, setShowPriceEdit] = useState(false);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PriceRule | null>(null);

  // Mock pricing data
  const [priceRules, setPriceRules] = useState<PriceRule[]>([
    {
      id: 'price-001',
      productId: 'prod-001',
      productName: 'LPG 12.5kg Cylinder',
      productType: 'cylinder',
      basePrice: 15000,
      currentPrice: 15000,
      lastUpdated: '2024-11-29T10:00:00Z',
      status: 'active',
      minPrice: 12000,
      maxPrice: 18000,
      priceHistory: [
        {
          date: '2024-11-15T00:00:00Z',
          oldPrice: 14500,
          newPrice: 15000,
          reason: 'Market price adjustment',
          updatedBy: 'Admin User'
        }
      ]
    },
    {
      id: 'price-002',
      productId: 'prod-002',
      productName: 'LPG 6kg Cylinder',
      productType: 'cylinder',
      basePrice: 9000,
      currentPrice: 8500,
      lastUpdated: '2024-11-28T14:30:00Z',
      status: 'active',
      minPrice: 7000,
      maxPrice: 10000,
      priceHistory: [
        {
          date: '2024-11-28T14:30:00Z',
          oldPrice: 9000,
          newPrice: 8500,
          reason: 'Promotional pricing',
          updatedBy: 'Sales Manager'
        }
      ]
    },
    {
      id: 'price-003',
      productId: 'prod-003',
      productName: 'Bulk LPG (per kg)',
      productType: 'bulk',
      basePrice: 800,
      currentPrice: 780,
      lastUpdated: '2024-11-29T09:15:00Z',
      status: 'active',
      minPrice: 700,
      maxPrice: 900,
      priceHistory: [
        {
          date: '2024-11-29T09:15:00Z',
          oldPrice: 800,
          newPrice: 780,
          reason: 'Bulk discount adjustment',
          updatedBy: 'Operations Manager'
        }
      ]
    },
    {
      id: 'price-004',
      productId: 'prod-004',
      productName: 'Gas Regulator',
      productType: 'accessory',
      basePrice: 3500,
      currentPrice: 3500,
      lastUpdated: '2024-11-20T00:00:00Z',
      status: 'active',
      minPrice: 3000,
      maxPrice: 4000,
      priceHistory: []
    }
  ]);

  // Mock promotions data
  const [promotions] = useState<Promotion[]>([
    {
      id: 'promo-001',
      name: 'Weekend Special - 6kg Cylinder',
      type: 'percentage',
      value: 5,
      applicableProducts: ['prod-002'],
      startDate: '2024-11-29T00:00:00Z',
      endDate: '2024-12-01T23:59:59Z',
      status: 'active',
      conditions: {
        customerType: 'individual'
      },
      description: '5% off on 6kg cylinders for individual customers'
    },
    {
      id: 'promo-002',
      name: 'Bulk Purchase Discount',
      type: 'percentage',
      value: 10,
      applicableProducts: ['prod-003'],
      startDate: '2024-11-25T00:00:00Z',
      endDate: '2024-12-25T23:59:59Z',
      status: 'active',
      conditions: {
        minQuantity: 1000,
        customerType: 'distributor'
      },
      description: '10% off bulk LPG for orders over 1000kg'
    },
    {
      id: 'promo-003',
      name: 'New Year Promotion',
      type: 'fixed',
      value: 1000,
      applicableProducts: ['prod-001'],
      startDate: '2024-12-31T00:00:00Z',
      endDate: '2025-01-07T23:59:59Z',
      status: 'scheduled',
      conditions: {},
      description: '₦1000 off 12.5kg cylinders for New Year'
    }
  ]);

  const filteredPrices = priceRules.filter(rule => {
    const matchesSearch = rule.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || rule.productType === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Clock }
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPromotionBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
      scheduled: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculatePriceChange = (rule: PriceRule) => {
    if (rule.priceHistory.length === 0) return 0;
    const lastChange = rule.priceHistory[rule.priceHistory.length - 1];
    return ((lastChange.newPrice - lastChange.oldPrice) / lastChange.oldPrice) * 100;
  };

  const updatePrice = (ruleId: string, newPrice: number, reason: string) => {
    setPriceRules(prev =>
      prev.map(rule =>
        rule.id === ruleId
          ? {
              ...rule,
              currentPrice: newPrice,
              lastUpdated: new Date().toISOString(),
              priceHistory: [
                ...rule.priceHistory,
                {
                  date: new Date().toISOString(),
                  oldPrice: rule.currentPrice,
                  newPrice: newPrice,
                  reason: reason,
                  updatedBy: user?.name || 'Current User'
                }
              ]
            }
          : rule
      )
    );
    setShowPriceEdit(false);
    setSelectedProduct(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-primary" />
              Pricing Management
            </h1>
            <p className="text-muted-foreground">
              Update product prices and manage promotional offers
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowPromotionDialog(true)}>
              <Tag className="h-4 w-4" />
              Create Promotion
            </Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save All Changes
            </Button>
          </div>
        </div>

        {/* Price Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Products
              </CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{priceRules.length}</div>
              <p className="text-xs text-blue-600">
                Price rules configured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Price Change
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2.3%</div>
              <p className="text-xs text-green-600">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Promotions
              </CardTitle>
              <Percent className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {promotions.filter(p => p.status === 'active').length}
              </div>
              <p className="text-xs text-orange-600">
                Running campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Price Updates
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {priceRules.filter(rule =>
                  new Date(rule.lastUpdated).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                ).length}
              </div>
              <p className="text-xs text-purple-600">
                This week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Price Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Pricing</CardTitle>
                <CardDescription>Manage product prices and pricing rules</CardDescription>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="cylinder">Cylinders</SelectItem>
                  <SelectItem value="bulk">Bulk Products</SelectItem>
                  <SelectItem value="accessory">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.map((rule) => {
                  const priceChange = calculatePriceChange(rule);
                  return (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.productName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.productType}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(rule.basePrice)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(rule.currentPrice)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {priceChange !== 0 && (
                            <>
                              {priceChange > 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                              )}
                              <span className={priceChange > 0 ? 'text-green-600' : 'text-red-600'}>
                                {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCurrency(rule.minPrice)} - {formatCurrency(rule.maxPrice)}
                      </TableCell>
                      <TableCell>{getStatusBadge(rule.status)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(rule.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(rule);
                            setShowPriceEdit(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Promotions */}
        <Card>
          <CardHeader>
            <CardTitle>Active Promotions</CardTitle>
            <CardDescription>Current promotional campaigns and discounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promotions.map((promotion) => (
                <Card key={promotion.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-blue-500" />
                        <div>
                          <CardTitle className="text-base">{promotion.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{promotion.description}</p>
                        </div>
                      </div>
                      {getPromotionBadge(promotion.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <label className="font-medium">Discount</label>
                        <p>
                          {promotion.type === 'percentage' ? `${promotion.value}%` : formatCurrency(promotion.value)}
                        </p>
                      </div>
                      <div>
                        <label className="font-medium">Valid Period</label>
                        <p>
                          {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="font-medium">Conditions</label>
                        <p>
                          {promotion.conditions.minQuantity ? `Min ${promotion.conditions.minQuantity} units` : 'No minimum'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Edit Dialog */}
        <Dialog open={showPriceEdit} onOpenChange={setShowPriceEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Price - {selectedProduct?.productName}</DialogTitle>
              <DialogDescription>
                Adjust the current selling price for this product
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Price</Label>
                    <Input value={formatCurrency(selectedProduct.currentPrice)} disabled />
                  </div>
                  <div>
                    <Label>Base Price</Label>
                    <Input value={formatCurrency(selectedProduct.basePrice)} disabled />
                  </div>
                </div>

                <div>
                  <Label>New Price</Label>
                  <Input
                    type="number"
                    placeholder="Enter new price"
                    min={selectedProduct.minPrice}
                    max={selectedProduct.maxPrice}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Range: {formatCurrency(selectedProduct.minPrice)} - {formatCurrency(selectedProduct.maxPrice)}
                  </p>
                </div>

                <div>
                  <Label>Reason for Change</Label>
                  <Textarea placeholder="Enter reason for price change..." />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPriceEdit(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // In a real app, get values from form inputs
                if (selectedProduct) {
                  updatePrice(selectedProduct.id, selectedProduct.currentPrice + 100, 'Price adjustment');
                }
              }}>
                Update Price
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Promotion Dialog */}
        <Dialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
              <DialogDescription>
                Set up a new promotional campaign or discount
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Promotion Name</Label>
                <Input placeholder="e.g., Holiday Special Discount" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="bulk">Bulk Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Discount Value</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea placeholder="Describe the promotion terms and conditions" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPromotionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowPromotionDialog(false)}>
                Create Promotion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}