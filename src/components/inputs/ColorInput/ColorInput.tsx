import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import '../InputControl.css';
import './ColorInput.css';
import type { ColorInputProps } from './ColorInput.types';

type RgbColor = {
  b: number;
  g: number;
  r: number;
};

type HsvColor = {
  h: number;
  s: number;
  v: number;
};

type RgbChannel = keyof RgbColor;
type HsvChannel = keyof HsvColor;

const DEFAULT_COLOR = '#ff7300';
const RGB_CHANNELS: Array<{ id: RgbChannel; label: string }> = [
  { id: 'r', label: 'R' },
  { id: 'g', label: 'G' },
  { id: 'b', label: 'B' },
];
const HSV_CHANNELS: Array<{ id: HsvChannel; label: string; max: number }> = [
  { id: 'h', label: 'H', max: 360 },
  { id: 's', label: 'S', max: 100 },
  { id: 'v', label: 'V', max: 100 },
];
const DEFAULT_PRESET_COLORS = ['#05d671', '#ff7300', '#ffc800', '#ff3344', '#2458c7', '#4e8cff', '#ffffff', '#121212'];
const THEME_PRESET_TOKENS = [
  '--color-trading-positive',
  '--color-accent',
  '--color-trading-warning',
  '--color-trading-negative',
  '--color-trading-neutral',
  '--color-generated-base',
  '--color-foreground',
  '--color-background',
];
const FALLBACK_POPUP_DURATION_MS = 180;

function parseCssDuration(value: string, fallbackDuration: number): number {
  const trimmedValue = value.trim();
  const numericValue = Number.parseFloat(trimmedValue);

  if (!Number.isFinite(numericValue)) {
    return fallbackDuration;
  }

  return trimmedValue.endsWith('s') && !trimmedValue.endsWith('ms') ? numericValue * 1000 : numericValue;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getPopupDurationMs(): number {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return 0;
  }

  const cssValue = window.getComputedStyle(document.documentElement).getPropertyValue('--motion-duration-popup');
  return parseCssDuration(cssValue, FALLBACK_POPUP_DURATION_MS);
}

function clampValue(value: number, minValue: number, maxValue: number): number {
  return Math.min(Math.max(value, minValue), maxValue);
}

function isHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function getThemePresetColors() {
  if (typeof window === 'undefined') {
    return DEFAULT_PRESET_COLORS;
  }

  const rootStyles = window.getComputedStyle(document.documentElement);
  const presetColors = THEME_PRESET_TOKENS.map((token, index) => {
    const tokenValue = rootStyles.getPropertyValue(token).trim();
    return isHexColor(tokenValue) ? tokenValue.toLowerCase() : DEFAULT_PRESET_COLORS[index];
  });

  return Array.from(new Set(presetColors));
}

function toHexByte(value: number): string {
  return clampValue(Math.round(value), 0, 255).toString(16).padStart(2, '0');
}

function rgbToHex(color: RgbColor): string {
  return `#${toHexByte(color.r)}${toHexByte(color.g)}${toHexByte(color.b)}`;
}

function hexToRgb(value: string): RgbColor | null {
  if (!isHexColor(value)) {
    return null;
  }

  return {
    r: Number.parseInt(value.slice(1, 3), 16),
    g: Number.parseInt(value.slice(3, 5), 16),
    b: Number.parseInt(value.slice(5, 7), 16),
  };
}

