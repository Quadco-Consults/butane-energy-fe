'use client';

import DashboardLayout from '@/components/DashboardLayout';
import VendorManagement from '@/components/procurement/VendorManagement';

export default function VendorsPage() {
  return (
    <DashboardLayout>
      <VendorManagement />
    </DashboardLayout>
  );
}