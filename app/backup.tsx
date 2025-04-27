import Button from "@/components/Button";
import Container from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { black, white } from "@/constants/Colors";
import useWalletStore from "@/store/wallet";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

function Word({ index, word }: { index: number; word: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
      }}
    >
      <Paragraph
        style={{
          fontSize: 20,
          fontWeight: "500",
          color: white[200],
          width: 24,
        }}
      >
        {index}
      </Paragraph>
      <Paragraph
        style={{
          fontSize: 20,
          fontWeight: "500",
          color: white[200],
        }}
      >
        {word}
      </Paragraph>
    </View>
  );
}

export default function Backup() {
  const { currentWallet, wallets } = useWalletStore();
  const router = useRouter();

  async function createWallet() {
    await AsyncStorage.setItem("wallets", JSON.stringify(wallets));
    router.replace("/(tabs)/");
  }

  return (
    <Container>
      <View
        style={{
          flex: 1,
          padding: 16,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Heading
            style={{
              fontSize: 36,
              fontWeight: "600",
              color: black[700],
            }}
          >
            Bro, Back it up
          </Heading>
          <Paragraph
            style={{
              fontSize: 20,
              fontWeight: "500",
              color: white[200],
              marginTop: 8,
            }}
          >
            Store your Secret Recovery Phrase in a safe location over which you
            have exclusive control.
          </Paragraph>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 64,
          }}
        >
          <View
            style={{
              gap: 8,
            }}
          >
            {[...Array(6)].map((el, index) => (
              <Word
                key={index}
                index={index + 1}
                word={currentWallet!.seed!.split(" ")[index]}
              />
            ))}
          </View>
          <View
            style={{
              gap: 8,
            }}
          >
            {[...Array(6)].map((el, index) => (
              <Word
                key={index}
                index={index + 7}
                word={currentWallet!.seed!.split(" ")[index + 6]}
              />
            ))}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.pasteButton}
            onPress={async () => {
              await Clipboard.setStringAsync(currentWallet!.seed!);
            }}
          >
            <Ionicons name="copy-outline" size={18} color="black" />
            <Heading style={styles.pasteButtonText}>Copy to Clipboard</Heading>
          </TouchableOpacity>
        </View>
        <Button onPress={createWallet}>Continue</Button>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  pasteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: white[600],
  },
  pasteButtonText: {
    marginLeft: 10,
    color: black[800],
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
});
