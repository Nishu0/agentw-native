// app/(withdraw)/confirm.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar
} from 'react-native';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { IToken } from '@/types/wallet';

// Dark theme colors
const darkTheme = {
  background: "#000000",
  surface: "#121212",
  cardBackground: "#1E1E1E",
  primary: "#8C73FF",
  text: "#FFFFFF",
  secondaryText: "#9CA3AF",
  border: "#333333",
  divider: "#2A2A2A",
};

export default function WithdrawConfirmScreen() {
  // Get params from URL
  const params = useLocalSearchParams();
  const tokenParam = params.token as string;
  const amountParam = params.amount as string;
  const recipient = params.recipient as string;
  
  // Parse the data
  const token = JSON.parse(tokenParam) as IToken;
  const amount = parseFloat(amountParam);

  const handleSend = () => {
    router.push({
      pathname: "/(withdraw)/processing",
      params: {
        token: tokenParam,
        amount: amountParam,
        recipient: recipient
      }
    });
  };

  // Calculate USD value
  const getUsdValue = () => {
    const priceValue = parseFloat(token.price) || 0;
    return (amount * priceValue).toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format recipient address for display
  const formatRecipient = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    const prefix = addr.slice(0, 6);
    const suffix = addr.slice(-4);
    return `Aptos Wallet (${prefix}...${suffix})`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={darkTheme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Send</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Token and Amount */}
      <View style={styles.confirmAmountContainer}>
        <View style={styles.confirmIconContainer}>
          <ArrowRight size={24} color={darkTheme.primary} />
        </View>
        <Text style={styles.confirmAmount}>{amount} {token.symbol}</Text>
        <Text style={styles.confirmUsdValue}>{getUsdValue()}</Text>
      </View>

      {/* Transaction Details */}
      <View style={styles.confirmDetailsCard}>
        <View style={styles.confirmDetailRow}>
          <Text style={styles.confirmDetailLabel}>To</Text>
          <Text style={styles.confirmDetailValue}>{formatRecipient(recipient)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.confirmDetailRow}>
          <Text style={styles.confirmDetailLabel}>Network</Text>
          <Text style={styles.confirmDetailValue}>Aptos Mainnet</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.confirmDetailRow}>
          <Text style={styles.confirmDetailLabel}>Network fee <Info size={16} color={darkTheme.secondaryText} /></Text>
          <Text style={styles.confirmDetailValue}>Up to $0.0004</Text>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.divider,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: darkTheme.text,
  },
  confirmAmountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  confirmIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: darkTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confirmAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 8,
  },
  confirmUsdValue: {
    fontSize: 16,
    color: darkTheme.secondaryText,
  },
  confirmDetailsCard: {
    backgroundColor: darkTheme.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  confirmDetailLabel: {
    fontSize: 16,
    color: darkTheme.secondaryText,
  },
  confirmDetailValue: {
    fontSize: 16,
    color: darkTheme.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: darkTheme.divider,
    marginHorizontal: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: darkTheme.cardBackground,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: darkTheme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
    backgroundColor: darkTheme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: darkTheme.text,
    fontSize: 16,
    fontWeight: '600',
  },
});