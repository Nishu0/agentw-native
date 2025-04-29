import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { black } from "@/constants/Colors";
import { IToken } from "@/types/wallet";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

// Default dark theme colors if none provided
const defaultDarkTheme = {
  text: "#FFFFFF",
  secondaryText: "#9CA3AF",
  background: "#000000",
  cardBackground: "#1E1E1E",
  border: "#333333",
};

export default function TokenCard({ 
  token, 
  darkTheme = defaultDarkTheme 
}: { 
  token: IToken;
  darkTheme?: any;
}) {
  // Format token price with commas and fixed decimal places
  const formattedPrice = parseFloat(token.price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Format token balance to show appropriate decimal places based on value
  const formattedBalance = parseFloat(token.balance) < 0.001 
    ? parseFloat(token.balance).toExponential(2) 
    : parseFloat(token.balance).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      });

  return (
    <View style={[styles.card, { borderBottomColor: darkTheme.border }]}>
      <View style={styles.leftContent}>
        <Image 
          source={{ uri: token.image }} 
          style={styles.assetImage} 
          contentFit="cover"
          transition={200}
        />
        <View style={styles.tokenInfo}>
          <Text 
            numberOfLines={1} 
            style={[styles.assetName, { color: darkTheme.text }]}
          >
            {token.name}
          </Text>
          <Text
            style={[styles.tokenSymbol, { color: darkTheme.secondaryText }]}
          >
            {formattedBalance} {token.symbol}
          </Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={[styles.priceText, { color: darkTheme.text }]}>
          ${formattedPrice}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingHorizontal: 4,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  assetImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A2A2A", // placeholder color while loading
  },
  tokenInfo: {
    maxWidth: 200,
  },
  assetName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  tokenSymbol: {
    fontSize: 14,
    fontWeight: "500",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
  },
});