function rgbToHsv(color: RgbColor): HsvColor {
  const red = color.r / 255;
  const green = color.g / 255;
  const blue = color.b / 255;
  const maxChannel = Math.max(red, green, blue);
  const minChannel = Math.min(red, green, blue);
  const delta = maxChannel - minChannel;
  let hue = 0;

  if (delta !== 0) {
    if (maxChannel === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (maxChannel === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  return {
    h: hue < 0 ? hue + 360 : hue,
    s: maxChannel === 0 ? 0 : (delta / maxChannel) * 100,
    v: maxChannel * 100,
  };
}

function hsvToRgb(color: HsvColor): RgbColor {
  const hue = ((color.h % 360) + 360) % 360;
  const saturation = clampValue(color.s, 0, 100) / 100;
  const value = clampValue(color.v, 0, 100) / 100;
  const chroma = value * saturation;
  const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = value - chroma;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = chroma;
    green = secondary;
  } else if (hue < 120) {
    red = secondary;
    green = chroma;
  } else if (hue < 180) {
    green = chroma;
    blue = secondary;
  } else if (hue < 240) {
    green = secondary;
    blue = chroma;
  } else if (hue < 300) {
    red = secondary;
    blue = chroma;
  } else {
    red = chroma;
    blue = secondary;
  }

  return {
    r: (red + match) * 255,
    g: (green + match) * 255,
    b: (blue + match) * 255,
  };
}

function getChannelInputValue(value: string, maxValue: number): number | null {
  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) ? clampValue(parsedValue, 0, maxValue) : null;
}

export function ColorInput({ ariaLabel, disabled, label, onValueChange, value = DEFAULT_COLOR, ...inputProps }: ColorInputProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isPickerRendered, setIsPickerRendered] = useState(false);
  const generatedInputId = useId();
  const inputId = inputProps.id ?? generatedInputId;
  const rootRef = useRef<HTMLDivElement>(null);
  const safeValue = isHexColor(value) ? value.toLowerCase() : DEFAULT_COLOR;
  const rgbValue = useMemo(() => hexToRgb(safeValue) ?? hexToRgb(DEFAULT_COLOR), [safeValue]);
  const hsvValue = useMemo(() => rgbToHsv(rgbValue ?? { b: 0, g: 0, r: 0 }), [rgbValue]);
  const presetColors = getThemePresetColors();
  const colorStyle = {
    '--color-input-brightness': hsvValue.v,
    '--color-input-current': safeValue,
    '--color-input-hue': hsvValue.h,
    '--color-input-saturation': hsvValue.s,
  } as CSSProperties;

  useEffect(() => {
    if (disabled) {
      setIsPickerOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (isPickerOpen) {
      setIsPickerRendered(true);
      return undefined;
    }

    if (!isPickerRendered) {
      return undefined;
    }

    const popupDuration = getPopupDurationMs();

    if (popupDuration === 0) {
      setIsPickerRendered(false);
      return undefined;
    }

    const closeTimer = window.setTimeout(() => setIsPickerRendered(false), popupDuration);
    return () => window.clearTimeout(closeTimer);
  }, [isPickerOpen, isPickerRendered]);

  useEffect(() => {
    if (!isPickerOpen) {
      return undefined;
    }

    function handleDocumentPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    }

    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsPickerOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [isPickerOpen]);

  function commitColor(nextColor: string) {
    onValueChange?.(nextColor.toLowerCase());
  }

  function updateHsv(nextColor: Partial<HsvColor>) {
    commitColor(
      rgbToHex(
        hsvToRgb({
          ...hsvValue,
          ...nextColor,
        }),
      ),
    );
  }

  function updateSaturationBrightness(event: ReactPointerEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const saturation = clampValue(((event.clientX - bounds.left) / bounds.width) * 100, 0, 100);
    const brightness = clampValue(100 - ((event.clientY - bounds.top) / bounds.height) * 100, 0, 100);

    updateHsv({ s: saturation, v: brightness });
  }

  function handleSaturationKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    const keyboardStep = event.shiftKey ? 10 : 2;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      updateHsv({ s: hsvValue.s - keyboardStep });
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      updateHsv({ s: hsvValue.s + keyboardStep });
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      updateHsv({ v: hsvValue.v - keyboardStep });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      updateHsv({ v: hsvValue.v + keyboardStep });
    }
  }

  function updateRgbChannel(channel: RgbChannel, channelValue: string) {
    const nextValue = getChannelInputValue(channelValue, 255);

    if (nextValue === null || !rgbValue) {
      return;
    }

    commitColor(
      rgbToHex({
        ...rgbValue,
        [channel]: nextValue,
      }),
    );
  }

  function updateHsvChannel(channel: HsvChannel, channelValue: string) {
    const channelDefinition = HSV_CHANNELS.find((currentChannel) => currentChannel.id === channel);
    const nextValue = getChannelInputValue(channelValue, channelDefinition?.max ?? 100);

    if (nextValue === null) {
      return;
    }

    updateHsv({ [channel]: nextValue });
  }

  return (
    <div className="input-field color-input" ref={rootRef} style={colorStyle}>
      {label ? (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <span className="input-field__control" data-disabled={disabled ? 'true' : undefined}>
        <Tooltip className="color-input__swatch-tooltip" content={`${isPickerOpen ? 'Close' : 'Open'} ${ariaLabel} picker`} placement="top" size="compact">
          <button
            aria-expanded={isPickerOpen}
            aria-haspopup="dialog"
            aria-label={`${ariaLabel} picker`}
            className="color-input__swatch-button"
            disabled={disabled}
            type="button"
            onClick={() => setIsPickerOpen((currentValue) => !currentValue)}
          >
            <span className="color-input__swatch" />
          </button>
        </Tooltip>
        <input
          {...inputProps}
          aria-label={ariaLabel}
          className="input-field__native"
          disabled={disabled}
          id={inputId}
          maxLength={7}
          spellCheck="false"
          value={value}
          onChange={(event) => onValueChange?.(event.target.value.trim().slice(0, 7))}
        />
      </span>

      {isPickerRendered && !disabled ? (
        <div className="color-input__popover" data-state={isPickerOpen ? 'open' : 'closed'} role="dialog" aria-label={`${ariaLabel} color picker`}>
          <button
            aria-label={`${ariaLabel} saturation and brightness`}
            className="color-input__saturation"
            type="button"
            onKeyDown={handleSaturationKeyDown}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updateSaturationBrightness(event);
            }}
            onPointerMove={(event) => {
              if (event.buttons === 1) {
                updateSaturationBrightness(event);
              }
            }}
          >
            <span className="color-input__saturation-thumb" />
          </button>

          <label className="color-input__hue-field">
            <span>Hue</span>
            <input
              aria-label={`${ariaLabel} hue`}
              className="color-input__hue"
              max="360"
              min="0"
              type="range"
              value={Math.round(hsvValue.h)}
              onChange={(event) => updateHsv({ h: Number(event.target.value) })}
            />
          </label>

          <div className="color-input__presets" aria-label="Color presets">
            {presetColors.map((presetColor) => (
              <button
                aria-label={`Use ${presetColor}`}
                className="color-input__preset"
                data-selected={presetColor === safeValue ? 'true' : undefined}
                key={presetColor}
                style={{ '--color-input-preset': presetColor } as CSSProperties}
                type="button"
                onClick={() => commitColor(presetColor)}
              />
            ))}
          </div>

          <div className="color-input__channel-group">
            <span className="color-input__channel-title">RGB</span>
            <div className="color-input__channels" role="group" aria-label="RGB channels">
              {RGB_CHANNELS.map((channel) => (
                <label className="color-input__channel" key={channel.id}>
                  <span>{channel.label}</span>
                  <input
                    inputMode="numeric"
                    maxLength={3}
                    pattern="[0-9]*"
                    type="text"
                    value={rgbValue?.[channel.id] ?? 0}
                    onChange={(event) => updateRgbChannel(channel.id, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="color-input__channel-group">
            <span className="color-input__channel-title">HSV</span>
            <div className="color-input__channels" role="group" aria-label="HSV channels">
              {HSV_CHANNELS.map((channel) => (
                <label className="color-input__channel" key={channel.id}>
                  <span>{channel.label}</span>
                  <input
                    inputMode="numeric"
                    maxLength={3}
                    pattern="[0-9]*"
                    type="text"
                    value={Math.round(hsvValue[channel.id])}
                    onChange={(event) => updateHsvChannel(channel.id, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export type { ColorInputProps };
