/**
 * BUTANE ENERGY ERP - ENTERPRISE DESIGN SYSTEM v2.0
 * Modern, scalable design system aligned with established ERP standards
 * Consistent with Ahni ERP and Kano State Justice System
 */

// Modern ERP Spacing System - Optimized for Business Applications
export const spacing = {
  // Base spacing units (8px grid system)
  xxs: "0.125rem", // 2px
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "1rem",      // 16px
  lg: "1.5rem",    // 24px
  xl: "2rem",      // 32px
  "2xl": "2.5rem", // 40px
  "3xl": "3rem",   // 48px
  "4xl": "4rem",   // 64px
  "5xl": "5rem",   // 80px

  // Enterprise Component Spacing
  enterprise: {
    sidebarWidth: "280px",     // Main sidebar width
    topbarHeight: "64px",      // Header/topbar height
    contentPadding: "2rem",    // Main content padding
    cardPadding: "1.5rem",     // Standard card padding
    modalPadding: "2rem",      // Modal dialog padding
    tableRowHeight: "3.5rem",  // Data table row height
    buttonHeight: "2.5rem",    // Standard button height
    inputHeight: "2.5rem",     // Form input height
  },

  // ERP-specific spacing for different sections
  dashboard: {
    statsCardGap: "1.5rem",    // Gap between stat cards
    sectionSpacing: "3rem",    // Space between dashboard sections
    widgetPadding: "1.5rem",   // Widget internal padding
  },

  forms: {
    fieldSpacing: "1.25rem",   // Space between form fields
    groupSpacing: "2rem",      // Space between field groups
    sectionSpacing: "3rem",    // Space between form sections
    labelSpacing: "0.5rem",    // Space between label and input
  },

  tables: {
    headerPadding: "1rem",     // Table header padding
    cellPadding: "0.75rem",    // Table cell padding
    rowSpacing: "0.25rem",     // Space between rows
  }
};

// Enterprise Typography System - Professional & Accessible
export const typography = {
  // Modern ERP Font Scale (Perfect for business applications)
  fontSize: {
    xxs: "0.6875rem",  // 11px - Tiny labels/badges
    xs: "0.75rem",     // 12px - Small text/captions
    sm: "0.875rem",    // 14px - Secondary text
    base: "1rem",      // 16px - Primary body text
    lg: "1.125rem",    // 18px - Large body text
    xl: "1.25rem",     // 20px - Subheadings
    "2xl": "1.5rem",   // 24px - Section headings
    "3xl": "1.875rem", // 30px - Page headings
    "4xl": "2.25rem",  // 36px - Main titles
    "5xl": "3rem",     // 48px - Display headings
  },

  // Professional font weights for ERP applications
  fontWeight: {
    light: "300",      // Light text for secondary info
    normal: "400",     // Default body text
    medium: "500",     // Emphasis within body text
    semibold: "600",   // Section headings, labels
    bold: "700",       // Main headings, important text
    extrabold: "800",  // Display headings, branding
  },

  // Line heights optimized for readability in data-heavy interfaces
  lineHeight: {
    none: "1",         // For headings and display text
    tight: "1.25",     // For compact layouts
    snug: "1.375",     // For body text in tables
    normal: "1.5",     // Standard body text
    relaxed: "1.625",  // For longer content
    loose: "2",        // For very spacious layouts
  },

  // Enterprise Typography Patterns
  enterprise: {
    // Page-level headings
    pageTitle: "text-4xl font-bold text-foreground tracking-tight",
    sectionTitle: "text-2xl font-semibold text-foreground",
    subsectionTitle: "text-xl font-semibold text-foreground",

    // Data & Content headings
    cardTitle: "text-lg font-semibold text-foreground",
    tableHeader: "text-sm font-semibold text-foreground uppercase tracking-wide",

    // Body text variations
    bodyLarge: "text-lg text-foreground leading-relaxed",
    bodyPrimary: "text-base text-foreground leading-normal",
    bodySecondary: "text-sm text-muted-foreground leading-normal",

    // UI element text
    buttonText: "text-sm font-medium",
    labelText: "text-sm font-medium text-foreground",
    helpText: "text-xs text-muted-foreground leading-tight",

    // Status and metadata text
    statusText: "text-xs font-medium uppercase tracking-wider",
    metadataText: "text-xs text-muted-foreground",
    timestampText: "text-xs text-muted-foreground font-mono",
  },

  // Semantic headings with ERP-optimized styling
  heading: {
    h1: "text-4xl font-bold text-foreground tracking-tight leading-tight",
    h2: "text-3xl font-semibold text-foreground tracking-tight leading-tight",
    h3: "text-2xl font-semibold text-foreground leading-snug",
    h4: "text-xl font-semibold text-foreground leading-snug",
    h5: "text-lg font-semibold text-foreground leading-normal",
    h6: "text-base font-semibold text-foreground leading-normal",
  },

  // Body text with improved hierarchy
  body: {
    xxl: "text-xl text-foreground leading-relaxed",
    xl: "text-lg text-foreground leading-relaxed",
    large: "text-lg text-foreground leading-normal",
    base: "text-base text-foreground leading-normal",
    medium: "text-sm text-foreground leading-normal",
    small: "text-sm text-muted-foreground leading-normal",
    tiny: "text-xs text-muted-foreground leading-tight",
    micro: "text-xxs text-muted-foreground leading-tight",
  },

  // Form labels with professional styling
  label: {
    primary: "text-sm font-semibold text-foreground",
    required: "text-sm font-semibold text-foreground after:content-['*'] after:text-destructive after:ml-1",
    optional: "text-sm font-medium text-muted-foreground",
    section: "text-base font-semibold text-foreground border-b border-border pb-2 mb-4",
    helper: "text-xs text-muted-foreground mt-1",
  }
};

