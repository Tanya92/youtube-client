module.exports = {
  parser:  '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
    "jest/globals": true
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [2, { args: 'none' }], // https://github.com/typescript-eslint/typescript-eslint/issues/46,
    "semi": "off"
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".ts"]
      }
    }
  },
  "plugins": [
    "@typescript-eslint/eslint-plugin",
    "jest"
  ],
};
