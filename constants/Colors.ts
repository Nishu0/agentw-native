/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';


export const primary = "#8357FF";

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

const black = {
  100: "#5F6368",
  200: "#3C4043",
  300: "#2E3134",
  400: "#282A2D",
  500: "#202124",
  600: "#17181B",
  700: "#0E1013",
  800: "#000000",
};

const white = {
  100: "#80868B",
  200: "#9AA0A6",
  300: "#BDC1C6",
  400: "#DADCE0",
  500: "#E8EAED",
  600: "#F1F3F4",
  700: "#F8F9FA",
  800: "#FFFFFF",
};

export { black, white };
