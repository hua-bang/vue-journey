module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'vue-eslint-parser', // 解析 .vue 文件
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser' // 解析 .ts 文件
  },
  rules: {   
    'indent': [2, 2],
    'quotes': [1, 'single'],
    'semi': [2, 'always'],
    'no-empty': 2,
    'eqeqeq': 2,
    'max-depth': [0, 4],
    'max-len': [1, 120],
    '@typescript-eslint/no-inferrable-types': 'off',
    'vue/multi-word-component-names': 'off'
  }  
};