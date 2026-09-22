export const DEFAULT_GENERATED_COLOR_SETTINGS = {
  hueStep: 137.50776405003785,
  saturationStep: 12,
  valueStep: 10,
  varySaturation: false,
  varyValue: false,
} as const;

/** @deprecated Use DEFAULT_GENERATED_COLOR_SETTINGS.hueStep instead. */
export const CATEGORICAL_HUE_STEP = DEFAULT_GENERATED_COLOR_SETTINGS.hueStep;

export type GeneratedColorSettings = {
  hueStep: number;
  saturationStep: number;
  valueStep: number;
  varySaturation: boolean;
  varyValue: boolean;
};

export type GeneratedColorRepeatRisk = {
  hueDrift: number;
  kind: 'exact' | 'near';
  repeatAfter: number;
};

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

const GENERATED_COLOR_THEME_TOKENS = {
  base: '--color-generated-base',
  hueStep: '--color-generated-hue-step',
  saturationStep: '--color-generated-saturation-step',
  valueStep: '--color-generated-value-step',
  varySaturation: '--color-generated-vary-saturation',
  varyValue: '--color-generated-vary-value',
} as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function wrapHue(hue: number) {
  return ((hue % 360) + 360) % 360;
}

function foldUnitInterval(value: number) {
  const wrapped = ((value % 2) + 2) % 2;
  return wrapped <= 1 ? wrapped : 2 - wrapped;
}

