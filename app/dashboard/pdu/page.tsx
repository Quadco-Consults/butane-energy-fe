'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function PDUDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">PDU Dashboard</h1>
          <p className="text-muted-foreground">
            Project Development Unit - Overview and Management
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Active Projects</h3>
            <p className="text-2xl font-bold text-primary">12</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Planning Phase</h3>
            <p className="text-2xl font-bold text-blue-600">8</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Permits Pending</h3>
            <p className="text-2xl font-bold text-orange-600">5</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Completed Projects</h3>
            <p className="text-2xl font-bold text-green-600">23</p>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">
            PDU dashboard functionality coming soon. This will include project management,
            planning tools, tracking systems, reporting, and permit/license management.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}