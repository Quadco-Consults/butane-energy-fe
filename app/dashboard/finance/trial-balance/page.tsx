"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download,
  Filter,
  FileText,
  BarChart3,
  Building2,
  Plus,
  Minus,
  Equal
} from "lucide-react";
import { useState } from "react";

// Mock Trial Balance Data
const trialBalanceData = {
  "2024-01-31": {
    date: "January 31, 2024",
    accounts: [
      // Assets
      { accountCode: "1100", accountName: "Cash and Cash Equivalents", accountType: "Asset", debit: 45250000, credit: 0 },
      { accountCode: "1200", accountName: "Accounts Receivable", accountType: "Asset", debit: 22100000, credit: 0 },
      { accountCode: "1300", accountName: "Inventory", accountType: "Asset", debit: 85000000, credit: 0 },
      { accountCode: "1400", accountName: "Prepaid Expenses", accountType: "Asset", debit: 3200000, credit: 0 },
      { accountCode: "1500", accountName: "Property, Plant & Equipment", accountType: "Asset", debit: 285000000, credit: 0 },
      { accountCode: "1501", accountName: "Accumulated Depreciation", accountType: "Asset", debit: 0, credit: 65000000 },
      { accountCode: "1600", accountName: "Intangible Assets", accountType: "Asset", debit: 12000000, credit: 0 },
      { accountCode: "1700", accountName: "Investments", accountType: "Asset", debit: 8500000, credit: 0 },

      // Liabilities
      { accountCode: "2100", accountName: "Accounts Payable", accountType: "Liability", debit: 0, credit: 15250000 },
      { accountCode: "2200", accountName: "Short-term Debt", accountType: "Liability", debit: 0, credit: 8500000 },
      { accountCode: "2300", accountName: "Accrued Liabilities", accountType: "Liability", debit: 0, credit: 6800000 },
      { accountCode: "2400", accountName: "Current Portion Long-term Debt", accountType: "Liability", debit: 0, credit: 12000000 },
      { accountCode: "2500", accountName: "Long-term Debt", accountType: "Liability", debit: 0, credit: 85000000 },
      { accountCode: "2600", accountName: "Deferred Tax Liabilities", accountType: "Liability", debit: 0, credit: 8500000 },

      // Equity
      { accountCode: "3100", accountName: "Paid-up Capital", accountType: "Equity", debit: 0, credit: 150000000 },
      { accountCode: "3200", accountName: "Retained Earnings", accountType: "Equity", debit: 0, credit: 95350000 },
      { accountCode: "3300", accountName: "Current Year Earnings", accountType: "Equity", debit: 0, credit: 15000000 },

      // Revenue
      { accountCode: "4100", accountName: "LPG Sales Revenue", accountType: "Revenue", debit: 0, credit: 125750000 },
      { accountCode: "4200", accountName: "Accessory Sales Revenue", accountType: "Revenue", debit: 0, credit: 8500000 },
      { accountCode: "4300", accountName: "Service Revenue", accountType: "Revenue", debit: 0, credit: 2250000 },
      { accountCode: "4900", accountName: "Other Revenue", accountType: "Revenue", debit: 0, credit: 1500000 },

      // Cost of Goods Sold
      { accountCode: "5100", accountName: "LPG Purchases", accountType: "Expense", debit: 75000000, credit: 0 },
      { accountCode: "5200", accountName: "Transportation Costs", accountType: "Expense", debit: 8500000, credit: 0 },
      { accountCode: "5300", accountName: "Storage Costs", accountType: "Expense", debit: 3200000, credit: 0 },
      { accountCode: "5400", accountName: "Handling Costs", accountType: "Expense", debit: 1800000, credit: 0 },

      // Operating Expenses
      { accountCode: "6100", accountName: "Salaries and Wages", accountType: "Expense", debit: 12500000, credit: 0 },
      { accountCode: "6200", accountName: "Utilities", accountType: "Expense", debit: 3200000, credit: 0 },
      { accountCode: "6300", accountName: "Maintenance Expenses", accountType: "Expense", debit: 2800000, credit: 0 },
      { accountCode: "6400", accountName: "Insurance Expenses", accountType: "Expense", debit: 1500000, credit: 0 },
      { accountCode: "6500", accountName: "Depreciation Expense", accountType: "Expense", debit: 2200000, credit: 0 },
      { accountCode: "6600", accountName: "Administrative Expenses", accountType: "Expense", debit: 3800000, credit: 0 },
      { accountCode: "6700", accountName: "Marketing Expenses", accountType: "Expense", debit: 1200000, credit: 0 },

      // Other Income/Expenses
      { accountCode: "7100", accountName: "Interest Income", accountType: "Revenue", debit: 0, credit: 250000 },
      { accountCode: "7200", accountName: "Interest Expense", accountType: "Expense", debit: 1200000, credit: 0 },
      { accountCode: "7300", accountName: "Foreign Exchange Gain", accountType: "Revenue", debit: 0, credit: 180000 },
      { accountCode: "7900", accountName: "Miscellaneous Expenses", accountType: "Expense", debit: 320000, credit: 0 }
    ]
  }
};

