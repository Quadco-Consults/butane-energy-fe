'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { PurchaseOrderManagement } from '@/components/procurement/PurchaseOrderManagement';

// Mock data for demonstration
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
        materialType: 'STOCK' as const,
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
        accountAssignmentCategory: 'COST_CENTER' as const,
        costCenter: 'HR_CC_001',
        qualityInspectionRequired: false,
        goodsReceiptNonValuated: false,
        invoiceReceiptNonValuated: false,
        deliveryStatus: 'OPEN' as const,
        invoiceStatus: 'OPEN' as const
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
    createdAt: new Date('2024-11-15'),
    department: 'Human Resources'
  },
  {
    id: '2',
    poNumber: 'PO-2024-002',
    documentType: 'STANDARD',
    headerInfo: {
      description: 'IT Equipment - Laptops and Accessories',
      vendor: 'TW002',
      vendorName: 'TechWorld Nigeria',
      poNumber: 'PO-2024-002',
      orderDate: new Date('2024-11-16'),
      deliveryDate: new Date('2024-11-30'),
      currency: 'NGN',
      paymentTerms: 'NET30',
      purchasingGroup: 'IT_PG',
      purchasingOrganization: 'BUTANE_NG',
      companyCode: 'BUT001',
      documentStatus: 'OPEN',
      releaseStatus: 'NOT_RELEASED',
      totalNetValue: 850000,
      totalTaxAmount: 63750,
      totalGrossValue: 913750,
      deliveryAddress: 'Lagos Main Plant, Victoria Island, Lagos, Nigeria',
      termsOfPayment: 'NET30',
      termsOfDelivery: 'DAP',
      approvalRequired: true,
      confirmationRequired: true
    },
    lineItems: [
      {
        itemNumber: '10',
        materialNumber: 'MAT002',
        materialDescription: 'Laptop Computers',
        materialType: 'STOCK' as const,
        orderQuantity: 3,
        orderUnit: 'PC',
        netPrice: 283333,
        priceUnit: 1,
        netValue: 850000,
        grossValue: 913750,
        deliveryDate: new Date('2024-11-30'),
        plant: 'LAGOS_01',
        storageLocation: 'IT01',
        partialDeliveryAllowed: true,
        unlimitedOverdelivery: false,
        underdeliveryTolerance: 0,
        overdeliveryTolerance: 5,
        accountAssignmentCategory: 'COST_CENTER' as const,
        costCenter: 'IT_CC_002',
        qualityInspectionRequired: false,
        goodsReceiptNonValuated: false,
        invoiceReceiptNonValuated: false,
        deliveryStatus: 'OPEN' as const,
        invoiceStatus: 'OPEN' as const
      }
    ],
    approvalHistory: [],
    conditions: [],
    partners: {
      orderingParty: 'BUTANE_NG',
      vendor: 'TW002'
    },
    sourceDocuments: {
      purchaseRequisitions: ['PR-2024-002']
    },
    followUpDocuments: {
      goodsReceipts: [],
      invoiceReceipts: [],
      serviceEntries: []
    },
    createdBy: 'Chinedu Okafor',
    createdAt: new Date('2024-11-16'),
    department: 'Information Technology'
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
        materialType: 'STOCK' as const,
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
        accountAssignmentCategory: 'COST_CENTER' as const,
        costCenter: 'OPS_CC_003',
        qualityInspectionRequired: true,
        goodsReceiptNonValuated: false,
        invoiceReceiptNonValuated: false,
        deliveryStatus: 'COMPLETE' as const,
        invoiceStatus: 'OPEN' as const
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
      goodsReceipts: ['GR-2024-001'],
      invoiceReceipts: [],
      serviceEntries: []
    },
    createdBy: 'Emeka Nwosu',
    createdAt: new Date('2024-11-17'),
    department: 'Operations'
  },
  {
    id: '4',
    poNumber: 'PO-2024-004',
    documentType: 'STANDARD',
    headerInfo: {
      description: 'Marketing Materials and Promotional Items',
      vendor: 'STS004',
      vendorName: 'SafeTech Solutions',
      poNumber: 'PO-2024-004',
      orderDate: new Date('2024-11-18'),
      deliveryDate: new Date('2024-11-28'),
      currency: 'NGN',
      paymentTerms: 'NET30',
      purchasingGroup: 'MKT_PG',
      purchasingOrganization: 'BUTANE_NG',
      companyCode: 'BUT001',
      documentStatus: 'COMPLETED',
      releaseStatus: 'RELEASED',
      totalNetValue: 275000,
      totalTaxAmount: 20625,
      totalGrossValue: 295625,
      deliveryAddress: 'Lagos Main Plant, Victoria Island, Lagos, Nigeria',
      termsOfPayment: 'NET30',
      termsOfDelivery: 'DAP',
      approvalRequired: false,
      confirmationRequired: true
    },
    lineItems: [
      {
        itemNumber: '10',
        materialNumber: 'MAT004',
        materialDescription: 'Marketing Materials',
        materialType: 'STOCK' as const,
        orderQuantity: 8,
        orderUnit: 'SET',
        netPrice: 34375,
        priceUnit: 1,
        netValue: 275000,
        grossValue: 295625,
        deliveryDate: new Date('2024-11-28'),
        plant: 'LAGOS_01',
        storageLocation: 'MKT01',
        partialDeliveryAllowed: true,
        unlimitedOverdelivery: false,
        underdeliveryTolerance: 0,
        overdeliveryTolerance: 15,
        accountAssignmentCategory: 'COST_CENTER' as const,
        costCenter: 'MKT_CC_004',
        qualityInspectionRequired: false,
        goodsReceiptNonValuated: false,
        invoiceReceiptNonValuated: false,
        deliveryStatus: 'COMPLETE' as const,
        invoiceStatus: 'COMPLETE' as const
      }
    ],
    approvalHistory: [],
    conditions: [],
    partners: {
      orderingParty: 'BUTANE_NG',
      vendor: 'STS004'
    },
    sourceDocuments: {
      purchaseRequisitions: ['PR-2024-003']
    },
    followUpDocuments: {
      goodsReceipts: ['GR-2024-002'],
      invoiceReceipts: ['IV-2024-001'],
      serviceEntries: []
    },
    createdBy: 'Kemi Adebayo',
    createdAt: new Date('2024-11-18'),
    department: 'Marketing'
  }
];

