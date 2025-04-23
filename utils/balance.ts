import { IToken, PanoraToken } from "@/types/wallet";
import { getAptosClient } from "./aptosClient";
import { Aptos } from "@aptos-labs/ts-sdk";
const tokenPriceCache: Record<string, number> = {};
let tokenListCache: PanoraToken[] = [];
const PRICE_API = "https://api.coinex.com/v1/market/ticker/all";
const APTOS_COIN_ADDRESS = "0x1::aptos_coin::AptosCoin";
const COIN_STORE_TYPE = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";

export async function getTokenBalance(address: string): Promise<IToken[]> {
    let tokens: IToken[] = [];
    
    try {
      // Ensure token list is fetched
      if (tokenListCache.length === 0) {
        const tokenListResponse = await fetch('https://raw.githubusercontent.com/PanoraExchange/Aptos-Tokens/refs/heads/main/token-list.json');
        tokenListCache = await tokenListResponse.json();
      }
      
      // Get price data for all tokens
      const priceResponse = await fetch(PRICE_API);
      const priceData = await priceResponse.json();
      
      // Update cache with latest prices
      if (priceData && priceData.data) {
        Object.keys(priceData.data).forEach(pair => {
          if (pair.endsWith('USDT')) {
            const symbol = pair.replace('USDT', '');
            tokenPriceCache[symbol] = parseFloat(priceData.data[pair].last);
          }
        });
      }
      
      const aptos: Aptos = getAptosClient();
      
      // Fetch token balances
      const fungibleAssets = await aptos.getCurrentFungibleAssetBalances({
        options: {
          where: {
            owner_address: {
              _eq: address,
            },
          },
        },
      });
      
      // Process each token
      for (const asset of fungibleAssets) {
        // Find the token in our token list
        const tokenInfo = asset.token_standard === 'v1'
          ? tokenListCache.find(t => t.tokenAddress === asset.asset_type)
          : tokenListCache.find(t => t.faAddress === asset.asset_type);
        
        if (tokenInfo) {
          // Calculate proper balance with decimals
          const balance = (Number(asset.amount) / Math.pow(10, tokenInfo.decimals)).toFixed(2);
          
          // Only include tokens with a meaningful balance (like > 0.01 in original)
          if (parseFloat(balance) > 0.01) {
            // Get the price (from cache or default to 0)
            const price = tokenPriceCache[tokenInfo.symbol] || 0;
            
            tokens.push({
              address: asset.asset_type || '',
              price: (price * parseFloat(balance)).toFixed(2),
              name: tokenInfo.name,
              symbol: tokenInfo.symbol,
              image: tokenInfo.logoUrl,
              decimal: tokenInfo.decimals,
              balance: balance,
            });
          }
        }
      }
      
      // Handle APT separately like SOL in the original
      const aptToken = tokens.find(el => el.symbol === 'APT');
      if (!aptToken) {
        const data = await getWalletBalance(address);
        tokens.push({
          address: APTOS_COIN_ADDRESS,
          decimal: 8, // APT has 8 decimals
          price: data.price.toFixed(2),
          name: "Aptos",
          symbol: "APT",
          image: "https://raw.githubusercontent.com/PanoraExchange/Aptos-Tokens/refs/heads/main/assets/apt.png",
          balance: data.balance.toFixed(2),
        });
      }
      
      // Sort by price, highest first
      tokens.sort((a, b) => Number(b.price) - Number(a.price));
      
    } catch (error) {
      console.error("Failed to fetch token balances:", error);
    }
    
    return tokens;
  }
  
  /**
   * Gets the APT balance for a specific address
   * @param address The Aptos wallet address
   * @returns Object containing balance and price information
   */
  export async function getWalletBalance(address: string) {
    try {
      // Create the Aptos client (assuming it's available in the environment)
      const aptos: Aptos = getAptosClient();
      
      // Get account resources
      const resources = await aptos.getAccountResources({
        accountAddress: address,
      });
      
      // Find the APT coin store
      const aptosCoinStore = resources.find(r => r.type === COIN_STORE_TYPE);
      
      let balance = 0;
      if (aptosCoinStore?.data && typeof aptosCoinStore.data === 'object' && 'coin' in aptosCoinStore.data) {
        const rawBalance = (aptosCoinStore.data as { coin: { value: string } }).coin.value || "0";
        // APT has 8 decimals
        balance = Number(rawBalance) / Math.pow(10, 8);
      }
      
      // Get APT price
      let rawPrice = 0;
      if (!tokenPriceCache['APT']) {
        const priceResponse = await fetch(PRICE_API);
        const priceData = await priceResponse.json();
        if (priceData && priceData.data && priceData.data['APTUSDT']) {
          rawPrice = parseFloat(priceData.data['APTUSDT'].last);
          tokenPriceCache['APT'] = rawPrice;
        }
      } else {
        rawPrice = tokenPriceCache['APT'];
      }
      
      return {
        balance: balance,
        price: rawPrice * balance,
        rawPrice: rawPrice,
      };
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      return {
        balance: 0,
        price: 0,
        rawPrice: 0,
      };
    }
  }