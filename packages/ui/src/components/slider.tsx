// ...existing code...
import * as React from "react"
import { Slider as AntdSlider } from "antd"

import { cn } from "@openreel/ui/lib/utils"

/**
 * Slider 二次封装（基于 antd Slider）
 * - 保留原有 Radix 风格的 props 命名（value/defaultValue/onValueChange/onChange/min/max/step/disabled/orientation 等）
 * - 支持单点与范围（数组）两种模式：当 value/defaultValue 为数组时，映射为 antd 的 range
 * - 保持原有外层结构与样式类名（尽量保持与原 Radix 版本一致）
 * - 图标库不变（该组件不使用图标）
 */

export type SliderProps = {
  value?: number | number[]
  defaultValue?: number | number[]
  onValueChange?: (v: number | number[]) => void // Radix 风格
  onChange?: (v: number | number[]) => void // 兼容 antd / 常用命名
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: "horizontal" | "vertical"
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const baseClass = "relative flex w-full touch-none select-none items-center"

const Slider = React.forwardRef<any, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      orientation = "horizontal",
      ...props
    },
    ref
  ) => {
    const isRange =
      Array.isArray(value) || Array.isArray(defaultValue)

    // antd 的 onChange 会传入 number 或 number[]
    const handleChange = (v: number | number[]) => {
      onValueChange?.(v)
      onChange?.(v)
    }

    return (
      <div ref={ref} className={cn(baseClass, className)} {...props}>
        <AntdSlider
          className="w-full"
          value={value as any}
          defaultValue={defaultValue as any}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          range={isRange}
          vertical={orientation === "vertical"}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
//