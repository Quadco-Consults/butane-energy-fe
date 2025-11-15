'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { VendorManagement } from '@/components/procurement/VendorManagement';

// Mock data for demonstration
const mockVendors = [
  {
    id: '1',
    vendorCode: 'ABC001',
    name: 'ABC Office Supplies Ltd',
    searchTerm: 'ABC',
    generalInfo: {
      title: 'Ltd',
      name1: 'ABC Office Supplies Ltd',
      name2: 'Business Solutions Division',
      searchTerm1: 'ABC',
      searchTerm2: 'Office',
      street: '123 Commercial Avenue',
      postalCode: '100001',
      city: 'Lagos',
      country: 'Nigeria',
      region: 'Lagos State',
      language: 'EN',
      telephone: '+234-1-234-5678',
      mobile: '+234-802-123-4567',
      email: 'procurement@abcoffice.ng',
      website: 'www.abcoffice.ng',
      taxNumber: 'TIN-123456789',
      vatRegistration: 'VAT-987654321'
    },
    purchasingData: {
      purchaseOrderCurrency: 'NGN',
      paymentTerms: 'NET30',
      incoterms: 'DAP',
      minimumOrderValue: 50000,
      orderOptimization: true,
      automaticEvaluatedReceiptSettlement: false,
      deliveryCompletionRule: 'COMPLETE',
      underDeliveryTolerance: 5,
      overDeliveryTolerance: 10,
      unlimitedOverDelivery: false,
      priceDate: 'ORDER_DATE',
      modeOfTransport: 'ROAD',
      customsOffice: 'Lagos Port'
    },
    accountingData: {
      reconAccount: '2100001',
      paymentMethods: ['BANK_TRANSFER', 'CHECK'],
      accountingClerk: 'FIN001',
      deletionBlock: false,
      postingBlock: false
    },
    vendorAccountGroup: 'DOMESTIC',
    vendorClass: 'A',
    status: 'ACTIVE',
    createdBy: 'System Admin',
    createdAt: new Date('2024-01-15'),
    plantAccess: ['P001', 'P002']
  },
  {
    id: '2',
    vendorCode: 'TW002',
    name: 'TechWorld Nigeria',
    searchTerm: 'TECH',
    generalInfo: {
      title: 'Ltd',
      name1: 'TechWorld Nigeria Ltd',
      name2: 'IT Solutions Provider',
      searchTerm1: 'TECH',
      searchTerm2: 'IT',
      street: '45 Technology Drive',
      postalCode: '100271',
      city: 'Lagos',
      country: 'Nigeria',
      region: 'Lagos State',
      language: 'EN',
      telephone: '+234-1-345-6789',
      mobile: '+234-803-234-5678',
      email: 'sales@techworld.ng',
      website: 'www.techworld.ng',
      taxNumber: 'TIN-234567890',
      vatRegistration: 'VAT-876543210'
    },
    purchasingData: {
      purchaseOrderCurrency: 'NGN',
      paymentTerms: 'NET30',
      incoterms: 'DAP',
      minimumOrderValue: 100000,
      orderOptimization: true,
      automaticEvaluatedReceiptSettlement: false,
      deliveryCompletionRule: 'PARTIAL',
      underDeliveryTolerance: 0,
      overDeliveryTolerance: 5,
      unlimitedOverDelivery: false,
      priceDate: 'ORDER_DATE',
      modeOfTransport: 'ROAD',
      customsOffice: 'Lagos Port'
    },
    accountingData: {
      reconAccount: '2100002',
      paymentMethods: ['BANK_TRANSFER'],
      accountingClerk: 'FIN002',
      deletionBlock: false,
      postingBlock: false
    },
    vendorAccountGroup: 'DOMESTIC',
    vendorClass: 'A',
    status: 'ACTIVE',
    createdBy: 'Procurement Team',
    createdAt: new Date('2024-02-20'),
    plantAccess: ['P001']
  },
  {
    id: '3',
    vendorCode: 'LEC003',
    name: 'Lagos Equipment Co.',
    searchTerm: 'EQUIP',
    generalInfo: {
      title: 'Co.',
      name1: 'Lagos Equipment Company',
      name2: 'Industrial Equipment Supplier',
      searchTerm1: 'EQUIP',
      searchTerm2: 'INDUSTRIAL',
      street: '67 Industrial Estate Road',
      postalCode: '100223',
      city: 'Lagos',
      country: 'Nigeria',
      region: 'Lagos State',
      language: 'EN',
      telephone: '+234-1-456-7890',
      mobile: '+234-804-345-6789',
      email: 'info@lagequip.ng',
      website: 'www.lagequip.ng',
      taxNumber: 'TIN-345678901',
      vatRegistration: 'VAT-765432109'
    },
    purchasingData: {
      purchaseOrderCurrency: 'NGN',
      paymentTerms: 'NET45',
      incoterms: 'EXW',
      minimumOrderValue: 200000,
      orderOptimization: false,
      automaticEvaluatedReceiptSettlement: true,
      deliveryCompletionRule: 'COMPLETE',
      underDeliveryTolerance: 2,
      overDeliveryTolerance: 5,
      unlimitedOverDelivery: false,
      priceDate: 'GOODS_RECEIPT',
      modeOfTransport: 'ROAD',
      customsOffice: 'Lagos Port'
    },
    accountingData: {
      reconAccount: '2100003',
      paymentMethods: ['BANK_TRANSFER', 'LC'],
      accountingClerk: 'FIN003',
      deletionBlock: false,
      postingBlock: false
    },
    vendorAccountGroup: 'DOMESTIC',
    vendorClass: 'B',
    status: 'ACTIVE',
    createdBy: 'Operations Manager',
    createdAt: new Date('2024-03-10'),
    plantAccess: ['P001', 'P003']
  },
  {
    id: '4',
    vendorCode: 'STS004',
    name: 'SafeTech Solutions',
    searchTerm: 'SAFE',
    generalInfo: {
      title: 'Ltd',
      name1: 'SafeTech Solutions Ltd',
      name2: 'Safety Equipment Specialists',
      searchTerm1: 'SAFE',
      searchTerm2: 'SAFETY',
      street: '89 Safety Boulevard',
      postalCode: '100156',
      city: 'Lagos',
      country: 'Nigeria',
      region: 'Lagos State',
      language: 'EN',
      telephone: '+234-1-567-8901',
      mobile: '+234-805-456-7890',
      email: 'contact@safetech.ng',
      website: 'www.safetech.ng',
      taxNumber: 'TIN-456789012',
      vatRegistration: 'VAT-654321098'
    },
    purchasingData: {
      purchaseOrderCurrency: 'NGN',
      paymentTerms: 'NET30',
      incoterms: 'DAP',
      minimumOrderValue: 75000,
      orderOptimization: true,
      automaticEvaluatedReceiptSettlement: false,
      deliveryCompletionRule: 'COMPLETE',
      underDeliveryTolerance: 0,
      overDeliveryTolerance: 10,
      unlimitedOverDelivery: false,
      priceDate: 'ORDER_DATE',
      modeOfTransport: 'ROAD'
    },
    accountingData: {
      reconAccount: '2100004',
      paymentMethods: ['BANK_TRANSFER'],
      accountingClerk: 'FIN001',
      deletionBlock: false,
      postingBlock: false
    },
    vendorAccountGroup: 'DOMESTIC',
    vendorClass: 'B',
    status: 'ACTIVE',
    createdBy: 'Safety Manager',
    createdAt: new Date('2024-04-05'),
    plantAccess: ['P001', 'P002', 'P003']
  },
  {
    id: '5',
    vendorCode: 'BLK005',
    name: 'Blocked Vendor Example',
    searchTerm: 'BLOCKED',
    generalInfo: {
      title: 'Ltd',
      name1: 'Blocked Vendor Example Ltd',
      searchTerm1: 'BLOCKED',
      street: '999 Blocked Street',
      postalCode: '999999',
      city: 'Lagos',
      country: 'Nigeria',
      language: 'EN',
      telephone: '+234-1-999-9999',
      email: 'blocked@example.ng'
    },
    purchasingData: {
      purchaseOrderCurrency: 'NGN',
      paymentTerms: 'NET30',
      orderOptimization: false,
      automaticEvaluatedReceiptSettlement: false,
      deliveryCompletionRule: 'COMPLETE',
      underDeliveryTolerance: 0,
      overDeliveryTolerance: 0,
      unlimitedOverDelivery: false,
      priceDate: 'ORDER_DATE'
    },
    accountingData: {
      reconAccount: '2100999',
      paymentMethods: [],
      accountingClerk: 'FIN999',
      deletionBlock: true,
      postingBlock: true
    },
    vendorAccountGroup: 'DOMESTIC',
    vendorClass: 'C',
    status: 'BLOCKED',
    centralBlockingReasons: ['QUALITY_ISSUES', 'PAYMENT_DISPUTES'],
    createdBy: 'System Admin',
    createdAt: new Date('2024-01-01'),
    plantAccess: []
  }
];

