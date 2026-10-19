const path = require('path');
const pkg = require('../package.json');

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {createHarmonyMetroConfig} = require('@zcating/react-native-harmony/metro.config');
const escape = require('escape-string-regexp');

const peerDependencies = Object.keys(pkg.peerDependencies);
const root = path.resolve(__dirname, '..');
const projectNodeModules = path.join(__dirname, 'node_modules');
const rootNodeModules = path.join(root, 'node_modules');

// We need to make sure that only one version is loaded for peerDependencies
// So we block them at the root, and alias them to the versions in example's node_modules
const blockList = peerDependencies.map(
  (name) => new RegExp(`^${escape(path.join(rootNodeModules, name))}\\/.*$`),
);

const extraNodeModules = peerDependencies.reduce((acc, name) => {
  return {...acc, [name]: path.join(projectNodeModules, name)};
}, {});

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  watchFolders: [root],
  resolver: {
    blockList,
    extraNodeModules,
    // Modules under the root repo (watched via watchFolders, imported through
    // the babel alias) resolve their own node_modules first, which is the root's
    // -- and react-native is deliberately blocked there so a single version is
    // loaded. Pointing Metro at the example's node_modules gives those modules
    // (and the RNOH preset's redirected harmony lookups) somewhere to land.
    nodeModulesPaths: [projectNodeModules],
    // 'harmony' must be registered or Metro silently ignores the *.harmony.ts
    // platform extensions: methods.harmony.ts and permissions.harmony.ts would
    // never be picked, and every call would fall back to the src/methods.ts stub
    // that returns RESULTS.UNAVAILABLE.
    platforms: ['ios', 'android', 'harmony', 'native'],
  },
};

// The RNOH preset owns harmony resolution: it redirects `react-native` imports
// to the harmony fork and falls back to ios for internals that ship only as
// .ios.js/.android.js (e.g. ReactDevToolsSettingsManager). Merged last so its
// resolver hooks win over the defaults above.
//
// The preset defaults reactNativeHarmonyPackageName to 'react-native-harmony',
// which would rewrite imports to a package that is not installed. The published
// name is scoped, so it must be passed explicitly.
module.exports = mergeConfig(
  getDefaultConfig(__dirname),
  config,
  createHarmonyMetroConfig({
    reactNativeHarmonyPackageName: '@zcating/react-native-harmony',
  }),
);