function hexToRgb(color: string): RgbColor | null {
  const match = /^#([0-9a-f]{6})$/i.exec(color.trim());

  if (!match) {
    return null;
  }

  const value = match[1];
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHsv({ b, g, r }: RgbColor): HsvColor {
  const normalizedRed = r / 255;
  const normalizedGreen = g / 255;
  const normalizedBlue = b / 255;
  const maximum = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const minimum = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const difference = maximum - minimum;
  let hue = 0;

  if (difference !== 0) {
    if (maximum === normalizedRed) {
      hue = 60 * (((normalizedGreen - normalizedBlue) / difference) % 6);
    } else if (maximum === normalizedGreen) {
      hue = 60 * ((normalizedBlue - normalizedRed) / difference + 2);
    } else {
      hue = 60 * ((normalizedRed - normalizedGreen) / difference + 4);
    }
  }

  return {
    h: wrapHue(hue),
    s: maximum === 0 ? 0 : difference / maximum,
    v: maximum,
  };
}

function toHexChannel(value: number) {
  return Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0');
}

function hsvToHex({ h, s, v }: HsvColor) {
  const chroma = v * s;
  const hueSection = wrapHue(h) / 60;
  const secondary = chroma * (1 - Math.abs((hueSection % 2) - 1));
  const match = v - chroma;
  const [red, green, blue] =
    hueSection < 1
      ? [chroma, secondary, 0]
      : hueSection < 2
        ? [secondary, chroma, 0]
        : hueSection < 3
          ? [0, chroma, secondary]
          : hueSection < 4
            ? [0, secondary, chroma]
            : hueSection < 5
              ? [secondary, 0, chroma]
              : [chroma, 0, secondary];

  return `#${toHexChannel((red + match) * 255)}${toHexChannel((green + match) * 255)}${toHexChannel((blue + match) * 255)}`;
}

function getFiniteNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readCssNumber(styles: CSSStyleDeclaration, token: string, fallback: number) {
  const value = Number.parseFloat(styles.getPropertyValue(token));
  return Number.isFinite(value) ? value : fallback;
}

function readCssBoolean(styles: CSSStyleDeclaration, token: string, fallback: boolean) {
  const value = styles.getPropertyValue(token).trim().toLowerCase();

  if (value === '1' || value === 'true') {
    return true;
  }

  if (value === '0' || value === 'false') {
    return false;
  }

  return fallback;
}

/** Normalizes user-provided settings before deriving a generated color. */
export function normalizeGeneratedColorSettings(settings?: Partial<GeneratedColorSettings>): GeneratedColorSettings {
  return {
    hueStep: clamp(getFiniteNumber(settings?.hueStep, DEFAULT_GENERATED_COLOR_SETTINGS.hueStep), 0, 360),
    saturationStep: clamp(getFiniteNumber(settings?.saturationStep, DEFAULT_GENERATED_COLOR_SETTINGS.saturationStep), 0, 100),
    valueStep: clamp(getFiniteNumber(settings?.valueStep, DEFAULT_GENERATED_COLOR_SETTINGS.valueStep), 0, 100),
    varySaturation: settings?.varySaturation === true,
    varyValue: settings?.varyValue === true,
  };
}

function getThemeGeneratedColorSettings(styles: CSSStyleDeclaration): GeneratedColorSettings {
  return normalizeGeneratedColorSettings({
    hueStep: readCssNumber(styles, GENERATED_COLOR_THEME_TOKENS.hueStep, DEFAULT_GENERATED_COLOR_SETTINGS.hueStep),
    saturationStep: readCssNumber(styles, GENERATED_COLOR_THEME_TOKENS.saturationStep, DEFAULT_GENERATED_COLOR_SETTINGS.saturationStep),
    valueStep: readCssNumber(styles, GENERATED_COLOR_THEME_TOKENS.valueStep, DEFAULT_GENERATED_COLOR_SETTINGS.valueStep),
    varySaturation: readCssBoolean(styles, GENERATED_COLOR_THEME_TOKENS.varySaturation, DEFAULT_GENERATED_COLOR_SETTINGS.varySaturation),
    varyValue: readCssBoolean(styles, GENERATED_COLOR_THEME_TOKENS.varyValue, DEFAULT_GENERATED_COLOR_SETTINGS.varyValue),
  });
}

function varyChannel(baseValue: number, step: number, index: number) {
  return foldUnitInterval(baseValue + index * (step / 100));
}

/**
 * Returns a stable generated color for an index. A golden-angle hue step is
 * used by default to spread colors across the wheel without a short cycle.
 * Saturation and value can optionally vary as a reflected 0–100% sequence.
 */
export function getGeneratedColor(baseColor: string, index: number, settings?: Partial<GeneratedColorSettings>) {
  const rgbColor = hexToRgb(baseColor);

  if (!rgbColor) {
    return baseColor;
  }

  const normalizedSettings = normalizeGeneratedColorSettings(settings);
  const colorIndex = Math.max(0, Math.trunc(index));
  const baseHsv = rgbToHsv(rgbColor);

  return hsvToHex({
    h: baseHsv.h + colorIndex * normalizedSettings.hueStep,
    s: normalizedSettings.varySaturation ? varyChannel(baseHsv.s, normalizedSettings.saturationStep, colorIndex) : baseHsv.s,
    v: normalizedSettings.varyValue ? varyChannel(baseHsv.v, normalizedSettings.valueStep, colorIndex) : baseHsv.v,
  });
}

function getGeneratedColorKeyIndex(key: string) {
  let hash = 2166136261;

  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/** Returns a deterministic generated color for a stable key, such as an ID. */
export function getGeneratedColorForKey(baseColor: string, key: string, settings?: Partial<GeneratedColorSettings>) {
  return getGeneratedColor(baseColor, getGeneratedColorKeyIndex(key), settings);
}

/**
 * Reports a short exact or near hue cycle. Near cycles are limited to the
 * first 48 colors because a close return after a very long sequence is not a
 * practical palette collision.
 */
export function getGeneratedColorRepeatRisk(hueStep: number): GeneratedColorRepeatRisk | null {
  const normalizedHueStep = wrapHue(hueStep);

  if (normalizedHueStep < 0.0001) {
    return { hueDrift: 0, kind: 'exact', repeatAfter: 1 };
  }

  const repeatAfter = Math.max(1, Math.round(360 / normalizedHueStep));
  const hueDrift = Math.abs(repeatAfter * normalizedHueStep - 360);

  if (hueDrift < 0.0001) {
    return { hueDrift, kind: 'exact', repeatAfter };
  }

  return hueDrift <= 4 && repeatAfter <= 48 ? { hueDrift, kind: 'near', repeatAfter } : null;
}

/** Reads theme settings and derives a generated color for an index. */
export function getThemeGeneratedColor(index: number, baseColorToken = GENERATED_COLOR_THEME_TOKENS.base) {
  if (typeof document === 'undefined') {
    return `var(${baseColorToken})`;
  }

  const styles = window.getComputedStyle(document.documentElement);
  const baseColor = styles.getPropertyValue(baseColorToken).trim();
  return getGeneratedColor(baseColor, index, getThemeGeneratedColorSettings(styles));
}

/** Reads theme settings and derives a deterministic generated color for a key. */
export function getThemeGeneratedColorForKey(key: string, baseColorToken = GENERATED_COLOR_THEME_TOKENS.base) {
  if (typeof document === 'undefined') {
    return `var(${baseColorToken})`;
  }

  const styles = window.getComputedStyle(document.documentElement);
  const baseColor = styles.getPropertyValue(baseColorToken).trim();
  return getGeneratedColorForKey(baseColor, key, getThemeGeneratedColorSettings(styles));
}

/** @deprecated Use getGeneratedColor instead. */
export function getCategoricalColor(baseColor: string, index: number, settings?: Partial<GeneratedColorSettings>) {
  return getGeneratedColor(baseColor, index, settings);
}

/** @deprecated Use getGeneratedColorForKey instead. */
export function getCategoricalColorForKey(baseColor: string, key: string, settings?: Partial<GeneratedColorSettings>) {
  return getGeneratedColorForKey(baseColor, key, settings);
}

/** @deprecated Use getThemeGeneratedColor instead. */
export function getThemeCategoricalColor(index: number, baseColorToken = GENERATED_COLOR_THEME_TOKENS.base) {
  return getThemeGeneratedColor(index, baseColorToken);
}

/** @deprecated Use getThemeGeneratedColorForKey instead. */
export function getThemeCategoricalColorForKey(key: string, baseColorToken = GENERATED_COLOR_THEME_TOKENS.base) {
  return getThemeGeneratedColorForKey(key, baseColorToken);
}
