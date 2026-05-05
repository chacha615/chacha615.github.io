import React, { useState, useCallback, useRef } from "react";
import {
  PARTICLE_PRESETS,
  type ParticlePreset,
  type ParticleEffect,
  type ParticleConfig,
  createEffectFromPreset,
} from "@openreel/core";
import {
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Play,
} from "lucide-react";
import {
  Button,
  Slider,
  Select,
  Input,
  Collapse,
  Popover,
} from "antd";

interface ParticleEffectsSectionProps {
  clipId: string;
  clipDuration: number;
  clipStartTime: number;
  effects: ParticleEffect[];
  onAddEffect: (effect: ParticleEffect) => void;
  onUpdateEffect: (effectId: string, config: Partial<ParticleConfig>) => void;
  onRemoveEffect: (effectId: string) => void;
  onToggleEffect: (effectId: string, enabled: boolean) => void;
  onUpdateTiming: (effectId: string, startTime: number, duration: number) => void;
  onPreviewEffect?: (effectId: string) => void;
}

export const ParticleEffectsSection: React.FC<ParticleEffectsSectionProps> = ({
  clipId,
  clipDuration,
  clipStartTime,
  effects,
  onAddEffect,
  onUpdateEffect,
  onRemoveEffect,
  onToggleEffect,
  onUpdateTiming,
  onPreviewEffect,
}) => {
  const [expandedEffects, setExpandedEffects] = useState<Set<string>>(new Set());
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  const toggleExpanded = useCallback((effectId: string) => {
    setExpandedEffects((prev) => {
      const next = new Set(prev);
      if (next.has(effectId)) {
        next.delete(effectId);
      } else {
        next.add(effectId);
      }
      return next;
    });
  }, []);

  const handleAddEffect = useCallback(() => {
    if (!selectedPreset) return;

    const effectId = `particle-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const effect = createEffectFromPreset(selectedPreset, effectId, clipId, clipStartTime, clipDuration);

    if (effect) {
      onAddEffect(effect);
      setExpandedEffects((prev) => new Set(prev).add(effectId));
    }
  }, [selectedPreset, clipId, clipStartTime, clipDuration, onAddEffect]);

  const handleConfigChange = useCallback(
    (effectId: string, key: keyof ParticleConfig, value: unknown) => {
      onUpdateEffect(effectId, { [key]: value });
    },
    [onUpdateEffect]
  );

  const handleStartTimeChange = useCallback(
    (effectId: string, effect: ParticleEffect, newRelativeStartTime: number) => {
      const absoluteStartTime = clipStartTime + newRelativeStartTime;
      onUpdateTiming(effectId, absoluteStartTime, effect.duration);
    },
    [clipStartTime, onUpdateTiming]
  );

  const handleDurationChange = useCallback(
    (effectId: string, effect: ParticleEffect, newDuration: number) => {
      onUpdateTiming(effectId, effect.startTime, newDuration);
    },
    [onUpdateTiming]
  );

  const groupedPresets = PARTICLE_PRESETS.reduce(
    (acc, preset) => {
      if (!acc[preset.type]) {
        acc[preset.type] = [];
      }
      acc[preset.type].push(preset);
      return acc;
    },
    {} as Record<string, ParticlePreset[]>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select className="flex-1 h-8 text-xs min-w-0 [&>span]:truncate"
        value={selectedPreset} onChange={setSelectedPreset}
        placeholder="Select effect preset..."
        options={Object.entries(groupedPresets).map(([type, presets]) => (
          {
            label:(
              <div className="px-2 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {type}
              </div>
            ),
            option:presets.map((preset) => (
                  {
                    value: preset.id,
                    label: preset.name,
                  }
                ))
          }
            ))}
        >
        </Select>
        <Button
          size="small"
          onClick={handleAddEffect}
          disabled={!selectedPreset}
          className="h-8 px-3"
        >
          <Plus size={14} className="mr-1" />
          Add
        </Button>
      </div>

      {effects.length === 0 ? (
        <div className="text-center py-6 text-text-muted text-xs">
          <Sparkles size={24} className="mx-auto mb-2 opacity-50" />
          <p>No particle effects added</p>
          <p className="mt-1 text-[10px]">Select a preset above to add effects</p>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-auto custom-scrollbar">
          <div className="space-y-2 pr-2">
            {effects.map((effect) => {
              const relativeStartTime = effect.startTime - clipStartTime;
              return (
                <div
                  key={effect.id}
                  className="bg-background-tertiary rounded-lg border border-border overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-3 py-2">
                    <button
                      onClick={() => toggleExpanded(effect.id)}
                      className="p-0.5 rounded hover:bg-background-elevated text-text-muted"
                    >
                      {expandedEffects.has(effect.id) ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>

                    <span className="flex-1 text-xs font-medium text-text-primary capitalize">
                      {effect.type}
                    </span>

                    {onPreviewEffect && (
                      <button
                        onClick={() => onPreviewEffect(effect.id)}
                        className="p-1 rounded hover:bg-background-elevated text-text-muted hover:text-primary transition-colors"
                        title="Preview effect"
                      >
                        <Play size={12} />
                      </button>
                    )}

                    <button
                      onClick={() => onToggleEffect(effect.id, !effect.enabled)}
                      className={`p-1 rounded transition-colors ${
                        effect.enabled
                          ? "text-primary hover:bg-primary/20"
                          : "text-text-muted hover:bg-background-elevated"
                      }`}
                      title={effect.enabled ? "Disable" : "Enable"}
                    >
                      {effect.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>

                    <button
                      onClick={() => onRemoveEffect(effect.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors"
                      title="Remove effect"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {expandedEffects.has(effect.id) && (
                    <div className="px-3 pb-3 space-y-3 border-t border-border/50 pt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-text-muted mb-1">
                            Start Time (s)
                          </label>
                          <Input
                            type="number"
                            value={relativeStartTime.toFixed(1)}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val >= 0 && val < clipDuration) {
                                handleStartTimeChange(effect.id, effect, val);
                              }
                            }}
                            className="h-7 text-xs"
                            step={0.1}
                            min={0}
                            max={clipDuration}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted mb-1">
                            Duration (s)
                          </label>
                          <Input
                            type="number"
                            value={effect.duration.toFixed(1)}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val >= 0.1) {
                                handleDurationChange(effect.id, effect, val);
                              }
                            }}
                            className="h-7 text-xs"
                            step={0.1}
                            min={0.1}
                          />
                        </div>
                      </div>

                      <Collapse
                      className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-primary"
                      items={[
                        {
                          key: "particleSettings",
                          label:(
                            <span className="flex items-center gap-1 text-text-muted hover:text-text-primary">
                               <ChevronRight size={10} />
                                  Particle Settings
                             </span>
                          ),
                          children:(
                            <div className="pt-2 space-y-3">
                              <div>
                            <label className="text-[10px] text-text-muted mb-1">
                              Particle Count: {effect.config.particleCount}
                            </label>
                            <Slider
                              value={effect.config.particleCount}
                              onChange={(v) =>
                                handleConfigChange(effect.id, "particleCount", v)
                              }
                              min={10}
                              max={500}
                              step={10}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-text-muted mb-1">
                              Speed: {effect.config.speed}
                            </label>
                            <Slider
                              value={effect.config.speed}
                              onChange={(v) =>
                                handleConfigChange(effect.id, "speed", v)
                              }
                              min={10}
                              max={500}
                              step={10}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-text-muted mb-1">
                              Gravity: {effect.config.gravity}
                            </label>
                            <Slider
                              value={effect.config.gravity}
                              onChange={(v) =>
                                handleConfigChange(effect.id, "gravity", v)
                              }
                              min={-500}
                              max={500}
                              step={10}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-text-muted mb-1">
                              Emission Rate: {effect.config.emissionRate}
                            </label>
                            <Slider
                              value={effect.config.emissionRate}
                              onChange={(v) =>
                                handleConfigChange(effect.id, "emissionRate", v)
                              }
                              min={1}
                              max={200}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-text-muted mb-1">
                                Min Size: {effect.config.size.min}
                              </label>
                              <Slider
                                value={effect.config.size.min}
                                onChange={(v) =>
                                  handleConfigChange(effect.id, "size", {
                                    ...effect.config.size,
                                    min: v,
                                  })
                                }
                                min={1}
                                max={20}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-text-muted mb-1">
                                Max Size: {effect.config.size.max}
                              </label>
                              <Slider
                                value={effect.config.size.max}
                                onChange={(v) =>
                                  handleConfigChange(effect.id, "size", {
                                    ...effect.config.size,
                                    max: v,
                                  })
                                }
                                min={1}
                                max={30}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-text-muted mb-1">
                              Turbulence: {effect.config.turbulence}
                            </label>
                            <Slider
                              value={effect.config.turbulence}
                              onChange={(v) =>
                                handleConfigChange(effect.id, "turbulence", v)
                              }
                              min={0}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-text-muted mb-1">
                              Blend Mode
                            </label>
                            <Select
                              className="h-7 text-xs"
                              value={effect.config.blendMode}
                              onChange={(v) =>
                                handleConfigChange(effect.id, "blendMode", v)
                              }
                              options={[
                          { value: "normal", label: "Normal" },
                          { value: "add", label: "Additive" },
                          { value: "multiply", label: "Multiply" },
                          { value: "screen", label: "Screen" },
                        ]}
                            >
                            </Select>
                          </div>
                            </div>
                          )
                        }
                      ]}
                      >
                      </Collapse>

                      <Collapse className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-primary"
                      items={
                        [
                          {
                            key:'colors',
                            label:(
                              <span className="flex items-center gap-1 text-text-muted hover:text-text-primary">
                                 <ChevronRight size={10} />
                                 Colors ({effect.config.colors.length})
                             </span>
                            ),
                            children:(
                              <div className="pt-2">
                                 <div className="flex flex-wrap gap-1">
                            {effect.config.colors.map((color, idx) => (
                              <ColorSwatch
                                key={idx}
                                color={color}
                                onChange={(newColor) => {
                                  const newColors = [...effect.config.colors];
                                  newColors[idx] = newColor;
                                  handleConfigChange(effect.id, "colors", newColors);
                                }}
                                onRemove={
                                  effect.config.colors.length > 1
                                    ? () => {
                                        const newColors = effect.config.colors.filter((_, i) => i !== idx);
                                        handleConfigChange(effect.id, "colors", newColors);
                                      }
                                    : undefined
                                }
                              />
                            ))}
                            <button
                              onClick={() => {
                                const newColors = [...effect.config.colors, "#ffffff"];
                                handleConfigChange(effect.id, "colors", newColors);
                              }}
                              className="w-6 h-6 rounded border border-dashed border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-primary transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                              </div>
                            )
                          }
                        ]
                      }
                      >
                      </Collapse>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface ColorSwatchProps {
  color: string;
  onChange: (color: string) => void;
  onRemove?: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, onChange, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}
    placement="topLeft"
    content={
      <div className="w-auto p-2">
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-32 h-24 cursor-pointer border-0 p-0"
          />
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={color}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                  onChange(val);
                }
              }}
              className="h-7 text-xs font-mono flex-1"
              placeholder="#ffffff"
            />
            {onRemove && (
              <button
                onClick={() => {
                  onRemove();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors"
                title="Remove color"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    }
    >
      <button
    className="w-6 h-6 rounded border border-border cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
    style={{ backgroundColor: color }}
  />
    </Popover>
  );
};

export default ParticleEffectsSection;
