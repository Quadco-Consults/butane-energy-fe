import { User, Order, Customer, Plant, Product, Truck, InventoryItem, WorkflowProcess } from './types';

/**
 * Data filtering utilities for role-based access control
 * Ensures users only see data from plants and departments they have access to
 */

// Plant-based filtering
export function filterByPlantAccess<T extends { plantId: string }>(
  items: T[],
  user: User
): T[] {
  if (!user) return [];
  if (user.role === 'super_admin') return items;

  return items.filter(item => user.plantAccess.includes(item.plantId));
}

// Department-based filtering for customers (sales department)
export function filterCustomersByDepartment(
  customers: Customer[],
  user: User
): Customer[] {
  if (!user) return [];
  if (user.role === 'super_admin') return customers;

  // Only sales, trading, and admin can see customers
  const authorizedDepartments = ['sales', 'trading', 'admin'];
  if (!authorizedDepartments.includes(user.department)) return [];

  // Filter by plant access
  return filterByPlantAccess(customers, user);
}

// Department-based filtering for orders
export function filterOrdersByDepartment(
  orders: Order[],
  user: User
): Order[] {
  if (!user) return [];
  if (user.role === 'super_admin') return orders;

  // Sales, finance, trading, and admin can see orders
  const authorizedDepartments = ['sales', 'finance', 'trading', 'admin'];
  if (!authorizedDepartments.includes(user.department)) return [];

  return filterByPlantAccess(orders, user);
}

// Department-based filtering for inventory
export function filterInventoryByDepartment(
  inventory: InventoryItem[],
  user: User
): InventoryItem[] {
  if (!user) return [];
  if (user.role === 'super_admin') return inventory;

  // Operations, procurement, logistics, and admin can see inventory
  const authorizedDepartments = ['operations', 'procurement', 'logistics', 'admin'];
  if (!authorizedDepartments.includes(user.department)) return [];

  return filterByPlantAccess(inventory, user);
}

// Department-based filtering for products
export function filterProductsByDepartment(
  products: Product[],
  user: User
): Product[] {
  if (!user) return [];
  if (user.role === 'super_admin') return products;

  // Operations, sales, procurement, trading, logistics, and admin can see products
  const authorizedDepartments = ['operations', 'sales', 'procurement', 'trading', 'logistics', 'admin'];
  if (!authorizedDepartments.includes(user.department)) return [];

  return filterByPlantAccess(products, user);
}

// Department-based filtering for trucks
export function filterTrucksByDepartment(
  trucks: Truck[],
  user: User
): Truck[] {
  if (!user) return [];
  if (user.role === 'super_admin') return trucks;

  // Only operations, logistics, and admin can see trucks
  const authorizedDepartments = ['operations', 'logistics', 'admin'];
  if (!authorizedDepartments.includes(user.department)) return [];

  return filterByPlantAccess(trucks, user);
}

// Department-based filtering for workflow processes
export function filterWorkflowProcessesByDepartment(
  processes: WorkflowProcess[],
  user: User
): WorkflowProcess[] {
  if (!user) return [];
  if (user.role === 'super_admin') return processes;

  // Filter by department access and plant access
  let filtered = processes.filter(process => {
    // Check if user's department can access this process type
    switch (user.department) {
      case 'operations':
        return process.type.includes('inbound') || process.type.includes('investigation');
      case 'procurement':
        return process.type.includes('procurement') || process.type.includes('tender');
      case 'finance':
        return process.type.includes('budget') || process.type.includes('payment') || process.type.includes('payroll');
      case 'sales':
        return process.type.includes('order') || process.type.includes('customer') || process.type.includes('sales');
      case 'trading':
        return process.type.includes('trade') || process.type.includes('commodity') || process.type.includes('market');
      case 'logistics':
        return process.type.includes('delivery') || process.type.includes('transport') || process.type.includes('fleet');
      case 'hr':
        return process.type.includes('leave') || process.type.includes('payroll') || process.type.includes('employee');
      case 'admin':
        return true; // Admin can see all processes
      default:
        return false;
    }
  });

  return filterByPlantAccess(filtered, user);
}

// Plant filtering for plants list (admin functions)
export function filterPlantsForUser(
  plants: Plant[],
  user: User
): Plant[] {
  if (!user) return [];
  if (user.role === 'super_admin') return plants;

  // Users can only see plants they have access to
  return plants.filter(plant => user.plantAccess.includes(plant.id));
}

