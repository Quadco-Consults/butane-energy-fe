// Core types for Butane Energy ERP

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff' | 'viewer';
  plantId?: string;
  avatar?: string;
}

export interface Plant {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'under-construction' | 'planned';
  capacity: number; // in MT
  currentStock: number;
  manager?: string;
  address: string;
  phone: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'lpg' | 'cylinder' | 'accessory';
  sku: string;
  description: string;
  unit: string;
  price: number;
  stockLevel: number;
  reorderLevel: number;
  plantId: string;
}

export interface Cylinder extends Product {
  size: '12.5kg' | '6.25kg';
  condition: 'new' | 'good' | 'needs-inspection' | 'retired';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  customerType: 'retail' | 'wholesale' | 'distributor';
  creditLimit?: number;
  outstandingBalance: number;
  plantId: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  plantId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: 'cash' | 'transfer' | 'credit';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  plantId: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  reference: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  salesByPlant: {
    plantId: string;
    plantName: string;
    revenue: number;
  }[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  inventoryValue: number;
  lowStockItems: number;
  pendingOrders: number;
  revenueGrowth: number;
  ordersGrowth: number;
}
