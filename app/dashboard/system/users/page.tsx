"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { designSystem } from "@/lib/design-system";
import {
  Users,
  UserPlus,
  Crown,
  Shield,
  Mail,
  Plus,
  Edit,
  Lock,
  Unlock
} from "lucide-react";

// Sample data for users
const userData = [
  {
    id: "USR-001",
    name: "Michael Davis",
    email: "michael.davis@company.com",
    role: "System Admin",
    department: "IT",
    status: "active",
    lastLogin: "2024-01-20T14:30:00"
  },
  {
    id: "USR-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Finance Manager",
    department: "Finance",
    status: "active",
    lastLogin: "2024-01-20T09:15:00"
  },
  {
    id: "USR-003",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@company.com",
    role: "Operations Supervisor",
    department: "Operations",
    status: "active",
    lastLogin: "2024-01-19T16:45:00"
  },
  {
    id: "USR-004",
    name: "Grace Adebayo",
    email: "grace.adebayo@company.com",
    role: "HR Specialist",
    department: "HR",
    status: "suspended",
    lastLogin: "2024-01-18T11:20:00"
  }
];

export default function UsersPage() {
  const { user } = useAuth();

  if (!user) return null;

  const success = (message: string) => alert(`Success: ${message}`);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>User Management</h1>
          <p className={designSystem.getBody("small")}>
            Manage system users, roles, and account settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">Active system users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">User registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">System administrators</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button onClick={() => success("Add user dialog opened")}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline" onClick={() => success("User data exported")}>
            Export Users
          </Button>
          <Button variant="outline" onClick={() => success("Bulk actions dialog opened")}>
            Bulk Actions
          </Button>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData.map((userData) => (
                <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{userData.name}</p>
                        {userData.role === "System Admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                        {userData.role.includes("Manager") && <Shield className="h-4 w-4 text-blue-500" />}
                      </div>
                      <p className="text-sm text-gray-600">{userData.email}</p>
                      <p className="text-sm text-gray-500">{userData.role} • {userData.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      userData.status === 'active' ? 'bg-green-100 text-green-800' :
                      userData.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {userData.status}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => success(`Viewing ${userData.name}`)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => success(`Email sent to ${userData.name}`)}>
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => success(`${userData.status === 'active' ? 'Suspended' : 'Activated'} ${userData.name}`)}
                      >
                        {userData.status === 'active' ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Management Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Roles
              </CardTitle>
              <CardDescription>
                Current role distribution across the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>System Admin:</span>
                  <span className="font-medium">3 users</span>
                </div>
                <div className="flex justify-between">
                  <span>Managers:</span>
                  <span className="font-medium">12 users</span>
                </div>
                <div className="flex justify-between">
                  <span>Staff:</span>
                  <span className="font-medium">209 users</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="font-medium">23 users</span>
                </div>
              </div>
              <Button size="sm" onClick={() => success("Role management opened")}>
                Manage Roles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest user management activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Lisa Park added</span>
                  </div>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Grace Adebayo suspended</span>
                  </div>
                  <span className="text-xs text-gray-500">4h ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Password reset - Ahmed Hassan</span>
                  </div>
                  <span className="text-xs text-gray-500">6h ago</span>
                </div>
              </div>
              <Button size="sm" onClick={() => success("User audit log opened")}>
                View Audit Log
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}