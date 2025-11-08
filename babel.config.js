module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxRuntime: 'automatic', // ✅ use the modern JSX transform
        },
      ],
    ],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
