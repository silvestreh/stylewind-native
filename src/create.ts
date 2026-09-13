import { create as createTwrnc } from 'twrnc';
import { attachComponentFactories } from './components';
import { createColorScheme } from './color-scheme';
import type { StyledwindConfig, StyledwindInstance } from './types';

export function createStyledwind(config?: StyledwindConfig): StyledwindInstance {
  const twrnc = createTwrnc(config);
  const tw = attachComponentFactories(twrnc);
  const { Provider, useColorScheme } = createColorScheme(twrnc);

  return { tw, Provider, useColorScheme };
}
