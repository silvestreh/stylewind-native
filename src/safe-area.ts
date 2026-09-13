import type { EdgeInsets } from 'react-native-safe-area-context';

export const SAFE_AREA_UTILITIES = {
  'safe:pt': ['paddingTop', 'top'],
  'safe:pb': ['paddingBottom', 'bottom'],
  'safe:pl': ['paddingLeft', 'left'],
  'safe:pr': ['paddingRight', 'right'],
  'safe:mt': ['marginTop', 'top'],
  'safe:mb': ['marginBottom', 'bottom'],
  'safe:ml': ['marginLeft', 'left'],
  'safe:mr': ['marginRight', 'right'],
  'safe:top': ['top', 'top'],
  'safe:bottom': ['bottom', 'bottom'],
  'safe:left': ['left', 'left'],
  'safe:right': ['right', 'right'],
  'safe:h-top': ['height', 'top'],
  'safe:h-bottom': ['height', 'bottom'],
  'safe:w-left': ['width', 'left'],
  'safe:w-right': ['width', 'right'],
} as const satisfies Record<string, readonly [string, keyof EdgeInsets]>;

export type SafeAreaClass = keyof typeof SAFE_AREA_UTILITIES;

export const SAFE_AREA_CLASSES = Object.keys(
  SAFE_AREA_UTILITIES
) as readonly SafeAreaClass[];

const SAFE_AREA_CLASS_SET: ReadonlySet<string> = new Set(SAFE_AREA_CLASSES);

export function parseTemplate(styles: TemplateStringsArray) {
  const tokens = new Set(styles.join(' ').split(/\s+/).filter(Boolean));
  const safeArea = SAFE_AREA_CLASSES.filter(className => tokens.has(className));
  const classNames = [...tokens]
    .filter(token => !SAFE_AREA_CLASS_SET.has(token))
    .join(' ');

  return { classNames, safeArea };
}
