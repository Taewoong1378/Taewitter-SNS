/** @type {import('prettier').Options} */
const tsOption = {
  arrowParens: 'always',
  jsxSingleQuote: true,
  bracketSameLine: true,
  singleQuote: true,
  semi: true,
  bracketSpacing: true,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  endOfLine: 'auto',
  importOrder: [
    '^re(.*)$',
    '^next',
    '<THIRD_PARTY_MODULES>',
    '^@(?:components|templates|pages)(.*)$',
    '^(?:api|types|enums)(.*)$',
    '^@(?:assets|public|constants|hooks|services|utils|styles|stores)(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

/** @type {import('prettier'.Config)} */
module.exports = {
  overrides: [
    {
      files: '*.{ts,tsx}',
      options: {
        ...tsOption,
      },
    },
    {
      files: '*.{js,jsx}',
      options: {
        ...tsOption,
        printWidth: 80,
      },
    },
    {
      files: '*.{css,scss}',
      options: {
        singleQuote: false,
        semi: true,
        useTabs: true,
        tabWidth: 2,
      },
    },
  ],
};
