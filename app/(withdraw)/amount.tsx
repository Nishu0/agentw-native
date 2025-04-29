// app/(withdraw)/amount.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  StatusBar
} from 'react-native';
import { ArrowLeft, AtSign } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { IToken } from '@/types/wallet';

// Dark theme colors
const darkTheme = {
  background: "#000000",
  surface: "#121212",
  cardBackground: "#1E1E1E",
  inputBackground: "#2A2A2A",
  primary: "#8C73FF",
  text: "#FFFFFF",
  secondaryText: "#9CA3AF",
  border: "#333333",
  divider: "#2A2A2A",
};

export default function WithdrawAmountScreen() {
  // Get token data from URL params
  const params = useLocalSearchParams();
  const tokenParam = params.token as string;
  
  // Parse the token from JSON string
  const token = JSON.parse(tokenParam) as IToken;
  
  const [amount, setAmount] = useState('');
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [recipient, setRecipient] = useState('');

  // Check if inputs are valid to enable Next button
  useEffect(() => {
    const amountValue = parseFloat(amount);
    const hasValidAmount = amountValue > 0 && amountValue <= parseFloat(token.balance);
    const hasValidRecipient = recipient.trim().length > 10;
    setIsNextEnabled(hasValidAmount && hasValidRecipient);
  }, [amount, recipient, token]);

  const handleMaxPress = () => {
    setAmount(token.balance);
  };

  const handleNext = () => {
    router.push({
      pathname: "/(withdraw)/confirm",
      params: {
        token: tokenParam,
        amount: amount,
        recipient: recipient
      }
    });
  };

  // Calculate USD value
  const getUsdValue = () => {
    const amountValue = parseFloat(amount) || 0;
    const priceValue = parseFloat(token.price) || 0;
    return (amountValue * priceValue).toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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
        <Text style={styles.headerTitle}>Send {token.symbol}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Token Info */}
      <View style={styles.tokenInfoSection}>
        <Image source={{ uri: token.image }} style={styles.largeTokenImage} />
      </View>

      {/* Recipient Address Input */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.addressInput}
            placeholder={`Recipient's ${token.symbol} address`}
            placeholderTextColor={darkTheme.secondaryText}
            value={recipient}
            onChangeText={setRecipient}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.addressBookButton}>
            <AtSign size={20} color={darkTheme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.inputSection}>
        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            placeholder="Amount"
            placeholderTextColor={darkTheme.secondaryText}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styles.amountRight}>
            <Text style={styles.amountCurrency}>{token.symbol}</Text>
            <TouchableOpacity 
              style={styles.maxButton}
              onPress={handleMaxPress}
            >
              <Text style={styles.maxButtonText}>Max</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.balanceInfoContainer}>
          <Text style={styles.usdValue}>{getUsdValue()}</Text>
          <Text style={styles.availableBalance}>
            Available {parseFloat(token.balance).toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 6 
            })} {token.symbol}
          </Text>
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
          style={[
            styles.nextButton, 
            !isNextEnabled && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!isNextEnabled}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
  tokenInfoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  largeTokenImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  inputSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  addressInput: {
    flex: 1,
    color: darkTheme.text,
    fontSize: 16,
    paddingVertical: 16,
  },
  addressBookButton: {
    padding: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  amountInput: {
    flex: 1,
    color: darkTheme.text,
    fontSize: 16,
    paddingVertical: 16,
  },
  amountRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountCurrency: {
    color: darkTheme.text,
    fontSize: 16,
    marginRight: 8,
  },
  maxButton: {
    backgroundColor: darkTheme.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  maxButtonText: {
    color: darkTheme.text,
    fontSize: 14,
    fontWeight: '600',
  },
  balanceInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  usdValue: {
    color: darkTheme.secondaryText,
    fontSize: 14,
  },
  availableBalance: {
    color: darkTheme.secondaryText,
    fontSize: 14,
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
  nextButton: {
    flex: 1,
    backgroundColor: darkTheme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: `${darkTheme.primary}80`, // 50% opacity
  },
  nextButtonText: {
    color: darkTheme.text,
    fontSize: 16,
    fontWeight: '600',
  }
});