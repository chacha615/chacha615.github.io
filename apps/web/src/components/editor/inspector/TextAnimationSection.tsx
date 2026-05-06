import React, { useCallback } from "react";
import { Type, Clock, Play } from "lucide-react";
import { useProjectStore } from "../../../stores/project-store";
import type { TextAnimationPreset, TextAnimationParams } from "@openreel/core";
import {
  Slider,
  Select,
} from "antd";

interface PresetInfo {
  value: TextAnimationPreset;
  label: string;
  description: string;
}

const ANIMATION_PRESETS: PresetInfo[] = [
  { value: "none", label: "None", description: "No animation" },
  {
    value: "typewriter",
    label: "Typewriter",
    description: "Characters appear one by one",
  },
  { value: "fade", label: "Fade", description: "Fade in and out" },
  {
    value: "slide-left",
    label: "Slide Left",
    description: "Slide in from the right",
  },
  {
    value: "slide-right",
    label: "Slide Right",
    description: "Slide in from the left",
  },
  {
    value: "slide-up",
    label: "Slide Up",
    description: "Slide in from below",
  },
  {
    value: "slide-down",
    label: "Slide Down",
    description: "Slide in from above",
  },
  { value: "scale", label: "Scale", description: "Scale up from small" },
  { value: "bounce", label: "Bounce", description: "Bouncy entrance" },
  { value: "rotate", label: "Rotate", description: "Rotate into view" },
  { value: "wave", label: "Wave", description: "Characters wave up and down" },
  { value: "shake", label: "Shake", description: "Vibrating text effect" },
  { value: "pop", label: "Pop", description: "Poppy entrance with overshoot" },
  { value: "glitch", label: "Glitch", description: "Digital glitch effect" },
  { value: "split", label: "Split", description: "Text splits from center" },
  { value: "flip", label: "Flip", description: "3D flip animation" },
  {
    value: "word-by-word",
    label: "Word by Word",
    description: "Words appear sequentially",
  },
  {
    value: "rainbow",
    label: "Rainbow",
    description: "Color cycles through spectrum",
  },
];


const PresetSelector: React.FC<{
  value: TextAnimationPreset;
  onChange: (preset: TextAnimationPreset) => void;
}> = ({ value, onChange }) => (
  <div className="space-y-2">
    <span className="text-[10px] text-text-secondary">Animation Preset</span>
    <Select className="w-full bg-background-tertiary border-border text-text-primary"
    value={value} onChange={(v) => onChange(v as TextAnimationPreset)}
    options={ANIMATION_PRESETS.map((preset) => ({
      value: preset.value,
      label: preset.label,
    }))}
    >
    </Select>
    <p className="text-[9px] text-text-muted">
      {ANIMATION_PRESETS.find((p) => p.value === value)?.description}
    </p>
  </div>
);

