'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Customer,
  Order,
  Plant,
  InventoryTransaction,
  DashboardStats,
  Truck
} from '@/lib/types';
import { useAuth } from './AuthContext';
import {
  filterProductsByDepartment,
  filterCustomersByDepartment,
  filterOrdersByDepartment,
  filterPlantsForUser,
  filterTrucksByDepartment,
  filterDashboardStats,
  canPerformAction
} from '@/lib/filters';

interface ERPContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;

  // Plants
  plants: Plant[];
  addPlant: (plant: Omit<Plant, 'id'>) => void;
  updatePlant: (id: string, plant: Partial<Plant>) => void;

  // Trucks
  trucks: Truck[];
  addTruck: (truck: Omit<Truck, 'id'>) => void;
  updateTruck: (id: string, truck: Partial<Truck>) => void;

  // Inventory
  inventoryTransactions: InventoryTransaction[];
  addInventoryTransaction: (transaction: Omit<InventoryTransaction, 'id'>) => void;

  // Dashboard
  dashboardStats: DashboardStats;

  // Permission checks
  canPerformAction: (action: string, plantId?: string) => boolean;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

// Mock data
const mockPlants: Plant[] = [
  {
    id: 'plant-1',
    name: 'Kano Plant',
    location: 'Kano',
    status: 'operational',
    capacity: 500,
    currentStock: 320,
    manager: 'Abubakar Mohammed',
    address: 'Industrial Area, Kano',
    phone: '+234803000001'
  },
  {
    id: 'plant-2',
    name: 'Kaduna Plant',
    location: 'Kaduna',
    status: 'operational',
    capacity: 500,
    currentStock: 280,
    manager: 'Fatima Aliyu',
    address: 'Kakuri Industrial, Kaduna',
    phone: '+234803000002'
  },
  {
    id: 'plant-3',
    name: 'Abuja Plant',
    location: 'Abuja',
    status: 'under-construction',
    capacity: 600,
    currentStock: 0,
    address: 'Suite 1, Plot 1054 R.I Uzoma Off Idris Gidado Street Wuye – Abuja',
    phone: '+2348035147341'
  }
];

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'LPG 12.5kg Cylinder',
    category: 'cylinder',
    sku: 'CYL-12.5',
    description: '12.5kg LPG Cylinder',
    unit: 'piece',
    price: 15000,
    stockLevel: 150,
    reorderLevel: 50,
    plantId: 'plant-1'
  },
  {
    id: 'prod-2',
    name: 'LPG 6.25kg Cylinder',
    category: 'cylinder',
    sku: 'CYL-6.25',
    description: '6.25kg LPG Cylinder',
    unit: 'piece',
    price: 8000,
    stockLevel: 200,
    reorderLevel: 75,
    plantId: 'plant-1'
  },
  {
    id: 'prod-3',
    name: 'LPG Bulk',
    category: 'lpg',
    sku: 'LPG-BULK',
    description: 'Liquefied Petroleum Gas - Bulk',
    unit: 'MT',
    price: 850000,
    stockLevel: 320,
    reorderLevel: 100,
    plantId: 'plant-1'
  },
  {
    id: 'prod-4',
    name: 'Regulator',
    category: 'accessory',
    sku: 'ACC-REG',
    description: 'LPG Regulator',
    unit: 'piece',
    price: 2500,
    stockLevel: 300,
    reorderLevel: 100,
    plantId: 'plant-1'
  },
  {
    id: 'prod-5',
    name: 'Hose',
    category: 'accessory',
    sku: 'ACC-HOSE',
    description: 'LPG Hose',
    unit: 'piece',
    price: 1500,
    stockLevel: 400,
    reorderLevel: 150,
    plantId: 'plant-1'
  }
];

