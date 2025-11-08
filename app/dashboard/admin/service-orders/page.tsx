'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Settings,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  DollarSign,
  Eye,
  Edit,
  Play,
  Pause,
  CheckCircle,
  X,
  AlertTriangle,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceOrdersPage() {
  const { user } = useAuth();

  // Mock service order data
  const serviceOrders = [
    {
      id: 'SO-2025-029',
      title: 'Office Deep Cleaning Service',
      description: 'Monthly comprehensive cleaning of all office spaces and common areas',
      serviceType: 'Cleaning',
      vendor: 'CleanCorp Services',
      requestedBy: 'Ibrahim Usman',
      approvedBy: 'Grace Adebayo',
      orderDate: '2025-11-01',
      startDate: '2025-11-08',
      endDate: '2025-11-08',
      status: 'completed',
      priority: 'medium',
      contractValue: 85000,
      location: 'Head Office - All Floors',
      plant: 'Head Office',
      paymentTerms: 'Net 30',
      paymentStatus: 'paid',
      completionPercentage: 100,
      notes: 'Service completed successfully, all areas thoroughly cleaned'
    },
    {
      id: 'SO-2025-030',
      title: 'HVAC System Maintenance',
      description: 'Quarterly maintenance and inspection of all air conditioning units',
      serviceType: 'HVAC Maintenance',
      vendor: 'CoolAir Systems Ltd',
      requestedBy: 'Ahmed Mohammed',
      approvedBy: 'Emeka Okafor',
      orderDate: '2025-11-02',
      startDate: '2025-11-10',
      endDate: '2025-11-12',
      status: 'in_progress',
      priority: 'high',
      contractValue: 150000,
      location: 'Building A & B',
      plant: 'Head Office',
      paymentTerms: 'Net 30',
      paymentStatus: 'pending',
      completionPercentage: 60,
      notes: 'Work in progress, Building A completed, working on Building B'
    },
    {
      id: 'SO-2025-031',
      title: 'Network Infrastructure Upgrade',
      description: 'Upgrade office network infrastructure and Wi-Fi systems',
      serviceType: 'IT Services',
      vendor: 'NetTech Solutions',
      requestedBy: 'Fatima Bello',
      approvedBy: 'Musa Garba',
      orderDate: '2025-11-03',
      startDate: '2025-11-15',
      endDate: '2025-11-20',
      status: 'approved',
      priority: 'high',
      contractValue: 280000,
      location: 'Building A - IT Department',
      plant: 'Head Office',
      paymentTerms: 'Net 45',
      paymentStatus: 'not_applicable',
      completionPercentage: 0,
      notes: 'Approved, waiting for vendor to start work'
    },
    {
      id: 'SO-2025-032',
      title: 'Security Camera Installation',
      description: 'Installation of additional CCTV cameras in parking areas',
      serviceType: 'Security',
      vendor: 'SecureWatch Systems',
      requestedBy: 'Grace Adebayo',
      approvedBy: 'Emeka Okafor',
      orderDate: '2025-11-04',
      startDate: '2025-11-18',
      endDate: '2025-11-22',
      status: 'pending',
      priority: 'medium',
      contractValue: 320000,
      location: 'Parking Areas A & B',
      plant: 'Head Office',
      paymentTerms: 'Net 30',
      paymentStatus: 'not_applicable',
      completionPercentage: 0,
      notes: 'Awaiting management approval for budget allocation'
    },
    {
      id: 'SO-2025-033',
      title: 'Elevator Annual Inspection',
      description: 'Annual safety inspection and maintenance of all elevators',
      serviceType: 'Maintenance',
      vendor: 'Elevator Solutions Ltd',
      requestedBy: 'Ibrahim Usman',
      approvedBy: null,
      orderDate: '2025-11-05',
      startDate: '2025-11-25',
      endDate: '2025-11-26',
      status: 'draft',
      priority: 'high',
      contractValue: 95000,
      location: 'Building A - Main Elevators',
      plant: 'Head Office',
      paymentTerms: 'Net 30',
      paymentStatus: 'not_applicable',
      completionPercentage: 0,
      notes: 'Draft order, preparing for approval'
    },
    {
      id: 'SO-2025-034',
      title: 'Office Furniture Assembly',
      description: 'Assembly and installation of new office furniture for HR department',
      serviceType: 'Furniture',
      vendor: 'Office Setup Pro',
      requestedBy: 'Ahmed Mohammed',
      approvedBy: 'Grace Adebayo',
      orderDate: '2025-11-06',
      startDate: '2025-11-12',
      endDate: '2025-11-13',
      status: 'on_hold',
      priority: 'low',
      contractValue: 45000,
      location: 'Building B - HR Department',
      plant: 'Head Office',
      paymentTerms: 'Net 15',
      paymentStatus: 'not_applicable',
      completionPercentage: 0,
      notes: 'On hold - waiting for furniture delivery from supplier'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'on_hold': return 'bg-orange-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      case 'not_applicable': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const serviceOrderStats = {
    totalOrders: serviceOrders.length,
    activeOrders: serviceOrders.filter(order => order.status === 'in_progress' || order.status === 'approved').length,
    pendingApproval: serviceOrders.filter(order => order.status === 'pending').length,
    totalValue: serviceOrders.reduce((sum, order) => sum + order.contractValue, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Service Order Management</h1>
            <p className="text-muted-foreground">
              Create and manage service orders to external vendors
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/service-orders/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Service Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Service Order Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xl font-bold">{serviceOrderStats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-xl font-bold">{serviceOrderStats.activeOrders}</p>
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
                  <p className="text-xl font-bold">{serviceOrderStats.pendingApproval}</p>
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
                  <p className="text-xl font-bold">₦{serviceOrderStats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Service Orders</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search service orders..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceOrders.map((order) => {
                const daysLeft = getDaysLeft(order.endDate);
                return (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{order.title}</h3>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(order.priority)}>
                            {order.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{order.serviceType}</Badge>
                        </div>

                        <p className="text-muted-foreground mb-3">{order.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium">Service Order</p>
                            <p className="text-muted-foreground">{order.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Vendor</p>
                            <p className="text-muted-foreground">{order.vendor}</p>
                          </div>
                          <div>
                            <p className="font-medium">Contract Value</p>
                            <p className="text-muted-foreground font-semibold">₦{order.contractValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-muted-foreground">{order.location}</p>
                          </div>
                        </div>

                        {/* Progress Bar (for active orders) */}
                        {order.status === 'in_progress' && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{order.completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${order.completionPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Ordered: {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {order.status === 'completed' ? (
                              <span className="text-green-600 font-medium">
                                Completed: {new Date(order.endDate).toLocaleDateString()}
                              </span>
                            ) : order.status === 'in_progress' ? (
                              <span className={`${daysLeft <= 1 ? 'text-red-600 font-medium' : ''}`}>
                                Due in {daysLeft} days ({new Date(order.endDate).toLocaleDateString()})
                              </span>
                            ) : (
                              <span>Scheduled: {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm mb-2">
                          <div>
                            <span className="font-medium">Requested by:</span>
                            <span className="text-muted-foreground ml-1">{order.requestedBy}</span>
                          </div>
                          {order.approvedBy && (
                            <div>
                              <span className="font-medium">Approved by:</span>
                              <span className="text-muted-foreground ml-1">{order.approvedBy}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Payment Terms:</span>
                            <span className="text-muted-foreground ml-1">{order.paymentTerms}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Payment:</span>
                            <Badge variant="secondary" className={getPaymentStatusColor(order.paymentStatus)}>
                              {order.paymentStatus.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="font-medium">Notes:</span>
                          <span className="text-muted-foreground ml-2">{order.notes}</span>
                        </div>

                        {/* Status-specific alerts */}
                        {order.status === 'pending' && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Pending approval - Requires management authorization
                            </div>
                          </div>
                        )}

                        {order.status === 'on_hold' && (
                          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                            <div className="flex items-center gap-1">
                              <Pause className="h-3 w-3" />
                              Service order on hold - Check notes for details
                            </div>
                          </div>
                        )}

                        {order.status === 'in_progress' && daysLeft <= 1 && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Service due soon - Monitor completion status
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {(order.status === 'draft' || order.status === 'pending') && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                        {order.status === 'pending' && (
                          <Button variant="outline" size="sm" className="gap-2 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </Button>
                        )}
                        {order.status === 'approved' && (
                          <Button variant="outline" size="sm" className="gap-2 text-blue-600">
                            <Play className="h-3 w-3" />
                            Start
                          </Button>
                        )}
                        {order.status === 'on_hold' && (
                          <Button variant="outline" size="sm" className="gap-2 text-purple-600">
                            <Play className="h-3 w-3" />
                            Resume
                          </Button>
                        )}
                        {order.status === 'in_progress' && (
                          <Button variant="outline" size="sm" className="gap-2 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Complete
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-3 w-3" />
                          Contract
                        </Button>
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