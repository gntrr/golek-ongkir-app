module.exports = function (api) {
  api.cache(true);
  const plugins = ['nativewind/babel'];
  if (process.env.NODE_ENV !== 'test') {
    plugins.push('react-native-reanimated/plugin');
  }
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins,
  };
};
