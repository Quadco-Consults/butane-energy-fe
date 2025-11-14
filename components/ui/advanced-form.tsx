"use client"

import * as React from "react"
import { useForm, UseFormReturn, FieldPath, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Upload, X, Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Field Types
export interface BaseField {
  name: string
  label: string
  description?: string
  required?: boolean
}

export interface InputField extends BaseField {
  type: "text" | "email" | "password" | "number" | "tel" | "url"
  placeholder?: string
  maxLength?: number
  minLength?: number
}

export interface TextareaField extends BaseField {
  type: "textarea"
  placeholder?: string
  rows?: number
  maxLength?: number
}

export interface SelectField extends BaseField {
  type: "select"
  placeholder?: string
  options: { label: string; value: string }[]
  multiple?: boolean
}

export interface CheckboxField extends BaseField {
  type: "checkbox"
  options?: { label: string; value: string }[]
}

export interface DateField extends BaseField {
  type: "date"
  placeholder?: string
}

export interface FileField extends BaseField {
  type: "file"
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
}

export interface ArrayField extends BaseField {
  type: "array"
  fields: FormFieldConfig[]
  addButtonText?: string
  removeButtonText?: string
}

export interface SectionField {
  type: "section"
  title: string
  description?: string
  fields: FormFieldConfig[]
  collapsible?: boolean
  defaultExpanded?: boolean
}

export type FormFieldConfig =
  | InputField
  | TextareaField
  | SelectField
  | CheckboxField
  | DateField
  | FileField
  | ArrayField
  | SectionField

// Advanced Form Builder Props
export interface AdvancedFormProps {
  fields: FormFieldConfig[]
  schema: z.ZodSchema<any>
  onSubmit: (data: any) => Promise<void> | void
  defaultValues?: any
  title?: string
  description?: string
  submitText?: string
  resetText?: string
  className?: string
  isLoading?: boolean
}

// Calendar Component (simplified)
const Calendar = ({ selected, onSelect, ...props }: any) => {
  return (
    <div className="p-3">
      <Input
        type="date"
        value={selected ? format(selected, "yyyy-MM-dd") : ""}
        onChange={(e) => onSelect && onSelect(new Date(e.target.value))}
        {...props}
      />
    </div>
  )
}

// Multi-Select Component
const MultiSelect = React.forwardRef<
  HTMLDivElement,
  {
    options: { label: string; value: string }[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
  }
>(({ options, value = [], onChange, placeholder = "Select options..." }, ref) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          ref={ref}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 3).map((item) => {
                const option = options.find(opt => opt.value === item)
                return (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {option?.label}
                  </Badge>
                )
              })}
              {value.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{value.length - 3} more
                </Badge>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                value.includes(option.value) && "bg-accent"
              )}
              onClick={() => {
                if (value.includes(option.value)) {
                  onChange(value.filter(item => item !== option.value))
                } else {
                  onChange([...value, option.value])
                }
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value.includes(option.value) ? "opacity-100" : "opacity-0"
                )}
              />
              {option.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
})
MultiSelect.displayName = "MultiSelect"

// File Upload Component
const FileUpload = React.forwardRef<
  HTMLInputElement,
  {
    value: FileList | null
    onChange: (files: FileList | null) => void
    accept?: string
    multiple?: boolean
    maxSize?: number
  }
