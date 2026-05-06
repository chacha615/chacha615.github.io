import React, { useCallback, useMemo } from "react";
import { useProjectStore } from "../../../stores/project-store";
import type { GraphicAnimation, GraphicAnimationType } from "@openreel/core";
import { SVG_ANIMATION_PRESETS } from "@openreel/core";
import {
  Slider,
  Select,
} from "antd";

const ColorPicker: React.FC<{
  label: string;
  value: string;
  onChange: (color: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-text-secondary">{label}</span>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded border border-border cursor-pointer"
      />
      <span className="text-[10px] font-mono text-text-muted uppercase">
        {value}
      </span>
    </div>
  </div>
);

const ANIMATION_PRESETS = SVG_ANIMATION_PRESETS.map((preset) => ({
  value: preset.id,
  label: preset.name,
  description: preset.description,
}));

interface SVGSectionProps {
  clipId: string;
}

export const SVGSection: React.FC<SVGSectionProps> = ({ clipId }) => {
  const { getSVGClipById, updateSVGClip, project } = useProjectStore();

  const svgClip = useMemo(
    () => getSVGClipById(clipId),
    [clipId, getSVGClipById, project.modifiedAt],
  );

  const colorStyle = svgClip?.colorStyle || {
    colorMode: "none" as const,
    tintColor: "#ffffff",
    tintOpacity: 1,
  };

  const entryAnimation = svgClip?.entryAnimation;
  const exitAnimation = svgClip?.exitAnimation;

  const handleColorModeChange = useCallback(
    (mode: "none" | "tint" | "replace") => {
      if (!svgClip) {
        console.warn(`[SVGSection] No SVG clip found for ${clipId}`);
        return;
      }
      const newColorStyle = {
        ...colorStyle,
        colorMode: mode,
      };
      updateSVGClip(clipId, {
        colorStyle: newColorStyle,
      });
    },
    [clipId, svgClip, colorStyle, updateSVGClip],
  );

  const handleTintColorChange = useCallback(
    (color: string) => {
      if (!svgClip) return;
      updateSVGClip(clipId, {
        colorStyle: {
          ...colorStyle,
          tintColor: color,
        },
      });
    },
    [clipId, svgClip, colorStyle, updateSVGClip],
  );

  const handleTintOpacityChange = useCallback(
    (opacity: number) => {
      if (!svgClip) return;
      updateSVGClip(clipId, {
        colorStyle: {
          ...colorStyle,
          tintOpacity: opacity,
        },
      });
    },
    [clipId, svgClip, colorStyle, updateSVGClip],
  );

  const handleEntryAnimationChange = useCallback(
    (type: GraphicAnimationType) => {
      if (!svgClip) {
        console.warn(`[SVGSection] No SVG clip found for ${clipId}`);
        return;
      }
      const animation: GraphicAnimation = {
        type,
        duration: entryAnimation?.duration || 0.5,
        easing: entryAnimation?.easing || "ease-out",
      };
      updateSVGClip(clipId, { entryAnimation: animation });
    },
    [clipId, svgClip, entryAnimation, updateSVGClip],
  );

  const handleExitAnimationChange = useCallback(
    (type: GraphicAnimationType) => {
      if (!svgClip) return;
      const animation: GraphicAnimation = {
        type,
        duration: exitAnimation?.duration || 0.5,
        easing: exitAnimation?.easing || "ease-out",
      };
      updateSVGClip(clipId, { exitAnimation: animation });
    },
    [clipId, svgClip, exitAnimation, updateSVGClip],
  );

  const handleEntryDurationChange = useCallback(
    (duration: number) => {
      if (!svgClip || !entryAnimation) return;
      updateSVGClip(clipId, {
        entryAnimation: { ...entryAnimation, duration },
      });
    },
    [clipId, svgClip, entryAnimation, updateSVGClip],
  );

  const handleExitDurationChange = useCallback(
    (duration: number) => {
      if (!svgClip || !exitAnimation) return;
      updateSVGClip(clipId, {
        exitAnimation: { ...exitAnimation, duration },
      });
    },
    [clipId, svgClip, exitAnimation, updateSVGClip],
  );

  if (!svgClip) {
    return (
      <div className="text-center py-8 text-text-muted text-xs">
        No SVG clip selected
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-secondary">Mode</span>
            <div className="flex gap-1">
              {(["none", "tint", "replace"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleColorModeChange(mode)}
                  className={`px-2 py-1 text-[9px] rounded capitalize transition-colors ${
                    colorStyle.colorMode === mode
                      ? "bg-primary text-white"
                      : "bg-background-tertiary border border-border text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {colorStyle.colorMode !== "none" && (
            <>
              <ColorPicker
                label="Color"
                value={colorStyle.tintColor || "#ffffff"}
                onChange={handleTintColorChange}
              />
              <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Opacity</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {(colorStyle.tintOpacity || 1).toFixed(1)}
          </span>
        </div>
        <Slider
          value={colorStyle.tintOpacity || 1}
          onChange={(values) => handleTintOpacityChange(values)}
          min={0}
          max={1}
          step={0.1}
          className="h-1.5"
        />
      </div>
            </>
          )}
        </div>

      <div className="space-y-3">
        <span className="text-[10px] font-medium text-text-secondary">
          Entry Animation
        </span>
        <Select
          className="w-full bg-background-tertiary border-border text-text-primary"
          value={entryAnimation?.type || "none"}
          onChange={(v) => handleEntryAnimationChange(v as GraphicAnimationType)}
          options={ANIMATION_PRESETS.map((preset) => ({
              value: preset.value,
              label: preset.label,
  }))}
        >
        </Select>

        {entryAnimation && entryAnimation.type !== "none" && (
          <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Duration</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {(entryAnimation.duration).toFixed(1)}
          </span>
        </div>
        <Slider
          value={entryAnimation.duration}
          onChange={(values) => handleEntryDurationChange(values)}
          min={0.1}
          max={3}
          step={0.1}
          className="h-1.5"
        />
      </div>
        )}
      </div>

      <div className="space-y-4">
        <span className="text-[10px] font-medium text-text-secondary">
          Exit Animation
        </span>
        <Select
          className="w-full bg-background-tertiary border-border text-text-primary"
          value={exitAnimation?.type || "none"}
          onChange={(v) => handleExitAnimationChange(v as GraphicAnimationType)}
          options={ANIMATION_PRESETS.map((preset) => ({
              value: preset.value,
              label: preset.label,
  }))}
        >
        </Select>

        {exitAnimation && exitAnimation.type !== "none" && (
          <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Duration</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {(exitAnimation.duration).toFixed(1)}
          </span>
        </div>
        <Slider
          value={exitAnimation.duration}
          onChange={(values) => handleExitDurationChange(values)}
          min={0.1}
          max={3}
          step={0.1}
          className="h-1.5"
        />
      </div>
        )}
      </div>
    </div>
  );
};
