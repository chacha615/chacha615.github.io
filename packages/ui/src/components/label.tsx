import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@openreel/ui/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

/**
 * Label 二次封装
 * - 不依赖 Radix，使用原生 <label> 保持语义
 * - 保持原有样式类名与 Variant API
 * - props 名称与行为保持一致（for、children、className 等）
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn(labelVariants(), className)} {...props} />
})
Label.displayName = "Label"

export {Label }