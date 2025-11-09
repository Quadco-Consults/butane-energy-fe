"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  Mail,
  Calendar,
  Building2,
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";
import { useState } from "react";
import { filterByPlantAccess } from "@/lib/filters";

// Mock Accounts Receivable Data
const accountsReceivable = [
  {
    id: "AR-2024-001",
    customerName: "Dangote Industries Limited",
    invoiceNumber: "INV-2024-0123",
    invoiceDate: "2024-01-10",
    dueDate: "2024-02-09",
    originalAmount: 15250000,
    outstandingAmount: 15250000,
    status: "current",
    daysPastDue: 0,
    plantId: "plant-lagos-1",
    contactPerson: "John Adebayo",
    contactEmail: "j.adebayo@dangote.com",
    contactPhone: "+234 803 123 4567",
    creditTerms: "30 days",
    lastPaymentDate: null,
    lastPaymentAmount: 0,
    notes: "Large commercial customer, excellent payment history",
  },
  {
    id: "AR-2024-002",
    customerName: "GT Energy Limited",
    invoiceNumber: "INV-2024-0098",
    invoiceDate: "2023-12-15",
    dueDate: "2024-01-14",
    originalAmount: 8750000,
    outstandingAmount: 8750000,
    status: "overdue",
    daysPastDue: 17,
    plantId: "plant-abuja-1",
    contactPerson: "Sarah Okafor",
    contactEmail: "s.okafor@gtenergy.com",
    contactPhone: "+234 807 987 6543",
    creditTerms: "30 days",
    lastPaymentDate: "2023-11-20",
    lastPaymentAmount: 5000000,
    notes: "Follow up required for overdue payment",
  },
  {
    id: "AR-2024-003",
    customerName: "Lagos State Government",
    invoiceNumber: "INV-2024-0087",
    invoiceDate: "2023-11-28",
    dueDate: "2023-12-28",
    originalAmount: 22100000,
    outstandingAmount: 11050000,
    status: "overdue",
    daysPastDue: 34,
    plantId: "plant-lagos-1",
    contactPerson: "Mrs. Adunola Bamidele",
    contactEmail: "a.bamidele@lagosstate.gov.ng",
    contactPhone: "+234 801 234 5678",
    creditTerms: "45 days",
    lastPaymentDate: "2024-01-05",
    lastPaymentAmount: 11050000,
    notes: "Government entity, payment typically slow but reliable",
  },
  {
    id: "AR-2024-004",
    customerName: "NNPC Retail Limited",
    invoiceNumber: "INV-2024-0156",
    invoiceDate: "2024-01-20",
    dueDate: "2024-02-19",
    originalAmount: 12500000,
    outstandingAmount: 12500000,
    status: "current",
    daysPastDue: 0,
    plantId: "plant-kano-1",
    contactPerson: "Ibrahim Musa",
    contactEmail: "i.musa@nnpcretail.com",
    contactPhone: "+234 813 456 7890",
    creditTerms: "30 days",
    lastPaymentDate: null,
    lastPaymentAmount: 0,
    notes: "New large customer, monitor payment behavior",
  },
];