const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Alhaji Musa Distributors',
    email: 'musa@example.com',
    phone: '+234803111001',
    address: 'No 15 Market Road, Kano',
    customerType: 'wholesale',
    creditLimit: 5000000,
    outstandingBalance: 0,
    plantId: 'plant-1',
    createdAt: '2025-01-15'
  },
  {
    id: 'cust-2',
    name: 'Grace Retail Store',
    email: 'grace@example.com',
    phone: '+234803222002',
    address: 'Shop 45, Kaduna Plaza',
    customerType: 'retail',
    outstandingBalance: 0,
    plantId: 'plant-2',
    createdAt: '2025-02-10'
  }
];

const mockOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-2025-001',
    customerId: 'cust-1',
    customerName: 'Alhaji Musa Distributors',
    plantId: 'plant-1',
    items: [
      {
        productId: 'prod-1',
        productName: 'LPG 12.5kg Cylinder',
        quantity: 50,
        unitPrice: 15000,
        total: 750000
      }
    ],
    totalAmount: 750000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'transfer',
    createdAt: '2025-10-01',
    completedAt: '2025-10-01'
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-2025-002',
    customerId: 'cust-2',
    customerName: 'Grace Retail Store',
    plantId: 'plant-2',
    items: [
      {
        productId: 'prod-2',
        productName: 'LPG 6.25kg Cylinder',
        quantity: 20,
        unitPrice: 8000,
        total: 160000
      },
      {
        productId: 'prod-4',
        productName: 'Regulator',
        quantity: 20,
        unitPrice: 2500,
        total: 50000
      }
    ],
    totalAmount: 210000,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: '2025-10-05'
  }
];

const mockTrucks: Truck[] = [
  {
    id: 'truck-001',
    plateNumber: 'KN-234-AB',
    type: 'offtake',
    capacity: 33000, // 33MT capacity
    driver: 'Ahmed Mohammed',
    driverPhone: '+234803111001',
    status: 'available',
    currentLocation: 'Kano Depot',
    assignedPlantId: 'plant-1'
  },
  {
    id: 'truck-002',
    plateNumber: 'KD-567-CD',
    type: 'offtake',
    capacity: 33000,
    driver: 'Ibrahim Abdullahi',
    driverPhone: '+234803222002',
    status: 'in-transit',
    currentLocation: 'En route to Kaduna',
    assignedPlantId: 'plant-2'
  },
  {
    id: 'truck-003',
    plateNumber: 'AB-890-EF',
    type: 'delivery',
    capacity: 20000,
    driver: 'Musa Garba',
    driverPhone: '+234803333003',
    status: 'loading',
    currentLocation: 'Abuja Terminal',
    assignedPlantId: 'plant-3'
  },
  {
    id: 'truck-004',
    plateNumber: 'KN-111-GH',
    type: 'bobtail',
    capacity: 5000, // 5000L capacity for bobtail
    driver: 'Salisu Hassan',
    driverPhone: '+234803444004',
    status: 'available',
    currentLocation: 'Kano Plant',
    assignedPlantId: 'plant-1'
  },
  {
    id: 'truck-005',
    plateNumber: 'KD-222-IJ',
    type: 'bobtail',
    capacity: 5000,
    driver: 'Usman Danjuma',
    driverPhone: '+234803555005',
    status: 'maintenance',
    currentLocation: 'Kaduna Workshop',
    assignedPlantId: 'plant-2'
  }
];

