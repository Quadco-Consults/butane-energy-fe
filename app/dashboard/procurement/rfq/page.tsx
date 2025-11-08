'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ClipboardList,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Clock,
  Eye,
  Edit,
  Send,
  Reply
} from 'lucide-react';
import Link from 'next/link';

export default function RFQPage() {
  const { user } = useAuth();

  // Mock RFQ data
  const rfqs = [
    {
      id: 'RFQ-2025-001',
      title: 'Office Equipment and Furniture',
      description: 'Request for quotation for office chairs, desks, and computer equipment',
      category: 'Office Supplies',
      requestDate: '2025-11-01',
      responseDeadline: '2025-11-15',
      estimatedValue: 850000,
      status: 'pending',
      supplierCount: 5,
      quotationCount: 3,
      plant: 'Head Office',
      requestedBy: 'Admin Department'
    },
    {
      id: 'RFQ-2025-002',
      title: 'Maintenance Supplies and Tools',
      description: 'Spare parts, tools, and consumables for plant maintenance',
      category: 'Maintenance',
      requestDate: '2025-10-25',
      responseDeadline: '2025-11-18',
      estimatedValue: 650000,
      status: 'draft',
      supplierCount: 0,
      quotationCount: 0,
      plant: 'Kano Plant',
      requestedBy: 'Operations Department'
    },
    {
      id: 'RFQ-2025-003',
      title: 'IT Hardware and Software',
      description: 'Computers, servers, and software licenses for system upgrade',
      category: 'Technology',
      requestDate: '2025-10-20',
      responseDeadline: '2025-11-10',
      estimatedValue: 1200000,
      status: 'quoted',
      supplierCount: 4,
      quotationCount: 4,
      plant: 'All Plants',
      requestedBy: 'IT Department'
    },
    {
      id: 'RFQ-2025-004',
      title: 'Vehicle Parts and Accessories',
      description: 'Spare parts for company vehicles and maintenance equipment',
      category: 'Automotive',
      requestDate: '2025-11-02',
      responseDeadline: '2025-11-20',
      estimatedValue: 450000,
      status: 'sent',
      supplierCount: 6,
      quotationCount: 1,
      plant: 'Logistics',
      requestedBy: 'Logistics Department'
    },
    {
      id: 'RFQ-2025-005',
      title: 'Safety and Security Equipment',
      description: 'Fire safety equipment, CCTV systems, and security accessories',
      category: 'Safety',
      requestDate: '2025-10-15',
      responseDeadline: '2025-11-05',
      estimatedValue: 980000,
      status: 'closed',
      supplierCount: 3,
      quotationCount: 3,
      plant: 'All Plants',
      requestedBy: 'Safety Department'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'quoted': return 'bg-green-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'draft': return 'Being prepared';
      case 'sent': return 'Sent to suppliers';
      case 'pending': return 'Awaiting responses';
      case 'quoted': return 'Quotations received';
      case 'closed': return 'Process completed';
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Request for Quotation (RFQ)</h1>
            <p className="text-muted-foreground">
              Create and manage requests for quotations from suppliers
            </p>
          </div>
          <Link href="/dashboard/procurement/rfq/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New RFQ
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active RFQs</p>
                  <p className="text-xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Response</p>
                  <p className="text-xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Reply className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Quotes Received</p>
                  <p className="text-xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">₦4.1M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All RFQs</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search RFQs..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rfqs.map((rfq) => {
                const daysLeft = getDaysLeft(rfq.responseDeadline);
                return (
                  <div key={rfq.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{rfq.title}</h3>
                          <Badge className={`${getStatusColor(rfq.status)} text-white`}>
                            {rfq.status}
                          </Badge>
                          <Badge variant="outline">{rfq.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{rfq.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">RFQ ID</p>
                            <p className="text-muted-foreground">{rfq.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Estimated Value</p>
                            <p className="text-muted-foreground">₦{rfq.estimatedValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Plant/Department</p>
                            <p className="text-muted-foreground">{rfq.plant}</p>
                          </div>
                          <div>
                            <p className="font-medium">Suppliers/Quotes</p>
                            <p className="text-muted-foreground">{rfq.supplierCount} suppliers, {rfq.quotationCount} quotes</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Created: {new Date(rfq.requestDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rfq.status !== 'closed' && rfq.status !== 'draft' && daysLeft > 0 ? (
                              <span className={`${daysLeft <= 3 ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                                Deadline in {daysLeft} days ({new Date(rfq.responseDeadline).toLocaleDateString()})
                              </span>
                            ) : rfq.status === 'closed' ? (
                              <span className="text-muted-foreground">Completed: {new Date(rfq.responseDeadline).toLocaleDateString()}</span>
                            ) : (
                              <span className="text-muted-foreground">Draft - No deadline set</span>
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            Status: {getStatusDescription(rfq.status)}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Requested by: {rfq.requestedBy}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {rfq.status !== 'closed' && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                        {rfq.status === 'draft' && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Send className="h-3 w-3" />
                            Send
                          </Button>
                        )}
                        {rfq.quotationCount > 0 && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Reply className="h-3 w-3" />
                            View Quotes
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