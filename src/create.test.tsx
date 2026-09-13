// Uses the real twrnc instead of the mock from jest.setup.js.
jest.unmock('twrnc');

import React from 'react';
import { render } from '@testing-library/react-native';
import tw, { createStyledwind } from './index';

const brandConfig = {
  theme: { extend: { colors: { brand: '#123456' } } },
};

describe('createStyledwind', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('creates an instance bound to its own config', () => {
    const brand = createStyledwind(brandConfig);

    expect(brand.tw`bg-brand`).toEqual({ backgroundColor: '#123456' });
    // The default instance was created without that theme.
    expect(tw`bg-brand`).toEqual({});
  });

  it('exposes a tw object with component factories', () => {
    const { tw: brandTw } = createStyledwind(brandConfig);
    const Label = brandTw.Text`text-brand`;

    const { getByText } = render(<Label>hi</Label>);
    const style = getByText('hi').props.style.filter(Boolean);

    expect(style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: '#123456' })])
    );
  });

  it('keeps instances isolated from each other', () => {
    const a = createStyledwind({
      theme: { extend: { colors: { brand: '#aaaaaa' } } },
    });
    const b = createStyledwind({
      theme: { extend: { colors: { brand: '#bbbbbb' } } },
    });

    expect(a.tw`text-brand`).toEqual({ color: '#aaaaaa' });
    expect(b.tw`text-brand`).toEqual({ color: '#bbbbbb' });
    expect(a.Provider).not.toBe(b.Provider);
    expect(a.useColorScheme).not.toBe(b.useColorScheme);
  });

  it('accepts Tailwind presets', () => {
    const preset = require('../tailwind.cjs');
    const { tw: presetTw } = createStyledwind({
      presets: [preset, brandConfig],
    });

    expect(presetTw`bg-brand safe:pt`).toEqual({ backgroundColor: '#123456' });
    expect(warn).not.toHaveBeenCalled();
  });

  it('never hands safe-area or separator tokens to twrnc', () => {
    const Box = tw.View`
      flex-1
      ${() => false}
      opacity-50
      safe:pt safe:pb safe:pl safe:pr
      safe:mt safe:mb safe:ml safe:mr
      safe:top safe:bottom safe:left safe:right
      safe:h-top safe:h-bottom safe:w-left safe:w-right
    `;

    const { getByTestId } = render(<Box testID="box" />);
    const style = getByTestId('box').props.style.filter(Boolean);

    expect(style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flexGrow: 1, opacity: 0.5, paddingTop: 0 }),
      ])
    );
    // twrnc warns in __DEV__ about unknown utilities; nothing must reach it.
    expect(warn).not.toHaveBeenCalled();
  });
});
