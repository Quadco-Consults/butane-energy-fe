'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PurchaseOrderManagement from '@/components/procurement/PurchaseOrderManagement';

export default function PurchaseOrdersPage() {
  return (
    <DashboardLayout>
      <PurchaseOrderManagement />
    </DashboardLayout>
  );
}