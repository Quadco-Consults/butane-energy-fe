'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Permission, Department } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  canAccessDepartment: (department: Department) => boolean;
  canAccessPlant: (plantId: string) => boolean;
  isLoading: boolean;
  switchPlant: (plantId: string) => void;
  currentPlant: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development - In production, this would come from a backend
const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    firstName: 'Ahmed',
    lastName: 'Mohammed',
    email: 'ahmed.mohammed@butane-energy.com',
    employeeId: 'BE-001',
    department: 'tdu',
    role: 'plant_manager',
    permissions: [
      'view_dashboard',
      'manage_tdu_operations',
      'manage_tdu_orders',
      'view_tdu_revenue',
      'manage_tdu_logistics',
      'view_customer_dashboard',
      'generate_tdu_reports'
    ],
    plantAccess: ['plant-1'], // Kano Plant only
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-002',
    firstName: 'Emeka',
    lastName: 'Okafor',
    email: 'emeka.okafor@butane-energy.com',
    employeeId: 'BE-002',
    department: 'finance',
    role: 'department_head',
    permissions: [
      'view_dashboard',
      'view_financial_reports',
      'process_payments',
      'approve_budgets',
      'manage_budgets',
      'view_cost_analysis'
    ],
    plantAccess: ['plant-1', 'plant-2', 'plant-3'], // All plants
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-003',
    firstName: 'Aisha',
    lastName: 'Ibrahim',
    email: 'aisha.ibrahim@butane-energy.com',
    employeeId: 'BE-003',
    department: 'sales',
    role: 'senior_staff',
    permissions: [
      'view_dashboard',
      'create_orders',
      'view_orders',
      'edit_orders',
      'manage_customers',
      'view_sales_reports'
    ],
    plantAccess: ['plant-1', 'plant-2'], // Kano and Kaduna only
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-004',
    firstName: 'Bello',
    lastName: 'Suleiman',
    email: 'bello.suleiman@butane-energy.com',
    employeeId: 'BE-004',
    department: 'logistics',
    role: 'senior_staff',
    permissions: [
      'view_dashboard',
      'manage_logistics',
      'manage_fleet',
      'manage_trips',
      'manage_vehicle_maintenance',
      'manage_logistics_stock',
      'view_logistics_reports'
    ],
    plantAccess: ['plant-1'], // Kano Plant logistics
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-005',
    firstName: 'Grace',
    lastName: 'Adebayo',
    email: 'grace.adebayo@butane-energy.com',
    employeeId: 'BE-005',
    department: 'procurement',
    role: 'department_head',
    permissions: [
      'view_dashboard',
      'create_purchase_requests',
      'manage_vendors',
      'approve_procurements',
      'manage_tenders',
      'evaluate_bids'
    ],
    plantAccess: ['plant-1', 'plant-2', 'plant-3'], // All plants for procurement
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-006',
    firstName: 'Fatima',
    lastName: 'Aliyu',
    email: 'fatima.aliyu@butane-energy.com',
    employeeId: 'BE-006',
    department: 'trading',
    role: 'senior_staff',
    permissions: [
      'view_dashboard',
      'manage_trading_operations',
      'view_trading_reports',
      'approve_trades',
      'manage_commodity_prices',
      'view_market_data'
    ],
    plantAccess: ['plant-1', 'plant-2', 'plant-3'], // All plants for trading
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-007',
    firstName: 'Ibrahim',
    lastName: 'Usman',
    email: 'ibrahim.usman@butane-energy.com',
    employeeId: 'BE-007',
    department: 'logistics',
    role: 'department_head',
    permissions: [
      'view_dashboard',
      'manage_fleet',
      'schedule_deliveries',
      'track_shipments',
      'manage_transportation',
      'view_logistics_reports'
    ],
    plantAccess: ['plant-1', 'plant-2', 'plant-3'], // All plants for logistics
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-008',
    firstName: 'Khadija',
    lastName: 'Yusuf',
    email: 'khadija.yusuf@butane-energy.com',
    employeeId: 'BE-008',
    department: 'hr',
    role: 'department_head',
    permissions: [
      'view_dashboard',
      'manage_employees',
      'process_payroll',
      'view_hr_reports'
    ],
    plantAccess: ['plant-1', 'plant-2', 'plant-3'], // All plants for HR
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-009',
    firstName: 'Amina',
    lastName: 'Hassan',
    email: 'amina.hassan@butane-energy.com',
    employeeId: 'BE-009',
    department: 'admin',
    role: 'senior_staff',
    permissions: [
      'view_dashboard',
      'manage_office_operations',
      'handle_correspondence',
      'manage_documents',
      'coordinate_meetings'
    ],
    plantAccess: ['plant-1', 'plant-2'], // Kano and Kaduna office operations
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-010',
    firstName: 'Musa',
    lastName: 'Garba',
    email: 'musa.garba@butane-energy.com',
    employeeId: 'BE-010',
    department: 'admin',
    role: 'super_admin',
    permissions: [
      'view_dashboard',
      'manage_users',
      'system_settings',
      'executive_dashboard',
      'approve_major_decisions',
      'view_all_reports',
      'strategic_planning',
      'approve_project_budgets',
      'approve_budgets',
      'approve_procurements',
      // All department permissions for super admin
      'view_orders',
      'create_orders',
      'edit_orders',
      'approve_orders',
      'manage_customers',
      'view_sales_reports',
      'manage_tdu_operations',
      'manage_tdu_orders',
      'view_tdu_revenue',
      'manage_tdu_logistics',
      'view_customer_dashboard',
      'generate_tdu_reports',
      'view_financial_reports',
      'process_payments',
      'manage_budgets',
      'view_cost_analysis',
      'create_purchase_requests',
      'manage_vendors',
      'approve_procurements',
      'manage_tenders',
      'evaluate_bids',
      'manage_trading_operations',
      'view_trading_reports',
      'approve_trades',
      'manage_commodity_prices',
      'view_market_data',
      'manage_logistics',
      'manage_fleet',
      'schedule_deliveries',
      'track_shipments',
      'manage_transportation',
      'manage_product_purchase',
      'manage_fuel',
      'manage_trips',
      'manage_vehicle_maintenance',
      'manage_logistics_stock',
      'view_logistics_reports',
      'manage_employees',
      'process_payroll',
      'view_hr_reports',
      'manage_office_operations',
      'handle_correspondence',
      'manage_documents',
      'coordinate_meetings'
    ],
    plantAccess: ['plant-1', 'plant-2', 'plant-3'], // All plants access
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlant, setCurrentPlant] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('butane_user');
    const savedPlant = localStorage.getItem('butane_current_plant');

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);

      // Set current plant to first accessible plant if not set
      if (savedPlant && userData.plantAccess.includes(savedPlant)) {
        setCurrentPlant(savedPlant);
      } else if (userData.plantAccess.length > 0) {
        setCurrentPlant(userData.plantAccess[0]);
        localStorage.setItem('butane_current_plant', userData.plantAccess[0]);
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user by email (In production, this would be handled by backend authentication)
    const foundUser = MOCK_USERS.find(u => u.email === email && u.isActive);

    if (foundUser) {
      // Update last login
      const userWithLogin = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };

      setUser(userWithLogin);
      localStorage.setItem('butane_user', JSON.stringify(userWithLogin));

      // Set default plant
      if (userWithLogin.plantAccess.length > 0) {
        setCurrentPlant(userWithLogin.plantAccess[0]);
        localStorage.setItem('butane_current_plant', userWithLogin.plantAccess[0]);
      }

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentPlant(null);
    localStorage.removeItem('butane_user');
    localStorage.removeItem('butane_current_plant');
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true; // Super admin has all permissions
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const canAccessDepartment = (department: Department): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;

    // Users can access their own department
    if (user.department === department) return true;

    // Admin department has access to most departments for coordination
    if (user.department === 'admin') {
      return ['tdu', 'sales', 'procurement', 'hr', 'logistics'].includes(department);
    }

    // Department heads can access related departments
    if (user.role === 'department_head') {
      switch (user.department) {
        case 'finance':
          return ['procurement', 'sales', 'trading'].includes(department);
        case 'procurement':
          return ['finance', 'tdu'].includes(department);
        case 'tdu':
          return ['logistics', 'procurement'].includes(department);
        case 'logistics':
          return ['tdu', 'trading'].includes(department);
        case 'trading':
          return ['finance', 'logistics'].includes(department);
        case 'hr':
          return ['admin'].includes(department);
        default:
          return false;
      }
    }

    return false;
  };

  const canAccessPlant = (plantId: string): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.plantAccess.includes(plantId);
  };

  const switchPlant = (plantId: string) => {
    if (canAccessPlant(plantId)) {
      setCurrentPlant(plantId);
      localStorage.setItem('butane_current_plant', plantId);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      hasPermission,
      hasAnyPermission,
      canAccessDepartment,
      canAccessPlant,
      isLoading,
      switchPlant,
      currentPlant
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
