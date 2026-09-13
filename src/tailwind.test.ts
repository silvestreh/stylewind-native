const preset = require('../tailwind.cjs');
const resolveConfig = require('tailwindcss/resolveConfig');
const { createContext } = require('tailwindcss/lib/lib/setupContextUtils');
const { generateRules } = require('tailwindcss/lib/lib/generateRules');
const { create: createTwrnc } = jest.requireActual('twrnc');
const { SAFE_AREA_CLASSES } = require('./index');

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

function cssFor(context: any, candidate: string): string {
  return generateRules(new Set([candidate]), context)
    .map(([, rule]: [unknown, { toString(): string }]) =>
      rule.toString().replace(/\s+/g, ' ')
    )
    .join(' | ');
}

describe('styledwind-native/tailwind preset', () => {
  it('lists the same safe-area classes the runtime handles', () => {
    expect(preset.safeAreaClasses).toEqual(SAFE_AREA_CLASSES);
    expect(preset.deviceVariants).toEqual(DEVICE_VARIANTS);
  });

  describe('under Tailwind (editor tooling)', () => {
    const context = createContext(
      resolveConfig({ content: [], presets: [preset] })
    );

    it('registers the device prefixes twrnc evaluates at runtime', () => {
      const variants = context.getVariants().map((v: { name: string }) => v.name);

      for (const variant of DEVICE_VARIANTS) {
        expect(variants).toContain(variant);
      }
      expect(cssFor(context, 'ios:mt-2')).toContain('margin-top');
    });

    it('registers the safe variant and utilities so safe:* completes', () => {
      const variants = context.getVariants().map((v: { name: string }) => v.name);
      const classList = context.getClassList();

      expect(variants).toContain('safe');
      for (const className of SAFE_AREA_CLASSES) {
        const utility = className.replace(/^safe:/, '');
        expect(classList).toContain(utility);
        expect(cssFor(context, className)).toContain('env(safe-area-inset-');
      }
      expect(cssFor(context, 'safe:pt')).toBe(
        '.safe\\:pt { padding-top: env(safe-area-inset-top) }'
      );
    });
  });

  describe('under twrnc (runtime)', () => {
    let warn: jest.SpyInstance;

    beforeEach(() => {
      warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      warn.mockRestore();
    });

    it('does not throw on the reduced plugin API', () => {
      expect(() => createTwrnc({ presets: [preset] })).not.toThrow();
    });

    it('turns safe:* into no-ops and leaves prefixes to twrnc', () => {
      const tw = createTwrnc({ presets: [preset] });

      expect(tw`safe:pt safe:w-right mt-2`).toEqual({ marginTop: 8 });
      expect(tw`ios:mt-2 android:mt-4`).toEqual({ marginTop: 8 }); // jest runs as ios
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
