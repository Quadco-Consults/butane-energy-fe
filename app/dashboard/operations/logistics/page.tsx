"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard, ListCard, DataTableHeader } from "@/components/ui/layout-cards";
import { DataTable, TableColumn, StatusCell, DateCell, ActionCell } from "@/components/ui/data-table";
import { FormModal, FormField, useFormValidation, validationRules } from "@/components/ui/form-components";
import { designSystem } from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Truck,
  Route,
  Fuel,
  MapPin,
  Clock,
  Plus,
  Eye,
  Edit,
  Download,
  Navigation,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Package
} from "lucide-react";

// Sample data for logistics operations
const logisticsStats = [
  {
    title: "Active Deliveries",
    value: "34",
    description: "In transit",
    icon: <Truck className="h-8 w-8" />
  },
  {
    title: "Fleet Vehicles",
    value: "18",
    description: "Available",
    icon: <Route className="h-8 w-8" />
  },
  {
    title: "Volume Delivered",
    value: "1,248",
    description: "MT this month",
    trend: { value: "+14%", isPositive: true },
    icon: <Package className="h-8 w-8" />
  },
  {
    title: "On-Time Delivery",
    value: "94.5%",
    description: "This month",
    trend: { value: "+2.1%", isPositive: true },
    icon: <Clock className="h-8 w-8" />
  }
];

const logisticsData = [
  {
    id: "LOG-2024-001",
    deliveryNumber: "LOG-2024-001",
    customerName: "Delta Gas Distribution Ltd",
    vehicleNumber: "BEL-001-KD",
    driverName: "Musa Ibrahim",
    volume: 25.5,
    origin: "Lagos Main Terminal",
    destination: "Warri, Delta State",
    status: "in_transit",
    scheduledTime: "2024-01-15T08:00",
    estimatedArrival: "2024-01-15T14:30",
    actualDeparture: "2024-01-15T08:15",
    distance: "342 km",
    contactNumber: "+234-803-123-4567"
  },
  {
    id: "LOG-2024-002",
    deliveryNumber: "LOG-2024-002",
    customerName: "Northern Energy Solutions",
    vehicleNumber: "BEL-003-AB",
    driverName: "Ahmed Yakubu",
    volume: 30.0,
    origin: "Kano Distribution Center",
    destination: "Kaduna, Kaduna State",
    status: "scheduled",
    scheduledTime: "2024-01-16T06:00",
    estimatedArrival: "2024-01-16T10:00",
    actualDeparture: null,
    distance: "180 km",
    contactNumber: "+234-806-987-6543"
  },
  {
    id: "LOG-2024-003",
    deliveryNumber: "LOG-2024-003",
    customerName: "Lagos Industrial Gas Co",
    vehicleNumber: "BEL-002-LA",
    driverName: "Emeka Okafor",
    volume: 35.0,
    origin: "Lagos Main Terminal",
    destination: "Ikeja, Lagos State",
    status: "delivered",
    scheduledTime: "2024-01-14T09:00",
    estimatedArrival: "2024-01-14T11:00",
    actualDeparture: "2024-01-14T09:10",
    distance: "45 km",
    contactNumber: "+234-809-456-7890",
    actualArrival: "2024-01-14T10:45"
  },
  {
    id: "LOG-2024-004",
    deliveryNumber: "LOG-2024-004",
    customerName: "Abuja Gas Hub",
    vehicleNumber: "BEL-005-AB",
    driverName: "Fatima Aliyu",
    volume: 28.0,
    origin: "Abuja Regional Office",
    destination: "Garki, FCT Abuja",
    status: "loading",
    scheduledTime: "2024-01-15T10:00",
    estimatedArrival: "2024-01-15T12:00",
    actualDeparture: null,
    distance: "25 km",
    contactNumber: "+234-812-345-6789"
  },
  {
    id: "LOG-2024-005",
    deliveryNumber: "LOG-2024-005",
    customerName: "Port Harcourt Industries",
    vehicleNumber: "BEL-004-PH",
    driverName: "Chidi Okonkwo",
    volume: 40.0,
    origin: "Port Harcourt Depot",
    destination: "Trans Amadi, Port Harcourt",
    status: "delayed",
    scheduledTime: "2024-01-15T07:00",
    estimatedArrival: "2024-01-15T09:30",
    actualDeparture: "2024-01-15T08:30",
    distance: "15 km",
    contactNumber: "+234-815-678-9012",
    delayReason: "Traffic congestion"
  }
];

