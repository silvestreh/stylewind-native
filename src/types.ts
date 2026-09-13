import type React from 'react';
import type RN from 'react-native';
import type { TailwindFn, TwConfig, Style } from 'twrnc';

/* -------------------------------------------------------------------------- */
/*                                Color scheme                                */
/* -------------------------------------------------------------------------- */

export type ColorScheme = 'light' | 'dark';
export type ColorSchemePreference = ColorScheme | 'device';
/** @deprecated Use `ColorSchemePreference`. */
export type ColorSchemeType = ColorSchemePreference;

export interface ColorSchemeContextValue {
  colorScheme: ColorScheme;
  internalColorScheme: ColorSchemePreference;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorSchemePreference) => void;
}

export interface ColorSchemeStorage {
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  setItem(key: string, value: string): Promise<void>;
}

export interface ProviderProps {
  children: React.ReactNode;
  initialColorScheme?: ColorSchemePreference;
  storage?: ColorSchemeStorage;
}

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

/**
 * A twrnc config, optionally extended with Tailwind presets. Presets are merged
 * by Tailwind's own `resolveConfig`, which twrnc runs internally, so
 * `presets: [require('styledwind-native/tailwind')]` works at runtime too.
 */
export interface StyledwindConfig extends TwConfig {
  presets?: StyledwindConfig[];
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

export interface ImageProps extends RN.ImageProps {
  tintColor?: string;
}

/** Base props for every component created by `tw.X`. */
export type ComponentPropsMap = {
  ActivityIndicator: RN.ActivityIndicatorProps;
  AnimatedFlatList: RN.Animated.AnimatedProps<RN.FlatListProps<any>>;
  AnimatedImage: RN.Animated.AnimatedProps<ImageProps>;
  AnimatedScrollView: RN.Animated.AnimatedProps<RN.ScrollViewProps>;
  AnimatedSectionList: RN.Animated.AnimatedProps<RN.SectionListProps<any>>;
  AnimatedText: RN.Animated.AnimatedProps<RN.TextProps>;
  AnimatedView: RN.Animated.AnimatedProps<RN.ViewProps>;
  Button: RN.ButtonProps;
  FlatList: RN.FlatListProps<any>;
  Image: ImageProps;
  Modal: RN.ModalProps;
  /**
   * @deprecated React Native deprecated `SafeAreaView` in 0.81 and will remove
   * it. Use the `safe:*` utilities on `tw.View` (for example
   * `tw.View\`safe:pt safe:pb\``) or `SafeAreaView` from
   * `react-native-safe-area-context` via the `component` prop instead.
   */
  SafeAreaView: RN.ViewProps;
  ScrollView: RN.ScrollViewProps;
  SectionList: RN.SectionListProps<any>;
  StatusBar: RN.StatusBarProps;
  Switch: RN.SwitchProps;
  Text: RN.TextProps;
  TextInput: RN.TextInputProps;
  TouchableHighlight: RN.TouchableHighlightProps;
  TouchableNativeFeedback: RN.TouchableNativeFeedbackProps;
  TouchableOpacity: RN.TouchableOpacityProps;
  View: RN.ViewProps;
};

export type Interpolation<T> = (props: T) => false | Style | undefined;

export type StyledFactory<P> = <T = object>(
  styles: TemplateStringsArray,
  ...interpolations: Interpolation<T>[]
) => React.FC<P & T>;

export type TailwindComponents = TailwindFn & {
  [K in keyof ComponentPropsMap]: StyledFactory<ComponentPropsMap[K]>;
};

/** Everything `createStyledwind` returns, bound to one twrnc instance. */
export interface StyledwindInstance {
  tw: TailwindComponents;
  Provider: (props: ProviderProps) => React.JSX.Element;
  useColorScheme: () => ColorSchemeContextValue;
}
