// app/(withdraw)/index.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  Image,
  StatusBar
} from 'react-native';
import { ArrowLeft, ChevronRight, Search } from 'lucide-react-native';
import { router, useRouter } from 'expo-router';
import useWalletStore from '@/store/wallet';
import { IToken } from '@/types/wallet';

// Dark theme colors
const darkTheme = {
  background: "#000000",
  surface: "#121212",
  cardBackground: "#1E1E1E",
  inputBackground: "#2A2A2A",
  primary: "#8C73FF", // Purple from your confirmation screen
  text: "#FFFFFF",
  secondaryText: "#9CA3AF",
  border: "#333333",
  divider: "#2A2A2A",
};

export default function WithdrawScreen() {
  const { tokens } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tokens based on search query
  const filteredTokens = tokens?.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTokenSelect = (token: IToken) => {
    // Use router.push to navigate to the amount screen with token data
    router.push({
      pathname: "/(withdraw)/amount",
      params: {
        // Serialize the token object - Expo Router can only pass strings as params
        token: JSON.stringify(token)
      }
    });
  };

  const renderTokenItem = ({ item }: { item: IToken }) => (
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
          onPress={() => router.back()}
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
});