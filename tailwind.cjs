'use strict';

/**
 * Tailwind preset for styledwind-native.
 *
 * Teaches editor tooling (Tailwind CSS IntelliSense in VS Code, Zed, and any
 * other tailwindcss-language-server client) about the class names that twrnc
 * and styledwind-native add on top of Tailwind:
 *
 *   - device prefixes evaluated by twrnc at runtime:
 *     ios: android: web: windows: macos: portrait: landscape: retina:
 *   - safe-area utilities evaluated by styledwind-native at runtime:
 *     safe:pt safe:pb safe:pl safe:pr safe:mt safe:mb safe:ml safe:mr
 *     safe:top safe:bottom safe:left safe:right
 *     safe:h-top safe:h-bottom safe:w-left safe:w-right
 *
 * Usage, in the app's tailwind.config.{js,cjs,ts}:
 *
 *   module.exports = {
 *     presets: [require('styledwind-native/tailwind')],
 *     // ...your theme
 *   };
 *
 * The preset is also safe in the config twrnc receives at runtime. twrnc runs
 * config plugins with a reduced API (no `addVariant`), so under twrnc the plugin
 * only registers the safe-area classes as no-op utilities and leaves prefix
 * handling to twrnc itself.
 */

const DEVICE_VARIANTS = [
  'ios',
  'android',
  'web',
  'windows',
  'macos',
  'portrait',
  'landscape',
  'retina',
];

/** Bare utility name -> CSS shown in editor previews. Order matters: it mirrors src/index.tsx. */
const SAFE_AREA_UTILITIES = {
  pt: { paddingTop: 'env(safe-area-inset-top)' },
  pb: { paddingBottom: 'env(safe-area-inset-bottom)' },
  pl: { paddingLeft: 'env(safe-area-inset-left)' },
  pr: { paddingRight: 'env(safe-area-inset-right)' },
  mt: { marginTop: 'env(safe-area-inset-top)' },
  mb: { marginBottom: 'env(safe-area-inset-bottom)' },
  ml: { marginLeft: 'env(safe-area-inset-left)' },
  mr: { marginRight: 'env(safe-area-inset-right)' },
  top: { top: 'env(safe-area-inset-top)' },
  bottom: { bottom: 'env(safe-area-inset-bottom)' },
  left: { left: 'env(safe-area-inset-left)' },
  right: { right: 'env(safe-area-inset-right)' },
  'h-top': { height: 'env(safe-area-inset-top)' },
  'h-bottom': { height: 'env(safe-area-inset-bottom)' },
  'w-left': { width: 'env(safe-area-inset-left)' },
  'w-right': { width: 'env(safe-area-inset-right)' },
};

const safeAreaClasses = Object.keys(SAFE_AREA_UTILITIES).map(
  utility => `safe:${utility}`
);

/**
 * twrnc calls plugin handlers with `postcss: null`; Tailwind passes the postcss
 * module (v3) or nothing at all (v4). Only an explicit null means twrnc.
 */
function isTwrnc(api) {
  return api.postcss === null;
}

function handler(api) {
  if (isTwrnc(api)) {
    // Register the safe-area classes as empty utilities so twrnc never treats
    // them as unknown. styledwind-native applies the real insets at render.
    api.addUtilities(
      Object.fromEntries(safeAreaClasses.map(className => [className, {}]))
    );
    return;
  }

  for (const variant of DEVICE_VARIANTS) {
    api.addVariant(variant, '&');
  }
  api.addVariant('safe', '&');

  api.addUtilities(
    Object.fromEntries(
      Object.entries(SAFE_AREA_UTILITIES).map(([utility, css]) => [
        `.${utility}`,
        css,
      ])
    )
  );
}

const preset = {
  plugins: [{ handler, config: undefined }],
};

// Exposed for tests and tooling without taking part in Tailwind's preset merge.
Object.defineProperty(preset, 'safeAreaClasses', {
  value: Object.freeze(safeAreaClasses),
});
Object.defineProperty(preset, 'deviceVariants', {
  value: Object.freeze(DEVICE_VARIANTS.slice()),
});

module.exports = preset;