// Enterprise Color System - Professional & Accessible
export const colors = {
  // Butane Energy Brand Colors (Primary Palette)
  brand: {
    primary: {
      50: "oklch(0.95 0.03 160)",   // Very light green
      100: "oklch(0.90 0.06 160)",  // Light green
      200: "oklch(0.80 0.08 160)",  // Medium light green
      300: "oklch(0.70 0.10 160)",  // Medium green
      400: "oklch(0.55 0.12 160)",  // Balanced green
      500: "oklch(0.39 0.15 160)",  // Primary brand green
      600: "oklch(0.32 0.18 160)",  // Dark green
      700: "oklch(0.25 0.20 160)",  // Darker green
      800: "oklch(0.18 0.22 160)",  // Very dark green
      900: "oklch(0.12 0.25 160)",  // Deepest green
    },
    secondary: {
      50: "oklch(0.95 0.03 250)",   // Very light blue
      100: "oklch(0.88 0.08 250)",  // Light blue
      200: "oklch(0.78 0.12 250)",  // Medium light blue
      300: "oklch(0.65 0.15 250)",  // Medium blue
      400: "oklch(0.55 0.17 250)",  // Balanced blue
      500: "oklch(0.45 0.18 250)",  // Primary brand blue
      600: "oklch(0.38 0.20 250)",  // Dark blue
      700: "oklch(0.30 0.22 250)",  // Darker blue
      800: "oklch(0.22 0.24 250)",  // Very dark blue
      900: "oklch(0.15 0.26 250)",  // Deepest blue
    },
    accent: {
      50: "oklch(0.95 0.05 30)",    // Very light orange
      100: "oklch(0.88 0.10 30)",   // Light orange
      200: "oklch(0.80 0.15 30)",   // Medium light orange
      300: "oklch(0.75 0.18 30)",   // Medium orange
      400: "oklch(0.70 0.20 30)",   // Balanced orange
      500: "oklch(0.65 0.22 30)",   // Primary brand orange
      600: "oklch(0.58 0.24 30)",   // Dark orange
      700: "oklch(0.50 0.26 30)",   // Darker orange
      800: "oklch(0.40 0.28 30)",   // Very dark orange
      900: "oklch(0.30 0.30 30)",   // Deepest orange
    }
  },

  // Enterprise Status Colors (Semantic)
  status: {
    success: {
      50: "oklch(0.95 0.03 140)",   // Very light success
      100: "oklch(0.88 0.08 140)",  // Light success background
      200: "oklch(0.80 0.12 140)",  // Success border
      600: "oklch(0.45 0.18 140)",  // Success text
      700: "oklch(0.35 0.20 140)",  // Dark success
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: "text-green-600",
    },
    warning: {
      50: "oklch(0.95 0.05 70)",    // Very light warning
      100: "oklch(0.90 0.10 70)",   // Light warning background
      200: "oklch(0.82 0.15 70)",   // Warning border
      600: "oklch(0.55 0.18 70)",   // Warning text
      700: "oklch(0.45 0.20 70)",   // Dark warning
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      icon: "text-yellow-600",
    },
    error: {
      50: "oklch(0.95 0.03 25)",    // Very light error
      100: "oklch(0.88 0.08 25)",   // Light error background
      200: "oklch(0.80 0.12 25)",   // Error border
      600: "oklch(0.50 0.20 25)",   // Error text
      700: "oklch(0.40 0.22 25)",   // Dark error
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: "text-red-600",
    },
    info: {
      50: "oklch(0.95 0.03 240)",   // Very light info
      100: "oklch(0.88 0.08 240)",  // Light info background
      200: "oklch(0.80 0.12 240)",  // Info border
      600: "oklch(0.50 0.18 240)",  // Info text
      700: "oklch(0.40 0.20 240)",  // Dark info
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "text-blue-600",
    },
    pending: {
      50: "oklch(0.95 0.03 60)",    // Very light pending
      100: "oklch(0.88 0.08 60)",   // Light pending background
      200: "oklch(0.80 0.12 60)",   // Pending border
      600: "oklch(0.55 0.15 60)",   // Pending text
      700: "oklch(0.45 0.18 60)",   // Dark pending
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      icon: "text-amber-600",
    }
  },

  // Enterprise Department Colors (Organized & Professional)
  departments: {
    finance: {
      primary: "bg-blue-600",
      light: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "text-blue-600",
    },
    procurement: {
      primary: "bg-green-600",
      light: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: "text-green-600",
    },
    hr: {
      primary: "bg-purple-600",
      light: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-800",
      icon: "text-purple-600",
    },
    operations: {
      primary: "bg-orange-600",
      light: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-800",
      icon: "text-orange-600",
    },
    admin: {
      primary: "bg-gray-600",
      light: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-800",
      icon: "text-gray-600",
    },
    it: {
      primary: "bg-indigo-600",
      light: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-800",
      icon: "text-indigo-600",
    },
    marketing: {
      primary: "bg-pink-600",
      light: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-800",
      icon: "text-pink-600",
    },
    logistics: {
      primary: "bg-teal-600",
      light: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-800",
      icon: "text-teal-600",
    }
  },

  // Enterprise Data Visualization Colors
  charts: {
    primary: ["oklch(0.39 0.15 160)", "oklch(0.45 0.18 250)", "oklch(0.65 0.22 30)"],
    revenue: "oklch(0.39 0.15 160)",    // Green for revenue/profit
    expense: "oklch(0.60 0.20 25)",     // Red for expenses/costs
    neutral: "oklch(0.60 0.05 240)",    // Blue-gray for neutral data
    growth: "oklch(0.45 0.18 140)",     // Green for growth/positive
    decline: "oklch(0.55 0.20 25)",     // Red for decline/negative
  }
};

