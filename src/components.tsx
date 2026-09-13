import React from 'react';
import RN from 'react-native';
import { useAppColorScheme, type TailwindFn, type Style } from 'twrnc';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { parseTemplate, SAFE_AREA_UTILITIES } from './safe-area';
import type {
  ComponentPropsMap,
  Interpolation,
  StyledFactory,
  TailwindComponents,
} from './types';

const baseComponents = {
  ActivityIndicator: RN.ActivityIndicator,
  AnimatedFlatList: RN.Animated.FlatList,
  AnimatedImage: RN.Animated.Image,
  AnimatedScrollView: RN.Animated.ScrollView,
  AnimatedSectionList: RN.Animated.SectionList,
  AnimatedText: RN.Animated.Text,
  AnimatedView: RN.Animated.View,
  Button: RN.Button,
  FlatList: RN.FlatList,
  Image: RN.Image,
  Modal: RN.Modal,
  SafeAreaView: RN.SafeAreaView,
  ScrollView: RN.ScrollView,
  SectionList: RN.SectionList,
  StatusBar: RN.StatusBar,
  Switch: RN.Switch,
  Text: RN.Text,
  TextInput: RN.TextInput,
  TouchableHighlight: RN.TouchableHighlight,
  TouchableNativeFeedback: RN.TouchableNativeFeedback,
  TouchableOpacity: RN.TouchableOpacity,
  View: RN.View,
} satisfies Record<keyof ComponentPropsMap, React.ComponentType<any>>;

interface TailwindComponentProps {
  children?: React.ReactNode;
  component?: React.ComponentType<any>;
  style?: RN.StyleProp<any>;
}

function createTailwindComponent<T = object>(
  twrnc: TailwindFn,
  Component: React.ComponentType<any>,
  styles: TemplateStringsArray,
  ...interpolations: Interpolation<T>[]
) {
  const { classNames, safeArea } = parseTemplate(styles);

  return React.forwardRef<any, TailwindComponentProps & T>(
    function TailwindComponent({ children, component, ...props }, ref) {
      // Subscribes this component to color scheme changes.
      useAppColorScheme(twrnc);

      let BaseComponent = Component;
      let baseStyle: RN.StyleProp<any> = null;

      if (typeof component === 'function') {
        baseStyle = component.defaultProps?.style;
        BaseComponent = component;
      }

      const insets = useSafeAreaInsets();
      let style: Style = { ...twrnc`${classNames}` };

      interpolations.forEach(interpolation => {
        const interpolatedStyle = interpolation(props as T);
        if (interpolatedStyle) {
          style = { ...style, ...interpolatedStyle };
        }
      });

      for (const className of safeArea) {
        const [prop, edge] = SAFE_AREA_UTILITIES[className];
        style[prop] = insets[edge];
      }

      return (
        <BaseComponent
          {...props}
          ref={ref}
          style={[baseStyle, style, props.style]}
        >
          {children}
        </BaseComponent>
      );
    }
  );
}

export function attachComponentFactories(
  twrnc: TailwindFn
): TailwindComponents {
  const factories = {} as Record<keyof ComponentPropsMap, StyledFactory<any>>;

  for (const [name, Component] of Object.entries(baseComponents)) {
    factories[name as keyof ComponentPropsMap] = (styles, ...interpolations) =>
      createTailwindComponent(twrnc, Component, styles, ...interpolations);
  }

  return Object.assign(twrnc, factories);
}
