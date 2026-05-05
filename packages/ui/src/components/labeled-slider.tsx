// ...existing code...
import * as React from "react"
import { Slider } from "./slider"
import { cn } from "@openreel/ui/lib/utils"

export interface LabeledSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  className?: string
}

const LabeledSlider = React.forwardRef<HTMLDivElement, LabeledSliderProps>(
  ({ label, value, onChange, min = 0, max = 100, step = 1, unit = "", className }, ref) => {
    const displayValue = step < 1 ? value.toFixed(1) : Math.round(value)

    return (
      <div ref={ref} className={cn("space-y-1", className)}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">{label}</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {displayValue}
            {unit}
          </span>
        </div>
        <Slider
          // 保持原有行为：以数组方式传入以确保 Slider 在封装时识别为 range（若需单值可改为 value={value}）
          value={[value]}
          onValueChange={(values) => {
            // 兼容 antd/封装返回 number | number[]
            const v = Array.isArray(values) ? values[0] : values
            onChange(Number(v))
          }}
          min={min}
          max={max}
          step={step}
          className="h-1.5"
        />
      </div>
    )
  }
)
LabeledSlider.displayName = "LabeledSlider"

export interface InspectorSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

const InspectorSlider = React.forwardRef<HTMLDivElement, InspectorSliderProps>(
  ({ value, onChange, min = 0, max = 100, step = 1, className }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-3", className)}>
        <Slider
          value={[value]}
          onValueChange={(values) => {
            const v = Array.isArray(values) ? values[0] : values
            onChange(Number(v))
          }}
          min={min}
          max={max}
          step={step}
          className="flex-1 h-1.5"
        />
        <span className="text-[10px] font-mono text-text-primary w-8 text-right bg-background-tertiary px-1 py-0.5 rounded border border-border">
          {Math.round(value)}
        </span>
      </div>
    )
  }
)
InspectorSlider.displayName = "InspectorSlider"

export { LabeledSlider, InspectorSlider }
//