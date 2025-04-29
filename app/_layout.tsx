// Import polyfill only once at the very beginning
import '../polyfill';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";


export default function RootLayout() {
  const [loaded, error] = useFonts({
    SF_Regular: require("../assets/fonts/SF-Pro-Rounded-Regular.otf"),
    SF_Medium: require("../assets/fonts/SF-Pro-Rounded-Medium.otf"),
    SF_Semibold: require("../assets/fonts/SF-Pro-Rounded-Semibold.otf"),
    SF_Bold: require("../assets/fonts/SF-Pro-Rounded-Bold.otf"),
    SF_Heavy: require("../assets/fonts/SF-Pro-Rounded-Heavy.otf"),
    SF_Black: require("../assets/fonts/SF-Pro-Rounded-Black.otf"),
    Inter_Regular: require("../assets/fonts/Inter-Regular.ttf"),
    Inter_Medium: require("../assets/fonts/Inter-Medium.ttf"),
    Inter_SemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    Inter_Bold: require("../assets/fonts/Inter-Bold.ttf"),
    Inter_ExtraBold: require("../assets/fonts/Inter-ExtraBold.ttf"),
    Inter_Black: require("../assets/fonts/Inter-Black.ttf"),
    ...FontAwesome.font,
  });
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <BottomSheetModalProvider>
        <RootLayoutNav />
      </BottomSheetModalProvider>
    </>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="explore" options={{ headerShown: false }} />
      <Stack.Screen
        name="backup"
        options={{ headerShown: true, title: "", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="import"
        options={{ headerShown: true, title: "", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="import-privatekey"
        options={{ headerShown: true, title: "", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="import-seed"
        options={{ headerShown: true, title: "", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="import-success"
        options={{ headerShown: true, title: "", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          title: "Settings",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="activeDCA"
        options={{ headerShown: true, title: "", headerBackTitle: "Back" }}
      />
    </Stack>
  );
}
