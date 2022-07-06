module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-env', '@babel/preset-typescript'],
    plugins: [
      '@babel/plugin-transform-runtime',
      [
        {
          ssr: true,
          displayName: true,
          preprocess: false,
        },
      ],
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@components': './src/components',
            '@atoms': './src/components/atoms',
            '@molecules': './src/components/molecules',
            '@organisms': './src/components/organisms',
            '@templates': './src/templates',
            '@constants': './src/constants',
            '@config': './src/config',
            '@assets': './src/assets',
            '@hooks': './src/hooks',
            '@styles': './src/styles',
            '@types': './src/types',
            '@themes': './src/themes',
            '@util': './src/util',
            '@pages': './src/pages',
            '@reducers': './src/reducers',
            '@sagas': './src/sagas',
          },
        },
      ],
    ],
  };
};
