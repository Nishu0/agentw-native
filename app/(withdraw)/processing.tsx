// app/(withdraw)/processing.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { IToken } from '@/types/wallet';

// Dark theme colors
const darkTheme = {
  background: "#000000",
  surface: "#121212",
  cardBackground: "#1E1E1E",
  primary: "#8C73FF",
  success: "#4CAF50",
  text: "#FFFFFF",
  secondaryText: "#9CA3AF",
  border: "#333333",
  divider: "#2A2A2A",
};

export default function WithdrawProcessingScreen() {
  // Get params from URL
  const params = useLocalSearchParams();
  const tokenParam = params.token as string;
  const amountParam = params.amount as string;
  const recipient = params.recipient as string;
  
  // Parse the data
  const token = JSON.parse(tokenParam) as IToken;
  const amount = parseFloat(amountParam);
  
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Mock transaction processing with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    // Return to the main wallet screen
    router.replace('/(tabs)');
  };

  // Format recipient address for display
  const formatRecipient = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    const prefix = addr.slice(0, 6);
    const suffix = addr.slice(-4);
    return `${token.symbol} Wallet (${prefix}...${suffix})`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      
      <View style={styles.processingContainer}>
        {!isCompleted ? (
          <>
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="large" color={darkTheme.primary} />
            </View>
            <Text style={styles.processingTitle}>Sending...</Text>
            <Text style={styles.processingSubtitle}>
              {amount} {token.symbol} to {formatRecipient(recipient)}
            </Text>
            <TouchableOpacity style={styles.viewTransactionButton}>
              <Text style={styles.viewTransactionText}>View transaction</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.successIndicator}>
              <CheckCircle2 size={40} color={darkTheme.success} />
            </View>
            <Text style={styles.successTitle}>Sent!</Text>
            <Text style={styles.successSubtitle}>
              {amount} {token.symbol} was successfully sent to
              {"\n"}{formatRecipient(recipient)}
            </Text>
            <TouchableOpacity style={styles.viewTransactionButton}>
              <Text style={styles.viewTransactionText}>View transaction</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleClose}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  processingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: darkTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  processingTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 16,
  },
  processingSubtitle: {
    fontSize: 16,
    color: darkTheme.secondaryText,
    textAlign: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: darkTheme.text,
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 16,
    color: darkTheme.secondaryText,
    textAlign: 'center',
    marginBottom: 24,
  },
  viewTransactionButton: {
    paddingVertical: 8,
  },
  viewTransactionText: {
    color: darkTheme.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: darkTheme.cardBackground,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: darkTheme.text,
    fontSize: 16,
    fontWeight: '600',
  },
});