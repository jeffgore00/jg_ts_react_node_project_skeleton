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
    project: ['./tsconfig.json', './tsconfig.wdio.json'],
  },
  ignorePatterns: [
    'public',
    'dist',
    'node_modules',
    'coverage',
    '*.json',
    '*.md',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    'import/prefer-default-export': 0, // I disagree, named exports are easier to (1) find in codebase and (2) spy on in tests
    'implicit-arrow-linebreak': 0, // ** for some reason this is not turned off by prettier extension **
    'function-paren-newline': 0, // ** for some reason this is not turned off by prettier extension **
    'operator-linebreak': 0, // ** for some reason this is not turned off by prettier extension **
    'object-curly-newline': 0, // complains about perfectly reasonable one-line destructuring
    '@typescript-eslint/restrict-template-expressions': 0, // often used for error logs, in which the thrown object being interpolated into string is of unknown type
    'no-void': 0, // conflicts with typescript-eslint/no-floating-promises, which recommends using `void` for non-awaited Promises
  },
  globals: {
    wdioBaseUrl: true,
  },
};
