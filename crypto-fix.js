/**
 * This file directly modifies the global objects needed for crypto operations
 */

// First import the library that's supposed to provide getRandomValues
import 'react-native-get-random-values';

// Set up Buffer which is needed by many crypto libraries
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Make sure process exists
import process from 'process';
if (typeof global.process === 'undefined') {
  global.process = process;
}

// Direct fix for crypto
const fixCrypto = () => {
  console.log('[CRYPTO POLYFILL] Applying crypto fix...');
  
  // Check for crypto in different contexts
  console.log('[CRYPTO POLYFILL] global.crypto:', typeof global.crypto);
  console.log('[CRYPTO POLYFILL] window.crypto:', typeof global.window?.crypto);
  console.log('[CRYPTO POLYFILL] self.crypto:', typeof global.self?.crypto);
  
  // Fix global.crypto
  if (typeof global.crypto === 'undefined') {
    console.log('[CRYPTO POLYFILL] Creating global.crypto');
    global.crypto = {};
  }
  
  if (typeof global.crypto.getRandomValues !== 'function') {
    console.log('[CRYPTO POLYFILL] Adding getRandomValues to global.crypto');
    global.crypto.getRandomValues = function(array) {
      console.log('[CRYPTO POLYFILL] Using polyfill getRandomValues');
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    };
  }
  
  // Make a direct test call to verify it works
  try {
    const testArray = new Uint8Array(8);
    global.crypto.getRandomValues(testArray);
    console.log('[CRYPTO POLYFILL] Test call successful:', Array.from(testArray));
  } catch (error) {
    console.log('[CRYPTO POLYFILL] Test call failed:', error);
  }
  
  // Verify again
  console.log('[CRYPTO POLYFILL] Verification - crypto:', typeof global.crypto);
  console.log('[CRYPTO POLYFILL] Verification - getRandomValues:', typeof global.crypto.getRandomValues);
};

// Run immediately
fixCrypto();

// Run again after a delay to catch any potential overrides
setTimeout(fixCrypto, 500);

export default {}; 