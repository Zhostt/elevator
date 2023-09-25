module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-shadow': 'off',
    'comma-dangle': 'off',
    quotes: 'off'
  },
};
