"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
  Calendar,
  Download,
  Eye,
  Filter,
  FileText,
  BarChart3,
  PieChart,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus
} from "lucide-react";
import { useState } from "react";
import { filterByPlantAccess } from "@/lib/filters";

// Mock P&L Data
const profitLossData = {
  "2024-01": {
    period: "January 2024",
    revenue: {
      lpgSales: 125750000,
      accessorySales: 8500000,
      serviceRevenue: 2250000,
      otherRevenue: 1500000,
      total: 138000000
    },
    costOfGoodsSold: {
      lpgPurchases: 75000000,
      transportationCost: 8500000,
      storageCost: 3200000,
      handlingCost: 1800000,
      total: 88500000
    },
    operatingExpenses: {
      salariesAndWages: 12500000,
      utilities: 3200000,
      maintenance: 2800000,
      insurance: 1500000,
      depreciation: 2200000,
      administrativeExpenses: 3800000,
      marketingExpenses: 1200000,
      total: 27200000
    },
    otherIncomeExpenses: {
      interestIncome: 250000,
      interestExpense: -1200000,
      foreignExchangeGain: 180000,
      miscellaneousExpenses: -320000,
      total: -1090000
    },
    plantBreakdown: {
      "plant-lagos-1": {
        revenue: 85000000,
        expenses: 72000000,
        profit: 13000000
      },
      "plant-kano-1": {
        revenue: 32000000,
        expenses: 28500000,
        profit: 3500000
      },
      "plant-abuja-1": {
        revenue: 21000000,
        expenses: 16290000,
        profit: 4710000
      }
    }
  },
  "2023-12": {
    period: "December 2023",
    revenue: {
      lpgSales: 142100000,
      accessorySales: 9200000,
      serviceRevenue: 2800000,
      otherRevenue: 1900000,
      total: 156000000
    },
    costOfGoodsSold: {
      lpgPurchases: 85000000,
      transportationCost: 9200000,
      storageCost: 3500000,
      handlingCost: 2100000,
      total: 99800000
    },
    operatingExpenses: {
      salariesAndWages: 12800000,
      utilities: 3500000,
      maintenance: 3200000,
      insurance: 1500000,
      depreciation: 2200000,
      administrativeExpenses: 4100000,
      marketingExpenses: 1800000,
      total: 29100000
    },
    otherIncomeExpenses: {
      interestIncome: 320000,
      interestExpense: -1100000,
      foreignExchangeGain: 450000,
      miscellaneousExpenses: -280000,
      total: -610000
    },
    plantBreakdown: {
      "plant-lagos-1": {
        revenue: 95000000,
        expenses: 78000000,
        profit: 17000000
      },
      "plant-kano-1": {
        revenue: 38000000,
        expenses: 31500000,
        profit: 6500000
      },
      "plant-abuja-1": {
        revenue: 23000000,
        expenses: 17790000,
        profit: 5210000
      }
    }
  },
  "2023-11": {
    period: "November 2023",
    revenue: {
      lpgSales: 128900000,
      accessorySales: 7800000,
      serviceRevenue: 2100000,
      otherRevenue: 1200000,
      total: 140000000
    },
    costOfGoodsSold: {
      lpgPurchases: 76500000,
      transportationCost: 8100000,
      storageCost: 3100000,
      handlingCost: 1700000,
      total: 89400000
    },
    operatingExpenses: {
      salariesAndWages: 12200000,
      utilities: 2900000,
      maintenance: 2500000,
      insurance: 1500000,
      depreciation: 2200000,
      administrativeExpenses: 3500000,
      marketingExpenses: 1100000,
      total: 25900000
    },
    otherIncomeExpenses: {
      interestIncome: 180000,
      interestExpense: -1050000,
      foreignExchangeGain: 220000,
      miscellaneousExpenses: -250000,
      total: -900000
    },
    plantBreakdown: {
      "plant-lagos-1": {
        revenue: 82000000,
        expenses: 69500000,
        profit: 12500000
      },
      "plant-kano-1": {
        revenue: 35000000,
        expenses: 28200000,
        profit: 6800000
      },
      "plant-abuja-1": {
        revenue: 23000000,
        expenses: 17500000,
        profit: 5500000
      }
    }
  }
};

const revenueCategories = [
  { key: 'lpgSales', label: 'LPG Sales', icon: DollarSign, color: 'text-green-600' },
  { key: 'accessorySales', label: 'Accessory Sales', icon: DollarSign, color: 'text-blue-600' },
  { key: 'serviceRevenue', label: 'Service Revenue', icon: DollarSign, color: 'text-purple-600' },
  { key: 'otherRevenue', label: 'Other Revenue', icon: DollarSign, color: 'text-orange-600' }
];

