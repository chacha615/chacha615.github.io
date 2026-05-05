// ...existing code...
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Button as AntdButton } from "antd"
import { cn } from "@openreel/ui/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 [&_svg]:size-4",
        "icon-xs": "h-6 w-6 [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button 二次封装（基于 antd Button）
 * - 保留原有 variant/size/asChild/className/children 等 API
 * - 使用 cva 样式类保持原有外观
 * - 当 asChild 为 true 时，使用 radix Slot 渲染任意元素（保持原先行为）
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // 生成样式类（保持与原来一致）
    const classes = cn(buttonVariants({ variant, size }), className)

    if (asChild) {
      // 把样式和属性传递给子元素（保持原有 asChild 行为）
      const Comp: any = Slot
      return <Comp className={classes} ref={ref} {...(props as any)} />
    }

    // 将部分语义映射到 antd Button（尽量保留原有外观）
    // 映射 variant -> antd.type，size -> antd.size（尽量兼容）
    const typeMap: Record<string, any> = {
      default: "primary",
      destructive: "default",
      outline: "default",
      secondary: "default",
      ghost: "default",
      link: "link",
    }
    const sizeMap: Record<string, any> = {
      default: "middle",
      sm: "small",
      lg: "large",
      icon: "middle",
      "icon-sm": "small",
      "icon-xs": "small",
    }

    const antdType = typeMap[variant ?? "default"]
    const antdSize = sizeMap[size ?? "default"]

    return (
      <AntdButton
        ref={ref as any}
        className={classes}
        type={antdType as any}
        size={antdSize as any}
        {...(props as any)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
// ...existing code...