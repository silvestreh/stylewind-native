![styledwind-native](https://raw.githubusercontent.com/silvestreh/stylewind-native/refs/heads/main/.github/header.png)

# styledwind-native

> A tiny wrapper for [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames) that brings a familiar [`styled-components`](https://github.com/styled-components/styled-components)-like API to React Native, making it easy to apply dynamic Tailwind CSS styles while avoiding verbose inline styling.

## Description

`styledwind-native` is a lightweight utility designed to offer a familiar [`styled-components`](https://github.com/styled-components/styled-components) API on top of [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames) for React Native. It allows you to apply Tailwind utility classes in a clean, declarative manner, making your components more maintainable by avoiding excessive inline styles.

With `styledwind-native`, you can:
- Define React Native components with Tailwind utility classes using a concise API.
- Dynamically adjust styles based on component props.
- Seamlessly handle safe-area insets for modern devices.
- Keep your components cleaner and easier to maintain, while still leveraging the full power of Tailwind CSS and [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames).

## Features

- **Familiar API**: Styled-components-like API, so you can define your styles and components without verbose inline styles.
- **Tailwind CSS for React Native**: Leverages the power of [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames) to bring utility-first styling to your components.
- **Dynamic Styling with Props**: Conditionally apply styles based on props, making your components more flexible and reusable.
- **Support for Core React Native Components**: Easily style components like `View`, `Text`, `ScrollView`, and many more.
- **Safe-Area Insets Support**: Automatically adjust layouts for safe-area insets to handle notches and system bars on modern devices.
- **Fully Configurable**: Works seamlessly with your own Tailwind configuration via `tailwind.config.js`.


## Installation

To install `styledwind-native` along with [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames), run:

```bash
npm install styledwind-native twrnc
```

## Usage Example

Here's how you can use styledwind-native to create dynamically styled components:

```tsx
import React from 'react';
import tw from 'styledwind-native';

const Text = tw.Text<{ isBig?: boolean }>`
  text-base

  ${props => props.isBig && tw`text-2xl`}
`;

const MyComponent = () => {
  return (
    <Text isBig>
      This text is styled with Tailwind!
    </Text>
  );
};

export default MyComponent;
```

## Safe Areas

Use the `safe:*` utilities to read insets from
[`react-native-safe-area-context`](https://github.com/AppAndFlow/react-native-safe-area-context)
without wrapping anything:

```tsx
const Screen = tw.View`
  flex-1
  safe:pt
  safe:pb
`;
```

| Utility | Sets |
| --- | --- |
| `safe:pt` `safe:pb` `safe:pl` `safe:pr` | padding to the matching inset |
| `safe:mt` `safe:mb` `safe:ml` `safe:mr` | margin to the matching inset |
| `safe:top` `safe:bottom` `safe:left` `safe:right` | position offset to the matching inset |
| `safe:h-top` `safe:h-bottom` | height to the top / bottom inset |
| `safe:w-left` `safe:w-right` | width to the left / right inset |

> `tw.SafeAreaView` wraps React Native's `SafeAreaView`, which
> [was deprecated in React Native 0.81](https://reactnative.dev/blog/2025/08/12/react-native-0.81)
> and will be removed. It is marked `@deprecated` here too. Prefer `tw.View` with
> `safe:*` utilities, or pass `react-native-safe-area-context`'s `SafeAreaView` via
> the `component` prop.

## Loading Your Tailwind Config

By default, `styledwind-native` tries to load `tailwind.config.{js,ts,tsx,json}`
from your app's root. That lookup is path-based and only works when the package is
hoisted flat into your app's `node_modules` (plain npm or yarn). It does **not** work
with pnpm, in hoisted monorepos, or when your config lives somewhere else.

For those setups, or whenever you want to be explicit, create your own instance
and import it everywhere instead of the default export:

```ts
// src/tw.ts
import { createStyledwind } from 'styledwind-native';
import config from '../tailwind.config'; // .js or .ts, Metro resolves either

export const { tw, Provider, useColorScheme } = createStyledwind(config);
export default tw;
```

```tsx
import tw, { Provider, useColorScheme } from './tw';
```

`Provider` and `useColorScheme` returned by `createStyledwind` are bound to that
instance, so always use the ones from your own `tw` module rather than the ones
exported from the package root. Every instance is independent, which also makes
it easy to have more than one config or to test components in isolation.

## Provider Setup

To enable color scheme management, wrap your app with the `Provider` component:

```tsx
import React from 'react';
import { Provider } from 'styledwind-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  return (
    <Provider
      initialColorScheme="device" // 'light' | 'dark' | 'device'
      storage={AsyncStorage} // Optional: for persistent storage
    >
      {/* Your app content */}
    </Provider>
  );
}
```

## Color Scheme Management

`styledwind-native` provides built-in support for light/dark mode with automatic system detection.

### Using the `useColorScheme` Hook

```tsx
import { useColorScheme } from 'styledwind-native';

function SettingsScreen() {
  const {
    colorScheme,        // Current color scheme being used ('light' | 'dark')
    internalColorScheme, // User's preference ('light' | 'dark' | 'device')
    setColorScheme,     // Function to change color scheme
    toggleColorScheme   // Function to toggle between light/dark
  } = useColorScheme();

  return (
    <View>
      <Text>Current theme: {colorScheme}</Text>
      <Text>User preference: {internalColorScheme}</Text>

      <Button
        title="Light Mode"
        onPress={() => setColorScheme('light')}
      />
      <Button
        title="Dark Mode"
        onPress={() => setColorScheme('dark')}
      />
      <Button
        title="System Mode"
        onPress={() => setColorScheme('device')}
      />
      <Button
        title="Toggle Theme"
        onPress={toggleColorScheme}
      />
    </View>
  );
}
```

### Color Scheme Options

- **`'light'`**: Force light mode
- **`'dark'`**: Force dark mode
- **`'device'`**: Automatically follow the system's color scheme

### Using Dark Mode Classes

Style your components with Tailwind's dark mode utilities:

```tsx
const Card = tw.View`
  bg-white
  dark:bg-gray-800
  border-gray-200
  dark:border-gray-700
  p-4
  rounded-lg
`;

const Text = tw.Text`
  text-gray-900
  dark:text-white
`;
```

When set to `'device'` mode, the library automatically detects system color scheme changes and updates all styled components accordingly.

## Editor Autocomplete

Tailwind's language server only knows the classes in your Tailwind config, so
`ios:`, `android:`, `safe:pt` and friends don't autocomplete out of the box.
`styledwind-native` ships a Tailwind preset that adds them. Add it to your config:

```js
// tailwind.config.js
module.exports = {
  presets: [require('styledwind-native/tailwind')],
  // ...your theme
};
```

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import styledwind from 'styledwind-native/tailwind';

export default {
  presets: [styledwind],
  // ...your theme
} satisfies Config;
```

The preset registers:

- the device prefixes `twrnc` evaluates at runtime: `ios:`, `android:`, `web:`,
  `windows:`, `macos:`, `portrait:`, `landscape:` and `retina:`
- the safe-area utilities: `safe:pt`, `safe:pb`, `safe:pl`, `safe:pr`, `safe:mt`,
  `safe:mb`, `safe:ml`, `safe:mr`, `safe:top`, `safe:bottom`, `safe:left`,
  `safe:right`, `safe:h-top`, `safe:h-bottom`, `safe:w-left` and `safe:w-right`

It's safe to leave the preset in the config you pass to `createStyledwind` or that
`twrnc` picks up: at runtime it only marks the `safe:*` classes as known so `twrnc`
never warns about them.

Then teach the language server where your classes live. Both editors use the
[same language server](https://github.com/tailwindlabs/tailwindcss-intellisense),
only the settings key differs.

### VS Code

Add to your settings for the
[official Tailwind extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss):

```jsonc
// ...
"editor.quickSuggestions": {
  "strings": true // forces VS Code to trigger completions when editing "string" content
},
"tailwindCSS.classAttributes": [
  // ...
  "style"
],
"tailwindCSS.includeLanguages": {
  "typescript": "javascript", // if you are using typescript
  "typescriptreact": "javascript"  // if you are using typescript with react
},
"tailwindCSS.experimental.classRegex": [
  "tw`([^`]*)", // tw`...`
  "tw\\.[^`]+`([^`]*)`" // tw.xxx<xxx>`...`
],
```

### Zed

Zed ships [Tailwind support](https://zed.dev/docs/languages/tailwindcss) for
TypeScript and JavaScript out of the box. Add to your project's
`.zed/settings.json` (or your global `settings.json`):

```json
{
  "lsp": {
    "tailwindcss-language-server": {
      "settings": {
        "classAttributes": ["style"],
        "experimental": {
          "classRegex": ["tw`([^`]*)", "tw\\.[^`]+`([^`]*)`"]
        }
      }
    }
  }
}
```

More detailed instructions, including how to add snippets, are available
[here](https://github.com/jaredh159/tailwind-react-native-classnames/discussions/124).

## Why Use `styledwind-native`?

If you're building a React Native app and want to use Tailwind CSS for styling, `styledwind-native` simplifies the process by wrapping [`twrnc`](https://github.com/jaredh159/tailwind-react-native-classnames) with a [`styled-components`](https://github.com/styled-components/styled-components)-like API. This reduces the need for verbose inline styles, making your components cleaner, easier to read, and more maintainable.
