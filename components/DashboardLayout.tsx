"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useRouter, usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { AuthGuard } from "./AuthGuard";
import { getAuthorizedNavigation } from "@/lib/filters";

// Department Menu Structure
const departmentMenus = [
  {
    name: "TDU",
    icon: Icons.Zap,
    permission: "manage_tdu_operations" as const,
    department: "tdu",
    subItems: [
      { name: "TDU Dashboard", href: "/dashboard/tdu", icon: Icons.LayoutDashboard },
      { name: "Orders", href: "/dashboard/tdu/orders", icon: Icons.ShoppingCart },
      { name: "Revenue", href: "/dashboard/tdu/revenue", icon: Icons.DollarSign },
      { name: "Logistics", href: "/dashboard/tdu/logistics", icon: Icons.Truck },
      { name: "Customer Dashboard", href: "/dashboard/tdu/customers", icon: Icons.Users },
      { name: "Report", href: "/dashboard/tdu/reports", icon: Icons.FileText },
    ]
  },
  {
    name: "Sales",
    icon: Icons.ShoppingCart,
    permission: "create_orders" as const,
    department: "sales",
    subItems: [
      { name: "Sales Dashboard", href: "/dashboard/sales", icon: Icons.LayoutDashboard },
      { name: "Gas Station POS", href: "/dashboard/pos", icon: Icons.CreditCard },
      { name: "Customer Management", href: "/dashboard/sales/customers", icon: Icons.Users },
      { name: "Sales Orders", href: "/dashboard/sales/orders", icon: Icons.ShoppingBag },
      { name: "Sales Reports", href: "/dashboard/sales/reports", icon: Icons.FileText },
      { name: "Pricing Management", href: "/dashboard/sales/pricing", icon: Icons.DollarSign },
    ]
  },
  {
    name: "Logistics",
    icon: Icons.Truck,
    permission: "manage_logistics" as const,
    department: "logistics",
    subItems: [
      { name: "Logistics Dashboard", href: "/dashboard/logistics", icon: Icons.LayoutDashboard },
      { name: "Product Purchase", href: "/dashboard/logistics/product-purchase", icon: Icons.ShoppingBag },
      { name: "Fuel", href: "/dashboard/logistics/fuel", icon: Icons.Fuel },
      { name: "Trips", href: "/dashboard/logistics/trips", icon: Icons.MapPin },
      { name: "Repairs & Maintenance", href: "/dashboard/logistics/maintenance", icon: Icons.Wrench },
      { name: "Stock Management", href: "/dashboard/logistics/stock", icon: Icons.Package },
    ]
  },
  {
    name: "Admin",
    icon: Icons.Briefcase,
    permission: "manage_admin_operations" as const,
    department: "admin",
    subItems: [
      { name: "Admin Dashboard", href: "/dashboard/admin", icon: Icons.LayoutDashboard },

      // Procurement section under Admin
      { name: "Procurement Dashboard", href: "/dashboard/admin/procurement", icon: Icons.ClipboardCheck },
      { name: "Purchase Requisitions (PR)", href: "/dashboard/admin/procurement/purchase-requisitions", icon: Icons.FileEdit },
      { name: "Purchase Orders (PO)", href: "/dashboard/admin/procurement/purchase-orders", icon: Icons.ShoppingCart },
      { name: "Goods Receipts (GR)", href: "/dashboard/admin/procurement/goods-receipts", icon: Icons.Package },
      { name: "Invoice Verification (IV)", href: "/dashboard/admin/procurement/invoice-verification", icon: Icons.Calculator },
      { name: "Vendor Master", href: "/dashboard/admin/procurement/vendors", icon: Icons.Users },
      { name: "Contract Management", href: "/dashboard/admin/procurement/contracts", icon: Icons.Handshake },
      { name: "Three-Way Matching", href: "/dashboard/admin/procurement/three-way-matching", icon: Icons.GitBranch },
      { name: "RFQ Management", href: "/dashboard/admin/procurement/rfq", icon: Icons.Search },
      { name: "Tenders", href: "/dashboard/admin/procurement/tenders", icon: Icons.FileText },

      // General Admin functions
      { name: "Inventory", href: "/dashboard/admin/inventory", icon: Icons.Package },
      { name: "Store", href: "/dashboard/admin/inventory/store", icon: Icons.Warehouse },
      { name: "Assets", href: "/dashboard/admin/inventory/assets", icon: Icons.HardDrive },
      { name: "Item Requests", href: "/dashboard/admin/item-requests", icon: Icons.FileEdit },
      { name: "Office Maintenance", href: "/dashboard/admin/maintenance", icon: Icons.Wrench },
      { name: "Facility Management", href: "/dashboard/admin/facility", icon: Icons.Building2 },
      { name: "Service Orders", href: "/dashboard/admin/service-orders", icon: Icons.Settings },
    ]
  },
  {
    name: "Finance",
    icon: Icons.DollarSign,
    permission: "view_financial_reports" as const,
    department: "finance",
    subItems: [
      { name: "Finance Dashboard", href: "/dashboard/finance", icon: Icons.LayoutDashboard },
      { name: "Banking & Cash", href: "/dashboard/finance/banking", icon: Icons.Landmark },
      { name: "Sales & Invoicing", href: "/dashboard/finance/sales", icon: Icons.FileText },
      { name: "Expenses", href: "/dashboard/finance/expenses", icon: Icons.Receipt },
      { name: "Chart of Accounts", href: "/dashboard/finance/chart-of-accounts", icon: Icons.List },
      { name: "Reports & Analysis", href: "/dashboard/finance/reports", icon: Icons.BarChart3 },
      { name: "Payroll", href: "/dashboard/finance/payroll", icon: Icons.Users },
      { name: "Tax Center", href: "/dashboard/finance/taxes", icon: Icons.Calculator },
    ]
  },
  {
    name: "HR",
    icon: Icons.Users,
    permission: "manage_employees" as const,
    department: "hr",
    subItems: [
      { name: "HR Dashboard", href: "/dashboard/hr", icon: Icons.LayoutDashboard },
      { name: "Employee Relations", href: "/dashboard/hr/employee-relations", icon: Icons.Users },
      { name: "Recruitment", href: "/dashboard/hr/recruitment", icon: Icons.UserPlus },
      { name: "Leave Management", href: "/dashboard/hr/leave", icon: Icons.Calendar },
      { name: "Payroll", href: "/dashboard/hr/payroll", icon: Icons.CreditCard },
      { name: "Training & Development", href: "/dashboard/hr/training", icon: Icons.GraduationCap },
      { name: "Performance Management", href: "/dashboard/hr/performance", icon: Icons.Target },
    ]
  }
];

