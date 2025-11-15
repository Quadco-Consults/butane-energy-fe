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
    name: "Procurement",
    icon: Icons.ClipboardCheck,
    permission: "create_purchase_requests" as const,
    department: "procurement",
    subItems: [
      { name: "Procurement Dashboard", href: "/dashboard/procurement", icon: Icons.LayoutDashboard },

      // SAP MM Core Process Flow (P2P Cycle)
      { name: "Purchase Requisitions (PR)", href: "/dashboard/procurement/purchase-requisitions", icon: Icons.FileEdit },
      { name: "Purchase Orders (PO)", href: "/dashboard/procurement/purchase-orders", icon: Icons.ShoppingCart },
      { name: "Goods Receipts (GR)", href: "/dashboard/procurement/goods-receipts", icon: Icons.Package },
      { name: "Invoice Verification (IV)", href: "/dashboard/procurement/invoice-verification", icon: Icons.Calculator },

      // Vendor & Contract Management
      { name: "Vendor Master", href: "/dashboard/procurement/vendors", icon: Icons.Users },
      { name: "Contract Management", href: "/dashboard/procurement/contracts", icon: Icons.Handshake },

      // Supporting Processes
      { name: "Three-Way Matching", href: "/dashboard/procurement/three-way-matching", icon: Icons.GitBranch },
      { name: "RFQ Management", href: "/dashboard/procurement/rfq", icon: Icons.Search },
      { name: "Tenders", href: "/dashboard/procurement/tenders", icon: Icons.FileText },

      // Analytics & Automation
      { name: "Procurement Analytics", href: "/dashboard/procurement/analytics", icon: Icons.BarChart3 },
      { name: "Workflow Automation", href: "/dashboard/procurement/workflow-automation", icon: Icons.Workflow },
      { name: "Reports", href: "/dashboard/procurement/reports", icon: Icons.FileSpreadsheet },
    ]
  },
  {
    name: "PDU",
    icon: Icons.FolderOpen,
    permission: "manage_pdu_operations" as const,
    department: "pdu",
    subItems: [
      { name: "PDU Dashboard", href: "/dashboard/pdu", icon: Icons.LayoutDashboard },
      { name: "Projects", href: "/dashboard/pdu/projects", icon: Icons.Folder },
      { name: "Planning", href: "/dashboard/pdu/planning", icon: Icons.Calendar },
      { name: "Tracking", href: "/dashboard/pdu/tracking", icon: Icons.MapPin },
      { name: "Reports", href: "/dashboard/pdu/reports", icon: Icons.FileText },
      { name: "Permits/Licenses", href: "/dashboard/pdu/permits", icon: Icons.Shield },
    ]
  },
  {
    name: "Admin",
    icon: Icons.Briefcase,
    permission: "manage_admin_operations" as const,
    department: "admin",
    subItems: [
      { name: "Admin Dashboard", href: "/dashboard/admin", icon: Icons.LayoutDashboard },
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
    name: "Operations",
    icon: Icons.Package,
    permission: "manage_inbound_operations" as const,
    department: "operations",
    subItems: [
      { name: "Operations Dashboard", href: "/dashboard/operations", icon: Icons.LayoutDashboard },
      { name: "Trading", href: "/dashboard/operations/trading", icon: Icons.TrendingUp },
      { name: "Logistics", href: "/dashboard/operations/logistics", icon: Icons.Truck },
      { name: "LPG Sales Process", href: "/dashboard/operations/trading/sales", icon: Icons.DollarSign },
      { name: "Stock Management", href: "/dashboard/operations/trading/stock", icon: Icons.Package },
      { name: "Truck Dispatching", href: "/dashboard/operations/logistics/offtake", icon: Icons.Truck },
      { name: "Investigations", href: "/dashboard/investigations", icon: Icons.Search },
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
      { name: "PIM", href: "/dashboard/hr/pim", icon: Icons.Users },
      { name: "Leave", href: "/dashboard/hr/leave", icon: Icons.Calendar },
      { name: "Time & Attendance", href: "/dashboard/hr/time", icon: Icons.Clock },
      { name: "Recruitment", href: "/dashboard/hr/recruitment", icon: Icons.UserPlus },
      { name: "My Info", href: "/dashboard/hr/my-info", icon: Icons.User },
      { name: "Performance", href: "/dashboard/hr/performance", icon: Icons.Target },
      { name: "Dashboard", href: "/dashboard/hr/analytics", icon: Icons.BarChart3 },
      { name: "Directory", href: "/dashboard/hr/directory", icon: Icons.Book },
      { name: "Maintenance", href: "/dashboard/hr/maintenance", icon: Icons.Settings },
      { name: "Buzz", href: "/dashboard/hr/buzz", icon: Icons.MessageSquare },
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
      <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
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
      <header className="fixed top-0 left-64 right-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-6">
          {/* Page Title */}
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              {pathname === "/dashboard" ? "Dashboard" :
               pathname.includes("/inbound") ? "Inbound Operations" :
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
              <DropdownMenuItem>
                <Icons.Settings className="mr-2 h-4 w-4" />
                Icons.Settings
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
      <main className="pl-64 pt-16">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
    </AuthGuard>
  );
}
