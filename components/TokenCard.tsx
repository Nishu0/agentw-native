import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { black } from "@/constants/Colors";
import { IToken } from "@/types/wallet";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TokenCard({ token }: { token: IToken }) {
  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image source={{ uri: token.image }} style={styles.assetImage} />
        <View
          style={{
            maxWidth: 200,
          }}
        >
          <Heading numberOfLines={1} style={styles.assetName}>
            {token.name}
          </Heading>
          <Paragraph
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: black[200],
            }}
          >
            {token.balance} {token.symbol}
          </Paragraph>
        </View>
      </View>
      <Heading style={styles.assetName}>${token.price}</Heading>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "flex-start",
  },
  assetImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  assetName: {
    fontSize: 18,
    fontWeight: "700",
  },
});