export default function TrialBalancePage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState("2024-01-31");
  const [viewType, setViewType] = useState("summary");

  if (!user) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentData = trialBalanceData[selectedDate as keyof typeof trialBalanceData];

  // Calculate totals
  const totalDebits = currentData.accounts.reduce((sum, account) => sum + account.debit, 0);
  const totalCredits = currentData.accounts.reduce((sum, account) => sum + account.credit, 0);
  const isBalanced = totalDebits === totalCredits;

  // Group accounts by type
  const accountsByType = currentData.accounts.reduce((groups, account) => {
    if (!groups[account.accountType]) {
      groups[account.accountType] = [];
    }
    groups[account.accountType].push(account);
    return groups;
  }, {} as Record<string, typeof currentData.accounts>);

  // Calculate type totals
  const typeTotals = Object.entries(accountsByType).map(([type, accounts]) => ({
    type,
    totalDebits: accounts.reduce((sum, account) => sum + account.debit, 0),
    totalCredits: accounts.reduce((sum, account) => sum + account.credit, 0),
    netBalance: accounts.reduce((sum, account) => sum + account.debit - account.credit, 0)
  }));

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'text-green-600';
      case 'Liability': return 'text-red-600';
      case 'Equity': return 'text-blue-600';
      case 'Revenue': return 'text-purple-600';
      case 'Expense': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'Asset': return Plus;
      case 'Liability': return Minus;
      case 'Equity': return Equal;
      case 'Revenue': return Plus;
      case 'Expense': return Minus;
      default: return Calculator;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trial Balance</h1>
        <p className="text-muted-foreground mt-2">
          Generate trial balance and verify the equality of debits and credits
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Date</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="2024-01-31">January 31, 2024</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">View Type</label>
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="summary">Summary by Type</option>
            <option value="detailed">Detailed by Account</option>
          </select>
        </div>
        <div className="flex gap-2 items-end">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Accounts
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Trial Balance
          </Button>
        </div>
      </div>

      {/* Balance Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isBalanced ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Trial Balance Status
              </CardTitle>
              <CardDescription>
                Verification of accounting equation balance as of {currentData.date}
              </CardDescription>
            </div>
            <Badge variant={isBalanced ? 'default' : 'destructive'}>
              {isBalanced ? 'Balanced' : 'Unbalanced'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalDebits)}</div>
              <p className="text-sm text-green-700 font-medium">Total Debits</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCredits)}</div>
              <p className="text-sm text-red-700 font-medium">Total Credits</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className={`text-2xl font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(totalDebits - totalCredits))}
              </div>
              <p className={`text-sm font-medium ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
                {isBalanced ? 'Perfect Balance' : 'Difference'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={viewType} onValueChange={setViewType} className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="analysis">Balance Analysis</TabsTrigger>
        </TabsList>

        {/* Summary View */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Trial Balance Summary by Account Type
              </CardTitle>
              <CardDescription>
                Account balances grouped by type with totals and verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {typeTotals.map((typeTotal) => {
                  const TypeIcon = getAccountTypeIcon(typeTotal.type);
                  return (
                    <div key={typeTotal.type}>
                      <div className="flex items-center gap-2 mb-3">
                        <TypeIcon className={`h-5 w-5 ${getAccountTypeColor(typeTotal.type)}`} />
                        <h3 className={`text-lg font-semibold ${getAccountTypeColor(typeTotal.type)}`}>
                          {typeTotal.type.toUpperCase()} ACCOUNTS
                        </h3>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="grid gap-2 md:grid-cols-4 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Total Debits</p>
                            <p className="font-bold text-green-600">{formatCurrency(typeTotal.totalDebits)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Total Credits</p>
                            <p className="font-bold text-red-600">{formatCurrency(typeTotal.totalCredits)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Net Balance</p>
                            <p className={`font-bold ${typeTotal.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(Math.abs(typeTotal.netBalance))}
                              {typeTotal.netBalance >= 0 ? ' Dr' : ' Cr'}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Account Count</p>
                            <p className="font-bold">{accountsByType[typeTotal.type].length}</p>
                          </div>
                        </div>

                        {/* Top accounts in this type */}
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Top Accounts:</p>
                          {accountsByType[typeTotal.type]
                            .sort((a, b) => (b.debit + b.credit) - (a.debit + a.credit))
                            .slice(0, 3)
                            .map((account) => (
                              <div key={account.accountCode} className="flex justify-between text-sm">
                                <span>{account.accountName}</span>
                                <span className="font-medium">
                                  {account.debit > 0 ? formatCurrency(account.debit) + ' Dr' : formatCurrency(account.credit) + ' Cr'}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed View */}
        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detailed Trial Balance - {currentData.date}
              </CardTitle>
              <CardDescription>
                Complete listing of all accounts with debit and credit balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(accountsByType).map(([type, accounts]) => {
                  const TypeIcon = getAccountTypeIcon(type);
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-4">
                        <TypeIcon className={`h-5 w-5 ${getAccountTypeColor(type)}`} />
                        <h3 className={`text-lg font-semibold ${getAccountTypeColor(type)}`}>
                          {type.toUpperCase()}
                        </h3>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2 font-medium">Account Code</th>
                              <th className="text-left p-2 font-medium">Account Name</th>
                              <th className="text-right p-2 font-medium">Debit</th>
                              <th className="text-right p-2 font-medium">Credit</th>
                              <th className="text-right p-2 font-medium">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {accounts
                              .sort((a, b) => a.accountCode.localeCompare(b.accountCode))
                              .map((account) => {
                                const netBalance = account.debit - account.credit;
                                return (
                                  <tr key={account.accountCode} className="border-b hover:bg-muted/50">
                                    <td className="p-2 font-mono text-sm">{account.accountCode}</td>
                                    <td className="p-2">{account.accountName}</td>
                                    <td className="p-2 text-right font-bold text-green-600">
                                      {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                                    </td>
                                    <td className="p-2 text-right font-bold text-red-600">
                                      {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                                    </td>
                                    <td className="p-2 text-right font-bold">
                                      {formatCurrency(Math.abs(netBalance))}
                                      <span className="text-xs ml-1">
                                        {netBalance >= 0 ? 'Dr' : 'Cr'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            <tr className="border-t-2 border-gray-300 bg-muted/30">
                              <td className="p-2 font-bold" colSpan={2}>
                                {type} Subtotal
                              </td>
                              <td className="p-2 text-right font-bold text-green-600">
                                {formatCurrency(accounts.reduce((sum, acc) => sum + acc.debit, 0))}
                              </td>
                              <td className="p-2 text-right font-bold text-red-600">
                                {formatCurrency(accounts.reduce((sum, acc) => sum + acc.credit, 0))}
                              </td>
                              <td className="p-2 text-right font-bold">
                                {(() => {
                                  const subtotal = accounts.reduce((sum, acc) => sum + acc.debit - acc.credit, 0);
                                  return formatCurrency(Math.abs(subtotal)) + (subtotal >= 0 ? ' Dr' : ' Cr');
                                })()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}

                {/* Grand Total */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="font-bold text-xl text-blue-700" colSpan={2}>
                          GRAND TOTAL
                        </td>
                        <td className="text-right font-bold text-xl text-green-600">
                          {formatCurrency(totalDebits)}
                        </td>
                        <td className="text-right font-bold text-xl text-red-600">
                          {formatCurrency(totalCredits)}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center gap-2">
                            {isBalanced ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className={`font-bold text-xl ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                              {isBalanced ? 'BALANCED' : 'UNBALANCED'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis View */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Account Type Distribution
                </CardTitle>
                <CardDescription>Distribution of accounts and balances by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {typeTotals.map((typeTotal) => {
                    const totalBalance = Math.abs(typeTotal.totalDebits) + Math.abs(typeTotal.totalCredits);
                    const percentage = totalBalance > 0 ? ((Math.abs(typeTotal.netBalance) / totalBalance) * 100) : 0;

                    return (
                      <div key={typeTotal.type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${getAccountTypeColor(typeTotal.type)}`}>
                            {typeTotal.type}
                          </span>
                          <span className="text-sm font-bold">
                            {formatCurrency(Math.abs(typeTotal.netBalance))}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              typeTotal.type === 'Asset' ? 'bg-green-500' :
                              typeTotal.type === 'Liability' ? 'bg-red-500' :
                              typeTotal.type === 'Equity' ? 'bg-blue-500' :
                              typeTotal.type === 'Revenue' ? 'bg-purple-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {accountsByType[typeTotal.type].length} accounts • {percentage.toFixed(1)}% of total balance
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Balance Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Balance Verification
                </CardTitle>
                <CardDescription>Accounting equation and balance verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Fundamental Equation */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-3">Fundamental Accounting Equation</h4>
                    <div className="text-center space-y-2">
                      <div className="text-sm text-blue-600">Assets = Liabilities + Equity</div>
                      <div className="font-bold text-lg">
                        {formatCurrency(typeTotals.find(t => t.type === 'Asset')?.netBalance || 0)} =
                      </div>
                      <div className="font-bold text-lg">
                        {formatCurrency(Math.abs(typeTotals.find(t => t.type === 'Liability')?.netBalance || 0))} +{' '}
                        {formatCurrency(Math.abs(typeTotals.find(t => t.type === 'Equity')?.netBalance || 0))}
                      </div>
                      <div className={`text-sm ${
                        Math.abs((typeTotals.find(t => t.type === 'Asset')?.netBalance || 0) -
                        (Math.abs(typeTotals.find(t => t.type === 'Liability')?.netBalance || 0) +
                         Math.abs(typeTotals.find(t => t.type === 'Equity')?.netBalance || 0))) < 1 ?
                        'text-green-600' : 'text-red-600'
                      }`}>
                        ✓ Equation is {Math.abs((typeTotals.find(t => t.type === 'Asset')?.netBalance || 0) -
                        (Math.abs(typeTotals.find(t => t.type === 'Liability')?.netBalance || 0) +
                         Math.abs(typeTotals.find(t => t.type === 'Equity')?.netBalance || 0))) < 1 ?
                        'Balanced' : 'Unbalanced'}
                      </div>
                    </div>
                  </div>

                  {/* Debit/Credit Verification */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Debit/Credit Verification</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-green-50 rounded">
                        <p className="font-medium text-green-700">Total Debits</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(totalDebits)}</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded">
                        <p className="font-medium text-red-700">Total Credits</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(totalCredits)}</p>
                      </div>
                    </div>
                    <div className={`text-center p-2 rounded ${isBalanced ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <span className="font-medium">
                        {isBalanced ? '✓ Debits Equal Credits' : '✗ Debits Do Not Equal Credits'}
                      </span>
                    </div>
                  </div>

                  {/* Account Statistics */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Account Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Accounts</p>
                        <p className="font-bold text-lg">{currentData.accounts.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Account Types</p>
                        <p className="font-bold text-lg">{Object.keys(accountsByType).length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Zero Balance Accounts</p>
                        <p className="font-bold text-lg">
                          {currentData.accounts.filter(acc => acc.debit === 0 && acc.credit === 0).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-bold text-lg">{currentData.date.split(',')[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}