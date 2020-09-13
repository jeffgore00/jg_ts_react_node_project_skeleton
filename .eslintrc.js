module.exports = {
  root: true,
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  ignorePatterns: ['webpack.config.js'],
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'comma-dangle': 0, // for some reason this is not turned off by prettier extension
  },
};
