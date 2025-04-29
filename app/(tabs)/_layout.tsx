import { ChartNoAxesColumn, Bot, Wallet } from "lucide-react-native";
import { ScanIcon, SettingsIcon } from "@/components/Icons";
import ScannerSheet from "@/components/ScannerSheet";
import Sheet from "@/components/Sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Tabs, useRouter } from "expo-router";
import React, { useRef } from "react";
import { TouchableOpacity, StyleSheet, View, StatusBar, Text } from "react-native";

// Define dark theme colors
const darkTheme = {
  background: "#000000",
  surface: "#111111",
  border: "#333333",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  accent: "#00BFFF",
  inactive: "#666666",
  tabBarBackground: "#111111",
  tabBarBorder: "#333333",
  headerBackground: "#000000",
};

const TABS = [
  {
    name: "wallet",
    label: "Wallet",
    activeIcon: <Wallet width={24} height={24} color={darkTheme.accent} />,
    inactiveIcon: <Wallet width={24} height={24} color={darkTheme.inactive} />,
  },
  {
    name: "activity",
    label: "Activity",
    activeIcon: <ChartNoAxesColumn width={24} height={24} color={darkTheme.accent} />,
    inactiveIcon: <ChartNoAxesColumn width={24} height={24} color={darkTheme.inactive} />,
  },
  {
    name: "chat",
    label: "Chat",
    activeIcon: <Bot width={24} height={24} color={darkTheme.accent} />,
    inactiveIcon: <Bot width={24} height={24} color={darkTheme.inactive} />,
  },
];

export default function TabLayout() {
  const router = useRouter();
  const scannerRef = useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["60%", "90%"], []);

  // Custom Tab Bar component
  const CustomTabBar = ({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) => {
    return (
      <View style={styles.tabBarContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tab = TABS[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              <View style={styles.tabContent}>
                {isFocused ? tab.activeIcon : tab.inactiveIcon}
                <Text style={[
                  styles.tabLabel,
                  { color: isFocused ? darkTheme.accent : darkTheme.inactive }
                ]}>
                  {tab.label}
                </Text>
              </View>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      <Tabs
        screenOptions={{
          // Completely hide the header for all screens in the tab navigator
          headerShown: false,
          tabBarStyle: {
            display: 'none', // Hide default tab bar as we're using custom
          },
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        {TABS.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              tabBarIcon: ({ focused }) =>
                focused ? tab.activeIcon : tab.inactiveIcon,
            }}
          />
        ))}
      </Tabs>
      <Sheet 
        ref={scannerRef} 
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: darkTheme.surface }}
        handleIndicatorStyle={{ backgroundColor: darkTheme.inactive }}
      >
        <ScannerSheet />
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: darkTheme.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: darkTheme.tabBarBorder,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 40,
    height: 3,
    backgroundColor: darkTheme.accent,
    borderRadius: 1.5,
  },
});