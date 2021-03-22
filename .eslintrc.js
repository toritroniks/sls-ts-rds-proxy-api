const { off } = require('node:process');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-i': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false }],
    '@typescript-eslint/explicit-module-boundary-types': off,
    'require-await': 'warn',
    'default-case': 'error',
    'max-lines-per-function': ['warn', { max: 30, skipBlankLines: true, skipComments: true }],
    'max-depth': ['warn', 3],
    'no-lonely-if': 'error',
    'consistent-return': ['error', { treatUndefinedAsUnspecified: false }],
    complexity: ['warn', { max: 20 }],
  },
};