const expenseCategories = [
  { key: 'lpgPurchases', label: 'LPG Purchases', section: 'cogs', icon: Minus, color: 'text-red-600' },
  { key: 'transportationCost', label: 'Transportation', section: 'cogs', icon: Minus, color: 'text-red-500' },
  { key: 'storageCost', label: 'Storage Cost', section: 'cogs', icon: Minus, color: 'text-red-400' },
  { key: 'handlingCost', label: 'Handling Cost', section: 'cogs', icon: Minus, color: 'text-red-300' },
  { key: 'salariesAndWages', label: 'Salaries & Wages', section: 'opex', icon: Minus, color: 'text-orange-600' },
  { key: 'utilities', label: 'Utilities', section: 'opex', icon: Minus, color: 'text-orange-500' },
  { key: 'maintenance', label: 'Maintenance', section: 'opex', icon: Minus, color: 'text-orange-400' },
  { key: 'insurance', label: 'Insurance', section: 'opex', icon: Minus, color: 'text-orange-300' },
  { key: 'depreciation', label: 'Depreciation', section: 'opex', icon: Minus, color: 'text-yellow-600' },
  { key: 'administrativeExpenses', label: 'Administrative', section: 'opex', icon: Minus, color: 'text-yellow-500' },
  { key: 'marketingExpenses', label: 'Marketing', section: 'opex', icon: Minus, color: 'text-yellow-400' }
];