// Enterprise Layout System - Optimized for ERP Applications
export const layout = {
  // Enterprise container widths (wider for data-heavy interfaces)
  container: {
    xs: "max-w-xs",      // 320px - Mobile compact
    sm: "max-w-sm",      // 384px - Mobile standard
    md: "max-w-md",      // 448px - Small tablets
    lg: "max-w-2xl",     // 672px - Forms and dialogs
    xl: "max-w-4xl",     // 896px - Standard content
    "2xl": "max-w-6xl",  // 1152px - Dashboard content
    "3xl": "max-w-7xl",  // 1280px - Full-width content
    "4xl": "max-w-[1440px]", // 1440px - Ultra-wide dashboards
    "5xl": "max-w-[1600px]", // 1600px - Large displays
    full: "max-w-full",  // No limit
    screen: "max-w-screen-2xl", // Viewport-based
  },

  // Enterprise grid systems (responsive & professional)
  grid: {
    auto: "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]", // Auto-responsive cards
    cols1: "grid-cols-1",
    cols2: "grid-cols-1 lg:grid-cols-2",
    cols3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    cols4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
    cols5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    cols6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",

    // Specialized ERP grids
    dashboard: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4", // Dashboard stats
    cards: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",     // Content cards
    sidebar: "grid-cols-[280px_1fr]",                        // Sidebar layout
    split: "grid-cols-1 lg:grid-cols-2",                     // Split panels
    table: "grid-cols-[auto_1fr_auto]",                      // Table layout
  },

  // Professional spacing patterns
  spacing: {
    section: "space-y-8",        // Between major sections
    subsection: "space-y-6",     // Between subsections
    content: "space-y-4",        // Between content blocks
    items: "space-y-3",          // Between list items
    tight: "space-y-2",          // Tight spacing
    compact: "space-y-1",        // Very tight spacing
  },

  // Enterprise breakpoints (optimized for business displays)
  breakpoints: {
    xs: "475px",     // Large mobile
    sm: "640px",     // Small tablet
    md: "768px",     // Tablet
    lg: "1024px",    // Small desktop
    xl: "1280px",    // Standard desktop
    "2xl": "1536px", // Large desktop
    "3xl": "1920px", // Ultra-wide
  },

  // Layout patterns for different page types
  pageTypes: {
    dashboard: {
      container: "max-w-[1600px] mx-auto",
      padding: "p-6 lg:p-8",
      spacing: "space-y-8",
    },
    form: {
      container: "max-w-4xl mx-auto",
      padding: "p-6",
      spacing: "space-y-6",
    },
    table: {
      container: "max-w-full",
      padding: "p-4 lg:p-6",
      spacing: "space-y-4",
    },
    detail: {
      container: "max-w-5xl mx-auto",
      padding: "p-6",
      spacing: "space-y-6",
    }
  }
};

