import antfu from '@antfu/eslint-config';

export default antfu({
  type: 'app',
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'single',
  },
  ignores: [],
  rules: {
    'style/no-tabs': 'off',
    'node/prefer-global/process': ['off'],
  },
});
