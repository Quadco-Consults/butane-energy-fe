"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  FileText,
  Building2,
  Briefcase,
  CreditCard,
  PieChart,
  Minus,
  Plus
} from "lucide-react";
import { useState } from "react";

// Mock Balance Sheet Data
const balanceSheetData = {
  "2024-01-31": {
    date: "January 31, 2024",
    assets: {
      currentAssets: {
        cashAndCashEquivalents: 45250000,
        accountsReceivable: 22100000,
        inventory: 85000000,
        prepaidExpenses: 3200000,
        otherCurrentAssets: 1800000,
        total: 157350000
      },
      nonCurrentAssets: {
        propertyPlantEquipment: 285000000,
        accumulatedDepreciation: -65000000,
        netPPE: 220000000,
        intangibleAssets: 12000000,
        investments: 8500000,
        otherAssets: 4200000,
        total: 244700000
      },
      totalAssets: 402050000
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable: 15250000,
        shortTermDebt: 8500000,
        accruedLiabilities: 6800000,
        currentPortionLongTermDebt: 12000000,
        otherCurrentLiabilities: 2450000,
        total: 45000000
      },
      nonCurrentLiabilities: {
        longTermDebt: 85000000,
        deferredTaxLiabilities: 8500000,
        otherLongTermLiabilities: 3200000,
        total: 96700000
      },
      totalLiabilities: 141700000
    },
    equity: {
      paidUpCapital: 150000000,
      retainedEarnings: 95350000,
      currentYearEarnings: 15000000,
      otherComprehensiveIncome: 0,
      total: 260350000
    },
    totalLiabilitiesAndEquity: 402050000
  },
  "2023-12-31": {
    date: "December 31, 2023",
    assets: {
      currentAssets: {
        cashAndCashEquivalents: 38750000,
        accountsReceivable: 19800000,
        inventory: 82500000,
        prepaidExpenses: 2900000,
        otherCurrentAssets: 1650000,
        total: 145600000
      },
      nonCurrentAssets: {
        propertyPlantEquipment: 285000000,
        accumulatedDepreciation: -62800000,
        netPPE: 222200000,
        intangibleAssets: 12500000,
        investments: 8200000,
        otherAssets: 4100000,
        total: 247000000
      },
      totalAssets: 392600000
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable: 18500000,
        shortTermDebt: 10000000,
        accruedLiabilities: 5900000,
        currentPortionLongTermDebt: 12000000,
        otherCurrentLiabilities: 2100000,
        total: 48500000
      },
      nonCurrentLiabilities: {
        longTermDebt: 97000000,
        deferredTaxLiabilities: 7800000,
        otherLongTermLiabilities: 2950000,
        total: 107750000
      },
      totalLiabilities: 156250000
    },
    equity: {
      paidUpCapital: 150000000,
      retainedEarnings: 86350000,
      currentYearEarnings: 0,
      otherComprehensiveIncome: 0,
      total: 236350000
    },
    totalLiabilitiesAndEquity: 392600000
  }
};