// Mock Accounts Payable Data
const accountsPayable = [
  {
    id: "AP-2024-001",
    vendorName: "Shell Nigeria Gas",
    invoiceNumber: "SNG-INV-2024-0234",
    invoiceDate: "2024-01-12",
    dueDate: "2024-02-11",
    originalAmount: 45500000,
    outstandingAmount: 45500000,
    status: "current",
    daysPastDue: 0,
    plantId: "plant-lagos-1",
    contactPerson: "David Olagoke",
    contactEmail: "d.olagoke@shell.com.ng",
    contactPhone: "+234 802 345 6789",
    paymentTerms: "30 days",
    lastPaymentDate: null,
    lastPaymentAmount: 0,
    category: "LPG Procurement",
    notes: "Large supplier, critical for operations",
  },
  {
    id: "AP-2024-002",
    vendorName: "Mobil Oil Nigeria",
    invoiceNumber: "MON-INV-2024-0567",
    invoiceDate: "2024-01-08",
    dueDate: "2024-01-23",
    originalAmount: 8750000,
    outstandingAmount: 8750000,
    status: "overdue",
    daysPastDue: 8,
    plantId: "plant-kano-1",
    contactPerson: "Jane Ogbonna",
    contactEmail: "j.ogbonna@mobil.com.ng",
    contactPhone: "+234 805 678 9012",
    paymentTerms: "15 days",
    lastPaymentDate: "2023-12-15",
    lastPaymentAmount: 5000000,
    category: "Equipment Maintenance",
    notes: "Equipment maintenance vendor, payment overdue",
  },
  {
    id: "AP-2024-003",
    vendorName: "Total Nigeria PLC",
    invoiceNumber: "TNP-INV-2024-0123",
    invoiceDate: "2023-12-20",
    dueDate: "2024-01-04",
    originalAmount: 12300000,
    outstandingAmount: 6150000,
    status: "overdue",
    daysPastDue: 27,
    plantId: "plant-abuja-1",
    contactPerson: "Emmanuel Okafor",
    contactEmail: "e.okafor@total.com.ng",
    contactPhone: "+234 809 123 4567",
    paymentTerms: "15 days",
    lastPaymentDate: "2024-01-15",
    lastPaymentAmount: 6150000,
    category: "Logistics Services",
    notes: "Partial payment made, balance overdue",
  },
  {
    id: "AP-2024-004",
    vendorName: "Dangote Cement PLC",
    invoiceNumber: "DCL-INV-2024-0890",
    invoiceDate: "2024-01-05",
    dueDate: "2024-01-20",
    originalAmount: 85000000,
    outstandingAmount: 59500000,
    status: "overdue",
    daysPastDue: 11,
    plantId: "plant-lagos-1",
    contactPerson: "Ahmed Aliyu",
    contactEmail: "a.aliyu@dangotecement.com",
    contactPhone: "+234 812 987 6543",
    paymentTerms: "15 days",
    lastPaymentDate: "2024-01-10",
    lastPaymentAmount: 25500000,
    category: "Infrastructure",
    notes: "Large infrastructure project, milestone payment made",
  },
];

