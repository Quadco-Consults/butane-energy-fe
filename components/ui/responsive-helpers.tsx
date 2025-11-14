"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Responsive Container Component
interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  breakpoint?: "sm" | "md" | "lg" | "xl"
}

export function ResponsiveContainer({
  children,
  className,
  breakpoint = "lg"
}: ResponsiveContainerProps) {
  const breakpointClass = {
    sm: "sm:container",
    md: "md:container",
    lg: "lg:container",
    xl: "xl:container"
  }[breakpoint]

  return (
    <div className={cn(
      "w-full px-4 sm:px-6",
      breakpointClass,
      className
    )}>
      {children}
    </div>
  )
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    base?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function ResponsiveGrid({
  children,
  cols = { base: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid",
    `gap-${gap}`,
    cols.base && `grid-cols-${cols.base}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// Mobile Navigation Hook
export function useMobileNavigation() {
  const [isMobile, setIsMobile] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return {
    isMobile,
    isOpen,
    setIsOpen,
    toggle: () => setIsOpen(!isOpen),
    close: () => setIsOpen(false)
  }
}

// Responsive Text Component
interface ResponsiveTextProps {
  children: React.ReactNode
  size?: {
    base?: string
    sm?: string
    md?: string
    lg?: string
  }
  className?: string
}

export function ResponsiveText({
  children,
  size = { base: "text-base", md: "md:text-lg" },
  className
}: ResponsiveTextProps) {
  const textClasses = cn(
    size.base,
    size.sm,
    size.md,
    size.lg,
    className
  )

  return (
    <span className={textClasses}>
      {children}
    </span>
  )
}

// Responsive Stack Component (Flex direction changes on mobile)
interface ResponsiveStackProps {
  children: React.ReactNode
  direction?: {
    base?: "row" | "col"
    md?: "row" | "col"
  }
  gap?: number
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  className?: string
}

export function ResponsiveStack({
  children,
  direction = { base: "col", md: "row" },
  gap = 4,
  align = "start",
  justify = "start",
  className
}: ResponsiveStackProps) {
  const stackClasses = cn(
    "flex",
    direction.base === "row" ? "flex-row" : "flex-col",
    direction.md === "row" ? "md:flex-row" : "md:flex-col",
    `gap-${gap}`,
    {
      "items-start": align === "start",
      "items-center": align === "center",
      "items-end": align === "end",
      "items-stretch": align === "stretch"
    },
    {
      "justify-start": justify === "start",
      "justify-center": justify === "center",
      "justify-end": justify === "end",
      "justify-between": justify === "between",
      "justify-around": justify === "around",
      "justify-evenly": justify === "evenly"
    },
    className
  )

  return (
    <div className={stackClasses}>
      {children}
    </div>
  )
}

// Mobile-First Card Component
interface MobileCardProps {
  children: React.ReactNode
  padding?: "sm" | "md" | "lg"
  className?: string
}

export function MobileCard({
  children,
  padding = "md",
  className
}: MobileCardProps) {
  const paddingClasses = {
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8"
  }[padding]

  return (
    <div className={cn(
      "bg-background rounded-lg border shadow-sm",
      paddingClasses,
      className
    )}>
      {children}
    </div>
  )
}

// Breakpoint Hook
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('sm')

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width >= 1536) setBreakpoint('2xl')
      else if (width >= 1280) setBreakpoint('xl')
      else if (width >= 1024) setBreakpoint('lg')
      else if (width >= 768) setBreakpoint('md')
      else setBreakpoint('sm')
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint)
  }
}

// Touch-Friendly Button Component
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "touch"
}

export function TouchButton({
  children,
  variant = "default",
  size = "touch",
  className,
  ...props
}: TouchButtonProps) {
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-9 px-4",
    lg: "h-10 px-6",
    touch: "h-12 px-6 min-w-[48px] touch-manipulation" // 48px minimum for accessibility
  }[size]

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  }[variant]

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background active:scale-95 transform transition-transform",
        sizeClasses,
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Responsive Table Wrapper
interface ResponsiveTableProps {
  children: React.ReactNode
  className?: string
  mobileTitle?: string
}

export function ResponsiveTableWrapper({
  children,
  className,
  mobileTitle = "Data Table"
}: ResponsiveTableProps) {
  const { isMobile } = useBreakpoint()

  if (isMobile) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="font-semibold text-lg">{mobileTitle}</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      {children}
    </div>
  )
}

// Mobile-Optimized Modal
interface MobileModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  fullScreen?: boolean
}

export function MobileModal({
  children,
  isOpen,
  onClose,
  title,
  fullScreen = false
}: MobileModalProps) {
  const { isMobile } = useBreakpoint()

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        "relative bg-background rounded-lg shadow-lg max-h-[90vh] overflow-y-auto",
        isMobile || fullScreen
          ? "w-full h-full m-0 rounded-none"
          : "w-full max-w-md mx-4"
      )}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              ✕
            </TouchButton>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// Safe Area Component (for iOS devices)
export function SafeArea({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      "pb-safe-bottom pt-safe-top pl-safe-left pr-safe-right",
      className
    )}>
      {children}
    </div>
  )
}

// Responsive hide/show utilities
export const responsiveUtils = {
  hideOn: {
    mobile: "hidden sm:block",
    tablet: "sm:hidden lg:block",
    desktop: "lg:hidden"
  },
  showOn: {
    mobile: "block sm:hidden",
    tablet: "hidden sm:block lg:hidden",
    desktop: "hidden lg:block"
  }
}

export default {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveText,
  ResponsiveStack,
  MobileCard,
  TouchButton,
  ResponsiveTableWrapper,
  MobileModal,
  SafeArea,
  useMobileNavigation,
  useBreakpoint,
  responsiveUtils
}