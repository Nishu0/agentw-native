import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  Image,
  Animated,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { ArrowLeft, AtSign, CheckCircle2, ChevronRight, Search, ArrowRight } from 'lucide-react-native';

import useWalletStore from '@/store/wallet';

// Main dark theme colors
const darkTheme = {
  background: "#000000",
  surface: "#121212",
  cardBackground: "#1E1E1E",
  inputBackground: "#2A2A2A",
  primary: "#8C73FF", // Purple from your confirmation screen
  success: "#4CAF50",
  text: "#FFFFFF",
  secondaryText: "#9CA3AF",
  border: "#333333",
  divider: "#2A2A2A",
};

// Step 1: Select Asset Screen
const WithdrawScreen = () => {
  const navigation = useNavigation();
  const { tokens } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tokens based on search query
  const filteredTokens = tokens?.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTokenSelect = (token: any) => {
    navigation.navigate('WithdrawAmount', { token });
  };

  const renderTokenItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.tokenItem} 
      onPress={() => handleTokenSelect(item)}
    >
      <View style={styles.tokenLeftSection}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.tokenImage} 
        />
        <View style={styles.tokenInfo}>
          <Text style={styles.tokenName}>{item.name}</Text>
          <Text style={styles.tokenBalance}>
            {parseFloat(item.balance).toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 6 
            })} {item.symbol}
          </Text>
        </View>
      </View>
      <ChevronRight size={20} color={darkTheme.secondaryText} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={darkTheme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color={darkTheme.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search assets..."
          placeholderTextColor={darkTheme.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>

      {/* Token List */}
      <FlatList
        data={filteredTokens}
        renderItem={renderTokenItem}
        keyExtractor={item => item.address}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No assets found</Text>
          </View>
        )}
      />
    </View>
  );
};

// Step 2: Enter Amount Screen
const WithdrawAmountScreen = ({ route }) => {
  const { token } = route.params;
  const navigation = useNavigation();
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
    navigation.navigate('WithdrawConfirm', { 
      token, 
      amount: parseFloat(amount), 
      recipient 
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
          onPress={() => navigation.goBack()}
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
          onPress={() => navigation.goBack()}
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
};

// Step 3: Confirmation Screen
const WithdrawConfirmScreen = ({ route }: { route: any }) => {
  const { token, amount, recipient } = route.params;
  const navigation = useNavigation();

  const handleSend = () => {
    navigation.navigate('WithdrawProcessing', { token, amount, recipient });
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
  const formatRecipient = (addr: any) => {
    if (!addr || addr.length < 10) return addr;
    const prefix = addr.slice(0, 6);
    const suffix = addr.slice(-4);
    return `${token.symbol} Wallet (${prefix}...${suffix})`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
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
          <Text style={styles.confirmDetailValue}>Base</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.confirmDetailRow}>
          <Text style={styles.confirmDetailLabel}>Network fee</Text>
          <Text style={styles.confirmDetailValue}>Up to $0.0004</Text>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sendButton]}
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Step 4: Processing Screen
const WithdrawProcessingScreen = ({ route }: { route: any }) => {
  const { token, amount, recipient } = route.params;
  const navigation = useNavigation();
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Mock transaction processing with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Wallet' }]
    });
  };

  // Format recipient address for display
  const formatRecipient = (addr: any) => {
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
};

// Combined Styles
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.inputBackground,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: darkTheme.text,
    fontSize: 16,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.divider,
  },
  tokenLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  largeTokenImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  tokenInfo: {
    justifyContent: 'center',
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.text,
    marginBottom: 4,
  },
  tokenBalance: {
    fontSize: 14,
    color: darkTheme.secondaryText,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: darkTheme.secondaryText,
  },
  tokenInfoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
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

// Export all screens for navigation
export { 
  WithdrawScreen,
  WithdrawAmountScreen,
  WithdrawConfirmScreen,
  WithdrawProcessingScreen
};