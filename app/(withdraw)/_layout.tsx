// app/(withdraw)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function WithdrawLayout() {
  return (
    <Stack
      screenOptions={{
        // Hide the default navigation header that shows the URL
        headerShown: false,
        headerShadowVisible: false,
        headerTransparent: true,
        title: "",
        // Set black background for all screens in this group
        contentStyle: { backgroundColor: '#000000' },
        // Use slide animation for transitions
        animation: 'slide_from_right',
      }}
    />
  );
}