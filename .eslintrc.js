/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config/jest-testing-library',
    'plugin:prettier/recommended',
  ],
  plugins: ['simple-import-sort'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
        singleQuote: true,
        semi: true,
      },
    ],
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        // https://github.com/lydell/eslint-plugin-simple-import-sort#grouping
        groups: [
          [
            // Pure side effect imports
            '^\\u0000',
          ],
          [
            // React
            '^react',
            // Other npm packages
            '^@?\\w',
          ],
          [
            // Internal packages
            '^(components|services|utils)',
            // Parent folders
            '^\\../',
          ],
          [
            // Same folder
            '^\\./',
          ],
        ],
      },
    ],
  },
  // we're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but it we have to explicitly
  // set the jest version.
  settings: {
    jest: {
      version: 27,
    },
  },
};