>(({ value, onChange, accept, multiple, maxSize, ...props }, ref) => {
  const [dragOver, setDragOver] = React.useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onChange(files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    onChange(files)
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors",
        dragOver && "border-primary bg-primary/10"
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={ref}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        {...props}
      />
      <div className="space-y-2">
        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => ref && "current" in ref && ref.current?.click()}
          >
            Choose files
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            or drag and drop files here
          </p>
        </div>
        {maxSize && (
          <p className="text-xs text-muted-foreground">
            Max file size: {(maxSize / 1024 / 1024).toFixed(1)}MB
          </p>
        )}
      </div>
      {value && value.length > 0 && (
        <div className="mt-4 space-y-1">
          <p className="text-sm font-medium">Selected files:</p>
          {Array.from(value).map((file, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span>{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const dt = new DataTransfer()
                  Array.from(value).forEach((f, i) => {
                    if (i !== index) dt.items.add(f)
                  })
                  onChange(dt.files.length > 0 ? dt.files : null)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
FileUpload.displayName = "FileUpload"

// Field Renderer Component
const FieldRenderer: React.FC<{
  field: FormFieldConfig
  form: UseFormReturn<any>
  baseName?: string
}> = ({ field, form, baseName = "" }) => {
  const fieldName = baseName ? `${baseName}.${field.name}` : field.name

  if (field.type === "section") {
    const [expanded, setExpanded] = React.useState(field.defaultExpanded ?? true)

    return (
      <div className="space-y-4">
        <div>
          {field.collapsible ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="p-0 h-auto font-semibold text-lg"
            >
              {field.title}
              <ChevronsUpDown className={cn("ml-2 h-4 w-4 transition-transform", expanded && "rotate-180")} />
            </Button>
          ) : (
            <h3 className="font-semibold text-lg">{field.title}</h3>
          )}
          {field.description && (
            <p className="text-sm text-muted-foreground mt-1">{field.description}</p>
          )}
        </div>
        {expanded && (
          <div className="space-y-4 pl-4 border-l">
            {field.fields.map((subField, index) => (
              <FieldRenderer
                key={`${subField.name}-${index}`}
                field={subField}
                form={form}
                baseName={baseName}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <FormField
      control={form.control}
      name={fieldName as FieldPath<any>}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            {field.type === "text" || field.type === "email" || field.type === "password" || field.type === "number" || field.type === "tel" || field.type === "url" ? (
              <Input
                type={field.type}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                {...formField}
              />
            ) : field.type === "textarea" ? (
              <Textarea
                placeholder={field.placeholder}
                rows={field.rows}
                maxLength={field.maxLength}
                {...formField}
              />
            ) : field.type === "select" ? (
              field.multiple ? (
                <MultiSelect
                  options={field.options}
                  value={formField.value || []}
                  onChange={formField.onChange}
                  placeholder={field.placeholder}
                />
              ) : (
                <Select value={formField.value} onValueChange={formField.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            ) : field.type === "checkbox" ? (
              field.options ? (
                <div className="space-y-2">
                  {field.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        checked={formField.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            formField.onChange([...(formField.value || []), option.value])
                          } else {
                            formField.onChange(formField.value?.filter((v: string) => v !== option.value))
                          }
                        }}
                      />
                      <label className="text-sm">{option.label}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <Checkbox
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                />
              )
            ) : field.type === "date" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formField.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formField.value ? format(formField.value, "PPP") : field.placeholder}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    selected={formField.value}
                    onSelect={formField.onChange}
                  />
                </PopoverContent>
              </Popover>
            ) : field.type === "file" ? (
              <FileUpload
                value={formField.value}
                onChange={formField.onChange}
                accept={field.accept}
                multiple={field.multiple}
                maxSize={field.maxSize}
              />
            ) : null}
          </FormControl>
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Main Advanced Form Component
export function AdvancedForm({
  fields,
  schema,
  onSubmit,
  defaultValues = {},
  title,
  description,
  submitText = "Submit",
  resetText = "Reset",
  className,
  isLoading = false,
}: AdvancedFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const handleReset = () => {
    form.reset()
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <FieldRenderer
                key={`${field.name || field.type}-${index}`}
                field={field}
                form={form}
              />
            ))}

            <Separator />

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : submitText}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                {resetText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Form Builder Helper Functions
export const createValidationSchema = (fields: FormFieldConfig[]): z.ZodSchema<any> => {
  const schemaObject: Record<string, z.ZodTypeAny> = {}

  const processFields = (fieldsArray: FormFieldConfig[], prefix = "") => {
    fieldsArray.forEach((field) => {
      if (field.type === "section") {
        processFields(field.fields, prefix)
        return
      }

      const fieldName = prefix ? `${prefix}.${field.name}` : field.name
      let validator: z.ZodTypeAny

      switch (field.type) {
        case "email":
          validator = z.string().email("Invalid email format")
          break
        case "number":
          validator = z.coerce.number()
          break
        case "date":
          validator = z.date()
          break
        case "file":
          validator = z.any()
          break
        case "checkbox":
          validator = field.options ? z.array(z.string()) : z.boolean()
          break
        case "select":
          validator = field.multiple ? z.array(z.string()) : z.string()
          break
        case "array":
          // Handle array fields recursively
          const arraySchema = createValidationSchema(field.fields)
          validator = z.array(arraySchema)
          break
        default:
          validator = z.string()
      }

      // Add length constraints
      if ((field.type === "text" || field.type === "textarea") && field.minLength) {
        validator = (validator as z.ZodString).min(field.minLength, `Minimum ${field.minLength} characters required`)
      }
      if ((field.type === "text" || field.type === "textarea") && field.maxLength) {
        validator = (validator as z.ZodString).max(field.maxLength, `Maximum ${field.maxLength} characters allowed`)
      }

      // Add required constraint
      if (!field.required) {
        validator = validator.optional()
      }

      schemaObject[fieldName] = validator
    })
  }

  processFields(fields)
  return z.object(schemaObject)
}

export default AdvancedForm