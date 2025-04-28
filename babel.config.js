module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { unstable_transformProfile: "hermes-stable" }],
      ],
      plugins: [
        "react-native-reanimated/plugin",
        [
          'module-resolver',
          {
            alias: {
              '@': '.',
            },
            extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          },
        ]
      ],
    };
  };
  