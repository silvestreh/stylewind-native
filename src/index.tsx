import { createStyledwind } from './create';
import type { StyledwindConfig } from './types';

/**
 * Legacy config discovery for the default instance. Resolves relative to the
 * built file, which only lands on `<app>/tailwind.config.*` when the package is
 * hoisted flat into the app's node_modules. Prefer `createStyledwind(config)`.
 *
 * @deprecated
 */
function loadAppConfig(): StyledwindConfig | undefined {
  try {
    const mod = require('../../../tailwind.config'); // eslint-disable-line @typescript-eslint/no-require-imports
    return mod?.default ?? mod;
  } catch {
    return undefined;
  }
}

const defaultInstance = createStyledwind(loadAppConfig());

export const Provider = defaultInstance.Provider;
export const useColorScheme = defaultInstance.useColorScheme;

export { createStyledwind } from './create';
export { SAFE_AREA_CLASSES, type SafeAreaClass } from './safe-area';
export type {
  ColorScheme,
  ColorSchemeContextValue,
  ColorSchemePreference,
  ColorSchemeStorage,
  ColorSchemeType,
  ComponentPropsMap,
  Interpolation,
  ProviderProps,
  StyledFactory,
  StyledwindConfig,
  StyledwindInstance,
  TailwindComponents,
} from './types';

export * from 'twrnc';
export default defaultInstance.tw;