// Dashboard statistics filtering
export function filterDashboardStats(
  allData: {
    orders: Order[];
    customers: Customer[];
    inventory: InventoryItem[];
    processes: WorkflowProcess[];
  },
  user: User
) {
  if (!user) return {
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingProcesses: 0,
    recentOrders: [],
    lowStockItems: [],
    urgentProcesses: []
  };

  const filteredOrders = filterOrdersByDepartment(allData.orders, user);
  const filteredCustomers = filterCustomersByDepartment(allData.customers, user);
  const filteredInventory = filterInventoryByDepartment(allData.inventory, user);
  const filteredProcesses = filterWorkflowProcessesByDepartment(allData.processes, user);

  return {
    totalOrders: filteredOrders.length,
    totalCustomers: filteredCustomers.length,
    totalProducts: filteredInventory.length,
    pendingProcesses: filteredProcesses.filter(p => p.status === 'pending').length,
    recentOrders: filteredOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    lowStockItems: filteredInventory.filter(item => item.currentStock < item.minStockLevel),
    urgentProcesses: filteredProcesses
      .filter(p => p.priority === 'urgent' && p.status !== 'completed')
      .slice(0, 3)
  };
}

// Permission-based action filtering
export function canPerformAction(
  action: string,
  user: User,
  targetPlantId?: string
): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;

  // Check plant access if specified
  if (targetPlantId && !user.plantAccess.includes(targetPlantId)) {
    return false;
  }

  // Check specific action permissions
  switch (action) {
    case 'create_order':
      return user.permissions.includes('create_orders');
    case 'edit_order':
      return user.permissions.includes('edit_orders');
    case 'approve_order':
      return user.permissions.includes('approve_orders');
    case 'create_customer':
      return user.permissions.includes('manage_customers');
    case 'edit_customer':
      return user.permissions.includes('manage_customers');
    case 'manage_inventory':
      return user.permissions.includes('manage_inbound_operations');
    case 'create_project':
      return user.permissions.includes('create_projects');
    case 'approve_budget':
      return user.permissions.includes('approve_budgets');
    case 'process_payment':
      return user.permissions.includes('process_payments');
    case 'manage_procurement':
      return user.permissions.includes('create_purchase_requests');
    case 'handle_investigation':
      return user.permissions.includes('handle_investigations');
    default:
      return false;
  }
}

// Navigation filtering based on user permissions and department
export function getAuthorizedNavigation(user: User) {
  if (!user) return { coreModules: [], businessProcesses: [] };

  const coreModules = [
    { name: "Dashboard", href: "/dashboard", permission: "view_dashboard" },
    { name: "Inventory", href: "/dashboard/inventory", permission: "view_orders" },
    { name: "Orders", href: "/dashboard/orders", permission: "view_orders" },
    { name: "Customers", href: "/dashboard/customers", permission: "manage_customers" },
    { name: "Plants", href: "/dashboard/plants", permission: "view_dashboard" },
    { name: "Reports", href: "/dashboard/reports", permission: "view_financial_reports" },
    { name: "User Management", href: "/dashboard/users", permission: "manage_users" },
    { name: "System Settings", href: "/dashboard/settings", permission: "system_settings" }
  ].filter(item => user.role === 'super_admin' || user.permissions.includes(item.permission as any));

  const businessProcesses = [
    { name: "Admin Operations", href: "/dashboard/admin", department: "admin", permission: "manage_admin_operations" },
    { name: "Operations Department", href: "/dashboard/operations", department: "operations", permission: "manage_inbound_operations" },
    { name: "Inbound Operations", href: "/dashboard/inbound", department: "operations", permission: "manage_inbound_operations" },
    { name: "Procurement", href: "/dashboard/procurement", department: "procurement", permission: "create_purchase_requests" },
    { name: "Finance Department", href: "/dashboard/finance", department: "finance", permission: "view_financial_reports" },
    { name: "Trading Operations", href: "/dashboard/trading", department: "trading", permission: "manage_trading_operations" },
    { name: "Fleet Management", href: "/dashboard/fleet", department: "logistics", permission: "manage_fleet" },
    { name: "HR Management", href: "/dashboard/hr", department: "hr", permission: "manage_employees" },
    { name: "Investigations", href: "/dashboard/investigations", department: "operations", permission: "handle_investigations" }
  ].filter(item => {
    // Super admin can see all business processes
    if (user.role === 'super_admin') return true;

    // Check permission for non-super admins
    if (!user.permissions.includes(item.permission as any)) return false;

    // Check department access
    if (user.department === item.department) return true;

    // Admin can access most processes
    if (user.department === 'admin') return true;

    return false;
  });

  return { coreModules, businessProcesses };
}