// Enterprise Component Variants - Professional & Consistent
export const componentVariants = {
  // Professional card variants
  card: {
    default: "bg-card text-card-foreground border shadow-sm rounded-xl",
    elevated: "bg-card text-card-foreground border shadow-lg rounded-xl",
    outlined: "bg-background text-foreground border-2 rounded-xl",
    ghost: "bg-transparent text-foreground",
    dashboard: "bg-card text-card-foreground border shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow",
    stats: "bg-gradient-to-br from-card to-card/80 text-card-foreground border shadow-lg rounded-xl p-6",
    interactive: "bg-card text-card-foreground border shadow-sm rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer",
  },

  // Professional status badges
  badge: {
    // Request statuses
    pending: "bg-amber-100 text-amber-800 border border-amber-200 rounded-full",
    approved: "bg-green-100 text-green-800 border border-green-200 rounded-full",
    rejected: "bg-red-100 text-red-800 border border-red-200 rounded-full",
    draft: "bg-gray-100 text-gray-700 border border-gray-200 rounded-full",

    // Activity statuses
    active: "bg-blue-100 text-blue-800 border border-blue-200 rounded-full",
    inactive: "bg-gray-100 text-gray-600 border border-gray-200 rounded-full",

    // Priority levels
    urgent: "bg-red-100 text-red-800 border border-red-200 rounded-full animate-pulse",
    high: "bg-orange-100 text-orange-800 border border-orange-200 rounded-full",
    medium: "bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full",
    low: "bg-green-100 text-green-800 border border-green-200 rounded-full",

    // Department badges
    finance: "bg-blue-100 text-blue-800 border border-blue-200 rounded-full",
    hr: "bg-purple-100 text-purple-800 border border-purple-200 rounded-full",
    operations: "bg-orange-100 text-orange-800 border border-orange-200 rounded-full",
    procurement: "bg-green-100 text-green-800 border border-green-200 rounded-full",
    it: "bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-full",
  },

  // Professional button variants
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm rounded-lg",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm rounded-lg",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg",
    ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm rounded-lg",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm rounded-lg",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 shadow-sm rounded-lg",
    info: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm rounded-lg",
  },

  // Form component variants
  input: {
    default: "border border-input bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
    error: "border border-red-300 bg-red-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400",
    success: "border border-green-300 bg-green-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400",
    large: "border border-input bg-background rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
  },

  // Table component variants
  table: {
    default: "w-full border-collapse bg-card rounded-xl overflow-hidden shadow-sm",
    striped: "w-full border-collapse bg-card rounded-xl overflow-hidden shadow-sm [&_tbody_tr:nth-child(even)]:bg-muted/30",
    bordered: "w-full border border-border rounded-xl overflow-hidden shadow-sm",
    compact: "w-full border-collapse bg-card rounded-lg overflow-hidden text-sm",
  },

  // Navigation variants
  nav: {
    sidebar: "flex flex-col space-y-1 p-4",
    topbar: "flex items-center justify-between px-6 py-4 border-b bg-card",
    breadcrumb: "flex items-center space-x-2 text-sm text-muted-foreground",
    tabs: "flex items-center space-x-1 p-1 bg-muted rounded-lg",
  }
};

