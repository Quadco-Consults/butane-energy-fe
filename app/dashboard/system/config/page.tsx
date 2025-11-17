"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Database,
  Shield,
  Mail,
  Clock,
  Save
} from "lucide-react";

export default function SystemConfigPage() {
  const { user } = useAuth();
  const success = (message: string) => alert(`Success: ${message}`);

  const [companyName, setCompanyName] = React.useState('Butane Energy Solutions');
  const [companyEmail, setCompanyEmail] = React.useState('info@butane-energy.com');
  const [timezone, setTimezone] = React.useState('Africa/Lagos');

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-gray-600 mt-2">
            Configure system settings, preferences, and operational parameters
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Enabled system modules</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Health</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">System performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Level</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">High</div>
              <p className="text-xs text-muted-foreground">Current security status</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
              <p className="text-xs text-muted-foreground">Auto backup status</p>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic company and system information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Email</label>
                <Input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="company@domain.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => success("General settings saved successfully!")}>
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Session Timeout:</span>
                  <span className="font-medium">30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Two-Factor Auth:</span>
                  <span className="font-medium text-green-600">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Login Attempts:</span>
                  <span className="font-medium">5 attempts</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Logging:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
              <Button onClick={() => success("Security settings updated!")}>
                <Shield className="h-4 w-4 mr-2" />
                Configure Security
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure SMTP settings for system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>SMTP Server:</span>
                  <span className="font-medium">smtp.gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Port:</span>
                  <span className="font-medium">587</span>
                </div>
                <div className="flex justify-between">
                  <span>Authentication:</span>
                  <span className="font-medium text-green-600">Configured</span>
                </div>
                <div className="flex justify-between">
                  <span>From Email:</span>
                  <span className="font-medium">noreply@butane-energy.com</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => success("Test email sent successfully!")}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Test Email
                </Button>
                <Button variant="outline" onClick={() => success("Email settings saved!")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Modules</CardTitle>
              <CardDescription>
                Enable or disable system modules and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Finance Management</p>
                    <p className="text-sm text-gray-600">Critical module</p>
                  </div>
                  <span className="text-green-600 font-medium">Enabled</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Human Resources</p>
                    <p className="text-sm text-gray-600">Critical module</p>
                  </div>
                  <span className="text-green-600 font-medium">Enabled</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Inventory Management</p>
                    <p className="text-sm text-gray-600">Optional module</p>
                  </div>
                  <span className="text-green-600 font-medium">Enabled</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Advanced Reporting</p>
                    <p className="text-sm text-gray-600">Optional module</p>
                  </div>
                  <span className="text-gray-500 font-medium">Disabled</span>
                </div>
              </div>
              <Button onClick={() => success("Module settings saved!")}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Modules
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Current system status and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">Database</h4>
                <p className="text-sm text-gray-600">PostgreSQL 14.2</p>
                <p className="text-sm text-green-600">Connection healthy</p>
                <p className="text-sm">Last backup: 2 hours ago</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Application Server</h4>
                <p className="text-sm text-gray-600">Next.js 15.5.4</p>
                <p className="text-sm text-green-600">Running optimally</p>
                <p className="text-sm">Memory usage: 67%</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Background Services</h4>
                <p className="text-sm text-gray-600">Email queue, report generation</p>
                <p className="text-sm text-green-600">All services operational</p>
                <p className="text-sm">Queue size: 12 jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}