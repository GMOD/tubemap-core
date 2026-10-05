import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import-x'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    ignores: [
      'dist/*',
      'esm/*',
      'coverage/*',
      'eslint.config.mjs',
      'scripts/*.sh',
      '.claude/**',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.lint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      '@typescript-eslint/parameter-properties': 'error',
      'no-empty': 'off',
      'no-console': [
        'warn',
        {
          allow: ['error', 'warn'],
        },
      ],
      'no-underscore-dangle': 'off',
      curly: 'error',
      'object-shorthand': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      eqeqeq: 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      semi: ['error', 'never'],
      'spaced-comment': [
        'error',
        'always',
        {
          markers: ['/'],
        },
      ],

      '@typescript-eslint/ban-ts-comment': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],

      'import-x/extensions': ['error', 'ignorePackages'],
      'import-x/no-unresolved': 'off',
      'import-x/order': [
        'error',
        {
          named: true,
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
          },
          groups: [
            'builtin',
            ['external', 'internal'],
            ['parent', 'sibling', 'index', 'object'],
            'type',
          ],
        },
      ],
    },
  },
)