// Animation System
export const animations = {
  // Duration classes
  duration: {
    fast: "duration-150",
    normal: "duration-200",
    slow: "duration-300",
    slower: "duration-500",
  },

  // Transition classes
  transition: {
    all: "transition-all",
    colors: "transition-colors",
    transform: "transition-transform",
    opacity: "transition-opacity",
  },

  // Hover effects
  hover: {
    lift: "hover:shadow-md hover:-translate-y-0.5",
    scale: "hover:scale-105",
    fade: "hover:opacity-80",
  }
};

// Enterprise Design System Utilities - Modern & Comprehensive
export const designSystem = {
  // Typography utilities
  getHeading: (level: keyof typeof typography.heading) => typography.heading[level],
  getBody: (size: keyof typeof typography.body) => typography.body[size],
  getLabel: (variant: keyof typeof typography.label) => typography.label[variant],
  getEnterpriseText: (style: keyof typeof typography.enterprise) => typography.enterprise[style],

  // Layout utilities
  getContainer: (size: keyof typeof layout.container) => layout.container[size],
  getGrid: (cols: keyof typeof layout.grid) => `grid ${layout.grid[cols]} gap-6`,
  getSpacing: (type: keyof typeof layout.spacing) => layout.spacing[type],
  getPageLayout: (type: keyof typeof layout.pageTypes) => {
    const pageType = layout.pageTypes[type];
    return `${pageType.container} ${pageType.padding} ${pageType.spacing}`;
  },

  // Component utilities
  getCard: (variant: keyof typeof componentVariants.card = 'default') => componentVariants.card[variant],
  getBadge: (variant: keyof typeof componentVariants.badge) =>
    `inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${componentVariants.badge[variant]}`,
  getButton: (variant: keyof typeof componentVariants.button = 'primary') =>
    `inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${componentVariants.button[variant]}`,
  getInput: (variant: keyof typeof componentVariants.input = 'default') => componentVariants.input[variant],
  getTable: (variant: keyof typeof componentVariants.table = 'default') => componentVariants.table[variant],

  // Color utilities
  getBrandColor: (color: 'primary' | 'secondary' | 'accent', shade: keyof typeof colors.brand.primary) =>
    colors.brand[color][shade],
  getStatusColor: (status: keyof typeof colors.status, variant: 'bg' | 'border' | 'text' | 'icon') =>
    colors.status[status][variant],
  getDepartmentColor: (dept: keyof typeof colors.departments, variant: 'primary' | 'light' | 'border' | 'text' | 'icon') =>
    colors.departments[dept][variant],
  getChartColor: (type: keyof typeof colors.charts) => colors.charts[type],

  // Enterprise spacing utilities
  getEnterpriseSpacing: (component: keyof typeof spacing.enterprise) => spacing.enterprise[component],
  getDashboardSpacing: (type: keyof typeof spacing.dashboard) => spacing.dashboard[type],
  getFormSpacing: (type: keyof typeof spacing.forms) => spacing.forms[type],
  getTableSpacing: (type: keyof typeof spacing.tables) => spacing.tables[type],

  // Professional patterns
  getStatsCard: () =>
    `${componentVariants.card.stats} transition-transform hover:scale-[1.02] duration-200`,
  getDashboardCard: () =>
    `${componentVariants.card.dashboard}`,
  getInteractiveCard: () =>
    `${componentVariants.card.interactive}`,

  // Status badge with semantic meaning
  getStatusBadge: (status: 'pending' | 'approved' | 'rejected' | 'draft' | 'active' | 'inactive') => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 text-xs font-medium";
    return `${baseClasses} ${componentVariants.badge[status]}`;
  },

  // Priority badge with visual emphasis
  getPriorityBadge: (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold";
    return `${baseClasses} ${componentVariants.badge[priority]}`;
  },

  // Department badge
  getDepartmentBadge: (dept: 'finance' | 'hr' | 'operations' | 'procurement' | 'it') => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 text-xs font-medium";
    return `${baseClasses} ${componentVariants.badge[dept]}`;
  },

  // Form field wrapper
  getFormField: () => "space-y-2",
  getFormGroup: () => "space-y-6 p-6 border border-border rounded-xl bg-card",
  getFormSection: () => "space-y-4 pb-6 border-b border-border last:border-b-0 last:pb-0",

  // Data table utilities
  getTableHeader: () => "bg-muted/50 border-b border-border font-semibold text-left p-4",
  getTableCell: () => "p-4 border-b border-border last:border-b-0",
  getTableRow: () => "hover:bg-muted/30 transition-colors",

  // Navigation utilities
  getNavItem: (isActive = false) => {
    const baseClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors";
    const activeClasses = "bg-primary text-primary-foreground";
    const inactiveClasses = "text-muted-foreground hover:text-foreground hover:bg-muted";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  },

  // Enterprise layout helpers
  getSidebarLayout: () => "min-h-screen bg-background flex",
  getMainContent: () => "flex-1 flex flex-col overflow-hidden",
  getContentArea: () => "flex-1 overflow-auto bg-background",

  // Animation utilities
  getHoverEffect: () => "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
  getFadeIn: () => "animate-in fade-in-0 duration-300",
  getSlideIn: () => "animate-in slide-in-from-bottom-4 duration-300",

  // Responsive utilities
  getResponsiveContainer: () => "container mx-auto px-4 sm:px-6 lg:px-8",
  getResponsiveGrid: (cols: number) => {
    const gridClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6"
    };
    return `grid ${gridClasses[cols as keyof typeof gridClasses] || gridClasses[4]} gap-6`;
  }
};

