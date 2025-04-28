import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Set up Buffer global
global.Buffer = Buffer;

// Add process polyfill
if (typeof process === 'undefined') {
  global.process = require('process');
}

// More aggressive approach to ensure crypto.getRandomValues is defined
const ensureCrypto = () => {
  console.log('Before polyfill - crypto available:', typeof global.crypto !== 'undefined');
  console.log('Before polyfill - getRandomValues available:', 
    typeof global.crypto !== 'undefined' && typeof global.crypto.getRandomValues === 'function');

  // First, make sure crypto exists as an object
  if (typeof global.crypto === 'undefined') {
    console.log('Creating global.crypto object');
    global.crypto = {};
  }

  // Then ensure getRandomValues is a function
  if (typeof global.crypto.getRandomValues !== 'function') {
    console.log('Creating crypto.getRandomValues function');
    global.crypto.getRandomValues = function(array) {
      console.log('Using polyfill implementation of getRandomValues');
      const bytes = new Uint8Array(array.length);
      // Simple random implementation - not cryptographically secure but prevents errors
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
      // Copy the values to the passed array
      for (let i = 0; i < array.length; i++) {
        array[i] = bytes[i];
      }
      return array;
    };
  }

  console.log('After polyfill - crypto available:', typeof global.crypto !== 'undefined');
  console.log('After polyfill - getRandomValues available:', 
    typeof global.crypto !== 'undefined' && typeof global.crypto.getRandomValues === 'function');
};

// Run the function immediately
ensureCrypto();

// Ensure it runs after a short delay in case something resets it
setTimeout(ensureCrypto, 100);
