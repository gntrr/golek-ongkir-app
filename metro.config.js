const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
let config = {
	transformer: {
		unstable_allowRequireContext: true,
	},
};

config = withNativeWind(config, { input: './global.css' });

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
