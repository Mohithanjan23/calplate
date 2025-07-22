import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    extends: [
      js.configs.recommended,
      react.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react/react-in-jsx-scope': 'off',         // Not needed in React 17+
      'react/jsx-uses-react': 'off',             // Not needed in React 17+
      'react-hooks/rules-of-hooks': 'error',     // Ensures proper hook usage
      'react-hooks/exhaustive-deps': 'warn',     // Warns for missing deps in useEffect
    },
  },
]);
