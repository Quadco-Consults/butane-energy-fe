'use client';

import DashboardLayout from '@/components/DashboardLayout';
import GoodsReceiptManagement from '@/components/procurement/GoodsReceiptManagement';

export default function GoodsReceiptsPage() {
  return (
    <DashboardLayout>
      <GoodsReceiptManagement />
    </DashboardLayout>
  );
}