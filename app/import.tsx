import Container from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { white } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ImportWalletScreen() {
  const router = useRouter();
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
          <Heading style={styles.headerText}>Add an Existing Wallet</Heading>
          <Paragraph style={styles.subHeaderText}>
            Continue using your wallet by importing it.
          </Paragraph>
        </View>

        <View>
          <LinearGradient
            colors={["#8357FF", "#7F7FD5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBox}
          />
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              router.push("/import-seed");
            }}
          >
            <View>
              <Heading style={styles.optionButtonText}>
                Secret Recovery Phrase
              </Heading>
              <Paragraph style={styles.optionButtonSubtext}>
                Import any wallet using a 12-word Secret Recovery Phrase.
              </Paragraph>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              router.push("/import-privatekey");
            }}
          >
            <View>
              <Heading style={styles.optionButtonText}>Private Key</Heading>
              <Paragraph style={styles.optionButtonSubtext}>
                Import any wallet using your Private key.
              </Paragraph>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <Paragraph style={styles.disclaimerText}>
            Your Private info is stored securely within your phone. we don't
            store or share your info anywhere else.
          </Paragraph>
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
    marginBottom: 30,
  },
  gradientBox: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: 30,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: white[500],
    backgroundColor: white[700],
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  optionButtonSubtext: {
    fontSize: 14,
    color: white[200],
  },
  disclaimerText: {
    fontSize: 14,
    color: white[200],
    textAlign: "center",
  },
});
