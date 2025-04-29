// Import polyfill only once at the beginning
import '../polyfill';

// Keep Crypto import for explicit use
import * as Crypto from 'expo-crypto';

import Button from "@/components/Button";
import Container from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { black, white } from "@/constants/Colors";
import useWalletStore from "@/store/wallet";
import * as Bip39 from "bip39";
import bs58 from "bs58";
import { Account, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { derivePath } from "ed25519-hd-key";
import aptosClient from "@/utils/aptosClient";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { View, useWindowDimensions } from "react-native";

export default function Create() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { setWallets, setCurrentWallet } = useWalletStore();

  async function generateWallet() {
    setIsLoading(true);
    try {
      // Direct implementation of wallet generation
      console.log("Starting wallet generation");
      
      // Step 1: Generate a mnemonic (seed phrase)
      const mnemonic = Bip39.generateMnemonic();
      console.log("Generated mnemonic");
      
      // Step 2: Convert mnemonic to seed - this might be where the slice error occurs
      console.log("Converting mnemonic to seed");
      const seed = Bip39.mnemonicToSeedSync(mnemonic);
      console.log("Seed generated:", typeof seed);
      console.log("Seed", seed);
      
      // Step 3: Convert seed to hex
      const seedHex = seed.toString('hex');
      console.log("Seed hex length:", seedHex.length);
      
      // Step 4: Derive path for Aptos (cointype 637)
      const path = "m/44'/637'/0'/0'/0'";
      console.log("Deriving path:", path);
      const derivationResult = derivePath(path, seedHex);
      console.log("Path derived");
      
      // Check if key exists in derivation result
      if (!derivationResult || !derivationResult.key) {
        throw new Error("Failed to derive key from path");
      }
      
      const privateKey = derivationResult.key; // 32-byte private key seed
      console.log("Private key acquired, length:", privateKey.length);
      
      // Encode private key for storage
      const secretKey = bs58.encode(privateKey);
      console.log("Secret key encoded");
      
      // Use a placeholder address for now
      const privateKeyObj = new Ed25519PrivateKey(privateKey);
      const account = Account.fromPrivateKey({ privateKey: privateKeyObj });
      console.log(account, "account");

      const address = account.accountAddress.toString();
      
      console.log("Generated address:", address);

      const wallets = [
        {
          name: "wallet 1",
          seed: mnemonic,
          publicKey: address,
          secretKey: secretKey,
        },
      ];
      
      setWallets(wallets);
      setCurrentWallet(wallets[0]);
      router.push("/backup");
    } catch (error) {
      console.error("Wallet generation error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImport() {
    router.push("/import");
  }

  return (
    <Container>
      <Image
        source={require("../assets/images/splashscreen.png")}
        style={{
          height: height / 2.5,
          width: width / 1.2,
          alignSelf: "center",
          marginVertical: 32,
        }}
        contentFit="contain"
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            maxWidth: width / 1.3,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Heading
              style={{
                fontSize: width / 10,
                fontWeight: "600",
                color: white[700],
                textAlign: "center",
              }}
            >
              AgentW for Aptos
            </Heading>
            <Paragraph
              style={{
                fontSize: width / 24,
                fontWeight: "500",
                color: white[200],
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Customizable Agents for all your needs
            </Paragraph>
          </View>
          <View
            style={{
              marginTop: 16,
            }}
          >
            <Button
              onPress={generateWallet}
              style={{
                marginVertical: 8,
              }}
              textStyle={{
                fontSize: width / 25,
              }}
              isLoading={isLoading}
            >
              Create wallet
            </Button>
            <Button
              variant="outlined"
              onPress={handleImport}
              style={{
                marginVertical: 8,
              }}
              textStyle={{
                fontSize: width / 25,
              }}
            >
              Import an Existing Wallet
            </Button>
          </View>
          <Paragraph
            style={{
              fontSize: width / 28,
              fontWeight: "500",
              color: white[200],
              textAlign: "center",
              marginTop: 8,
            }}
          >
            by using AgentW, you agree to accept our{" "}
            <Paragraph
              style={{
                fontWeight: "600",
                color: white[100],
              }}
            >
              Terms of Use{" "}
            </Paragraph>
            and{" "}
            <Paragraph
              style={{
                fontWeight: "600",
                color: white[100],
              }}
            >
              Privacy Policy
            </Paragraph>
          </Paragraph>
        </View>
      </View>
    </Container>
  );
}
