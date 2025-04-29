import { CopyIcon } from "@/components/Icons";
import React, { useState, useEffect } from "react";
import { 
  TouchableOpacity, 
  View, 
  useWindowDimensions, 
  StyleSheet, 
  Text,
  Animated,
  Clipboard,
  Share
} from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import { Heading } from "./Heading";
import { Paragraph } from "./Paragraph";
import { black } from "@/constants/Colors";
import useWalletStore from "@/store/wallet";
import { formatAddress } from "@/utils/formatAddress";
import { Copy, Share as ShareIcon } from "lucide-react-native";

// Default dark theme colors if none provided
const defaultDarkTheme = {
  background: "#000000",
  surface: "#121212",
  cardBackground: "#1E1E1E",
  primary: "#00BFFF",
  text: "#FFFFFF",
  secondaryText: "#9CA3AF",
  border: "#333333",
  divider: "#2A2A2A",
};

export default function DepositSheet({ darkTheme = defaultDarkTheme }) {
  const { height, width } = useWindowDimensions();
  const { currentWallet } = useWalletStore();
  const [copyAnimationValue] = useState(new Animated.Value(0));
  const [qrSize, setQrSize] = useState(Math.min(width * 0.7, 280));

  // Handle address copy with animation
  const handleCopyAddress = () => {
    if (currentWallet?.publicKey) {
      Clipboard.setString(currentWallet.publicKey);
      
      // Animate the copy notification
      Animated.sequence([
        Animated.timing(copyAnimationValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(copyAnimationValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Share wallet address
  const handleShareAddress = async () => {
    if (currentWallet?.publicKey) {
      try {
        await Share.share({
          message: currentWallet.publicKey,
          title: 'My Wallet Address',
        });
      } catch (error) {
        console.error('Error sharing address:', error);
      }
    }
  };

  // Animation properties
  const copyAnimationOpacity = copyAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const copyAnimationTranslateY = copyAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  // Calculate appropriate QR code size based on screen dimensions
  useEffect(() => {
    const calculatedSize = Math.min(width * 0.7, 280);
    setQrSize(calculatedSize);
  }, [width]);

  return (
    <View style={[styles.container, { backgroundColor: darkTheme.surface }]}>
      <Heading style={[styles.heading, { color: darkTheme.text }]}>
        Deposit
      </Heading>
      
      <Paragraph style={[styles.subheading, { color: darkTheme.secondaryText }]}>
        Scan this QR code or copy the address below
      </Paragraph>
      
      {currentWallet && (
        <View style={styles.qrContainer}>
          <QRCodeStyled
            data={currentWallet?.publicKey}
            style={styles.qrCode}
            pieceSize={qrSize / 25}
            color={darkTheme.text}
            gradient={{
              options: {
                colors: [darkTheme.primary, darkTheme.text],
                type: 'linear',
              },
            }}
            outerEyesOptions={{
              borderRadius: 12,
              color: darkTheme.primary,
            }}
            innerEyesOptions={{
              borderRadius: 6,
              color: darkTheme.primary,
            }}
            pieceBorderRadius={4}
            logo={{
              href: require("../assets/images/icon.png"),
              padding: 4,
              scale: 0.22,
              hidePieces: true,
            }}
            backgroundColor={darkTheme.surface}
          />
        </View>
      )}
      
      <View style={styles.addressSection}>
        <View style={[styles.addressContainer, { backgroundColor: darkTheme.cardBackground, borderColor: darkTheme.border }]}>
          <Text style={[styles.addressText, { color: darkTheme.text }]}>
            {formatAddress(currentWallet?.publicKey || "")}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: darkTheme.cardBackground, borderColor: darkTheme.border }]} 
            onPress={handleCopyAddress}
          >
            <Copy width={18} height={18} color={darkTheme.primary} />
            <Text style={[styles.buttonText, { color: darkTheme.text }]}>Copy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: darkTheme.cardBackground, borderColor: darkTheme.border }]}
            onPress={handleShareAddress}
          >
            <ShareIcon width={18} height={18} color={darkTheme.primary} />
            <Text style={[styles.buttonText, { color: darkTheme.text }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Network selection would go here */}
      <View style={[styles.networkSection, { borderColor: darkTheme.border }]}>
        <Text style={[styles.networkLabel, { color: darkTheme.secondaryText }]}>Network</Text>
        <View style={[styles.networkSelector, { backgroundColor: darkTheme.cardBackground }]}>
          <Text style={[styles.networkName, { color: darkTheme.text }]}>Ethereum</Text>
          <View style={[styles.networkBadge, { backgroundColor: darkTheme.primary }]}>
            <Text style={styles.networkBadgeText}>ETH</Text>
          </View>
        </View>
      </View>
      
      {/* Copy notification popup */}
      <Animated.View
        style={[
          styles.copyNotification,
          {
            opacity: copyAnimationOpacity,
            transform: [{ translateY: copyAnimationTranslateY }],
            backgroundColor: darkTheme.cardBackground,
            borderLeftColor: darkTheme.primary,
          },
        ]}
      >
        <Text style={[styles.notificationText, { color: darkTheme.text }]}>Address copied to clipboard</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 24,
    textAlign: "center",
  },
  qrContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCode: {
    backgroundColor: "transparent",
  },
  addressSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  addressContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  networkSection: {
    width: "100%",
    borderTopWidth: 1,
    paddingTop: 20,
  },
  networkLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  networkSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  networkName: {
    fontSize: 16,
    fontWeight: "600",
  },
  networkBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
  },
  networkBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  copyNotification: {
    position: "absolute",
    bottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  notificationText: {
    fontSize: 14,
    fontWeight: "500",
  }
});