// Enterprise Common Class Combinations - Ready-to-use patterns
export const commonClasses = {
  // Modern page layouts
  page: "min-h-screen bg-background",
  pageContent: "mx-auto max-w-[1600px] space-y-8 p-6 lg:p-8",
  pageHeader: "border-b border-border pb-6 mb-8",

  // Dashboard layouts
  dashboard: "min-h-screen bg-background",
  dashboardContent: "space-y-8 p-6 lg:p-8",
  dashboardGrid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",

  // Enterprise form layouts
  form: "space-y-6",
  formGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  formSection: "space-y-4 p-6 border border-border rounded-xl bg-card",
  formHeader: "border-b border-border pb-4 mb-6",

  // Professional navigation
  sidebar: "w-80 bg-card border-r border-border flex flex-col",
  sidebarHeader: "p-6 border-b border-border",
  sidebarContent: "flex-1 overflow-auto p-4",
  topbar: "h-16 bg-card border-b border-border flex items-center justify-between px-6",

  // Modern card layouts
  card: "bg-card border border-border rounded-xl shadow-sm",
  cardHeader: "border-b border-border p-6",
  cardContent: "p-6",
  cardFooter: "border-t border-border p-6 bg-muted/30",

  // Enterprise data tables
  table: "w-full bg-card border border-border rounded-xl overflow-hidden",
  tableHeader: "bg-muted/50 border-b border-border",
  tableRow: "border-b border-border hover:bg-muted/30 transition-colors",
  tableCell: "p-4 text-sm",

  // Professional stats cards
  statsCard: "bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow",
  statsGrid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",

  // Action button groups
  buttonGroup: "flex items-center gap-3",
  buttonToolbar: "flex items-center justify-between",
  actionButtons: "flex items-center gap-2",

  // List layouts
  list: "divide-y divide-border bg-card rounded-xl border",
  listItem: "p-4 hover:bg-muted/30 transition-colors flex items-center justify-between",
  listHeader: "p-4 bg-muted/50 border-b border-border font-semibold",

  // Status and notification patterns
  alert: "p-4 rounded-lg border flex items-start gap-3",
  alertSuccess: "bg-green-50 border-green-200 text-green-800",
  alertWarning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  alertError: "bg-red-50 border-red-200 text-red-800",
  alertInfo: "bg-blue-50 border-blue-200 text-blue-800",

  // Loading states
  skeleton: "animate-pulse bg-muted rounded",
  loading: "flex items-center justify-center p-8 text-muted-foreground",

  // Empty states
  emptyState: "flex flex-col items-center justify-center p-12 text-center text-muted-foreground",
  emptyStateIcon: "w-12 h-12 mb-4 text-muted-foreground/50",

  // Enterprise breadcrumbs
  breadcrumb: "flex items-center space-x-2 text-sm text-muted-foreground mb-6",
  breadcrumbSeparator: "text-muted-foreground/50",

  // Modal and dialog layouts
  modal: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4",
  modalContent: "bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto",
  modalHeader: "border-b border-border p-6",
  modalBody: "p-6",
  modalFooter: "border-t border-border p-6 bg-muted/30",

  // Utility classes
  statusDot: (status: 'success' | 'warning' | 'error' | 'info') => {
    const colorMap = {
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    };
    return `inline-block w-2 h-2 rounded-full ${colorMap[status]}`;
  },

  // Responsive helpers
  responsive: {
    hideOnMobile: "hidden md:block",
    hideOnDesktop: "md:hidden",
    stackOnMobile: "flex flex-col md:flex-row gap-4",
  }
};