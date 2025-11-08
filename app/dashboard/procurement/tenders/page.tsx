'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Clock,
  Eye,
  Edit,
  Download,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function TendersPage() {
  const { user } = useAuth();

  // Mock tender data
  const tenders = [
    {
      id: 'TND-2025-001',
      title: 'LPG Storage Tank Procurement',
      description: 'Procurement of 50MT LPG storage tanks for Kano and Kaduna plants',
      category: 'Equipment',
      publishDate: '2025-10-15',
      closingDate: '2025-11-20',
      estimatedValue: 5000000,
      status: 'open',
      bidCount: 12,
      plant: 'All Plants'
    },
    {
      id: 'TND-2025-002',
      title: 'Transport Services Contract',
      description: 'LPG transportation services for northern region',
      category: 'Services',
      publishDate: '2025-10-20',
      closingDate: '2025-11-25',
      estimatedValue: 3200000,
      status: 'evaluation',
      bidCount: 8,
      plant: 'Kano Plant'
    },
    {
      id: 'TND-2025-003',
      title: 'Office Building Renovation',
      description: 'Renovation of administrative building at Abuja office',
      category: 'Construction',
      publishDate: '2025-09-30',
      closingDate: '2025-10-30',
      estimatedValue: 2800000,
      status: 'closed',
      bidCount: 15,
      plant: 'Abuja Office'
    },
    {
      id: 'TND-2025-004',
      title: 'Safety Equipment Supply',
      description: 'Supply of personal protective equipment and safety gear',
      category: 'Safety',
      publishDate: '2025-11-01',
      closingDate: '2025-11-15',
      estimatedValue: 850000,
      status: 'open',
      bidCount: 6,
      plant: 'All Plants'
    },
    {
      id: 'TND-2025-005',
      title: 'IT Infrastructure Upgrade',
      description: 'Server hardware and networking equipment procurement',
      category: 'Technology',
      publishDate: '2025-10-25',
      closingDate: '2025-12-01',
      estimatedValue: 4500000,
      status: 'draft',
      bidCount: 0,
      plant: 'Head Office'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'closed': return 'bg-red-500';
      case 'evaluation': return 'bg-purple-500';
      case 'draft': return 'bg-gray-500';
      case 'awarded': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysLeft = (closingDate: string) => {
    const today = new Date();
    const closing = new Date(closingDate);
    const diffTime = closing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tenders Management</h1>
            <p className="text-muted-foreground">
              Create, manage, and track tender processes
            </p>
          </div>
          <Link href="/dashboard/procurement/tenders/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Tender
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Open Tenders</p>
                  <p className="text-xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Under Evaluation</p>
                  <p className="text-xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Bidders</p>
                  <p className="text-xl font-bold">41</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">₦16.4M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Tenders</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tenders..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenders.map((tender) => {
                const daysLeft = getDaysLeft(tender.closingDate);
                return (
                  <div key={tender.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{tender.title}</h3>
                          <Badge className={`${getStatusColor(tender.status)} text-white`}>
                            {tender.status}
                          </Badge>
                          <Badge variant="outline">{tender.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{tender.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Tender ID</p>
                            <p className="text-muted-foreground">{tender.id}</p>
                          </div>
                          <div>
                            <p className="font-medium">Estimated Value</p>
                            <p className="text-muted-foreground">₦{tender.estimatedValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Plant/Location</p>
                            <p className="text-muted-foreground">{tender.plant}</p>
                          </div>
                          <div>
                            <p className="font-medium">Bids Received</p>
                            <p className="text-muted-foreground">{tender.bidCount} bids</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Published: {new Date(tender.publishDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {tender.status === 'open' && daysLeft > 0 ? (
                              <span className={daysLeft <= 5 ? 'text-red-600 font-medium' : ''}>
                                Closes in {daysLeft} days ({new Date(tender.closingDate).toLocaleDateString()})
                              </span>
                            ) : (
                              <span>Closed: {new Date(tender.closingDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {tender.status !== 'closed' && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        {tender.bidCount > 0 && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Users className="h-3 w-3" />
                            View Bids
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