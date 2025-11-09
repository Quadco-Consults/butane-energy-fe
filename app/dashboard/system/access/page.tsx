"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { designSystem } from "@/lib/design-system";
import {
  Shield,
  Users,
  Key,
  AlertTriangle,
  Settings,
  Lock,
  Unlock
} from "lucide-react";

export default function AccessManagementPage() {
  const { user } = useAuth();

  if (!user) return null;

  const success = (message: string) => alert(`Success: ${message}`);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={designSystem.getHeading("h1")}>Access Management</h1>
          <p className={designSystem.getBody("small")}>
            Manage user permissions, roles, and system access controls
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
              <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Defined user roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Access Violations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permission Groups</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Active permission sets</p>
            </CardContent>
          </Card>
        </div>

        {/* Access Management Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Access Control
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-medium">224</span>
                </div>
                <div className="flex justify-between">
                  <span>Suspended Users:</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Approval:</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => success("User management opened")}>
                  Manage Users
                </Button>
                <Button size="sm" variant="outline" onClick={() => success("User created")}>
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Role Management
              </CardTitle>
              <CardDescription>
                Configure user roles and permission levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>System Admin:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Managers:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Staff:</span>
                  <span className="font-medium">209</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => success("Role management opened")}>
                  Manage Roles
                </Button>
                <Button size="sm" variant="outline" onClick={() => success("Role created")}>
                  Add Role
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Permissions
              </CardTitle>
              <CardDescription>
                Define and assign system permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Finance Module:</span>
                  <span className="font-medium">15 users</span>
                </div>
                <div className="flex justify-between">
                  <span>HR Module:</span>
                  <span className="font-medium">8 users</span>
                </div>
                <div className="flex justify-between">
                  <span>Operations:</span>
                  <span className="font-medium">25 users</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => success("Permissions management opened")}>
                  Manage Permissions
                </Button>
                <Button size="sm" variant="outline" onClick={() => success("Permission group created")}>
                  Add Group
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>2FA Enabled:</span>
                  <span className="font-medium">89%</span>
                </div>
                <div className="flex justify-between">
                  <span>Session Timeout:</span>
                  <span className="font-medium">30 min</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed Login Limit:</span>
                  <span className="font-medium">5 attempts</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => success("Security settings opened")}>
                  Security Settings
                </Button>
                <Button size="sm" variant="outline" onClick={() => success("Audit log opened")}>
                  View Audit Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Access Events</CardTitle>
            <CardDescription>
              Latest security and access management activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">User Access Granted - Mike Chen</p>
                    <p className="text-sm text-gray-600">IT Administrator role assigned</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-medium">User Suspended - Grace Adebayo</p>
                    <p className="text-sm text-gray-600">HR Specialist access suspended</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">4 hours ago</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <Key className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Permission Update - Finance Team</p>
                    <p className="text-sm text-gray-600">Report generation access added</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}