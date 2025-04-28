import 'react-native-get-random-values'
import { black } from "@/constants/Colors";
import useWalletData from "@/hooks/useWallet";
import useWalletStore from "@/store/wallet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function loader() {
  const router = useRouter();
  const { setWallets, setCurrentWallet } = useWalletStore();
  const { handleTokens } = useWalletData();

  async function handleWallets() {
    const wallets = await AsyncStorage.getItem("wallets");
    if (!wallets) {
      router.replace("/create");
    } else {
      setWallets(JSON.parse(wallets));
      setCurrentWallet(JSON.parse(wallets)[0]);
      await handleTokens();
      router.replace("/(tabs)/");
    }
  }

  React.useEffect(() => {
    handleWallets();
  }, []);

  return (
    <View
      style={{
        backgroundColor: black[800],
      }}
    >
      <Image
        source={require("../assets/images/splashscreen.png")}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}
