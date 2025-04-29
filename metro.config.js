// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { resolver: defaultResolver } = getDefaultConfig(__dirname);

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolvers for Node.js core modules
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    // Crypto
    crypto: require.resolve('crypto-browserify'),
    
    // Streams
    stream: require.resolve('stream-browserify'),
    _stream_duplex: require.resolve('readable-stream/lib/_stream_duplex'),
    _stream_passthrough: require.resolve('readable-stream/lib/_stream_passthrough'),
    _stream_readable: require.resolve('readable-stream/lib/_stream_readable'),
    _stream_transform: require.resolve('readable-stream/lib/_stream_transform'),
    _stream_writable: require.resolve('readable-stream/lib/_stream_writable'),
    
    // Buffer
    buffer: require.resolve('buffer'),
    
    // Process
    process: require.resolve('process/browser'),
    
    // Other common Node.js modules that might be needed
    path: require.resolve('path-browserify'),
    fs: require.resolve('react-native-fs'),
  },
  assetExts: [...defaultResolver.assetExts, 'dat', 'bin'],
};

// Handle source maps properly
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config; 