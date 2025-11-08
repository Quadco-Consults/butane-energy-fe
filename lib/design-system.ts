/**
 * Design System Constants
 * Central place for consistent spacing, colors, typography, and layout values
 */

// Spacing System (Tailwind-based with semantic names)
export const spacing = {
  // Base spacing units
  xs: "0.25rem", // 4px
  sm: "0.5rem",  // 8px
  md: "1rem",    // 16px
  lg: "1.5rem",  // 24px
  xl: "2rem",    // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px

  // Component-specific spacing
  card: {
    padding: "1.5rem",  // 24px
    gap: "1rem",        // 16px
  },
  form: {
    fieldSpacing: "1rem",    // 16px between fields
    sectionSpacing: "2rem",  // 32px between sections
    padding: "1.5rem",       // 24px form padding
  },
  page: {
    padding: "1.5rem",       // 24px page padding
    maxWidth: "1200px",      // Max content width
    headerSpacing: "2rem",   // 32px after page headers
  },
  navigation: {
    itemSpacing: "0.5rem",   // 8px between nav items
    groupSpacing: "1.5rem",  // 24px between nav groups
  }
};

// Typography System
export const typography = {
  // Font sizes
  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
  },

  // Font weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Line heights
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },

  // Semantic typography styles
  heading: {
    h1: "text-3xl font-bold text-foreground",
    h2: "text-2xl font-semibold text-foreground",
    h3: "text-xl font-semibold text-foreground",
    h4: "text-lg font-medium text-foreground",
    h5: "text-base font-medium text-foreground",
    h6: "text-sm font-medium text-foreground",
  },

  body: {
    large: "text-lg text-foreground",
    base: "text-base text-foreground",
    small: "text-sm text-muted-foreground",
    tiny: "text-xs text-muted-foreground",
  },

  label: {
    default: "text-sm font-medium text-foreground",
    required: "text-sm font-medium text-foreground after:content-['*'] after:text-destructive after:ml-1",
    optional: "text-sm font-medium text-muted-foreground",
  }
};

// Color System (extends the existing theme)
export const colors = {
  // Status colors
  status: {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: "text-green-600",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: "text-yellow-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "text-red-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "text-blue-600",
    },
  },

  // Department colors (for consistent theming)
  departments: {
    finance: {
      primary: "bg-blue-600",
      light: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
    },
    procurement: {
      primary: "bg-green-600",
      light: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
    },
    hr: {
      primary: "bg-purple-600",
      light: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-800",
    },
    operations: {
      primary: "bg-orange-600",
      light: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-800",
    },
    admin: {
      primary: "bg-gray-600",
      light: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-800",
    },
  }
};

// Layout System
export const layout = {
  // Container widths
  container: {
    sm: "max-w-sm",      // 384px
    md: "max-w-md",      // 448px
    lg: "max-w-lg",      // 512px
    xl: "max-w-xl",      // 576px
    "2xl": "max-w-2xl",  // 672px
    "3xl": "max-w-3xl",  // 768px
    "4xl": "max-w-4xl",  // 896px
    "5xl": "max-w-5xl",  // 1024px
    "6xl": "max-w-6xl",  // 1152px
    "7xl": "max-w-7xl",  // 1280px
    full: "max-w-full",
  },

  // Grid systems
  grid: {
    cols1: "grid-cols-1",
    cols2: "grid-cols-1 md:grid-cols-2",
    cols3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cols4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    cols6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
  },

  // Responsive breakpoints (for reference)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  }
};

// Component Variants
export const componentVariants = {
  // Card variants
  card: {
    default: "bg-card text-card-foreground border shadow-sm",
    elevated: "bg-card text-card-foreground border shadow-md",
    outlined: "bg-background text-foreground border-2",
    ghost: "bg-transparent",
  },

  // Badge variants for status
  badge: {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    draft: "bg-gray-100 text-gray-800 border-gray-200",
    active: "bg-blue-100 text-blue-800 border-blue-200",
    inactive: "bg-gray-100 text-gray-600 border-gray-200",
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

// Utility Functions for Design System
export const designSystem = {
  // Get consistent spacing
  getSpacing: (size: keyof typeof spacing) => spacing[size],

  // Get typography classes
  getHeading: (level: keyof typeof typography.heading) => typography.heading[level],

  getBody: (size: keyof typeof typography.body) => typography.body[size],

  // Get department colors
  getDepartmentColor: (dept: keyof typeof colors.departments, variant: 'primary' | 'light' | 'border' | 'text') =>
    colors.departments[dept][variant],

  // Get status colors
  getStatusColor: (status: keyof typeof colors.status, variant: 'bg' | 'border' | 'text' | 'icon') =>
    colors.status[status][variant],

  // Get grid classes
  getGrid: (cols: keyof typeof layout.grid) => `grid ${layout.grid[cols]} gap-${spacing.md}`,

  // Get card variant
  getCard: (variant: keyof typeof componentVariants.card) =>
    `rounded-lg p-6 ${componentVariants.card[variant]}`,

  // Get badge variant
  getBadge: (variant: keyof typeof componentVariants.badge) =>
    `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${componentVariants.badge[variant]}`,
};

// Common CSS Class Combinations
export const commonClasses = {
  // Page layouts
  page: `min-h-screen bg-background p-${spacing.page.padding}`,
  pageContent: `mx-auto max-w-${layout.container["7xl"]} space-y-${spacing.page.headerSpacing}`,

  // Form layouts
  form: `space-y-${spacing.form.fieldSpacing}`,
  formSection: `space-y-${spacing.form.sectionSpacing}`,
  formGrid: `grid grid-cols-1 md:grid-cols-2 gap-${spacing.form.fieldSpacing}`,

  // Navigation
  navItem: `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`,
  navActive: `bg-primary text-primary-foreground`,
  navInactive: `text-muted-foreground hover:text-foreground hover:bg-muted`,

  // Cards
  dashboardCard: `${componentVariants.card.default} rounded-lg p-6`,
  statsCard: `${componentVariants.card.elevated} rounded-lg p-6 text-center`,

  // Buttons (extending the existing button component)
  buttonGroup: `flex items-center space-x-2`,
  buttonPrimary: `bg-primary text-primary-foreground hover:bg-primary/90`,
  buttonSecondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80`,

  // Lists
  list: `divide-y divide-border`,
  listItem: `py-4 flex items-center justify-between hover:bg-muted/50 transition-colors`,

  // Status indicators
  statusDot: (status: 'success' | 'warning' | 'error' | 'info') =>
    `inline-block w-2 h-2 rounded-full ${colors.status[status].icon.replace('text', 'bg')}`,
};