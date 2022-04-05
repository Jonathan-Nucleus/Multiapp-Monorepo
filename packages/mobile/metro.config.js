/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      blacklistRE: exclusionList([/amplify\/#current-cloud-backend\/.*/]),
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) => {
            return path.join(__dirname, `node_modules/${name}`);
          },
        },
      ),
    },
    watchFolders: [path.resolve(__dirname, '../')],
  };
})();
