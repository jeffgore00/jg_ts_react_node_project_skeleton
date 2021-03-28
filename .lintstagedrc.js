module.exports = {
  '*.{ts,tsx,js,jsx,md,json,html}': ['eslint --fix', 'prettier --write'],
  '*.md': 'mdspell -n -a -r --en-us',
};