export default function ProfitLossPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("2024-01");
  const [comparisonPeriod, setComparisonPeriod] = useState("2023-12");

  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentData = profitLossData[selectedPeriod as keyof typeof profitLossData];
  const comparisonData = profitLossData[comparisonPeriod as keyof typeof profitLossData];

  // Calculate key metrics
  const currentGrossProfit = currentData.revenue.total - currentData.costOfGoodsSold.total;
  const currentOperatingProfit = currentGrossProfit - currentData.operatingExpenses.total;
  const currentNetProfit = currentOperatingProfit + currentData.otherIncomeExpenses.total;

  const comparisonGrossProfit = comparisonData.revenue.total - comparisonData.costOfGoodsSold.total;
  const comparisonOperatingProfit = comparisonGrossProfit - comparisonData.operatingExpenses.total;
  const comparisonNetProfit = comparisonOperatingProfit + comparisonData.otherIncomeExpenses.total;

  // Calculate percentage changes
  const revenueChange = ((currentData.revenue.total - comparisonData.revenue.total) / comparisonData.revenue.total) * 100;
  const grossProfitChange = ((currentGrossProfit - comparisonGrossProfit) / comparisonGrossProfit) * 100;
  const operatingProfitChange = ((currentOperatingProfit - comparisonOperatingProfit) / comparisonOperatingProfit) * 100;
  const netProfitChange = ((currentNetProfit - comparisonNetProfit) / comparisonNetProfit) * 100;

  // Calculate margins
  const grossMargin = (currentGrossProfit / currentData.revenue.total) * 100;
  const operatingMargin = (currentOperatingProfit / currentData.revenue.total) * 100;
  const netMargin = (currentNetProfit / currentData.revenue.total) * 100;

  // Filter plant data based on user access
  const accessiblePlants = user.role === 'super_admin' ?
    Object.keys(currentData.plantBreakdown) :
    Object.keys(currentData.plantBreakdown).filter(plantId => user.plantAccess.includes(plantId));

  const getVarianceIcon = (change: number) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Minus;
  };

  const getVarianceColor = (change: number, isRevenueType: boolean = true) => {
    if (isRevenueType) {
      return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
    } else {
      // For expenses, negative change (reduction) is good
      return change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profit & Loss Statement</h1>
        <p className="text-muted-foreground mt-2">
          Generate P&L statements and analyze profitability across all operations
        </p>
      </div>

      {/* Period Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Period</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="2024-01">January 2024</option>
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Comparison Period</label>
          <select
            value={comparisonPeriod}
            onChange={(e) => setComparisonPeriod(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
            <option value="2024-01">January 2024</option>
          </select>
        </div>
        <div className="flex gap-2 items-end">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export P&L
          </Button>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(currentData.revenue.total)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {React.createElement(getVarianceIcon(revenueChange), {
                className: `h-3 w-3 mr-1 ${getVarianceColor(revenueChange)}`
              })}
              <span className={getVarianceColor(revenueChange)}>
                {revenueChange > 0 ? '+' : ''}{revenueChange.toFixed(1)}%
              </span>
              <span className="ml-1">vs {comparisonData.period}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(currentGrossProfit)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {React.createElement(getVarianceIcon(grossProfitChange), {
                className: `h-3 w-3 mr-1 ${getVarianceColor(grossProfitChange)}`
              })}
              <span className={getVarianceColor(grossProfitChange)}>
                {grossProfitChange > 0 ? '+' : ''}{grossProfitChange.toFixed(1)}%
              </span>
              <span className="ml-1">• {grossMargin.toFixed(1)}% margin</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operating Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(currentOperatingProfit)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {React.createElement(getVarianceIcon(operatingProfitChange), {
                className: `h-3 w-3 mr-1 ${getVarianceColor(operatingProfitChange)}`
              })}
              <span className={getVarianceColor(operatingProfitChange)}>
                {operatingProfitChange > 0 ? '+' : ''}{operatingProfitChange.toFixed(1)}%
              </span>
              <span className="ml-1">• {operatingMargin.toFixed(1)}% margin</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(currentNetProfit)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {React.createElement(getVarianceIcon(netProfitChange), {
                className: `h-3 w-3 mr-1 ${getVarianceColor(netProfitChange)}`
              })}
              <span className={getVarianceColor(netProfitChange)}>
                {netProfitChange > 0 ? '+' : ''}{netProfitChange.toFixed(1)}%
              </span>
              <span className="ml-1">• {netMargin.toFixed(1)}% margin</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="statement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="statement">P&L Statement</TabsTrigger>
          <TabsTrigger value="analysis">Variance Analysis</TabsTrigger>
          <TabsTrigger value="plant-breakdown">Plant Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* P&L Statement Tab */}
        <TabsContent value="statement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Profit & Loss Statement - {currentData.period}
              </CardTitle>
              <CardDescription>
                Detailed financial performance for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Revenue Section */}
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    REVENUE
                  </h3>
                  <div className="space-y-2 pl-4">
                    {revenueCategories.map((category) => (
                      <div key={category.key} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">{category.label}</span>
                        <span className={`font-bold ${category.color}`}>
                          {formatCurrency(currentData.revenue[category.key as keyof typeof currentData.revenue] as number)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-green-200 font-bold text-lg">
                      <span className="text-green-700">TOTAL REVENUE</span>
                      <span className="text-green-700">{formatCurrency(currentData.revenue.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Cost of Goods Sold Section */}
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <Minus className="h-4 w-4" />
                    COST OF GOODS SOLD
                  </h3>
                  <div className="space-y-2 pl-4">
                    {expenseCategories.filter(cat => cat.section === 'cogs').map((category) => (
                      <div key={category.key} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">{category.label}</span>
                        <span className={`font-bold ${category.color}`}>
                          ({formatCurrency(currentData.costOfGoodsSold[category.key as keyof typeof currentData.costOfGoodsSold] as number)})
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-red-200 font-bold text-lg">
                      <span className="text-red-700">TOTAL COGS</span>
                      <span className="text-red-700">({formatCurrency(currentData.costOfGoodsSold.total)})</span>
                    </div>
                  </div>
                </div>

                {/* Gross Profit */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center font-bold text-xl">
                    <span className="text-blue-700">GROSS PROFIT</span>
                    <span className="text-blue-700">{formatCurrency(currentGrossProfit)}</span>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    Margin: {grossMargin.toFixed(1)}%
                  </div>
                </div>

                {/* Operating Expenses Section */}
                <div>
                  <h3 className="text-lg font-semibold text-orange-700 mb-3 flex items-center gap-2">
                    <Minus className="h-4 w-4" />
                    OPERATING EXPENSES
                  </h3>
                  <div className="space-y-2 pl-4">
                    {expenseCategories.filter(cat => cat.section === 'opex').map((category) => (
                      <div key={category.key} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">{category.label}</span>
                        <span className={`font-bold ${category.color}`}>
                          ({formatCurrency(currentData.operatingExpenses[category.key as keyof typeof currentData.operatingExpenses] as number)})
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 border-t-2 border-orange-200 font-bold text-lg">
                      <span className="text-orange-700">TOTAL OPERATING EXPENSES</span>
                      <span className="text-orange-700">({formatCurrency(currentData.operatingExpenses.total)})</span>
                    </div>
                  </div>
                </div>

                {/* Operating Profit */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center font-bold text-xl">
                    <span className="text-purple-700">OPERATING PROFIT</span>
                    <span className="text-purple-700">{formatCurrency(currentOperatingProfit)}</span>
                  </div>
                  <div className="text-sm text-purple-600 mt-1">
                    Margin: {operatingMargin.toFixed(1)}%
                  </div>
                </div>

                {/* Other Income/Expenses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    OTHER INCOME & EXPENSES
                  </h3>
                  <div className="space-y-2 pl-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium">Interest Income</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(currentData.otherIncomeExpenses.interestIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium">Interest Expense</span>
                      <span className="font-bold text-red-600">
                        ({formatCurrency(Math.abs(currentData.otherIncomeExpenses.interestExpense))})
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium">Foreign Exchange Gain</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(currentData.otherIncomeExpenses.foreignExchangeGain)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium">Miscellaneous Expenses</span>
                      <span className="font-bold text-red-600">
                        ({formatCurrency(Math.abs(currentData.otherIncomeExpenses.miscellaneousExpenses))})
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 font-bold text-lg">
                      <span className="text-gray-700">NET OTHER INCOME/EXPENSES</span>
                      <span className={currentData.otherIncomeExpenses.total >= 0 ? 'text-green-700' : 'text-red-700'}>
                        {currentData.otherIncomeExpenses.total >= 0 ? '' : '('}
                        {formatCurrency(Math.abs(currentData.otherIncomeExpenses.total))}
                        {currentData.otherIncomeExpenses.total >= 0 ? '' : ')'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                  <div className="flex justify-between items-center font-bold text-2xl">
                    <span className="text-orange-700">NET PROFIT</span>
                    <span className="text-orange-700">{formatCurrency(currentNetProfit)}</span>
                  </div>
                  <div className="text-sm text-orange-600 mt-2">
                    Net Margin: {netMargin.toFixed(1)}% •
                    Return on Revenue: {((currentNetProfit / currentData.revenue.total) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variance Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Variance Analysis: {currentData.period} vs {comparisonData.period}
              </CardTitle>
              <CardDescription>
                Detailed comparison showing changes in revenue and expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Revenue Variance */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Revenue Variance</h3>
                  <div className="space-y-3">
                    {revenueCategories.map((category) => {
                      const current = currentData.revenue[category.key as keyof typeof currentData.revenue] as number;
                      const previous = comparisonData.revenue[category.key as keyof typeof comparisonData.revenue] as number;
                      const variance = current - previous;
                      const variancePercent = (variance / previous) * 100;

                      return (
                        <div key={category.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <category.icon className={`h-4 w-4 ${category.color}`} />
                            <span className="font-medium">{category.label}</span>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${getVarianceColor(variancePercent)}`}>
                              {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                            </div>
                            <div className={`text-sm ${getVarianceColor(variancePercent)}`}>
                              {variancePercent >= 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* COGS Variance */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Cost of Goods Sold Variance</h3>
                  <div className="space-y-3">
                    {expenseCategories.filter(cat => cat.section === 'cogs').map((category) => {
                      const current = currentData.costOfGoodsSold[category.key as keyof typeof currentData.costOfGoodsSold] as number;
                      const previous = comparisonData.costOfGoodsSold[category.key as keyof typeof comparisonData.costOfGoodsSold] as number;
                      const variance = current - previous;
                      const variancePercent = (variance / previous) * 100;

                      return (
                        <div key={category.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <category.icon className={`h-4 w-4 ${category.color}`} />
                            <span className="font-medium">{category.label}</span>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${getVarianceColor(variancePercent, false)}`}>
                              {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                            </div>
                            <div className={`text-sm ${getVarianceColor(variancePercent, false)}`}>
                              {variancePercent >= 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Operating Expenses Variance */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Operating Expenses Variance</h3>
                  <div className="space-y-3">
                    {expenseCategories.filter(cat => cat.section === 'opex').map((category) => {
                      const current = currentData.operatingExpenses[category.key as keyof typeof currentData.operatingExpenses] as number;
                      const previous = comparisonData.operatingExpenses[category.key as keyof typeof comparisonData.operatingExpenses] as number;
                      const variance = current - previous;
                      const variancePercent = (variance / previous) * 100;

                      return (
                        <div key={category.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <category.icon className={`h-4 w-4 ${category.color}`} />
                            <span className="font-medium">{category.label}</span>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${getVarianceColor(variancePercent, false)}`}>
                              {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                            </div>
                            <div className={`text-sm ${getVarianceColor(variancePercent, false)}`}>
                              {variancePercent >= 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plant Breakdown Tab */}
        <TabsContent value="plant-breakdown" className="space-y-4">
          <div className="grid gap-4">
            {accessiblePlants.map((plantId) => {
              const plantData = currentData.plantBreakdown[plantId as keyof typeof currentData.plantBreakdown];
              const comparisonPlantData = comparisonData.plantBreakdown[plantId as keyof typeof comparisonData.plantBreakdown];
              const revenueChange = ((plantData.revenue - comparisonPlantData.revenue) / comparisonPlantData.revenue) * 100;
              const profitChange = ((plantData.profit - comparisonPlantData.profit) / comparisonPlantData.profit) * 100;
              const margin = (plantData.profit / plantData.revenue) * 100;

              return (
                <Card key={plantId}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {plantId.split('-')[1].toUpperCase()} Plant
                        </CardTitle>
                        <CardDescription>Financial performance for {currentData.period}</CardDescription>
                      </div>
                      <Badge variant="outline">{margin.toFixed(1)}% margin</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-bold text-lg text-green-600">{formatCurrency(plantData.revenue)}</p>
                        <div className="flex items-center text-xs">
                          {React.createElement(getVarianceIcon(revenueChange), {
                            className: `h-3 w-3 mr-1 ${getVarianceColor(revenueChange)}`
                          })}
                          <span className={getVarianceColor(revenueChange)}>
                            {revenueChange > 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Expenses</p>
                        <p className="font-bold text-lg text-red-600">{formatCurrency(plantData.expenses)}</p>
                        <p className="text-xs text-muted-foreground">
                          {((plantData.expenses / plantData.revenue) * 100).toFixed(1)}% of revenue
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Profit</p>
                        <p className="font-bold text-lg text-blue-600">{formatCurrency(plantData.profit)}</p>
                        <div className="flex items-center text-xs">
                          {React.createElement(getVarianceIcon(profitChange), {
                            className: `h-3 w-3 mr-1 ${getVarianceColor(profitChange)}`
                          })}
                          <span className={getVarianceColor(profitChange)}>
                            {profitChange > 0 ? '+' : ''}{profitChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                3-Month Financial Trends
              </CardTitle>
              <CardDescription>
                Revenue, profit trends and key performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Monthly Comparison */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Monthly Performance Comparison</h3>
                  <div className="space-y-4">
                    {Object.entries(profitLossData).map(([period, data]) => {
                      const grossProfit = data.revenue.total - data.costOfGoodsSold.total;
                      const operatingProfit = grossProfit - data.operatingExpenses.total;
                      const netProfit = operatingProfit + data.otherIncomeExpenses.total;

                      return (
                        <div key={period} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">{data.period}</h4>
                            <Badge variant={period === selectedPeriod ? 'default' : 'outline'}>
                              {((netProfit / data.revenue.total) * 100).toFixed(1)}% margin
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Revenue</p>
                              <p className="font-bold text-green-600">{formatCurrency(data.revenue.total)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Gross Profit</p>
                              <p className="font-bold text-blue-600">{formatCurrency(grossProfit)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Operating Profit</p>
                              <p className="font-bold text-purple-600">{formatCurrency(operatingProfit)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Net Profit</p>
                              <p className="font-bold text-orange-600">{formatCurrency(netProfit)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Ratios Trend */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Financial Ratios Trend</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Gross Margin Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(profitLossData).map(([period, data]) => {
                            const grossProfit = data.revenue.total - data.costOfGoodsSold.total;
                            const margin = (grossProfit / data.revenue.total) * 100;
                            return (
                              <div key={period} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{data.period.split(' ')[0]}</span>
                                <span className="font-medium">{margin.toFixed(1)}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Operating Margin Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(profitLossData).map(([period, data]) => {
                            const grossProfit = data.revenue.total - data.costOfGoodsSold.total;
                            const operatingProfit = grossProfit - data.operatingExpenses.total;
                            const margin = (operatingProfit / data.revenue.total) * 100;
                            return (
                              <div key={period} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{data.period.split(' ')[0]}</span>
                                <span className="font-medium">{margin.toFixed(1)}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Net Margin Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(profitLossData).map(([period, data]) => {
                            const grossProfit = data.revenue.total - data.costOfGoodsSold.total;
                            const operatingProfit = grossProfit - data.operatingExpenses.total;
                            const netProfit = operatingProfit + data.otherIncomeExpenses.total;
                            const margin = (netProfit / data.revenue.total) * 100;
                            return (
                              <div key={period} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{data.period.split(' ')[0]}</span>
                                <span className="font-medium">{margin.toFixed(1)}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}
