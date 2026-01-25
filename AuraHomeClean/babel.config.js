module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Keep Reanimated plugin last so worklets compile correctly
      "react-native-reanimated/plugin",
    ],
  };
};