export default function BalanceSheetPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState("2024-01-31");
  const [comparisonDate, setComparisonDate] = useState("2023-12-31");

  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentData = balanceSheetData[selectedDate as keyof typeof balanceSheetData];
  const comparisonData = balanceSheetData[comparisonDate as keyof typeof balanceSheetData];

  // Calculate key ratios
  const currentRatio = currentData.assets.currentAssets.total / currentData.liabilities.currentLiabilities.total;
  const quickRatio = (currentData.assets.currentAssets.total - currentData.assets.currentAssets.inventory) / currentData.liabilities.currentLiabilities.total;
  const debtToEquity = currentData.liabilities.totalLiabilities / currentData.equity.total;
  const debtToAssets = currentData.liabilities.totalLiabilities / currentData.assets.totalAssets;
  const equityRatio = currentData.equity.total / currentData.assets.totalAssets;
  const workingCapital = currentData.assets.currentAssets.total - currentData.liabilities.currentLiabilities.total;

  // Calculate changes
  const totalAssetsChange = ((currentData.assets.totalAssets - comparisonData.assets.totalAssets) / comparisonData.assets.totalAssets) * 100;
  const totalLiabilitiesChange = ((currentData.liabilities.totalLiabilities - comparisonData.liabilities.totalLiabilities) / comparisonData.liabilities.totalLiabilities) * 100;
  const totalEquityChange = ((currentData.equity.total - comparisonData.equity.total) / comparisonData.equity.total) * 100;

  const getVarianceIcon = (change: number) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Minus;
  };

  const getVarianceColor = (change: number, isAssetType: boolean = true) => {
    if (isAssetType) {
      return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
    } else {
      // For liabilities, increase might be bad (depends on context)
      return change > 0 ? 'text-orange-600' : change < 0 ? 'text-green-600' : 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Balance Sheet</h1>
        <p className="text-muted-foreground mt-2">
          Generate balance sheets and analyze financial position of Butane Energy
        </p>
      </div>

      {/* Date Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Date</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="2024-01-31">January 31, 2024</option>
            <option value="2023-12-31">December 31, 2023</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Comparison Date</label>
          <select
            value={comparisonDate}
            onChange={(e) => setComparisonDate(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="2023-12-31">December 31, 2023</option>
            <option value="2024-01-31">January 31, 2024</option>
          </select>
        </div>
        <div className="flex gap-2 items-end">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Balance Sheet
          </Button>
        </div>
      </div>

      {/* Key Financial Ratios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{currentRatio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {currentRatio >= 2 ? 'Excellent' : currentRatio >= 1.5 ? 'Good' : currentRatio >= 1 ? 'Fair' : 'Poor'} liquidity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Debt-to-Equity</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{debtToEquity.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {debtToEquity <= 0.5 ? 'Conservative' : debtToEquity <= 1 ? 'Moderate' : 'Aggressive'} leverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Capital</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(workingCapital)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available operating funds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equity Ratio</CardTitle>
            <PieChart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{(equityRatio * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Owner's stake in assets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="balance-sheet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="analysis">Ratio Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Period Comparison</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Balance Sheet Statement */}
        <TabsContent value="balance-sheet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Balance Sheet - {currentData.date}
              </CardTitle>
              <CardDescription>
                Statement of financial position showing assets, liabilities, and equity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Assets Section */}
                <div>
                  <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    ASSETS
                  </h2>

                  {/* Current Assets */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-600 mb-3">Current Assets</h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Cash and Cash Equivalents</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.currentAssets.cashAndCashEquivalents)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Accounts Receivable</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.currentAssets.accountsReceivable)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Inventory</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.currentAssets.inventory)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Prepaid Expenses</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.currentAssets.prepaidExpenses)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Other Current Assets</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.currentAssets.otherCurrentAssets)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t-2 border-green-200 font-bold">
                        <span className="text-green-700">Total Current Assets</span>
                        <span className="text-green-700">{formatCurrency(currentData.assets.currentAssets.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Non-Current Assets */}
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-3">Non-Current Assets</h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Property, Plant & Equipment</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.nonCurrentAssets.propertyPlantEquipment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 pl-4">
                        <span className="text-sm font-medium text-muted-foreground">Less: Accumulated Depreciation</span>
                        <span className="font-bold text-red-600">
                          ({formatCurrency(Math.abs(currentData.assets.nonCurrentAssets.accumulatedDepreciation))})
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Net Property, Plant & Equipment</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.nonCurrentAssets.netPPE)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Intangible Assets</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.nonCurrentAssets.intangibleAssets)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Investments</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.nonCurrentAssets.investments)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Other Assets</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(currentData.assets.nonCurrentAssets.otherAssets)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t-2 border-green-200 font-bold">
                        <span className="text-green-700">Total Non-Current Assets</span>
                        <span className="text-green-700">{formatCurrency(currentData.assets.nonCurrentAssets.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Assets */}
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 mt-4">
                    <div className="flex justify-between items-center font-bold text-xl">
                      <span className="text-green-700">TOTAL ASSETS</span>
                      <span className="text-green-700">{formatCurrency(currentData.assets.totalAssets)}</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities & Equity Section */}
                <div>
                  <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                    <Minus className="h-5 w-5" />
                    LIABILITIES AND EQUITY
                  </h2>

                  {/* Current Liabilities */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-red-600 mb-3">Current Liabilities</h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Accounts Payable</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(currentData.liabilities.currentLiabilities.accountsPayable)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Short-term Debt</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(currentData.liabilities.currentLiabilities.shortTermDebt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Accrued Liabilities</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(currentData.liabilities.currentLiabilities.accruedLiabilities)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Current Portion of Long-term Debt</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(currentData.liabilities.currentLiabilities.currentPortionLongTermDebt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Other Current Liabilities</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(currentData.liabilities.currentLiabilities.otherCurrentLiabilities)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t-2 border-red-200 font-bold">
                        <span className="text-red-700">Total Current Liabilities</span>
                        <span className="text-red-700">{formatCurrency(currentData.liabilities.currentLiabilities.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Non-Current Liabilities */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-red-600 mb-3">Non-Current Liabilities</h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Long-term Debt</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(currentData.liabilities.nonCurrentLiabilities.longTermDebt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Deferred Tax Liabilities</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(currentData.liabilities.nonCurrentLiabilities.deferredTaxLiabilities)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Other Long-term Liabilities</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(currentData.liabilities.nonCurrentLiabilities.otherLongTermLiabilities)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t-2 border-red-200 font-bold">
                        <span className="text-red-700">Total Non-Current Liabilities</span>
                        <span className="text-red-700">{formatCurrency(currentData.liabilities.nonCurrentLiabilities.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Liabilities */}
                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200 mb-6">
                    <div className="flex justify-between items-center font-bold text-xl">
                      <span className="text-red-700">TOTAL LIABILITIES</span>
                      <span className="text-red-700">{formatCurrency(currentData.liabilities.totalLiabilities)}</span>
                    </div>
                  </div>

                  {/* Equity Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">Shareholders' Equity</h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Paid-up Capital</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(currentData.equity.paidUpCapital)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Retained Earnings</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(currentData.equity.retainedEarnings)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Current Year Earnings</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(currentData.equity.currentYearEarnings)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t-2 border-blue-200 font-bold">
                        <span className="text-blue-700">Total Shareholders' Equity</span>
                        <span className="text-blue-700">{formatCurrency(currentData.equity.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Liabilities and Equity */}
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mt-6">
                    <div className="flex justify-between items-center font-bold text-xl">
                      <span className="text-blue-700">TOTAL LIABILITIES AND EQUITY</span>
                      <span className="text-blue-700">{formatCurrency(currentData.totalLiabilitiesAndEquity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ratio Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Liquidity Ratios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Liquidity Ratios
                </CardTitle>
                <CardDescription>Ability to meet short-term obligations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Current Ratio</span>
                      <Badge variant={currentRatio >= 2 ? 'default' : currentRatio >= 1.5 ? 'secondary' : 'destructive'}>
                        {currentRatio.toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current Assets ÷ Current Liabilities = {formatCurrency(currentData.assets.currentAssets.total)} ÷ {formatCurrency(currentData.liabilities.currentLiabilities.total)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Quick Ratio</span>
                      <Badge variant={quickRatio >= 1.5 ? 'default' : quickRatio >= 1 ? 'secondary' : 'destructive'}>
                        {quickRatio.toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      (Current Assets - Inventory) ÷ Current Liabilities
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Working Capital</span>
                      <span className="font-bold text-green-600">{formatCurrency(workingCapital)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current Assets - Current Liabilities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leverage Ratios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Leverage Ratios
                </CardTitle>
                <CardDescription>Financial leverage and debt management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Debt-to-Equity</span>
                      <Badge variant={debtToEquity <= 0.5 ? 'default' : debtToEquity <= 1 ? 'secondary' : 'destructive'}>
                        {debtToEquity.toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total Liabilities ÷ Total Equity = {formatCurrency(currentData.liabilities.totalLiabilities)} ÷ {formatCurrency(currentData.equity.total)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Debt-to-Assets</span>
                      <Badge variant={debtToAssets <= 0.3 ? 'default' : debtToAssets <= 0.5 ? 'secondary' : 'destructive'}>
                        {(debtToAssets * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total Liabilities ÷ Total Assets
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Equity Ratio</span>
                      <span className="font-bold text-blue-600">{(equityRatio * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total Equity ÷ Total Assets
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Period-over-Period Comparison
              </CardTitle>
              <CardDescription>
                Changes between {currentData.date} and {comparisonData.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Changes */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {React.createElement(getVarianceIcon(totalAssetsChange), {
                        className: `h-4 w-4 ${getVarianceColor(totalAssetsChange)}`
                      })}
                      <span className="font-bold text-lg">Total Assets</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(currentData.assets.totalAssets)}</p>
                    <p className={`text-sm ${getVarianceColor(totalAssetsChange)}`}>
                      {totalAssetsChange > 0 ? '+' : ''}{totalAssetsChange.toFixed(1)}% change
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {React.createElement(getVarianceIcon(totalLiabilitiesChange), {
                        className: `h-4 w-4 ${getVarianceColor(totalLiabilitiesChange, false)}`
                      })}
                      <span className="font-bold text-lg">Total Liabilities</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(currentData.liabilities.totalLiabilities)}</p>
                    <p className={`text-sm ${getVarianceColor(totalLiabilitiesChange, false)}`}>
                      {totalLiabilitiesChange > 0 ? '+' : ''}{totalLiabilitiesChange.toFixed(1)}% change
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {React.createElement(getVarianceIcon(totalEquityChange), {
                        className: `h-4 w-4 ${getVarianceColor(totalEquityChange)}`
                      })}
                      <span className="font-bold text-lg">Total Equity</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(currentData.equity.total)}</p>
                    <p className={`text-sm ${getVarianceColor(totalEquityChange)}`}>
                      {totalEquityChange > 0 ? '+' : ''}{totalEquityChange.toFixed(1)}% change
                    </p>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Asset Changes</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Cash & Cash Equivalents', current: currentData.assets.currentAssets.cashAndCashEquivalents, previous: comparisonData.assets.currentAssets.cashAndCashEquivalents },
                        { label: 'Accounts Receivable', current: currentData.assets.currentAssets.accountsReceivable, previous: comparisonData.assets.currentAssets.accountsReceivable },
                        { label: 'Inventory', current: currentData.assets.currentAssets.inventory, previous: comparisonData.assets.currentAssets.inventory },
                        { label: 'Property, Plant & Equipment (Net)', current: currentData.assets.nonCurrentAssets.netPPE, previous: comparisonData.assets.nonCurrentAssets.netPPE }
                      ].map((item) => {
                        const change = ((item.current - item.previous) / item.previous) * 100;
                        return (
                          <div key={item.label} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm font-medium">{item.label}</span>
                            <div className="text-right">
                              <span className="text-sm font-bold">{formatCurrency(item.current)}</span>
                              <span className={`block text-xs ${getVarianceColor(change)}`}>
                                {change > 0 ? '+' : ''}{change.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Liability & Equity Changes</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Accounts Payable', current: currentData.liabilities.currentLiabilities.accountsPayable, previous: comparisonData.liabilities.currentLiabilities.accountsPayable },
                        { label: 'Short-term Debt', current: currentData.liabilities.currentLiabilities.shortTermDebt, previous: comparisonData.liabilities.currentLiabilities.shortTermDebt },
                        { label: 'Long-term Debt', current: currentData.liabilities.nonCurrentLiabilities.longTermDebt, previous: comparisonData.liabilities.nonCurrentLiabilities.longTermDebt },
                        { label: 'Retained Earnings', current: currentData.equity.retainedEarnings, previous: comparisonData.equity.retainedEarnings }
                      ].map((item) => {
                        const change = ((item.current - item.previous) / item.previous) * 100;
                        return (
                          <div key={item.label} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm font-medium">{item.label}</span>
                            <div className="text-right">
                              <span className="text-sm font-bold">{formatCurrency(item.current)}</span>
                              <span className={`block text-xs ${item.label.includes('Debt') || item.label.includes('Payable') ? getVarianceColor(change, false) : getVarianceColor(change)}`}>
                                {change > 0 ? '+' : ''}{change.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Financial Position Analysis
              </CardTitle>
              <CardDescription>Key insights and financial health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Asset Composition */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Asset Composition</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Current Assets</span>
                        <div className="text-right">
                          <span className="font-bold text-green-600">{formatCurrency(currentData.assets.currentAssets.total)}</span>
                          <span className="block text-xs text-green-600">
                            {((currentData.assets.currentAssets.total / currentData.assets.totalAssets) * 100).toFixed(1)}% of total
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Non-Current Assets</span>
                        <div className="text-right">
                          <span className="font-bold text-blue-600">{formatCurrency(currentData.assets.nonCurrentAssets.total)}</span>
                          <span className="block text-xs text-blue-600">
                            {((currentData.assets.nonCurrentAssets.total / currentData.assets.totalAssets) * 100).toFixed(1)}% of total
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Asset Quality Indicators</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Cash Position:</span>
                            <span className="font-medium">Strong ({((currentData.assets.currentAssets.cashAndCashEquivalents / currentData.assets.totalAssets) * 100).toFixed(1)}%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Inventory Level:</span>
                            <span className="font-medium">High ({((currentData.assets.currentAssets.inventory / currentData.assets.totalAssets) * 100).toFixed(1)}%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PPE Investment:</span>
                            <span className="font-medium">Significant ({((currentData.assets.nonCurrentAssets.netPPE / currentData.assets.totalAssets) * 100).toFixed(1)}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capital Structure */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Capital Structure</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <h4 className="font-medium text-red-700">Debt Financing</h4>
                      <p className="text-2xl font-bold text-red-600">
                        {((currentData.liabilities.totalLiabilities / currentData.assets.totalAssets) * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-red-600">{formatCurrency(currentData.liabilities.totalLiabilities)}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <h4 className="font-medium text-blue-700">Equity Financing</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {((currentData.equity.total / currentData.assets.totalAssets) * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-blue-600">{formatCurrency(currentData.equity.total)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <h4 className="font-medium text-gray-700">Financial Leverage</h4>
                      <p className="text-2xl font-bold text-gray-600">{debtToEquity.toFixed(2)}x</p>
                      <p className="text-xs text-gray-600">Debt-to-Equity Ratio</p>
                    </div>
                  </div>
                </div>

                {/* Financial Health Summary */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-3">Financial Health Summary</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Strong current ratio ({currentRatio.toFixed(2)}) indicates good liquidity
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Healthy cash position ({formatCurrency(currentData.assets.currentAssets.cashAndCashEquivalents)})
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Conservative debt levels (D/E: {debtToEquity.toFixed(2)})
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-700 mb-2">Areas of Focus</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Monitor inventory levels and turnover
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Optimize accounts receivable collection
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Consider growth investment opportunities
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}