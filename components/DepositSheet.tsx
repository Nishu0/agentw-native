import { CopyIcon } from "@/components/Icons";
import React from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import { Heading } from "./Heading";
import { Paragraph } from "./Paragraph";
import { black } from "@/constants/Colors";
import useWalletStore from "@/store/wallet";
import { formatAddress } from "@/utils/formatAddress";

export default function DepositSheet() {
  const { height, width } = useWindowDimensions();
  const { currentWallet } = useWalletStore();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Heading
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginTop: 24,
        }}
      >
        Deposit
      </Heading>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginTop: 12,
        }}
      >
        <Paragraph
          style={{
            fontWeight: "500",
            fontSize: 14,
            color: black[200],
          }}
        >
          {formatAddress(currentWallet?.publicKey!)}
        </Paragraph>
        <CopyIcon width={16} height={16} color={black[200]} />
      </TouchableOpacity>
      {currentWallet && (
        <QRCodeStyled
          data={currentWallet?.publicKey}
          style={{
            backgroundColor: "transparent",
            marginTop: 32,
          }}
          pieceSize={(height / width) * 4}
          color={black[200]}
          gradient={{
            options: {
              colors: ["black"],
            },
          }}
          outerEyesOptions={{
            borderRadius: 24,
          }}
          innerEyesOptions={{
            borderRadius: 8,
          }}
          pieceBorderRadius={6}
          logo={{
            href: require("../assets/images/icon.png"),
            padding: 0,
            scale: 1,
            hidePieces: true,
          }}
        />
      )}
    </View>
  );
}
