/** Subset of the Tailwind / twrnc plugin API this preset touches. */
export interface StyledwindPluginApi {
  addUtilities(utilities: Record<string, Record<string, string | number>>): void;
  addVariant?(name: string, definition: string | string[]): void;
  postcss?: unknown;
}

export interface StyledwindTailwindPreset {
  plugins: Array<{ handler: (api: StyledwindPluginApi) => void; config?: undefined }>;
  /** `safe:pt` … `safe:w-right`, in the order styledwind-native applies them. */
  readonly safeAreaClasses: readonly string[];
  /** Prefixes twrnc evaluates at runtime: `ios`, `android`, `portrait`, … */
  readonly deviceVariants: readonly string[];
}

declare const preset: StyledwindTailwindPreset;
export = preset;
