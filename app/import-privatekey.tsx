import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import Container from "@/components/Container";
import { black, white } from "@/constants/Colors";
import bs58 from "bs58";
import useWalletStore from "@/store/wallet";
import { useRouter } from "expo-router";

export default function ImportPrivateKeyScreen() {
  const { setWallets, setCurrentWallet } = useWalletStore();
  const router = useRouter();

  async function handleWallet() {
    try {
      const privateKeyBytes = bs58.decode(privateKeyInput);
      const account = Account.fromPrivateKey({ privateKey: privateKeyBytes });
      const address = account.accountAddress.toString();
      const wallets = [
        {
          name: "wallet 1",
          seed: null,
          publicKey: address,
          secretKey: privateKeyInput,
        },
      ];
      setWallets(wallets);
      setCurrentWallet(wallets[0]);
      router.push("/import-success");
    } catch (error) {
      console.log(error);
      // Add error handling, e.g., show an alert to the user
    }
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
          <Heading style={styles.headerText}>Import Wallet</Heading>
          <Paragraph style={styles.subHeaderText}>
            Enter your Private key below to import your wallet.
          </Paragraph>
        </View>

        <LinearGradient
          colors={["#8357FF", "#7F7FD5"]}
          style={styles.gradientBox}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              paddingBottom: 8,
            }}
          >
            <TextInput
              style={{
                width: "100%",
                padding: 4,
                borderBottomWidth: 1,
                borderBottomColor: white[700],
                color: white[700],
                fontSize: 20,
              }}
              selectionColor={white[700]}
            />
          </View>
        </LinearGradient>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity style={styles.pasteButton}>
            <Ionicons name="copy-outline" size={18} color="black" />
            <Heading style={styles.pasteButtonText}>
              Paste from Clipboard
            </Heading>
          </TouchableOpacity>
        </View>
        <View>
          <Paragraph style={styles.disclaimerText}>
            Your keys are stored securely within your phone.{"\n"}
            we don't store or share your keys anywhere else.
          </Paragraph>

          <Button onPress={() => {}}>Import</Button>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: white[200],
    marginBottom: 20,
  },
  gradientBox: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    height: 200,
  },
  inputField: {
    width: "100%",
    minHeight: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 10,
    color: "white",
    marginBottom: 10,
  },
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
  manualEntryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 20,
    width: 170,
    backgroundColor: black[800],
    marginBottom: 10,
  },
  manualEntryButtonText: {
    marginLeft: 10,
    color: "white",
    fontWeight: "600",
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 14,
    color: white[200],
    textAlign: "center",
    marginBottom: 20,
  },
});
