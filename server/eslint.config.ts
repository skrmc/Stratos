import { defineFlatConfig } from 'eslint-define-config';
import prettierConfig from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';

export default defineFlatConfig([
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    rules: {
      ...require('@typescript-eslint/eslint-plugin').configs.recommended.rules,
      ...prettierConfig.rules
    }
  },
  prettierConfig
]);
