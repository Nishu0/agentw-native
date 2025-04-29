import DepositSheet from "@/components/DepositSheet";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { Heading } from "@/components/Heading";
import Sheet from "@/components/Sheet";
import TokenCard from "@/components/TokenCard";
import useWalletData from "@/hooks/useWallet";
import useWalletStore from "@/store/wallet";
import { IToken } from "@/types/wallet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { router } from 'expo-router';

import { 
  FlatList, 
  RefreshControl, 
  StyleSheet, 
  Text, 
  View, 
  Clipboard, 
  StatusBar,
  TouchableOpacity,
  Animated
} from "react-native";
import { Copy, ArrowDownLeft, ArrowUpRight } from "lucide-react-native";

// Dark theme color palette
const darkTheme = {
  background: "#000000",
  surface: "#121212",
  cardBackground: "#1E1E1E",
  primary: "#00BFFF",
  primaryDark: "#0098CC",
  text: "#FFFFFF",
  secondaryText: "#9CA3AF",
  border: "#333333",
  divider: "#2A2A2A",
  success: "#4CAF50",
  danger: "#F44336",
  warning: "#FF9800",
  info: "#2196F3",
};

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [copyAnimationValue] = React.useState(new Animated.Value(0));
  const { handleTokens } = useWalletData();
  const { balance, tokens, wallets } = useWalletStore();
  console.log("Tokens", tokens);
  const depositSheetRef = useRef<BottomSheetModal>(null);
  const withdrawSheetRef = useRef<BottomSheetModal>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleTokens().finally(() => setRefreshing(false));
  }, []);

  const shortenAddress = (addr: string | undefined) => {
    if (!addr) return "";
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleWithdrawPress = () => {
    router.push('/(withdraw)');
  };

  const handleCopyAddress = () => {
    if (wallets?.[0]?.publicKey) {
      Clipboard.setString(wallets[0].publicKey);
      
      // Animate the copy notification
      Animated.sequence([
        Animated.timing(copyAnimationValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(copyAnimationValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const copyAnimationOpacity = copyAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const copyAnimationTranslateY = copyAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  const _RefreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      progressBackgroundColor={darkTheme.surface}
      tintColor={darkTheme.primary}
      colors={[darkTheme.primary]}
    />
  );

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      <View style={{flex: 1, backgroundColor: darkTheme.background}}>
        <View style={styles.container}>
        <View style={styles.walletSummary}>
          {wallets?.[0]?.publicKey && (
            <TouchableOpacity 
              style={styles.addressContainer}
              onPress={handleCopyAddress}
              activeOpacity={0.7}
            >
              <Text style={styles.address}>
                {shortenAddress(wallets?.[0]?.publicKey)}
              </Text>
              <Copy width={16} height={16} color={darkTheme.primary} style={styles.copyIcon} />
            </TouchableOpacity>
          )}
          <Animated.View
            style={[
              styles.copyNotification,
              {
                opacity: copyAnimationOpacity,
                transform: [{ translateY: copyAnimationTranslateY }],
              },
            ]}
          >
            <Text style={styles.copyNotificationText}>Address copied to clipboard</Text>
          </Animated.View>
          
          <Heading style={styles.balanceLabel}>Total Balance</Heading>
          <Heading style={styles.balance}>${balance ? parseFloat(balance.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</Heading>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.withdrawButton]}
              onPress={handleWithdrawPress}
            >
              <ArrowUpRight size={18} color={darkTheme.text} />
              <Text style={styles.buttonText}>Withdraw</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.depositButton]}
              onPress={() => depositSheetRef.current?.present()}
            >
              <ArrowDownLeft size={18} color={darkTheme.text} />
              <Text style={styles.buttonText}>Deposit</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.assetsContainer}>
          <Heading style={styles.assetsHeading}>My Assets</Heading>
          
          <FlatList
            renderItem={({ item }) => <TokenCard token={item} darkTheme={darkTheme} />}
            data={tokens}
            keyExtractor={(item) => item.address}
            refreshControl={_RefreshControl}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No assets found</Text>
                <Text style={styles.emptySubtext}>
                  Your assets will appear here once you deposit tokens to your wallet
                </Text>
              </View>
            )}
          />
        </View>
      </View>
      </View>
      
      <Sheet
        ref={depositSheetRef}
        snapPoints={[500]}
        detached={true}
        bottomInset={50}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <DepositSheet darkTheme={darkTheme} />
      </Sheet>
      
      <Sheet
        ref={withdrawSheetRef}
        snapPoints={[500]}
        detached={true}
        bottomInset={50}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        {/* You would need to implement WithdrawSheet component */}
        <View style={styles.withdrawSheetContent}>
          <Heading style={styles.sheetHeading}>Withdraw</Heading>
          <Text style={styles.sheetText}>Withdrawal functionality would go here</Text>
        </View>
      </Sheet>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: darkTheme.background,
  },
  walletSummary: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.divider,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: darkTheme.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    marginBottom: 16,
  },
  address: {
    fontSize: 16,
    color: darkTheme.secondaryText,
    marginRight: 6,
  },
  copyIcon: {
    marginLeft: 4,
  },
  copyNotification: {
    position: "absolute",
    top: 80,
    backgroundColor: darkTheme.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: darkTheme.primary,
  },
  copyNotificationText: {
    color: darkTheme.secondaryText,
    fontSize: 12,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: darkTheme.secondaryText,
    marginBottom: 8,
  },
  balance: {
    fontSize: 42,
    fontWeight: "700",
    color: darkTheme.text,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    justifyContent: "center",
    marginTop: 24,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  withdrawButton: {
    backgroundColor: darkTheme.cardBackground,
    borderWidth: 1,
    borderColor: darkTheme.divider,
  },
  depositButton: {
    backgroundColor: darkTheme.primary,
  },
  buttonText: {
    color: darkTheme.text,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  assetsContainer: {
    flex: 1,
  },
  assetsHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: darkTheme.text,
    marginTop: 24,
    marginBottom: 16,
  },
  flatListContent: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: darkTheme.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: darkTheme.secondaryText,
    textAlign: "center",
  },
  sheetBackground: {
    backgroundColor: darkTheme.surface,
  },
  sheetIndicator: {
    backgroundColor: darkTheme.divider,
    width: 40,
  },
  withdrawSheetContent: {
    padding: 20,
  },
  sheetHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: darkTheme.text,
    marginBottom: 16,
  },
  sheetText: {
    color: darkTheme.secondaryText,
    fontSize: 14,
  },
});