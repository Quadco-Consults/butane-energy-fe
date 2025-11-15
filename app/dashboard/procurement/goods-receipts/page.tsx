'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { GoodsReceiptManagement } from '@/components/procurement/GoodsReceiptManagement';

// Mock data for demonstration
const mockGoodsReceipts = [];
const mockPurchaseOrders = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    documentType: 'STANDARD',
    headerInfo: {
      description: 'Office Supplies for HR Department',
      vendor: 'ABC001',
      vendorName: 'ABC Office Supplies Ltd',
      poNumber: 'PO-2024-001',
      orderDate: new Date('2024-11-15'),
      deliveryDate: new Date('2024-11-25'),
      currency: 'NGN',
      paymentTerms: 'NET30',
      purchasingGroup: 'HR_PG',
      purchasingOrganization: 'BUTANE_NG',
      companyCode: 'BUT001',
      documentStatus: 'RELEASED',
      releaseStatus: 'RELEASED',
      totalNetValue: 125000,
      totalTaxAmount: 9375,
      totalGrossValue: 134375,
      deliveryAddress: 'Lagos Main Plant, Victoria Island, Lagos, Nigeria',
      termsOfPayment: 'NET30',
      termsOfDelivery: 'DAP',
      approvalRequired: false,
      confirmationRequired: true
    },
    lineItems: [
      {
        itemNumber: '10',
        materialNumber: 'MAT001',
        materialDescription: 'Office Chairs',
        materialType: 'STOCK',
        orderQuantity: 5,
        orderUnit: 'PC',
        netPrice: 25000,
        priceUnit: 1,
        netValue: 125000,
        grossValue: 134375,
        deliveryDate: new Date('2024-11-25'),
        plant: 'LAGOS_01',
        storageLocation: 'FG01',
        partialDeliveryAllowed: true,
        unlimitedOverdelivery: false,
        underdeliveryTolerance: 0,
        overdeliveryTolerance: 10,
        accountAssignmentCategory: 'COST_CENTER',
        costCenter: 'HR_CC_001',
        qualityInspectionRequired: false,
        goodsReceiptNonValuated: false,
        invoiceReceiptNonValuated: false,
        deliveryStatus: 'OPEN',
        invoiceStatus: 'OPEN'
      }
    ],
    approvalHistory: [],
    conditions: [],
    partners: {
      orderingParty: 'BUTANE_NG',
      vendor: 'ABC001'
    },
    sourceDocuments: {
      purchaseRequisitions: ['PR-2024-001']
    },
    followUpDocuments: {
      goodsReceipts: [],
      invoiceReceipts: [],
      serviceEntries: []
    },
    createdBy: 'Adaobi Okechukwu',
    createdAt: new Date('2024-11-15')
  },
  {
    id: '3',
    poNumber: 'PO-2024-003',
    documentType: 'STANDARD',
    headerInfo: {
      description: 'Maintenance Tools and Safety Equipment',
      vendor: 'LEC003',
      vendorName: 'Lagos Equipment Co.',
      poNumber: 'PO-2024-003',
      orderDate: new Date('2024-11-17'),
      deliveryDate: new Date('2024-11-22'),
      currency: 'NGN',
      paymentTerms: 'NET30',
      purchasingGroup: 'OPS_PG',
      purchasingOrganization: 'BUTANE_NG',
      companyCode: 'BUT001',
      documentStatus: 'RELEASED',
      releaseStatus: 'RELEASED',
      totalNetValue: 450000,
      totalTaxAmount: 33750,
      totalGrossValue: 483750,
      deliveryAddress: 'Port Harcourt Plant, Trans Amadi, Port Harcourt, Nigeria',
      termsOfPayment: 'NET30',
      termsOfDelivery: 'DAP',
      approvalRequired: false,
      confirmationRequired: true
    },
    lineItems: [
      {
        itemNumber: '10',
        materialNumber: 'MAT003',
        materialDescription: 'Safety Helmets',
        materialType: 'STOCK',
        orderQuantity: 12,
        orderUnit: 'PC',
        netPrice: 37500,
        priceUnit: 1,
        netValue: 450000,
        grossValue: 483750,
        deliveryDate: new Date('2024-11-22'),
        plant: 'PH_01',
        storageLocation: 'SAF01',
        partialDeliveryAllowed: true,
        unlimitedOverdelivery: false,
        underdeliveryTolerance: 0,
        overdeliveryTolerance: 10,
        accountAssignmentCategory: 'COST_CENTER',
        costCenter: 'OPS_CC_003',
        qualityInspectionRequired: true,
        goodsReceiptNonValuated: false,
        invoiceReceiptNonValuated: false,
        deliveryStatus: 'OPEN',
        invoiceStatus: 'OPEN'
      }
    ],
    approvalHistory: [],
    conditions: [],
    partners: {
      orderingParty: 'BUTANE_NG',
      vendor: 'LEC003'
    },
    sourceDocuments: {
      purchaseRequisitions: ['PR-2024-004']
    },
    followUpDocuments: {
      goodsReceipts: [],
      invoiceReceipts: [],
      serviceEntries: []
    },
    createdBy: 'Emeka Nwosu',
    createdAt: new Date('2024-11-17')
  }
];
const mockPlants = [
  { id: 'P001', name: 'Lagos Plant', location: 'Lagos' },
  { id: 'P002', name: 'Abuja Plant', location: 'Abuja' }
];
const mockStorageLocations = [
  { id: 'SL001', name: 'Main Warehouse', plant: 'P001' },
  { id: 'SL002', name: 'Storage Area A', plant: 'P001' },
  { id: 'SL003', name: 'Central Storage', plant: 'P002' }
];

export default function GoodsReceiptsPage() {
  const handleCreateGR = async (data: any) => {
    console.log('Creating Goods Receipt:', data);
  };

  const handleReverseGR = async (grNumber: string, reason: string) => {
    console.log('Reversing GR:', grNumber, 'Reason:', reason);
  };

  const handleQualityDecision = async (grNumber: string, decision: 'PASSED' | 'FAILED') => {
    console.log('Quality Decision for GR:', grNumber, 'Decision:', decision);
  };

  return (
    <DashboardLayout>
      <GoodsReceiptManagement
        goodsReceipts={mockGoodsReceipts}
        purchaseOrders={mockPurchaseOrders}
        plants={mockPlants}
        storageLocations={mockStorageLocations}
        onCreateGR={handleCreateGR}
        onReverseGR={handleReverseGR}
        onQualityDecision={handleQualityDecision}
        userPermissions={['create_goods_receipt', 'reverse_goods_receipt', 'quality_decision']}
      />
    </DashboardLayout>
  );
}