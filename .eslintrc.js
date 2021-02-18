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
  ignorePatterns: [
    'webpack.config.js',
    'public',
    'dist',
    'node_modules',
    'coverage',
    '*.json',
    '*.md',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'comma-dangle': 0, // for some reason this is not turned off by prettier extension
    'implicit-arrow-linebreak': 0, // for some reason this is not turned off by prettier extension
    'function-paren-newline': 0, // for some reason this is not turned off by prettier extension
    'operator-linebreak': 0, // for some reason this is not turned off by prettier extension
    'object-curly-newline': 0, // complains about perfectly reasonable one-line destructuring
    '@typescript-eslint/restrict-template-expressions': 0,
    'no-void': 0, // conflicts with typescript-eslint/no-floating-promises, which recommends using `void` for non-awaited Promises
  },
};
