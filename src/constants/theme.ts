/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#262A1E',
    background: '#DFEAD5',
    bodyBackground: '#FAF6EC',
    backgroundElement: '#F6F2E6',
    backgroundSelected: '#E8E0CB',
    textSecondary: '#5B5942',
    accent: '#3E5C3B',
    accentText: '#FAF6EC',
    ochre: '#8C6A24',
    rust: '#8B3A2B',
    indigo: '#33427A',
    border: 'rgba(38,42,30,0.18)',
    headerBackground: '#A9C296',
  },
  dark: {
    text: '#EDE8D8',
    background: '#12160F',
    bodyBackground: '#12160F',
    backgroundElement: '#262E1F',
    backgroundSelected: '#33402B',
    textSecondary: '#B9B39A',
    accent: '#93B884',
    accentText: '#12160F',
    ochre: '#D9AD5E',
    rust: '#E08469',
    indigo: '#9AA8E8',
    border: 'rgba(237,232,216,0.20)',
    headerBackground: '#1E2B18',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ThemeColors = Record<ThemeColor, string>;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
