// Import polyfill first - fix path to be relative from utils dir
import '../polyfill';

// Add a direct import of Buffer
import { Buffer } from 'buffer';

import { Account, AccountAddress, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import * as Crypto from 'expo-crypto';
import * as Bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";
import aptosClient from "./aptosClient";

/**
 * Generate a wallet account using BIP39 mnemonics
 */
export async function generateWalletAccount() {
  try {
    // Generate a mnemonic (seed phrase)
    const mnemonic = Bip39.generateMnemonic();
    
    // Convert mnemonic to seed
    const seed = Bip39.mnemonicToSeedSync(mnemonic);
    
    // Derive path for Aptos (cointype 637)
    const path = "m/44'/637'/0'/0'/0'";
    const { key } = derivePath(path, seed.toString('hex'));
    
    // Use derived key as private key
    const privateKey = key; // 32-byte private key seed
    
    // Generate Aptos account from private key
    const account = await aptosClient.deriveAccountFromPrivateKey({
      privateKey: new Ed25519PrivateKey(PrivateKey.formatPrivateKey(privateKey, PrivateKeyVariants.Ed25519)),
    });
    
    // Get the address
    const address = account.accountAddress.toString();
    
    return {
      mnemonic: mnemonic,
      privateKey: privateKey,
      address: address,
      secretKey: bs58.encode(privateKey),
    };
  } catch (error) {
    console.error("Error generating wallet account:", error);
    throw error;
  }
} 