// Global Request Menu
const globalRequests = [
  { name: "Item Requisition", href: "/dashboard/requests/item-requisition", icon: Icons.Package, permission: "create_item_requests" as const },
  { name: "Purchase Request", href: "/dashboard/requests/purchase", icon: Icons.ShoppingCart, permission: "create_purchase_requests" as const },
  { name: "Memo", href: "/dashboard/requests/memo", icon: Icons.FileEdit, permission: "create_memos" as const },
  { name: "Leave Request", href: "/dashboard/requests/leave", icon: Icons.Calendar, permission: "request_leave" as const },
  { name: "Timesheet", href: "/dashboard/requests/timesheet", icon: Icons.Clock, permission: "submit_timesheets" as const },
  { name: "Maintenance Request", href: "/dashboard/requests/maintenance", icon: Icons.Wrench, permission: "request_maintenance" as const },
];

// System Settings Menu
const systemSettings = [
  { name: "Access Management", href: "/dashboard/system/access", icon: Icons.UserCog, permission: "manage_users" as const },
  { name: "System Config", href: "/dashboard/system/config", icon: Icons.Settings, permission: "system_settings" as const },
  { name: "Plant Management", href: "/dashboard/system/plants", icon: Icons.Building2, permission: "manage_plants" as const },
  { name: "User Management", href: "/dashboard/system/users", icon: Icons.Users, permission: "manage_users" as const },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading, hasPermission } = useAuth();
  const { getNotificationsForUser } = useWorkflow();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);

  // Get user notifications
  const notifications = user ? getNotificationsForUser(user.id) : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Check if user has access to department
  const hasAccessToDepartment = (department: string) => {
    return user.role === 'super_admin' || user.department === department || user.department === 'admin';
  };

  // Check if user has permission
  const checkPermission = (permission: string) => {
    return user.role === 'super_admin' || user.permissions.includes(permission as any);
  };

  // Toggle menu expansion
  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  // Check if menu should be active/expanded
  const isMenuActive = (menuName: string, subItems: any[]) => {
    return subItems.some(item => pathname.startsWith(item.href));
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background overflow-x-auto">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card hidden lg:block">
        <div className="flex h-full flex-col">
          {/* Official Butane Energy Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src="/butane-logo-official.jpeg"
                  alt="Butane Energy"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-sm">BUTANE ENERGY</h1>
                <p className="text-xs text-muted-foreground">RC 423007 • ERP System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {/* Dashboard */}
            <div className="mb-4">
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-4",
                  pathname === "/dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icons.LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
            </div>

            {/* Department Menus */}
            <div className="space-y-1 mb-6">
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Departments
              </h3>

              {departmentMenus.map((menu) => {
                if (!hasAccessToDepartment(menu.department) || !checkPermission(menu.permission)) {
                  return null;
                }

                const MenuIcon = menu.icon;
                const isExpanded = expandedMenus.includes(menu.name) || isMenuActive(menu.name, menu.subItems);
                const hasActiveSubItem = isMenuActive(menu.name, menu.subItems);

                return (
                  <Collapsible
                    key={menu.name}
                    open={isExpanded}
                    onOpenChange={() => toggleMenu(menu.name)}
                  >
                    <CollapsibleTrigger
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        hasActiveSubItem
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <MenuIcon className="h-5 w-5" />
                        {menu.name}
                      </div>
                      {isExpanded ? (
                        <Icons.ChevronDown className="h-4 w-4" />
                      ) : (
                        <Icons.ChevronRight className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>

                    <CollapsibleContent className="pl-6 mt-1 space-y-1">
                      {menu.subItems.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <ItemIcon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>

            {/* Global Requests */}
            <div className="space-y-1 mb-6">
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Requests
              </h3>
              {globalRequests.map((request) => {
                if (!checkPermission(request.permission)) {
                  return null;
                }

                const RequestIcon = request.icon;
                const isActive = pathname === request.href || pathname.startsWith(request.href + "/");

                return (
                  <Link
                    key={request.name}
                    href={request.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <RequestIcon className="h-4 w-4" />
                    {request.name}
                  </Link>
                );
              })}
            </div>

            {/* System Icons.Settings */}
            {(user.role === 'super_admin' || checkPermission('manage_users') || checkPermission('system_settings')) && (
              <div className="space-y-1">
                <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  System
                </h3>
                {systemSettings.map((setting) => {
                  if (!checkPermission(setting.permission)) {
                    return null;
                  }

                  const SettingIcon = setting.icon;
                  const isActive = pathname === setting.href || pathname.startsWith(setting.href + "/");

                  return (
                    <Link
                      key={setting.name}
                      href={setting.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <SettingIcon className="h-4 w-4" />
                      {setting.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4 lg:px-6">
          {/* Page Title */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => {/* TODO: Add mobile menu toggle */}}
            >
              <Icons.Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">
              {pathname === "/dashboard" ? "Dashboard" :
               pathname.includes("/tdu") ? "TDU (Technical Delivery Unit)" :
               pathname.includes("/logistics") ? "Logistics" :
               pathname.includes("/procurement") ? "Procurement" :
               pathname.includes("/projects") ? "Projects" :
               pathname.includes("/investigations") ? "Investigations" :
               pathname.split("/").pop()?.replace(/^\w/, c => c.toUpperCase()) || "Dashboard"}
            </h2>
          </div>

          {/* Actions & User Menu */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icons.Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-butane-orange text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {unreadCount} unread
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex-col items-start p-3 cursor-pointer"
                        asChild
                      >
                        <Link href={notification.actionUrl || '#'}>
                          <div className="flex items-start justify-between w-full">
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-butane-orange rounded-full mt-1"></div>
                            )}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {notifications.length > 5 && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/notifications" className="text-center text-sm text-primary">
                          View all notifications
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{user.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span className="text-xs text-muted-foreground">{user.department?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Dept.</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center w-full">
                  <Icons.User className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                <Icons.LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 min-h-screen bg-background">
        <div className="w-full px-6 lg:px-8 xl:px-12 py-6 pb-12 min-h-[calc(100vh-4rem)] overflow-x-auto">
          <div className="min-w-0 max-w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
