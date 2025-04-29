// React Native polyfills for crypto operations
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import process from 'process';

// Set up Buffer global
global.Buffer = Buffer;

// Set up process global
global.process = process;

// Ensure crypto is properly defined
if (typeof global.crypto !== 'object') {
  global.crypto = {};
}

// Make sure getRandomValues is defined
if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = function(array) {
    const length = array.length;
    const bytes = new Uint8Array(length);
    
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    
    for (let i = 0; i < length; i++) {
      array[i] = bytes[i];
    }
    
    return array;
  };
}

// Set up stream
try {
  global.stream = require('stream-browserify');
} catch (e) {
  console.warn('Stream polyfill not loaded:', e.message);
}

// Patch BIP39 to handle errors
try {
  const bip39 = require('bip39');
  if (typeof bip39._patched !== 'boolean') {
    bip39._patched = true;
    
    // Store original mnemonicToSeedSync
    const originalMnemonicToSeedSync = bip39.mnemonicToSeedSync;
    
    // Wrap with error handling
    bip39.mnemonicToSeedSync = function(mnemonic, password) {
      try {
        return originalMnemonicToSeedSync(mnemonic, password);
      } catch (e) {
        console.error('Error in mnemonicToSeedSync:', e);
        // Create a fallback implementation
        const pbkdf2 = require('pbkdf2');
        const salt = 'mnemonic' + (password || '');
        return pbkdf2.pbkdf2Sync(
          Buffer.from(mnemonic, 'utf8'), 
          Buffer.from(salt, 'utf8'), 
          2048, 
          64, 
          'sha512'
        );
      }
    };
  }
} catch (e) {
  console.warn('BIP39 patching failed:', e.message);
}

// Make pbkdf2 available
try {
  global.pbkdf2 = require('pbkdf2');
} catch (e) {
  console.warn('pbkdf2 not available:', e.message);
}

