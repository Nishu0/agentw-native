import { ChartNoAxesColumn, Clock, Bot, CircleUserRound} from "lucide-react-native"
import { ScanIcon, SettingsIcon, WalletIcon, WalletOutline } from "@/components/Icons";
import ScannerSheet from "@/components/ScannerSheet";
import Sheet from "@/components/Sheet";
import { black, white } from "@/constants/Colors";
import useWalletStore from "@/store/wallet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Tabs, useRouter } from "expo-router";
import React, { useRef } from "react";
import { TouchableOpacity } from "react-native";

const TABS = [
  {
    name: "dca",
    label: "DCA",
    activeIcon: <Bot width={26} height={26} color={black[700]} />,
    inactiveIcon: <Bot width={26} height={26} color={white[200]} />,
  },
  {
    name: "limit",
    label: "Limit",
    activeIcon: <ChartNoAxesColumn width={26} height={26} color={black[700]} />,
    inactiveIcon: <ChartNoAxesColumn width={26} height={26} color={white[200]} />,
  },
  {
    name: "index",
    label: "Index",
    activeIcon: <WalletIcon width={26} height={26} color={black[700]} />,
    inactiveIcon: <WalletOutline width={26} height={26} color={white[200]} />,
  },
  {
    name: "bridge",
    label: "Bridge",
    activeIcon: <CircleUserRound width={26} height={26} color={black[700]} />,
    inactiveIcon: <CircleUserRound width={26} height={26} color={white[200]} />,
  },
  {
    name: "activity",
    label: "Activity",
    activeIcon: <Clock width={26} height={26} color={black[700]} />,
    inactiveIcon: <Clock width={26} height={26} color={white[200]} />,
  },
];

export default function TabLayout() {
  const { currentWallet } = useWalletStore();
  const router = useRouter();
  const scannerRef = useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["60%", "90%"], []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "red",
          tabBarShowLabel: false,
          headerShadowVisible: false,
          headerTitle: currentWallet?.name,
          headerRight: () => (
            <TouchableOpacity
              style={{
                paddingHorizontal: 24,
                paddingVertical: 8,
              }}
              onPress={() => {
                scannerRef.current?.present();
              }}
            >
              <ScanIcon width={20} height={20} color={black[700]} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={{
                paddingHorizontal: 24,
                paddingVertical: 8,
              }}
              onPress={() => {
                router.push("/settings" as any);
              }}
            >
              <SettingsIcon width={24} height={24} color={black[700]} />
            </TouchableOpacity>
          ),
        }}
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
      <Sheet ref={scannerRef} snapPoints={snapPoints}>
        <ScannerSheet />
      </Sheet>
    </>
  );
}