const EasingSelector: React.FC<{
  value: string;
  onChange: (easing: string) => void;
}> = ({ value, onChange }) => {
  const easingOptions = [
    { value: "linear", label: "Linear" },
    { value: "ease-in", label: "Ease In" },
    { value: "ease-out", label: "Ease Out" },
    { value: "ease-in-out", label: "Ease In Out" },
  ];

  return (
    <div className="space-y-1">
      <span className="text-[10px] text-text-secondary">Easing</span>
      <Select className="w-full bg-background-tertiary border-border text-text-primary text-[10px]"
      value={value} onChange={onChange}
      options={easingOptions.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
      >
      </Select>
    </div>
  );
};

interface TextAnimationSectionProps {
  clipId: string;
}

export const TextAnimationSection: React.FC<TextAnimationSectionProps> = ({
  clipId,
}) => {
  const getTextClip = useProjectStore((state) => state.getTextClip);
  const applyTextAnimationPreset = useProjectStore(
    (state) => state.applyTextAnimationPreset,
  );
  useProjectStore((state) => state.project);

  const textClip = getTextClip(clipId);

  const currentPreset: TextAnimationPreset =
    textClip?.animation?.preset || "none";
  const inDuration = textClip?.animation?.inDuration ?? 0.5;
  const outDuration = textClip?.animation?.outDuration ?? 0.5;
  const easing = textClip?.animation?.params?.easing ?? "ease-out";

  const handlePresetChange = useCallback(
    (preset: TextAnimationPreset) => {
      applyTextAnimationPreset(clipId, preset, inDuration, outDuration);
    },
    [clipId, applyTextAnimationPreset, inDuration, outDuration],
  );

  const handleInDurationChange = useCallback(
    (newInDuration: number) => {
      applyTextAnimationPreset(
        clipId,
        currentPreset,
        newInDuration,
        outDuration,
      );
    },
    [clipId, applyTextAnimationPreset, currentPreset, outDuration],
  );

  const handleOutDurationChange = useCallback(
    (newOutDuration: number) => {
      applyTextAnimationPreset(
        clipId,
        currentPreset,
        inDuration,
        newOutDuration,
      );
    },
    [clipId, applyTextAnimationPreset, currentPreset, inDuration],
  );

  const handleEasingChange = useCallback(
    (newEasing: string) => {
      applyTextAnimationPreset(clipId, currentPreset, inDuration, outDuration, {
        easing: newEasing as TextAnimationParams["easing"],
      });
    },
    [clipId, applyTextAnimationPreset, currentPreset, inDuration, outDuration],
  );

  if (!textClip) {
    return (
      <div className="p-4 text-center">
        <Type size={24} className="mx-auto mb-2 text-text-muted" />
        <p className="text-[10px] text-text-muted">No text clip selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PresetSelector value={currentPreset} onChange={handlePresetChange} />

      {currentPreset !== "none" && (
        <>
          <div className="space-y-3 p-3 bg-background-tertiary rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={12} className="text-text-muted" />
              <span className="text-[10px] text-text-secondary font-medium">
                Timing
              </span>
            </div>

            <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">In Duration</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {inDuration.toFixed(1)}
            s
          </span>
        </div>
        <Slider
          value={inDuration}
          onChange={(values) => handleInDurationChange(values)}
          min={0}
          max={5}
          step={0.1}
          className="h-1.5"
        />
      </div>
             <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Out Duration</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {outDuration.toFixed(1)}
            s
          </span>
        </div>
        <Slider
          value={outDuration}
          onChange={(values) => handleOutDurationChange(values)}
          min={0}
          max={5}
          step={0.1}
          className="h-1.5"
        />
        </div>
          </div>
          <div className="p-3 bg-background-tertiary rounded-lg">
            <EasingSelector value={easing} onChange={handleEasingChange} />
          </div>

          <div className="p-3 bg-background-secondary rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Play size={12} className="text-text-muted" />
              <span className="text-[10px] text-text-secondary font-medium">
                Preview
              </span>
            </div>
            <p className="text-[9px] text-text-muted">
              Animation will play during preview and export. Total animation
              time: {(inDuration + outDuration).toFixed(1)}s
            </p>
          </div>
        </>
      )}

      {currentPreset === "fade" && (
        <FadeParams clipId={clipId} animation={textClip.animation} />
      )}

      {(currentPreset === "slide-left" ||
        currentPreset === "slide-right" ||
        currentPreset === "slide-up" ||
        currentPreset === "slide-down") && (
        <SlideParams clipId={clipId} animation={textClip.animation} />
      )}

      {currentPreset === "scale" && (
        <ScaleParams clipId={clipId} animation={textClip.animation} />
      )}

      {currentPreset === "bounce" && (
        <BounceParams clipId={clipId} animation={textClip.animation} />
      )}

      {currentPreset === "rotate" && (
        <RotateParams clipId={clipId} animation={textClip.animation} />
      )}

      {currentPreset === "wave" && (
        <WaveParams clipId={clipId} animation={textClip.animation} />
      )}

      {currentPreset === "shake" && (
        <ShakeParams clipId={clipId} animation={textClip.animation} />
      )}

      {currentPreset === "pop" && (
        <PopParams clipId={clipId} animation={textClip.animation} />
      )}

      {currentPreset === "glitch" && (
        <GlitchParams clipId={clipId} animation={textClip.animation} />
      )}
    </div>
  );
};

const FadeParams: React.FC<{
  clipId: string;
  animation?: { params?: TextAnimationParams };
}> = ({ clipId, animation }) => {
  const { applyTextAnimationPreset, getTextClip } = useProjectStore();
  const textClip = getTextClip(clipId);

  const startOpacity = animation?.params?.fadeOpacity?.start ?? 0;
  const endOpacity = animation?.params?.fadeOpacity?.end ?? 1;

  const handleChange = (start: number, end: number) => {
    if (!textClip?.animation) return;
    applyTextAnimationPreset(
      clipId,
      "fade",
      textClip.animation.inDuration,
      textClip.animation.outDuration,
      { fadeOpacity: { start, end } },
    );
  };

  return (
    <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
      <span className="text-[10px] text-text-secondary font-medium">
        Fade Settings
      </span>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Start Opacity</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {startOpacity.toFixed(1)}
          </span>
        </div>
        <Slider
          value={startOpacity}
          onChange={(values) => handleChange(values, endOpacity)}
          min={0}
          max={1}
          step={0.1}
          className="h-1.5"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">End Opacity</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {endOpacity.toFixed(1)}
          </span>
        </div>
        <Slider
          value={endOpacity}
          onChange={(values) => handleChange(startOpacity, values)}
          min={0}
          max={1}
          step={0.1}
          className="h-1.5"
        />
      </div>
    </div>
  );
};

const SlideParams: React.FC<{
  clipId: string;
  animation?: { params?: TextAnimationParams; preset?: TextAnimationPreset };
}> = ({ clipId, animation }) => {
  const { applyTextAnimationPreset, getTextClip } = useProjectStore();
  const textClip = getTextClip(clipId);

  const slideDistance = animation?.params?.slideDistance ?? 0.2;

  const handleChange = (distance: number) => {
    if (!textClip?.animation) return;
    applyTextAnimationPreset(
      clipId,
      textClip.animation.preset,
      textClip.animation.inDuration,
      textClip.animation.outDuration,
      { slideDistance: distance },
    );
  };

  return (
    <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
      <span className="text-[10px] text-text-secondary font-medium">
        Slide Settings
      </span>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Distance</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            { slideDistance.toFixed(1)}
          </span>
        </div>
        <Slider
          value={slideDistance}
          onChange={(values) => handleChange(values)}
          min={0.05}
          max={1}
          step={0.05}
          className="h-1.5"
        />
      </div>
    </div>
  );
};

const ScaleParams: React.FC<{
  clipId: string;
  animation?: { params?: TextAnimationParams };
}> = ({ clipId, animation }) => {
  const { applyTextAnimationPreset, getTextClip } = useProjectStore();
  const textClip = getTextClip(clipId);

  const scaleFrom = animation?.params?.scaleFrom ?? 0;
  const scaleTo = animation?.params?.scaleTo ?? 1;

  const handleChange = (from: number, to: number) => {
    if (!textClip?.animation) return;
    applyTextAnimationPreset(
      clipId,
      "scale",
      textClip.animation.inDuration,
      textClip.animation.outDuration,
      { scaleFrom: from, scaleTo: to },
    );
  };

  return (
    <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
      <span className="text-[10px] text-text-secondary font-medium">
        Scale Settings
      </span>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Scale From</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {scaleFrom.toFixed(1)}x
          </span>
        </div>
        <Slider
          value={scaleFrom}
          onChange={(values) => handleChange(values, scaleTo)}
          min={0}
          max={2}
          step={0.1}
          className="h-1.5"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Scale To</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {scaleTo.toFixed(1)}x
          </span>
        </div>
        <Slider
          value={scaleTo}
          onChange={(values) => handleChange(scaleFrom, values)}
          min={0}
          max={2}
          step={0.1}
          className="h-1.5"
        />
      </div>
    </div>
  );
};

const BounceParams: React.FC<{
  clipId: string;
  animation?: { params?: TextAnimationParams };
}> = ({ clipId, animation }) => {
  const { applyTextAnimationPreset, getTextClip } = useProjectStore();
  const textClip = getTextClip(clipId);

  const bounceHeight = animation?.params?.bounceHeight ?? 0.1;
  const bounceCount = animation?.params?.bounceCount ?? 3;

  const handleChange = (height: number, count: number) => {
    if (!textClip?.animation) return;
    applyTextAnimationPreset(
      clipId,
      "bounce",
      textClip.animation.inDuration,
      textClip.animation.outDuration,
      { bounceHeight: height, bounceCount: count },
    );
  };

  return (
    <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
      <span className="text-[10px] text-text-secondary font-medium">
        Bounce Settings
      </span>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Height</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {bounceHeight.toFixed(2)}
          </span>
        </div>
        <Slider
          value={bounceHeight}
          onChange={(values) => handleChange(values, bounceCount)}
          min={0.01}
          max={0.5}
          step={0.01}
          className="h-1.5"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Bounces</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {Math.round(bounceCount)}
          </span>
        </div>
        <Slider
          value={bounceCount}
          onChange={(values) => handleChange(bounceHeight, Math.round(values))}
          min={1}
          max={10}
          step={1}
          className="h-1.5"
        />
      </div>
    </div>
  );
};

const RotateParams: React.FC<{
  clipId: string;
  animation?: { params?: TextAnimationParams };
}> = ({ clipId, animation }) => {
  const { applyTextAnimationPreset, getTextClip } = useProjectStore();
  const textClip = getTextClip(clipId);

  const rotateAngle = animation?.params?.rotateAngle ?? 360;

  const handleChange = (angle: number) => {
    if (!textClip?.animation) return;
    applyTextAnimationPreset(
      clipId,
      "rotate",
      textClip.animation.inDuration,
      textClip.animation.outDuration,
      { rotateAngle: angle },
    );
  };

  return (
    <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
      <span className="text-[10px] text-text-secondary font-medium">
        Rotate Settings
      </span>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Angle</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {rotateAngle}°
          </span>
        </div>
        <Slider
          value={rotateAngle}
          onChange={handleChange}
          min={-720}
          max={720}
          step={15}
          className="h-1.5"
        />
      </div>
    </div>
  );
};

const WaveParams: React.FC<{
  clipId: string;
  animation?: { params?: TextAnimationParams };
}> = ({ clipId, animation }) => {
  const { applyTextAnimationPreset, getTextClip } = useProjectStore();
  const textClip = getTextClip(clipId);

  const waveAmplitude = animation?.params?.waveAmplitude ?? 0.02;
  const waveFrequency = animation?.params?.waveFrequency ?? 2;

  const handleChange = (amplitude: number, frequency: number) => {
    if (!textClip?.animation) return;
    applyTextAnimationPreset(
      clipId,
      "wave",
      textClip.animation.inDuration,
      textClip.animation.outDuration,
      { waveAmplitude: amplitude, waveFrequency: frequency },
    );
  };

  return (
    <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
      <span className="text-[10px] text-text-secondary font-medium">
        Wave Settings
      </span>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Amplitude</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {waveAmplitude.toFixed(3)}
          </span>
        </div>
        <Slider
          value={waveAmplitude}
          onChange={(values) => handleChange(values, waveFrequency)}
          min={0.005}
          max={0.1}
          step={0.005}
          className="h-1.5"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Frequency</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {waveFrequency}
          </span>
        </div>
        <Slider
          value={waveFrequency}
          onChange={(values) => handleChange(waveAmplitude, values)}
          min={0.5}
          max={5}
          step={0.5}
          className="h-1.5"
        />
      </div>
    </div>
  );
};

const ShakeParams: React.FC<{
  clipId: string;
  animation?: { params?: TextAnimationParams };
}> = ({ clipId, animation }) => {
  const { applyTextAnimationPreset, getTextClip } = useProjectStore();
  const textClip = getTextClip(clipId);

  const shakeIntensity = animation?.params?.shakeIntensity ?? 0.01;
  const shakeSpeed = animation?.params?.shakeSpeed ?? 20;

  const handleChange = (intensity: number, speed: number) => {
    if (!textClip?.animation) return;
    applyTextAnimationPreset(
      clipId,
      "shake",
      textClip.animation.inDuration,
      textClip.animation.outDuration,
      { shakeIntensity: intensity, shakeSpeed: speed },
    );
  };

  return (
    <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
      <span className="text-[10px] text-text-secondary font-medium">
        Shake Settings
      </span>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Intensity</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {shakeIntensity.toFixed(3)}
          </span>
        </div>
        <Slider
          value={shakeIntensity}
          onChange={(values) => handleChange(values, shakeSpeed)}
          min={0.001}
          max={0.05}
          step={0.001}
          className="h-1.5"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Speed</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {shakeSpeed}
          </span>
        </div>
        <Slider
          value={shakeSpeed}
          onChange={(values) => handleChange(shakeIntensity, values)}
          min={5}
          max={50}
          step={5}
          className="h-1.5"
        />
      </div>
    </div>
  );
};

const PopParams: React.FC<{
  clipId: string;
  animation?: { params?: TextAnimationParams };
}> = ({ clipId, animation }) => {
  const { applyTextAnimationPreset, getTextClip } = useProjectStore();
  const textClip = getTextClip(clipId);

  const popOvershoot = animation?.params?.popOvershoot ?? 1.2;

  const handleChange = (overshoot: number) => {
    if (!textClip?.animation) return;
    applyTextAnimationPreset(
      clipId,
      "pop",
      textClip.animation.inDuration,
      textClip.animation.outDuration,
      { popOvershoot: overshoot },
    );
  };

  return (
    <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
      <span className="text-[10px] text-text-secondary font-medium">
        Pop Settings
      </span>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Overshoot</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {popOvershoot.toFixed(2)}x
          </span>
        </div>
        <Slider
          value={popOvershoot}
          onChange={handleChange}
          min={1}
          max={2}
          step={0.05}
          className="h-1.5"
        />
      </div>
    </div>
  );
};

const GlitchParams: React.FC<{
  clipId: string;
  animation?: { params?: TextAnimationParams };
}> = ({ clipId, animation }) => {
  const { applyTextAnimationPreset, getTextClip } = useProjectStore();
  const textClip = getTextClip(clipId);

  const glitchIntensity = animation?.params?.glitchIntensity ?? 0.02;
  const glitchSpeed = animation?.params?.glitchSpeed ?? 10;

  const handleChange = (intensity: number, speed: number) => {
    if (!textClip?.animation) return;
    applyTextAnimationPreset(
      clipId,
      "glitch",
      textClip.animation.inDuration,
      textClip.animation.outDuration,
      { glitchIntensity: intensity, glitchSpeed: speed },
    );
  };

  return (
    <div className="space-y-2 p-3 bg-background-tertiary rounded-lg">
      <span className="text-[10px] text-text-secondary font-medium">
        Glitch Settings
      </span>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Intensity</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {glitchIntensity.toFixed(3)}
          </span>
        </div>
        <Slider
          value={glitchIntensity}
          onChange={(values) => handleChange(values, glitchSpeed)}
          min={0.005}
          max={0.1}
          step={0.005}
          className="h-1.5"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Speed</span>
          <span className="text-[10px] font-mono text-text-primary bg-background-tertiary px-1.5 py-0.5 rounded border border-border">
            {glitchSpeed}
          </span>
        </div>
        <Slider
          value={glitchSpeed}
          onChange={(values) => handleChange(glitchIntensity, values)}
          min={1}
          max={30}
          step={1}
          className="h-1.5"
        />
      </div>
    </div>
  );
};

export default TextAnimationSection;
