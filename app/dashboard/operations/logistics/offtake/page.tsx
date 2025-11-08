'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Truck,
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  Package,
  Eye,
  Edit,
  Play,
  Pause,
  CheckCircle,
  Navigation,
  AlertTriangle,
  Fuel
} from 'lucide-react';
import Link from 'next/link';

export default function TruckDispatchOfftakePage() {
  const { user } = useAuth();

  // Mock truck dispatch data for offtake (collecting products from depot/supplier)
  const offtakeDispatches = [
    {
      id: 'OFT-2025-034',
      truckNumber: 'TRK-045',
      driverName: 'Mallam Sani Yusuf',
      driverPhone: '+234 803 456 7890',
      driverLicense: 'KN-45678912',
      routeDetails: {
        origin: 'Kano Plant',
        destination: 'NLNG Depot - Bonny Island',
        distance: 1250, // km
        estimatedDuration: '18 hours'
      },
      cargo: {
        type: 'LPG Bulk Collection',
        expectedQuantity: 25, // MT
        actualQuantity: null,
        loadingInstructions: 'Standard LPG loading protocol'
      },
      schedule: {
        departureDate: '2025-11-08',
        departureTime: '06:00',
        expectedArrival: '2025-11-09 00:00',
        expectedReturn: '2025-11-10 18:00'
      },
      status: 'in_transit',
      priority: 'high',
      currentLocation: 'En route to Bonny Island',
      lastUpdate: '2025-11-08 14:30',
      fuelLevel: 75,
      approvedBy: 'Grace Adebayo',
      dispatchedBy: 'Ibrahim Usman',
      plant: 'Kano Plant',
      contactDepot: 'NLNG Bonny Terminal',
      emergencyContact: '+234 807 123 4567',
      gpsTracking: 'Active'
    },
    {
      id: 'OFT-2025-035',
      truckNumber: 'TRK-012',
      driverName: 'Alhaji Musa Ibrahim',
      driverPhone: '+234 806 234 5678',
      driverLicense: 'AB-78901234',
      routeDetails: {
        origin: 'Abuja Plant',
        destination: 'Warri Refinery Complex',
        distance: 450,
        estimatedDuration: '8 hours'
      },
      cargo: {
        type: 'LPG Cylinder Collection',
        expectedQuantity: 500, // cylinders
        actualQuantity: 500,
        loadingInstructions: 'Mixed cylinder sizes - 12.5kg and 25kg'
      },
      schedule: {
        departureDate: '2025-11-07',
        departureTime: '08:00',
        expectedArrival: '2025-11-07 16:00',
        expectedReturn: '2025-11-08 10:00'
      },
      status: 'completed',
      priority: 'medium',
      currentLocation: 'Returned to Abuja Plant',
      lastUpdate: '2025-11-08 10:15',
      fuelLevel: 45,
      approvedBy: 'Emeka Okafor',
      dispatchedBy: 'Ahmed Mohammed',
      plant: 'Abuja Plant',
      contactDepot: 'Warri Refinery Logistics',
      emergencyContact: '+234 805 987 6543',
      gpsTracking: 'Completed'
    },
    {
      id: 'OFT-2025-036',
      truckNumber: 'TRK-067',
      driverName: 'Mr. John Okoro',
      driverPhone: '+234 809 876 5432',
      driverLicense: 'LA-56789123',
      routeDetails: {
        origin: 'Lagos Plant',
        destination: 'Chevron Terminal - Escravos',
        distance: 380,
        estimatedDuration: '7 hours'
      },
      cargo: {
        type: 'LPG Bulk Collection',
        expectedQuantity: 30, // MT
        actualQuantity: null,
        loadingInstructions: 'Temperature monitoring required'
      },
      schedule: {
        departureDate: '2025-11-09',
        departureTime: '05:30',
        expectedArrival: '2025-11-09 12:30',
        expectedReturn: '2025-11-10 08:00'
      },
      status: 'scheduled',
      priority: 'high',
      currentLocation: 'Lagos Plant - Ready for dispatch',
      lastUpdate: '2025-11-08 16:00',
      fuelLevel: 95,
      approvedBy: 'Grace Adebayo',
      dispatchedBy: 'Fatima Bello',
      plant: 'Lagos Plant',
      contactDepot: 'Chevron Nigeria Limited',
      emergencyContact: '+234 802 345 6789',
      gpsTracking: 'Pending'
    },
    {
      id: 'OFT-2025-037',
      truckNumber: 'TRK-089',
      driverName: 'Alhaji Adamu Hassan',
      driverPhone: '+234 808 123 4567',
      driverLicense: 'KD-23456789',
      routeDetails: {
        origin: 'Kaduna Plant',
        destination: 'Shell Depot - Port Harcourt',
        distance: 680,
        estimatedDuration: '12 hours'
      },
      cargo: {
        type: 'LPG Accessories Collection',
        expectedQuantity: 200, // accessories
        actualQuantity: null,
        loadingInstructions: 'Include regulators, hoses, and valves'
      },
      schedule: {
        departureDate: '2025-11-10',
        departureTime: '04:00',
        expectedArrival: '2025-11-10 16:00',
        expectedReturn: '2025-11-11 12:00'
      },
      status: 'pending_approval',
      priority: 'medium',
      currentLocation: 'Kaduna Plant - Awaiting dispatch approval',
      lastUpdate: '2025-11-08 15:30',
      fuelLevel: 85,
      approvedBy: null,
      dispatchedBy: 'Ibrahim Usman',
      plant: 'Kaduna Plant',
      contactDepot: 'Shell Nigeria Exploration',
      emergencyContact: '+234 804 567 8901',
      gpsTracking: 'Not Started'
    },
    {
      id: 'OFT-2025-038',
      truckNumber: 'TRK-023',
      driverName: 'Mr. Peter Okafor',
      driverPhone: '+234 807 890 1234',
      driverLicense: 'EN-34567890',
      routeDetails: {
        origin: 'Enugu Plant',
        destination: 'Total Terminal - Port Harcourt',
        distance: 320,
        estimatedDuration: '6 hours'
      },
      cargo: {
        type: 'LPG Bulk Collection',
        expectedQuantity: 20, // MT
        actualQuantity: null,
        loadingInstructions: 'Priority loading - Customer waiting'
      },
      schedule: {
        departureDate: '2025-11-08',
        departureTime: '10:00',
        expectedArrival: '2025-11-08 16:00',
        expectedReturn: '2025-11-09 06:00'
      },
      status: 'overdue',
      priority: 'urgent',
      currentLocation: 'Total Terminal - Loading delayed',
      lastUpdate: '2025-11-08 18:30',
      fuelLevel: 60,
      approvedBy: 'Emeka Okafor',
      dispatchedBy: 'Ahmed Mohammed',
      plant: 'Enugu Plant',
      contactDepot: 'Total Nigeria Plc',
      emergencyContact: '+234 803 678 9012',
      gpsTracking: 'Active',
      delayReason: 'Terminal equipment maintenance'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      case 'in_transit': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level <= 25) return 'text-red-600';
    if (level <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const offtakeStats = {
    totalDispatches: offtakeDispatches.length,
    inTransit: offtakeDispatches.filter(dispatch => dispatch.status === 'in_transit').length,
    overdue: offtakeDispatches.filter(dispatch => dispatch.status === 'overdue').length,
    pendingApproval: offtakeDispatches.filter(dispatch => dispatch.status === 'pending_approval').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Truck Dispatch for Offtake</h1>
            <p className="text-muted-foreground">
              Manage truck dispatches for collecting LPG products from depots and suppliers
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/operations/logistics/offtake/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Offtake Dispatch
              </Button>
            </Link>
          </div>
        </div>

        {/* Dispatch Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Dispatches</p>
                  <p className="text-xl font-bold">{offtakeStats.totalDispatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-xl font-bold">{offtakeStats.inTransit}</p>
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
                  <p className="text-xl font-bold">{offtakeStats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-xl font-bold">{offtakeStats.pendingApproval}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Offtake Dispatches</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search dispatches..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {offtakeDispatches.map((dispatch) => {
                return (
                  <div key={dispatch.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <h3 className="font-semibold text-lg">{dispatch.truckNumber}</h3>
                          </div>
                          <Badge className={`${getStatusColor(dispatch.status)} text-white`}>
                            {dispatch.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(dispatch.priority)}>
                            {dispatch.priority.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Dispatch ID</p>
                            <p className="text-muted-foreground">{dispatch.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Driver</p>
                            <p className="text-muted-foreground">{dispatch.driverName}</p>
                          </div>
                          <div>
                            <p className="font-medium">Route</p>
                            <p className="text-muted-foreground">{dispatch.routeDetails.origin} → {dispatch.routeDetails.destination}</p>
                          </div>
                          <div>
                            <p className="font-medium">Distance</p>
                            <p className="text-muted-foreground">{dispatch.routeDetails.distance} km</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Cargo Type</p>
                            <p className="text-muted-foreground">{dispatch.cargo.type}</p>
                          </div>
                          <div>
                            <p className="font-medium">Expected Quantity</p>
                            <p className="text-muted-foreground">
                              {dispatch.cargo.expectedQuantity} {dispatch.cargo.type.includes('Bulk') ? 'MT' : 'units'}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Current Location</p>
                            <p className="text-muted-foreground">{dispatch.currentLocation}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Fuel className="h-3 w-3" />
                            <span className="font-medium">Fuel:</span>
                            <span className={`font-semibold ${getFuelLevelColor(dispatch.fuelLevel)}`}>
                              {dispatch.fuelLevel}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Departure: {dispatch.schedule.departureDate} at {dispatch.schedule.departureTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Expected Return: {dispatch.schedule.expectedReturn}
                          </div>
                          <div>
                            Contact: {dispatch.contactDepot}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="font-medium">Dispatched by:</span>
                            <span className="text-muted-foreground ml-1">{dispatch.dispatchedBy}</span>
                          </div>
                          {dispatch.approvedBy && (
                            <div>
                              <span className="font-medium">Approved by:</span>
                              <span className="text-muted-foreground ml-1">{dispatch.approvedBy}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">GPS:</span>
                            <span className="text-muted-foreground ml-1">{dispatch.gpsTracking}</span>
                          </div>
                        </div>

                        {/* Status-specific alerts */}
                        {dispatch.status === 'overdue' && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Dispatch overdue! {dispatch.delayReason && `Reason: ${dispatch.delayReason}`}
                            </div>
                          </div>
                        )}

                        {dispatch.status === 'pending_approval' && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Awaiting management approval before dispatch
                            </div>
                          </div>
                        )}

                        {dispatch.fuelLevel <= 25 && (
                          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                            <div className="flex items-center gap-1">
                              <Fuel className="h-3 w-3" />
                              Low fuel level - Refueling may be required
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {dispatch.status === 'pending_approval' && (
                          <>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Approve
                            </Button>
                          </>
                        )}
                        {dispatch.status === 'scheduled' && (
                          <Button variant="outline" size="sm" className="gap-2 text-blue-600">
                            <Play className="h-3 w-3" />
                            Start Trip
                          </Button>
                        )}
                        {dispatch.status === 'in_transit' && (
                          <>
                            <Button variant="outline" size="sm" className="gap-2 text-purple-600">
                              <Navigation className="h-3 w-3" />
                              Track
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Complete
                            </Button>
                          </>
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