export function ERPProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts);
  const [allCustomers, setAllCustomers] = useState<Customer[]>(mockCustomers);
  const [allOrders, setAllOrders] = useState<Order[]>(mockOrders);
  const [allPlants, setAllPlants] = useState<Plant[]>(mockPlants);
  const [allTrucks, setAllTrucks] = useState<Truck[]>(mockTrucks);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);

  // Filter data based on user access
  const products = user ? filterProductsByDepartment(allProducts, user) : [];
  const customers = user ? filterCustomersByDepartment(allCustomers, user) : [];
  const orders = user ? filterOrdersByDepartment(allOrders, user) : [];
  const plants = user ? filterPlantsForUser(allPlants, user) : [];
  const trucks = user ? filterTrucksByDepartment(allTrucks, user) : [];

  // Calculate dashboard stats with filtered data
  const dashboardStats: DashboardStats = user ? filterDashboardStats({
    orders: allOrders,
    customers: allCustomers,
    inventory: allProducts.map(p => ({
      id: p.id,
      productId: p.id,
      productName: p.name,
      currentStock: p.stockLevel,
      minStockLevel: p.reorderLevel,
      plantId: p.plantId,
      lastUpdated: new Date().toISOString(),
      unit: p.unit
    })),
    processes: []
  }, user) : {
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingProcesses: 0,
    recentOrders: [],
    lowStockItems: [],
    urgentProcesses: []
  };

  // Permission check wrapper
  const canPerformActionWrapper = (action: string, plantId?: string): boolean => {
    return user ? canPerformAction(action, user, plantId) : false;
  };

  // Products
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: `prod-${Date.now()}` };
    setAllProducts([...allProducts, newProduct]);
  };

  const updateProduct = (id: string, update: Partial<Product>) => {
    setAllProducts(allProducts.map(p => p.id === id ? { ...p, ...update } : p));
  };

  const deleteProduct = (id: string) => {
    setAllProducts(allProducts.filter(p => p.id !== id));
  };

  // Customers
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: `cust-${Date.now()}` };
    setAllCustomers([...allCustomers, newCustomer]);
  };

  const updateCustomer = (id: string, update: Partial<Customer>) => {
    setAllCustomers(allCustomers.map(c => c.id === id ? { ...c, ...update } : c));
  };

  const deleteCustomer = (id: string) => {
    setAllCustomers(allCustomers.filter(c => c.id !== id));
  };

  // Orders
  const addOrder = (order: Omit<Order, 'id' | 'orderNumber'>) => {
    const orderNumber = `ORD-2025-${String(allOrders.length + 1).padStart(3, '0')}`;
    const newOrder = { ...order, id: `ord-${Date.now()}`, orderNumber };
    setAllOrders([...allOrders, newOrder]);
  };

  const updateOrder = (id: string, update: Partial<Order>) => {
    setAllOrders(allOrders.map(o => o.id === id ? { ...o, ...update } : o));
  };

  // Plants
  const addPlant = (plant: Omit<Plant, 'id'>) => {
    const newPlant = { ...plant, id: `plant-${Date.now()}` };
    setAllPlants([...allPlants, newPlant]);
  };

  const updatePlant = (id: string, update: Partial<Plant>) => {
    setAllPlants(allPlants.map(p => p.id === id ? { ...p, ...update } : p));
  };

  // Trucks
  const addTruck = (truck: Omit<Truck, 'id'>) => {
    const newTruck = { ...truck, id: `truck-${Date.now()}` };
    setAllTrucks([...allTrucks, newTruck]);
  };

  const updateTruck = (id: string, update: Partial<Truck>) => {
    setAllTrucks(allTrucks.map(t => t.id === id ? { ...t, ...update } : t));
  };

  // Inventory
  const addInventoryTransaction = (transaction: Omit<InventoryTransaction, 'id'>) => {
    const newTransaction = { ...transaction, id: `inv-${Date.now()}` };
    setInventoryTransactions([...inventoryTransactions, newTransaction]);

    // Update product stock
    if (transaction.type === 'in' || transaction.type === 'adjustment') {
      updateProduct(transaction.productId, {
        stockLevel: allProducts.find(p => p.id === transaction.productId)!.stockLevel + transaction.quantity
      });
    } else if (transaction.type === 'out') {
      updateProduct(transaction.productId, {
        stockLevel: allProducts.find(p => p.id === transaction.productId)!.stockLevel - transaction.quantity
      });
    }
  };

  return (
    <ERPContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        orders,
        addOrder,
        updateOrder,
        plants,
        addPlant,
        updatePlant,
        trucks,
        addTruck,
        updateTruck,
        inventoryTransactions,
        addInventoryTransaction,
        dashboardStats,
        canPerformAction: canPerformActionWrapper
      }}
    >
      {children}
    </ERPContext.Provider>
  );
}

export function useERP() {
  const context = useContext(ERPContext);
  if (context === undefined) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
}
