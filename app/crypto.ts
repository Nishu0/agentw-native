import { Platform } from "react-native";
import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto";

// Polyfill crypto.getRandomValues for React Native
if (Platform.OS !== "web" && !global.crypto) {
  global.crypto = {
    getRandomValues: function (buffer: Uint8Array) {
      return expoCryptoGetRandomValues(buffer);
    },
  } as Crypto;
}