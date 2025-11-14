"use client"

import * as React from "react"
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Base Modal Props
interface BaseModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

// Confirmation Modal
interface ConfirmationModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: "destructive" | "default" | "warning"
  isLoading?: boolean
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  isLoading = false,
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <AlertTriangle className="h-6 w-6 text-destructive" />
      case "warning":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />
      default:
        return <Info className="h-6 w-6 text-primary" />
    }
  }

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "destructive":
        return "destructive"
      case "warning":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.()
              onOpenChange?.(false)
            }}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Form Modal
interface FormModalProps extends BaseModalProps {
  onSubmit?: () => void
  submitText?: string
  cancelText?: string
  isLoading?: boolean
  showFooter?: boolean
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = "md",
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  isLoading = false,
  showFooter = true,
}: FormModalProps) {
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "sm:max-w-md"
      case "md":
        return "sm:max-w-lg"
      case "lg":
        return "sm:max-w-2xl"
      case "xl":
        return "sm:max-w-4xl"
      case "full":
        return "sm:max-w-[95vw] h-[95vh]"
      default:
        return "sm:max-w-lg"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(getSizeClass(), className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className={cn("space-y-4", size === "full" && "overflow-y-auto flex-1")}>
          {children}
        </div>
        {showFooter && (
          <>
            <Separator />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button onClick={onSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : submitText}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Info/Details Modal
interface InfoModalProps extends BaseModalProps {
  data?: Record<string, any>
  fields?: { key: string; label: string; type?: "text" | "badge" | "date" | "currency" }[]
}

export function InfoModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = "md",
  data,
  fields = [],
}: InfoModalProps) {
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "sm:max-w-md"
      case "md":
        return "sm:max-w-lg"
      case "lg":
        return "sm:max-w-2xl"
      case "xl":
        return "sm:max-w-4xl"
      default:
        return "sm:max-w-lg"
    }
  }

  const renderValue = (value: any, type: string = "text") => {
    if (value == null) return <span className="text-muted-foreground">—</span>

    switch (type) {
      case "badge":
        return <Badge variant="secondary">{value}</Badge>
      case "date":
        return new Date(value).toLocaleDateString()
      case "currency":
        return new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(value)
      default:
        return value.toString()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(getSizeClass(), className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4">
          {data && fields.length > 0 && (
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.key} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="font-medium text-sm">{field.label}:</span>
                  <div className="text-right">
                    {renderValue(data[field.key], field.type)}
                  </div>
                </div>
              ))}
            </div>
          )}
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Slide Over/Drawer
interface SlideOverProps extends BaseModalProps {
  side?: "top" | "bottom" | "left" | "right"
}

export function SlideOver({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  side = "right",
}: SlideOverProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={cn("w-full sm:max-w-lg", className)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="mt-6 space-y-4 overflow-y-auto flex-1">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Multi-step Modal/Wizard
interface WizardStep {
  title: string
  description?: string
  content: React.ReactNode
  isValid?: boolean
}

interface WizardModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  steps: WizardStep[]
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: () => void
  size?: "md" | "lg" | "xl"
}

export function WizardModal({
  open,
  onOpenChange,
  title,
  steps,
  currentStep,
  onStepChange,
  onComplete,
  size = "lg",
}: WizardModalProps) {
  const getSizeClass = () => {
    switch (size) {
      case "md":
        return "sm:max-w-2xl"
      case "lg":
        return "sm:max-w-4xl"
      case "xl":
        return "sm:max-w-6xl"
      default:
        return "sm:max-w-2xl"
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={getSizeClass()}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {title}
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </DialogTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step, index) => (
                <span
                  key={index}
                  className={cn(
                    "text-xs",
                    index === currentStep && "font-medium text-primary",
                    index < currentStep && "text-green-600"
                  )}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{steps[currentStep]?.title}</CardTitle>
              {steps[currentStep]?.description && (
                <CardDescription>{steps[currentStep].description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {steps[currentStep]?.content}
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={goNext}
              disabled={steps[currentStep]?.isValid === false}
            >
              {currentStep === steps.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Success/Error Notification Modal
interface NotificationModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  type: "success" | "error" | "warning" | "info"
  title: string
  description?: string
  actionText?: string
  onAction?: () => void
}

export function NotificationModal({
  open,
  onOpenChange,
  type,
  title,
  description,
  actionText,
  onAction,
}: NotificationModalProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "error":
        return <AlertTriangle className="h-8 w-8 text-red-500" />
      case "warning":
        return <AlertCircle className="h-8 w-8 text-yellow-500" />
      case "info":
        return <Info className="h-8 w-8 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-950"
      case "error":
        return "bg-red-50 dark:bg-red-950"
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950"
      case "info":
        return "bg-blue-50 dark:bg-blue-950"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className={cn("p-6 rounded-lg", getBgColor())}>
          <div className="flex items-center justify-center mb-4">
            {getIcon()}
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-4">
          {actionText && onAction && (
            <Button onClick={onAction}>{actionText}</Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Modal Hook for easier state management
export function useModal() {
  const [isOpen, setIsOpen] = React.useState(false)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}

// Export all components
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}