export default function AccountsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useState("receivables");

  if (!user) return null;

  // Filter data based on user's plant access
  const filteredReceivables = filterByPlantAccess(accountsReceivable, user);
  const filteredPayables = filterByPlantAccess(accountsPayable, user);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string, daysPastDue: number) => {
    if (status === "overdue") {
      if (daysPastDue > 30) return "destructive";
      if (daysPastDue > 15) return "secondary";
      return "outline";
    }
    return "default";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "current":
        return CheckCircle;
      case "overdue":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  // Calculate statistics
  const arStats = {
    total: filteredReceivables.reduce(
      (sum, ar) => sum + ar.outstandingAmount,
      0,
    ),
    current: filteredReceivables
      .filter((ar) => ar.status === "current")
      .reduce((sum, ar) => sum + ar.outstandingAmount, 0),
    overdue: filteredReceivables
      .filter((ar) => ar.status === "overdue")
      .reduce((sum, ar) => sum + ar.outstandingAmount, 0),
    count: filteredReceivables.length,
    overdueCount: filteredReceivables.filter((ar) => ar.status === "overdue")
      .length,
  };

  const apStats = {
    total: filteredPayables.reduce((sum, ap) => sum + ap.outstandingAmount, 0),
    current: filteredPayables
      .filter((ap) => ap.status === "current")
      .reduce((sum, ap) => sum + ap.outstandingAmount, 0),
    overdue: filteredPayables
      .filter((ap) => ap.status === "overdue")
      .reduce((sum, ap) => sum + ap.outstandingAmount, 0),
    count: filteredPayables.length,
    overdueCount: filteredPayables.filter((ap) => ap.status === "overdue")
      .length,
  };

  const filteredData =
    selectedTab === "receivables"
      ? filteredReceivables.filter((item) => {
          const matchesSearch =
            item.customerName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus =
            statusFilter === "all" || item.status === statusFilter;
          return matchesSearch && matchesStatus;
        })
      : filteredPayables.filter((item) => {
          const matchesSearch =
            item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus =
            statusFilter === "all" || item.status === statusFilter;
          return matchesSearch && matchesStatus;
        });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Accounts Payable & Receivable
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage customer receivables, vendor payables, and debt collection
            processes
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Accounts Receivable
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(arStats.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {arStats.count} outstanding invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Accounts Payable
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(apStats.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {apStats.count} pending payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Net Working Capital
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(arStats.total - apStats.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                Receivables minus payables
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue Items
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {arStats.overdueCount + apStats.overdueCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {arStats.overdueCount} AR + {apStats.overdueCount} AP
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search customers, vendors, or invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All Statuses</option>
            <option value="current">Current</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="receivables">Accounts Receivable</TabsTrigger>
            <TabsTrigger value="payables">Accounts Payable</TabsTrigger>
            <TabsTrigger value="aging">Aging Analysis</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Accounts Receivable Tab */}
          <TabsContent value="receivables" className="space-y-4">
            <div className="grid gap-4">
              {filteredData.map((receivable: any) => {
                const StatusIcon = getStatusIcon(receivable.status);
                return (
                  <Card key={receivable.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            {receivable.customerName}
                          </CardTitle>
                          <CardDescription>
                            Invoice: {receivable.invoiceNumber}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getStatusColor(
                              receivable.status,
                              receivable.daysPastDue,
                            )}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {receivable.status === "overdue"
                              ? `${receivable.daysPastDue} days overdue`
                              : "Current"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Outstanding Amount
                            </p>
                            <p className="font-bold text-lg text-green-600">
                              {formatCurrency(receivable.outstandingAmount)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Invoice Date
                            </p>
                            <p className="text-sm font-medium">
                              {receivable.invoiceDate}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Due Date
                            </p>
                            <p className="text-sm font-medium">
                              {receivable.dueDate}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Credit Terms
                            </p>
                            <p className="text-sm font-medium">
                              {receivable.creditTerms}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-2 md:grid-cols-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Contact: {receivable.contactPerson}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{receivable.contactEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{receivable.contactPhone}</span>
                          </div>
                        </div>

                        {receivable.lastPaymentDate && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700">
                              Last Payment:{" "}
                              {formatCurrency(receivable.lastPaymentAmount)} on{" "}
                              {receivable.lastPaymentDate}
                            </p>
                          </div>
                        )}

                        {receivable.notes && (
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">{receivable.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Plant:{" "}
                            {receivable.plantId.split("-")[1].toUpperCase()}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Contact Customer
                            </Button>
                            {receivable.status === "overdue" && (
                              <Button size="sm">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Send Reminder
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Accounts Payable Tab */}
          <TabsContent value="payables" className="space-y-4">
            <div className="grid gap-4">
              {filteredData.map((payable: any) => {
                const StatusIcon = getStatusIcon(payable.status);
                return (
                  <Card key={payable.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            {payable.vendorName}
                          </CardTitle>
                          <CardDescription>
                            Invoice: {payable.invoiceNumber}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{payable.category}</Badge>
                          <Badge
                            variant={getStatusColor(
                              payable.status,
                              payable.daysPastDue,
                            )}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {payable.status === "overdue"
                              ? `${payable.daysPastDue} days overdue`
                              : "Current"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Outstanding Amount
                            </p>
                            <p className="font-bold text-lg text-red-600">
                              {formatCurrency(payable.outstandingAmount)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Invoice Date
                            </p>
                            <p className="text-sm font-medium">
                              {payable.invoiceDate}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Due Date
                            </p>
                            <p className="text-sm font-medium">
                              {payable.dueDate}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Payment Terms
                            </p>
                            <p className="text-sm font-medium">
                              {payable.paymentTerms}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-2 md:grid-cols-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Contact: {payable.contactPerson}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{payable.contactEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{payable.contactPhone}</span>
                          </div>
                        </div>

                        {payable.lastPaymentDate && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              Last Payment:{" "}
                              {formatCurrency(payable.lastPaymentAmount)} on{" "}
                              {payable.lastPaymentDate}
                            </p>
                          </div>
                        )}

                        {payable.notes && (
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">{payable.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Plant: {payable.plantId.split("-")[1].toUpperCase()}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {payable.status === "overdue" && (
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-2" />
                                Contact Vendor
                              </Button>
                            )}
                            <Button size="sm">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Schedule Payment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Aging Analysis Tab */}
          <TabsContent value="aging" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Accounts Receivable Aging */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Accounts Receivable Aging
                  </CardTitle>
                  <CardDescription>
                    Age analysis of outstanding customer receivables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        range: "0-30 days",
                        amount: 27750000,
                        count: 2,
                        color: "text-green-600",
                      },
                      {
                        range: "31-60 days",
                        amount: 19800000,
                        count: 2,
                        color: "text-yellow-600",
                      },
                      {
                        range: "61-90 days",
                        amount: 0,
                        count: 0,
                        color: "text-orange-600",
                      },
                      {
                        range: "90+ days",
                        amount: 0,
                        count: 0,
                        color: "text-red-600",
                      },
                    ].map((bucket) => (
                      <div
                        key={bucket.range}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{bucket.range}</p>
                          <p className="text-xs text-muted-foreground">
                            {bucket.count} invoice
                            {bucket.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${bucket.color}`}>
                            {formatCurrency(bucket.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {bucket.amount > 0
                              ? ((bucket.amount / arStats.total) * 100).toFixed(
                                  1,
                                ) + "%"
                              : "0%"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Accounts Payable Aging */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Accounts Payable Aging
                  </CardTitle>
                  <CardDescription>
                    Age analysis of outstanding vendor payables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        range: "0-15 days",
                        amount: 45500000,
                        count: 1,
                        color: "text-green-600",
                      },
                      {
                        range: "16-30 days",
                        amount: 65650000,
                        count: 2,
                        color: "text-yellow-600",
                      },
                      {
                        range: "31-45 days",
                        amount: 8750000,
                        count: 1,
                        color: "text-orange-600",
                      },
                      {
                        range: "45+ days",
                        amount: 0,
                        count: 0,
                        color: "text-red-600",
                      },
                    ].map((bucket) => (
                      <div
                        key={bucket.range}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{bucket.range}</p>
                          <p className="text-xs text-muted-foreground">
                            {bucket.count} invoice
                            {bucket.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${bucket.color}`}>
                            {formatCurrency(bucket.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {bucket.amount > 0
                              ? ((bucket.amount / apStats.total) * 100).toFixed(
                                  1,
                                ) + "%"
                              : "0%"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Customers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers by Outstanding</CardTitle>
                  <CardDescription>
                    Largest outstanding receivables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredReceivables
                      .sort((a, b) => b.outstandingAmount - a.outstandingAmount)
                      .slice(0, 5)
                      .map((customer) => (
                        <div
                          key={customer.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {customer.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {customer.invoiceNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              {formatCurrency(customer.outstandingAmount)}
                            </p>
                            <Badge
                              variant={getStatusColor(
                                customer.status,
                                customer.daysPastDue,
                              )}
                              className="text-xs"
                            >
                              {customer.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Vendors */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Vendors by Outstanding</CardTitle>
                  <CardDescription>
                    Largest outstanding payables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredPayables
                      .sort((a, b) => b.outstandingAmount - a.outstandingAmount)
                      .slice(0, 5)
                      .map((vendor) => (
                        <div
                          key={vendor.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{vendor.vendorName}</p>
                            <p className="text-xs text-muted-foreground">
                              {vendor.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">
                              {formatCurrency(vendor.outstandingAmount)}
                            </p>
                            <Badge
                              variant={getStatusColor(
                                vendor.status,
                                vendor.daysPastDue,
                              )}
                              className="text-xs"
                            >
                              {vendor.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cash Flow Impact */}
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Impact</CardTitle>
                  <CardDescription>Financial impact analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          Expected Inflow
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(arStats.total)}
                        </p>
                        <p className="text-xs text-green-600">
                          {arStats.count} invoices
                        </p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">Expected Outflow</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(apStats.total)}
                        </p>
                        <p className="text-xs text-red-600">
                          {apStats.count} payments
                        </p>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <p className="text-sm text-blue-700">Net Cash Impact</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatCurrency(arStats.total - apStats.total)}
                      </p>
                      <p className="text-xs text-blue-600">
                        {arStats.total > apStats.total
                          ? "Positive cash flow expected"
                          : "Negative cash flow expected"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Metrics</CardTitle>
                  <CardDescription>
                    Important financial ratios and KPIs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          DSO (Days Sales Outstanding)
                        </p>
                        <p className="text-xl font-bold">
                          {Math.round(arStats.total / (138000000 / 30))} days
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          DPO (Days Payable Outstanding)
                        </p>
                        <p className="text-xl font-bold">
                          {Math.round(apStats.total / (88500000 / 30))} days
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Collection Rate</p>
                        <p className="text-xl font-bold text-green-600">
                          {(
                            ((arStats.total - arStats.overdue) /
                              arStats.total) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Payment Compliance
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          {(
                            ((apStats.total - apStats.overdue) /
                              apStats.total) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
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