const mockVendors = [
  { id: '1', name: 'ABC Office Supplies Ltd', code: 'ABC001' },
  { id: '2', name: 'TechWorld Nigeria', code: 'TW002' },
  { id: '3', name: 'Lagos Equipment Co.', code: 'LEC003' },
  { id: '4', name: 'SafeTech Solutions', code: 'STS004' }
];

export default function PurchaseOrdersPage() {
  const handleCreatePO = (prNumbers: string[]) => {
    console.log('Creating PO for PR numbers:', prNumbers);
  };

  const handleReleasePO = (poNumber: string) => {
    console.log('Releasing PO:', poNumber);
  };

  const handleBlockPO = (poNumber: string, reason: string) => {
    console.log('Blocking PO:', poNumber, 'Reason:', reason);
  };

  const handleSendPO = (poNumber: string) => {
    console.log('Sending PO:', poNumber);
  };

  const handleViewPO = (poNumber: string) => {
    console.log('Viewing PO:', poNumber);
  };

  const handleEditPO = (poNumber: string) => {
    console.log('Editing PO:', poNumber);
  };

  return (
    <DashboardLayout>
      <PurchaseOrderManagement
        purchaseOrders={mockPurchaseOrders}
        vendors={mockVendors}
        onCreatePO={handleCreatePO}
        onReleasePO={handleReleasePO}
        onBlockPO={handleBlockPO}
        onSendPO={handleSendPO}
        onViewPO={handleViewPO}
        onEditPO={handleEditPO}
        userPermissions={['create_po', 'edit_po', 'release_po', 'send_po']}
      />
    </DashboardLayout>
  );
}