module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // react-native's sources use class private methods/fields, which
  // metro-react-native-babel-preset 0.77 does not transform. Keep these at the
  // top level so Jest works regardless of NODE_ENV / BABEL_ENV.
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ],
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
    },
  },
};
