// This file should be imported at the very beginning of the app
import 'react-native-get-random-values';

// Ensure global.crypto exists
if (typeof global.crypto !== 'object') {
  global.crypto = {};
}

// Check if getRandomValues is already defined
if (typeof global.crypto.getRandomValues !== 'function') {
  // Define a simple polyfill for getRandomValues
  global.crypto.getRandomValues = function(array) {
    // Create a new array of the same type and size
    const length = array.length;
    const bytes = new Uint8Array(length);
    
    // Fill it with random values
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    
    // Copy bytes to the original array
    for (let i = 0; i < length; i++) {
      array[i] = bytes[i];
    }
    
    return array;
  };
}

// Ensure Buffer is available
global.Buffer = global.Buffer || require('buffer').Buffer; 