const mockPurchasingInfoRecords = [
  {
    id: '1',
    infoRecordNumber: 'IR-ABC001-MAT001',
    vendor: 'ABC001',
    material: 'MAT001',
    purchasingOrganization: 'BUTANE_NG',
    plant: 'P001',
    conditions: [
      {
        conditionType: 'PB00',
        amount: 25000,
        unit: 'PC',
        currency: 'NGN',
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31')
      }
    ],
    standardOrderQuantity: 10,
    minimumOrderQuantity: 1,
    orderUnit: 'PC',
    netPrice: 25000,
    priceUnit: 1,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    standardDeliveryTime: 7,
    overdDeliveryTolerance: 10,
    underDeliveryTolerance: 5,
    unlimitedOverDelivery: false,
    recordStatus: 'ACTIVE',
    deletionFlag: false,
    createdBy: 'Procurement',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    infoRecordNumber: 'IR-TW002-MAT002',
    vendor: 'TW002',
    material: 'MAT002',
    purchasingOrganization: 'BUTANE_NG',
    plant: 'P001',
    conditions: [
      {
        conditionType: 'PB00',
        amount: 283333,
        unit: 'PC',
        currency: 'NGN',
        validFrom: new Date('2024-02-01'),
        validTo: new Date('2024-12-31')
      }
    ],
    standardOrderQuantity: 5,
    minimumOrderQuantity: 1,
    orderUnit: 'PC',
    netPrice: 283333,
    priceUnit: 1,
    validFrom: new Date('2024-02-01'),
    validTo: new Date('2024-12-31'),
    standardDeliveryTime: 14,
    overdDeliveryTolerance: 5,
    underDeliveryTolerance: 0,
    unlimitedOverDelivery: false,
    recordStatus: 'ACTIVE',
    deletionFlag: false,
    createdBy: 'IT Manager',
    createdAt: new Date('2024-02-20')
  }
];
const mockPlants = [
  { id: 'P001', name: 'Lagos Plant' },
  { id: 'P002', name: 'Abuja Plant' },
  { id: 'P003', name: 'Port Harcourt Plant' }
];

export default function VendorsPage() {
  const handleCreateVendor = async (data: any) => {
    console.log('Creating vendor:', data);
  };

  const handleUpdateVendor = async (vendorId: string, data: any) => {
    console.log('Updating vendor:', vendorId, data);
  };

  const handleBanVendor = async (vendorId: string, reason: string) => {
    console.log('Banning vendor:', vendorId, 'Reason:', reason);
  };

  const handleUnblockVendor = async (vendorId: string) => {
    console.log('Unblocking vendor:', vendorId);
  };

  return (
    <DashboardLayout>
      <VendorManagement
        vendors={mockVendors}
        purchasingInfoRecords={mockPurchasingInfoRecords}
        plants={mockPlants}
        onCreateVendor={handleCreateVendor}
        onUpdateVendor={handleUpdateVendor}
        onBanVendor={handleBanVendor}
        onUnblockVendor={handleUnblockVendor}
        userPermissions={['create_vendor', 'edit_vendor', 'ban_vendor', 'unblock_vendor']}
      />
    </DashboardLayout>
  );
}