const vehicleNumbers = [
  "BEL-001-KD", "BEL-002-LA", "BEL-003-AB", "BEL-004-PH", "BEL-005-AB",
  "BEL-006-KN", "BEL-007-OG", "BEL-008-ED", "BEL-009-RV", "BEL-010-OY"
];

const origins = [
  "Lagos Main Terminal",
  "Kano Distribution Center",
  "Port Harcourt Depot",
  "Abuja Regional Office",
  "Kaduna Storage Facility"
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const tableColumns: TableColumn[] = [
  {
    id: "deliveryNumber",
    header: "Delivery #",
    accessorKey: "deliveryNumber",
    sortable: true,
    cell: (row) => (
      <div className="font-medium text-blue-600">
        {row.deliveryNumber}
      </div>
    )
  },
  {
    id: "vehicleDetails",
    header: "Vehicle & Driver",
    cell: (row) => (
      <div>
        <div className="font-medium">{row.vehicleNumber}</div>
        <div className="text-sm text-gray-500">{row.driverName}</div>
      </div>
    )
  },
  {
    id: "route",
    header: "Route",
    cell: (row) => (
      <div className="text-sm">
        <div className="font-medium flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-green-500" />
          {row.origin}
        </div>
        <div className="flex items-center text-gray-500">
          <MapPin className="h-3 w-3 mr-1 text-red-500" />
          {row.destination}
        </div>
        <div className="text-xs text-gray-400">{row.distance}</div>
      </div>
    )
  },
  {
    id: "volume",
    header: "Volume",
    cell: (row) => (
      <div className="text-sm font-medium">
        {row.volume} MT
      </div>
    )
  },
  {
    id: "customerName",
    header: "Customer",
    accessorKey: "customerName",
    sortable: true,
    cell: (row) => (
      <div className="text-sm">{row.customerName}</div>
    )
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusCell
        status={row.status}
        variant={
          row.status === 'delivered' ? 'default' :
          row.status === 'in_transit' ? 'secondary' :
          row.status === 'delayed' ? 'destructive' : 'outline'
        }
      />
    )
  },
  {
    id: "timing",
    header: "Timing",
    cell: (row) => (
      <div className="text-sm">
        <div className="font-medium">
          {new Date(row.scheduledTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>
        <div className="text-gray-500">
          ETA: {new Date(row.estimatedArrival).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>
      </div>
    )
  }
];

export default function LogisticsPage() {
  const { user } = useAuth();
  // Temporary toast replacement
  const success = (message: string) => alert(`Success: ${message}`);
  const error = (message: string) => alert(`Error: ${message}`);
  const [selectedDeliveries, setSelectedDeliveries] = React.useState<string[]>([]);

  // Form validation for new delivery
  const { values, errors, setValue, validate, reset } = useFormValidation(
    {
      customerName: '',
      vehicleNumber: '',
      driverName: '',
      volume: '',
      origin: '',
      destination: '',
      destinationState: '',
      scheduledDate: '',
      scheduledTime: '',
      contactNumber: '',
      specialInstructions: ''
    },
    {
      customerName: validationRules.required,
      vehicleNumber: validationRules.required,
      driverName: validationRules.required,
      volume: (value) => validationRules.required(value) || validationRules.positiveNumber(value),
      origin: validationRules.required,
      destination: validationRules.required,
      destinationState: validationRules.required,
      scheduledDate: validationRules.required,
      scheduledTime: validationRules.required,
      contactNumber: validationRules.required
    }
  );

  const handleCreateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      success("Delivery scheduled successfully and assigned to driver!");
      reset();
    } else {
      error("Please fill all required fields correctly");
    }
  };

  const handleBulkTrack = () => {
    if (selectedDeliveries.length === 0) {
      error("Please select deliveries to track");
      return;
    }
    success(`Tracking ${selectedDeliveries.length} delivery(ies)`);
    setSelectedDeliveries([]);
  };

  const handleExport = () => {
    success("Logistics report exported to Excel");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>Logistics Management</h1>
          <p className={designSystem.getBody("small")}>
            Manage LPG deliveries, fleet operations, and transportation logistics
          </p>
        </div>

        {/* Stats Cards */}
        <div className={designSystem.getGrid("cols4")}>
          {logisticsStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions & Filters */}
        <section className="space-y-4">
          <DataTableHeader
            title="Delivery Operations"
            description="Real-time logistics management and delivery tracking system"
            searchPlaceholder="Search by delivery number, vehicle, or customer..."
            onSearch={(value) => console.log("Search:", value)}
            onRefresh={() => success("Logistics data refreshed")}
            onExport={handleExport}
            actions={
              <div className="flex space-x-2">
                {selectedDeliveries.length > 0 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleBulkTrack}>
                      <Navigation className="h-4 w-4 mr-2" />
                      Track Selected ({selectedDeliveries.length})
                    </Button>
                    <Button variant="outline" onClick={() => success("Routes optimized")}>
                      <Route className="h-4 w-4 mr-2" />
                      Optimize Routes
                    </Button>
                  </div>
                )}
                <FormModal
                  title="Schedule New Delivery"
                  description="Schedule a new LPG delivery operation"
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Delivery
                    </Button>
                  }
                  onSubmit={handleCreateDelivery}
                  submitLabel="Schedule Delivery"
                  size="lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Customer Name" required error={errors.customerName}>
                      <Input
                        value={values.customerName}
                        onChange={(e) => setValue('customerName', e.target.value)}
                        placeholder="Enter customer name"
                      />
                    </FormField>

                    <FormField label="Volume (MT)" required error={errors.volume}>
                      <Input
                        type="number"
                        value={values.volume}
                        onChange={(e) => setValue('volume', e.target.value)}
                        placeholder="0.0"
                        min="0.1"
                        step="0.1"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Vehicle Number" required error={errors.vehicleNumber}>
                      <Select value={values.vehicleNumber} onValueChange={(value) => setValue('vehicleNumber', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleNumbers.map((vehicle) => (
                            <SelectItem key={vehicle} value={vehicle}>
                              {vehicle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Driver Name" required error={errors.driverName}>
                      <Input
                        value={values.driverName}
                        onChange={(e) => setValue('driverName', e.target.value)}
                        placeholder="Assigned driver name"
                      />
                    </FormField>
                  </div>

                  <FormField label="Origin Location" required error={errors.origin}>
                    <Select value={values.origin} onValueChange={(value) => setValue('origin', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {origins.map((origin) => (
                          <SelectItem key={origin} value={origin}>
                            {origin}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Destination" required error={errors.destination}>
                      <Input
                        value={values.destination}
                        onChange={(e) => setValue('destination', e.target.value)}
                        placeholder="Delivery destination"
                      />
                    </FormField>

                    <FormField label="State" required error={errors.destinationState}>
                      <Select value={values.destinationState} onValueChange={(value) => setValue('destinationState', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Scheduled Date" required error={errors.scheduledDate}>
                      <Input
                        type="date"
                        value={values.scheduledDate}
                        onChange={(e) => setValue('scheduledDate', e.target.value)}
                      />
                    </FormField>

                    <FormField label="Scheduled Time" required error={errors.scheduledTime}>
                      <Input
                        type="time"
                        value={values.scheduledTime}
                        onChange={(e) => setValue('scheduledTime', e.target.value)}
                      />
                    </FormField>
                  </div>

                  <FormField label="Customer Contact" required error={errors.contactNumber}>
                    <Input
                      value={values.contactNumber}
                      onChange={(e) => setValue('contactNumber', e.target.value)}
                      placeholder="+234-XXX-XXX-XXXX"
                    />
                  </FormField>

                  <FormField label="Special Instructions">
                    <Textarea
                      value={values.specialInstructions}
                      onChange={(e) => setValue('specialInstructions', e.target.value)}
                      placeholder="Delivery instructions, safety requirements, or special handling notes"
                      rows={3}
                    />
                  </FormField>
                </FormModal>
              </div>
            }
          />

          {/* Logistics Table */}
          <DataTable
            data={logisticsData}
            columns={tableColumns}
            pagination={{
              page: 1,
              pageSize: 10,
              total: logisticsData.length,
              onPageChange: (page) => console.log("Page:", page),
              onPageSizeChange: (size) => console.log("Page size:", size)
            }}
            sorting={{
              column: "scheduledTime",
              direction: "asc",
              onSortChange: (column, direction) => console.log("Sort:", column, direction)
            }}
            selection={{
              selectedRows: selectedDeliveries,
              onRowSelect: (id) => {
                setSelectedDeliveries(prev =>
                  prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
                );
              },
              onSelectAll: () => {
                setSelectedDeliveries(prev =>
                  prev.length === logisticsData.length
                    ? []
                    : logisticsData.map(delivery => delivery.id)
                );
              }
            }}
            actions={{
              row: (row) => (
                <ActionCell
                  actions={[
                    {
                      label: "Track",
                      onClick: () => success(`Tracking ${row.deliveryNumber}`),
                      variant: "outline"
                    },
                    {
                      label: "Contact Driver",
                      onClick: () => success(`Contacting ${row.driverName}`),
                      variant: "outline"
                    },
                    {
                      label: "Update Status",
                      onClick: () => success(`Updating ${row.deliveryNumber} status`),
                      variant: "outline"
                    }
                  ]}
                />
              ),
              bulk: selectedDeliveries.length > 0 ? (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBulkTrack}>
                    <Navigation className="h-4 w-4 mr-1" />
                    Track
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => success("Routes optimized")}>
                    <Route className="h-4 w-4 mr-1" />
                    Optimize
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => success("Report exported")}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              ) : undefined
            }}
            emptyState={{
              message: "No deliveries scheduled",
              action: (
                <Button onClick={() => success("Scheduling first delivery...")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule First Delivery
                </Button>
              )
            }}
          />
        </section>

        {/* Fleet Status and Recent Activity */}
        <section className="space-y-4">
          <h2 className={designSystem.getHeading("h3")}>Fleet Operations</h2>

          <ListCard
            title="Active Deliveries"
            items={[
              {
                id: "1",
                title: "LOG-2024-001 - Delta Gas Distribution Ltd",
                description: "BEL-001-KD • Driver: Musa Ibrahim • 25.5 MT • Lagos → Warri",
                status: { label: "In Transit", variant: "secondary" },
                metadata: [
                  { label: "Distance", value: "342 km" },
                  { label: "ETA", value: "2:30 PM" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Navigation className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "2",
                title: "LOG-2024-004 - Abuja Gas Hub",
                description: "BEL-005-AB • Driver: Fatima Aliyu • 28.0 MT • Abuja → Garki",
                status: { label: "Loading", variant: "outline" },
                metadata: [
                  { label: "Distance", value: "25 km" },
                  { label: "Scheduled", value: "10:00 AM" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Clock className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                )
              },
              {
                id: "3",
                title: "LOG-2024-005 - Port Harcourt Industries",
                description: "BEL-004-PH • Driver: Chidi Okonkwo • 40.0 MT • PH → Trans Amadi",
                status: { label: "Delayed", variant: "destructive" },
                metadata: [
                  { label: "Delay Reason", value: "Traffic congestion" },
                  { label: "New ETA", value: "10:30 AM" }
                ],
                actions: (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <AlertTriangle className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Route className="h-3 w-3" />
                    </Button>
                  </div>
                )
              }
            ]}
            emptyState={{
              message: "No active deliveries",
              action: {
                label: "Schedule Delivery",
                onClick: () => success("Scheduling new delivery...")
              }
            }}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}